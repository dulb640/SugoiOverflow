'use strict';

var domain      = require('../domain');
var logger      = require('../logger');

var _           = require('lodash');
var express     = require('express');
var validate    = require('express-jsonschema').validate;
var router      = express.Router();
var schemas     = require('./schemas');

/**
 * Get all questions
 */
router.get('/', function(req, res, next){
  domain.Question
    .find()
    .select('id title body answers.author answers.timestamp answers.correct subscribers tags timestamp author')
    .populate('author subscribers answers.author', 'username displayName email')
    .execQ()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
      next();
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      next(error);
    });
});

/**
 * Get suggested questions
 */
router.get('/suggested', function(req, res, next){
  domain.User
    .findByIdQ(req.user.id)
    .then(function(user){
      var tags = user.profile.selectedTags;
      domain.Question
        .find({'tags': {$in : tags}})
        .select('id title body answers.author answers.timestamp answers.correct subscribers tags timestamp author')
        .populate('author subscribers answers.author', 'username displayName email')
        .execQ()
        .then(function(questions){
          res
            .status(200)
            .send(questions);
          next();
        })
        .catch(function(error){
          logger.error('Error getting questions', error);
          next(error);
        });
    });
});

/**
 * Get most wanted questions
 */
router.get('/most-wanted', function(req, res, next){
  domain.Question
    .aggregate([{
        $match:{ 'answers.correct': {$ne: true}}},{
        $project : {
          subCount: {
            $size: {
              '$ifNull': [ '$subscribers', [] ]
            }
          },
          id : 1,
          author : 1,
          title : 1,
          body : 1,
          'answers.author' : 1,
          'answers.correct' : 1,
          'answers.timestamp' : 1,
          timestamp : 1,
          subscribers : 1,
          tags : 1
        }
      },
      {$sort: {'subCount':-1} }])
    .execQ()
    .then(function(questions){
      domain.User.populateQ(questions, {path:'author subscribers answers.author', select: 'username displayName email'})
        .then(function(questions){
          questions.forEach(function(q){
            q.id = q._id;
            delete q._id;
          });

          res
            .status(200)
            .send(questions);
          next();
        });
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      next(error);
    });
});

/**
 * Get all questions by user
 */
router.get('/profile/:id', function(req, res, next){
  domain.User
    .findByIdQ(req.params.id)
    .then(function(user){
      return user.populateQ('profile.asked', 'id title body answers.author answers.timestamp answers.correct subscribers tags timestamp')
        .then(function(user){
          res
            .status(200)
            .send(user.profile.asked);
            next();
        });
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      next(error);
    });
});


/**
 * Get question by id
 */
router.get('/:id', function(req, res, next){
  domain.Question.findByIdQ(req.params.id)
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
      next();
    })
    .catch(function(error){
      logger.error('Error getting answer', error);
      next(error);
    });
});

/**
 * Subscribe to question
 */
router.put('/:id/subscribe', function(req, res, next){
  domain.Question.findByIdQ(req.params.id)
    .then(function(question){
      question.subscribers.push(req.user.id);
      return question.saveQ();
    })
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
      next();
    })
    .catch(function(error){
      logger.error('Error getting answer', error);
      next(error);
    });
});

/**
 * Fulltext search for questions
 */
router.get('/search/:term', function(req, res, next){
  domain.Question
    .find(
        { $text : { $search : req.params.term } },
        { score : { $meta: 'textScore' } },
        { limit: 50 }
    )
    .sort({ score : { $meta : 'textScore' } })
    .execQ()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
      next();
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      next(error);
    });
});

/**
 * Get questions by tag
 */
router.get('/tag/:tag', function(req, res, next){
  domain.Question
    .find(
      { tags : req.params.tag }
    )
    .execQ()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
      next();
    })
    .catch(function(error){
      logger.error('Error getting questions by tag', error);
      next(error);
    });
});

function updateUserQuestionsFeed(user, question, message){
  return user.populateQ('feed', 'questionNotifications')
    .then(function(user){
      user.feed.questionNotifications.push({
        body:message,
        question: question.id,
        questionTitle: question.title
      });
      return user.feed.saveQ()
        .catch(function(error){
          logger.error('Error updating user feed', error);
        });
    });
}

/**
 * Add answer
 */
router.post('/:questionId/answer', function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = new domain.Answer({
        author: req.user.id,
        body: req.body.body
      });

      question.answers.push(answer);

      return question.saveQ();
    })
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      return domain.User.findByIdQ(req.user.id)
      .then(function(user){
        user.profile.answered.push(question.id);
        return user.saveQ();
      })
      .then(function(){
        res
          .status(200)
          .send(question);
        next();

        question.populateQ('subscribers', 'feed')
          .then(function(questionPop){
            questionPop.subscribers.forEach(function(sub){
              if (sub.id !== req.user.id){
                updateUserQuestionsFeed(sub, question, 'Question has been answered');
              }
            });
          });
      });
    })
    .then(function(question){
        res
          .status(200)
          .send(question);
        next();
    })
    .catch(function(error){
      logger.error('Error posting answer', error);
      next(error);
    });
});


/* Add comment for question */
router.post('/:questionId/comment', function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
  .then(function(question) {
    question.comments.push({
      author: req.user.id,
      body: req.body.body
    });
    return question.saveQ();
  })
  .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
  .then(function(question){
    return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
  })
  .then(function(question){
      return domain.User.findByIdQ(req.user.id)
      .then(function(user){
        user.profile.answered.push(question.id);
        return user.saveQ();
      })
      .then(function(){
        res
          .status(200)
          .send(question);
        next();

        question.populateQ('subscribers', 'feed')
          .then(function(questionPop){
            questionPop.subscribers.forEach(function(sub){
              updateUserQuestionsFeed(sub, question, 'Question has new comment');
            });
          });
      });
    })
    .then(function(question){
        res
          .status(200)
          .send(question);
        next();
    })
    .catch(function(error){
      logger.error('Error posting comment', error);
      next(error);
    });
});


/* Add comment for answer */
router.post('/:questionId/answer/:answerId/comment', function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = question.answers.id(req.params.answerId);
      if(!answer){
        res
        .status(404);

        return;
      }

      answer.comments.push({
        author: req.user.id,
        body: req.body.body
      });

      return question.saveQ();
    })
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
      next();
    })
    .catch(function(error){
      logger.error('Error adding comment', error, error.errors);
      next(error);
    });
});

/**
 * Mark answer as correct
 */
router.put('/:questionId/answer/:answerId/correct', function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      return question.populateQ('answers.author', 'username displayName email profile.karmaChanges feed')
        .then(function(question){
          var answer = question.answers.id(req.params.answerId);
          answer.correct = true;
          answer.author.profile.karmaChanges.push({
            value: 5,
            reason: 'Answer marked as correct',
            question: question.id
          });

          return answer.author.saveQ()
            .then(function(author){
              return updateUserQuestionsFeed(author, question, 'Your answer marked as correct');
            })
            .then(function(){
              return question.saveQ();
            });
        });
    })
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
      next();
    })
    .catch(function(error){
      logger.error('Error marking answer as correct', error);
      next(error);
    });
});

/**
 * Upvote answer
 */
router.put('/:questionId/answer/:answerId/upvote', function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = question.answers.id(req.params.answerId);
      var downVoteIndex = answer.downVotes.indexOf(req.user.id);
      if (downVoteIndex > -1){
        answer.downVotes.splice(downVoteIndex, 1);
      }
      else if (answer.upVotes.indexOf(req.user.id) === -1){
        answer.upVotes.push(req.user.id);//TODO: Review that
      }
      return question.saveQ();
    })
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
      next();
    })
    .catch(function(error){
      logger.error('Error upvoting an answer', error);
      next(error);
    });
});

/**
 * Downvote answer
 */
router.put('/:questionId/answer/:answerId/downvote', function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = question.answers.id(req.params.answerId);
      var upVoteIndex = answer.upVotes.indexOf(req.user.id);
      if (upVoteIndex > -1){
        answer.upVotes.splice(upVoteIndex, 1);
      }
      else if (answer.downVotes.indexOf(req.user.id) === -1){
        answer.downVotes.push(req.user.id);
      }
      return question.saveQ();
    })
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
      next();
    })
    .catch(function(error){
      logger.error('Error upvoting an answer', error);
      next(error);
    });
});

/**
 * Add question
 */
router.post('/', validate({body: schemas.addOrEditQuestionSchema}), function(req, res, next){
  res
          .status(200).send();
next();
});


module.exports = router;
