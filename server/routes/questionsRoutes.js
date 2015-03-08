'use strict';

var domain      = require('../domain');
var logger      = require('../logger');

var _           = require('lodash');
var express     = require('express');
var q     = require('Q');

var router      = express.Router();

/**
 * Get all questions
 */
router.get('/', function(req, res){
  domain.Question
    .find()
    .select('id title body answers.author answers.timestamp answers.correct subscribers tags timestamp author')
    .populate('author', 'id name email profilePictureUrl karma')
    .execQ()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Get suggested questions
 */
router.get('/suggested', function(req, res){
  domain.User
    .findByIdQ(req.user.id)
    .then(function(user){
      var tags = user.profile.selectedTags;
      domain.Question
        .find({'tags': {$in : tags}})
        .select('id title body answers.author answers.timestamp answers.correct subscribers tags timestamp author')
        .populate('author', 'id name email profilePictureUrl karma')
        .execQ()
        .then(function(questions){
          res
            .status(200)
            .send(questions);
        })
        .catch(function(error){
          logger.error('Error getting questions', error);
          res
            .status(500)
            .send();
        });
    });
});

/**
 * Get most wanted questions
 */
router.get('/most-wanted', function(req, res){
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
    //.sort({'subscribers.length': -1})
    //.select('id title body answers.author answers.timestamp answers.correct subscribers tags timestamp author')
    //.populate('author', 'name email profilePictureUrl')
    .execQ()
    .then(function(questions){
      questions.forEach(function(q){
        q.id = q._id;
        delete q._id;
      });
      res
        .status(200)
        .send(questions);
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Get all questions by user
 */
router.get('/profile/:id', function(req, res){
  domain.User
    .findByIdQ(req.params.id)
    .then(function(user){
      return user.populateQ('profile.asked', 'id title body answers.author answers.timestamp answers.correct subscribers tags timestamp')
        .then(function(user){
          res
            .status(200)
            .send(user.profile.asked);
        });
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      res
        .status(500)
        .send();
    });
});


/**
 * Get question by id
 */
router.get('/:id', function(req, res){
  domain.Question.findByIdQ(req.params.id)
    .then(function(question){
      return question.populateQ('author', 'id name email profilePictureUrl karma');
    })
    .then(function(question){
      return question.populateQ('answers.author', 'id name email profilePictureUrl karma');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error getting answer', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Subscribe to question
 */
router.put('/:id/subscribe', function(req, res){
  domain.Question.findByIdQ(req.params.id)
    .then(function(question){
      question.subscribers.push(req.user.id);
      return question.saveQ();
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error getting answer', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Fulltext search for questions
 */
router.get('/search/:term', function(req, res){
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
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Get questions by tag
 */
router.get('/tag/:tag', function(req, res){
  domain.Question
    .find(
      { tags : req.params.tag }
    )
    .execQ()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
    })
    .catch(function(error){
      logger.error('Error getting questions by tag', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Add answer
 */

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

router.post('/:questionId/answer', function(req, res){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = new domain.Answer({
        author: req.user._id,
        body: req.body.body
      });

      question.answers.push(answer);

      return question.saveQ();
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

        question.populateQ('subscribers', 'feed')
          .then(function(questionPop){
            questionPop.subscribers.forEach(function(sub){
              updateUserQuestionsFeed(sub, question, 'Question has been answered');
            });
          });
      });
    })
    .then(function(question){
        res
          .status(200)
          .send(question);
    })
    .catch(function(error){
      logger.error('Error posting answer', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Mark answer as correct
 */
router.put('/:questionId/answer/:answerId/correct', function(req, res){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      return question.populateQ('answers.author', 'id name email profile.karmaChanges feed')
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
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error marking answer as correct', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Upvote answer
 */
router.put('/:questionId/answer/:answerId/upvote', function(req, res){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = question.answers.id(req.params.answerId);
      var downVoteIndex = answer.downVotes.indexOf(req.user.id);
      if (downVoteIndex > -1){
        answer.downVotes.splice(downVoteIndex, 1);
      }
      else if (answer.upVotes.indexOf(req.user.id) === -1){
        answer.upVotes.push(req.user.id);
      }
      return question.saveQ();
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error upvoting an answer', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Downvote answer
 */
router.put('/:questionId/answer/:answerId/downvote', function(req, res){
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
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error upvoting an answer', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Add question
 */
router.post('/', function(req, res){
  var question = new domain.Question(_.extend(req.body, {author: req.user.id}));
  question.subscribers.push(req.user.id);

  question
    .saveQ()
    .then(function(question){
      return domain.User.findByIdQ(req.user.id)
      .then(function(user){
        user.profile.asked.push(question.id);
        return user.saveQ();
      })
      .then(function(){
        res
          .status(200)
          .send(question);
        question.populateQ('proposedPeople', 'feed')
          .then(function(questionPop){
            questionPop.proposedPeople.forEach(function(prop){
              updateUserQuestionsFeed(prop, question, 'You have been proposed to answer the question');
            });
          });
      });
    })
    .catch(function(error){
      logger.error('Error posting question', error);
      res
        .status(500)
        .send();
    });
});


module.exports = router;
