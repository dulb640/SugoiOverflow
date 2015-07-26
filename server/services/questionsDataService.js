let Promise = require('bluebird')
let domain = require('../domain')
let logger = require('../logger')

let service = {
  getOld: function getQuestions (whereStatements, sortStatement) {
    return new Promise(function (resolve, reject) {
      domain.Question
        .find(...whereStatements)
        .select('id title body answers.author answers.timestamp answers.correct subscribers tags timestamp author')
        .populate('author subscribers answers.author', 'profile username displayName email')
        .sort(sortStatement)
        .limit(100)
        .execAsync()
        .then(function (questions) {
          resolve(questions)
        })
        .catch(function (error) {
          logger.error('Error getting questions', error)
          reject(error)
        })
    })
  },
  get: function getQuestions (match, sort) {
    return new Promise(function (resolve, reject) {
      domain.Question
        .aggregateAsync([{
            $match: match }, {
            $project: {
              subCount: {
                $size: {
                  '$ifNull': [ '$subscribers', [] ]
                }
              },
              id: 1,
              author: 1,
              title: 1,
              body: 1,
              'answers.author': 1,
              'answers.correct': 1,
              'answers.timestamp': 1,
              timestamp: 1,
              subscribers: 1,
              tags: 1
            }
          },
          {$sort: sort }])
        .then(function (questions) {
          domain.User.populateAsync(questions, {path: 'author', select: 'username displayName email'})
            .then(function (populatedQuestions) {
              populatedQuestions.forEach(function (q) {
                q.id = q._id
                delete q._id
              })

              resolve(questions)
            })
        })
        .catch(function (error) {
          logger.error('Error getting questions through aggregation', error)
          reject(error)
        })
    })
  }
}

export default service
