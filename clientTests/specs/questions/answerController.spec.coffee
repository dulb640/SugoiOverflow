describe 'sugoiOverflow.questions', ->
  describe 'answerController', ->
    beforeEach module 'sugoiOverflow.templates'
    beforeEach module 'sugoiOverflow.shared'
    beforeEach module 'sugoiOverflow.auth'
    beforeEach module 'sugoiOverflow.questions'

    beforeEach inject ($controller, $rootScope, $q) ->
      @deferredAddAnswerComment = $q.defer()
      @questionsDataService =
        addAnswerComment: sinon.stub().returns @deferredAddAnswerComment.promise

      @currentUser =
        username: 'tester'

      @scope = $rootScope.$new()
      @controller = $controller 'answerController',
        $scope: @scope
        currentUser: @currentUser
        questionsDataService: @questionsDataService

    describe 'submitComment', ->
      it 'should call questionsDataService.addAnswerComment', ->
        @scope.questionId = '123'
        @scope.answer =
          id: '321'

        @scope.submitComment('Test body')

        expect @questionsDataService.addAnswerComment
          .to.be.called

        expect @questionsDataService.addAnswerComment
          .to.be.calledWith '123', '321', 'Test body'

