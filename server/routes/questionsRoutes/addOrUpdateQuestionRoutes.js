'use strict';

var domain      = require('../domain');
var logger      = require('../logger');

var _           = require('lodash');
var express     = require('express');
var validate    = require('express-jsonschema').validate;
var router      = express.Router();
var schemas     = require('./schemas');

function updateUserQuestionsFeed(user, question, message){
  return user.populateQ('feed', 'questionNotifications')
    .then(function(populatedUser){
      populatedUser.feed.questionNotifications.push({
        body:message,
        question: question.id,
        questionTitle: question.title
      });
      return populatedUser.feed.saveQ()
        .catch(function(error){
          logger.error('Error updating user feed', error);
        });
    });
}

/**
 * Add answer
 */
router.post('/:questionId/answer', validate({body: schemas.addOrEditAnswerSchema}), function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes answers.author comments.author answers.comments.author', 'profile username displayName email feed');
    })
    .then(function (question){
      var answer = new domain.Answer({
        author: req.user.id,
        body: req.body.body
      });

      question.answers.push(answer);

      question.saveQ()
        .then(function(savedQuestion){
          res
            .status(200)
            .send(savedQuestion);
        })
        .catch(function(error){
          logger.error('Error posting answer', error);
          return next(error);
        });

      domain.User.findByIdQ(req.user.id)
        .then(function(user){
          user.profile.answered.push(question.id);
          return user.saveQ();
        });

      question.subscribers
        .filter(function(sub){
          return sub.id !== req.user.id;
        })
        .forEach(function(sub){
          updateUserQuestionsFeed(sub, question, 'Question has a new answer');
        });
    });
});


/* Add comment to question */
router.post('/:questionId/comment', validate({body: schemas.addOrEditCommentSchema}), function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
  .then(function(question){
    return question.populateQ('author subscribers upVotes downVotes answers.author comments.author answers.comments.author', 'profile username displayName email feed');
  })
  .then(function(question) {
    if(!question){
      res
        .status(404);

      return next('Question was not found');
    }

    question.comments.push({
      author: req.user.id,
      body: req.body.body
    });
    question.saveQ()
      .then(function(){
        res
          .status(200)
          .send(question);
      });

    domain.User.findByIdQ(req.user.id)
      .then(function(user){
        user.profile.answered.push(question.id);
        return user.saveQ()
          .catch(function(error){
            logger.error('Error posting comment', error);
            return next(error);
          });
      });

    question.subscribers.forEach(function(sub){
      updateUserQuestionsFeed(sub, question, 'Question has a new comment');
    });
  });
});

/* Add comment to answer */
router.post('/:questionId/answer/:answerId/comment', validate({body: schemas.addOrEditCommentSchema}), function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId).then(function (question){
    return question.populateQ('author subscribers upVotes downVotes answers.author comments.author answers.comments.author', 'profile username displayName email profile.karmaChanges feed')
      .then(function(populatedQuestion){
        var answer = populatedQuestion.answers.id(req.params.answerId);
        if(!answer){
          res
            .status(404);

          return next('Answer was not found');
        }

        answer.comments.push({
          author: req.user.id,
          body: req.body.body
        });

        question.saveQ()
          .then(function(savedQuestion){
            res
              .status(200)
              .send(savedQuestion);
          })
          .catch(function(error){
            logger.error('Error adding a comment to answer', error);
            return next(error);
          });

        updateUserQuestionsFeed(answer.author, question, 'Answer has a new comment');
      });
  });
});

/**
 * Mark answer as correct
 */
router.put('/:questionId/answer/:answerId/correct', function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      return question.populateQ('author subscribers upVotes downVotes answers.author comments.author answers.comments.author', 'profile username displayName email profile.karmaChanges feed')
        .then(function(populatedQuestion){
          var answer = populatedQuestion.answers.id(req.params.answerId);
          if(!answer){
            res
              .status(404);

            return next('Answer was not found');
          }

          answer.correct = true;
          question.saveQ()
            .then(function(savedQuestion){
              res
                .status(200)
                .send(savedQuestion);
            })
            .catch(function(error){
              logger.error('Error marking answer as correct', error);
              return next(error);
            });

          answer.author.profile.karmaChanges.push({
            value: 5,
            reason: 'Answer marked as correct',
            question: question.id
          });

          answer.author.saveQ()
            .then(function(author){
              return updateUserQuestionsFeed(author, question, 'Your answer marked as correct');
            });
        });
    });
});

/**
 * Upvote answer
 */
router.put('/:questionId/answer/:answerId/upvote', function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes answers.author comments.author answers.comments.author', 'profile username displayName email profile.karmaChanges feed');
    })
    .then(function (question){
      var answer = question.answers.id(req.params.answerId);
      if(!answer){
        res
          .status(404);

        return next('Answer was not found');
      }

      var downVoteIndex = answer.downVotes.indexOf(req.user.id);
      if (downVoteIndex > -1){
        answer.downVotes.splice(downVoteIndex, 1);
      }
      else if (answer.upVotes.indexOf(req.user.id) === -1){
        answer.upVotes.push(req.user.id);
      }
      question.saveQ()
        .then(function(savedQuestion){
          res
            .status(200)
            .send(savedQuestion);
        })
        .catch(function(error){
          logger.error('Error upvoting an answer', error);
          return next(error);
        });

      answer.author.profile.karmaChanges.push({
        value: 1,
        reason: 'Answer is upvoted',
        question: question.id
      });

      answer.author.saveQ()
        .then(function(author){
          return updateUserQuestionsFeed(author, question, 'Your answer is upvoted');
        });
    });
});

/**
 * Downvote answer
 */
router.put('/:questionId/answer/:answerId/downvote', function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes answers.author comments.author answers.comments.author', 'profile username displayName email profile.karmaChanges feed');
    })
    .then(function (question){
      var answer = question.answers.id(req.params.answerId);

      if(!answer){
        res
          .status(404);

        return next('Answer was not found');
      }

      var upVoteIndex = answer.upVotes.indexOf(req.user.id);
      if (upVoteIndex > -1){
        answer.upVotes.splice(upVoteIndex, 1);
      }
      else if (answer.downVotes.indexOf(req.user.id) === -1){
        answer.downVotes.push(req.user.id);
      }
      question.saveQ()
        .then(function(savedQuestion){
          res
            .status(200)
            .send(savedQuestion);
        })
        .catch(function(error){
          logger.error('Error downvoting an answer', error);
          return next(error);
        });

        answer.author.profile.karmaChanges.push({
          value: -1,
          reason: 'Answer is downvoted',
          question: question.id
        });

        answer.author.saveQ()
          .then(function(author){
            return updateUserQuestionsFeed(author, question, 'Your answer is downvoted');
          });
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
      return question.populateQ('author subscribers upVotes downVotes answers.author comments.author answers.comments.author', 'profile username displayName email');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error getting answer', error);
      return next(error);
    });
});

/**
 * Add question
 */
router.post('/', validate({body: schemas.addOrEditQuestionSchema}), function(req, res, next){
  var question = new domain.Question(_.extend(req.body, {author: req.user.id}));
  question.subscribers.push(req.user.id);

  question
    .saveQ()
    .then(function(savedQuestion){
      res
        .status(200)
        .send(question);

      domain.User.findByIdQ(req.user.id)
        .then(function(user){
          user.profile.asked.push(savedQuestion.id);
          return user.saveQ();
      });

      req.body.people.map(function(email){
        return domain.User.findQ({email: email})
          .then(function(person){
            if(!person){
              return;
            }
            updateUserQuestionsFeed(person, question, 'You have been proposed to answer the question');
          });
      });
    })
    .catch(function(error){
      logger.error('Error posting question', error, error.errors);
      next(error);
    });
});


module.exports = router;
