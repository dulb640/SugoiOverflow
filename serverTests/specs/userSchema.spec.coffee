proxyquire = require 'proxyquire'
proxyquire.noCallThru()
chai = require 'chai'
expect = chai.expect
sinon = require 'sinon'
sinonChai = require 'sinon-chai'
mongooseQ = require 'mongoose-q'
mongoose = require 'mongoose'
mongoose = mongooseQ mongoose

chai.use sinonChai

config = sinon.stub().returns ''
UserSchema = proxyquire '../../server/domain/userSchema.js',
                        '../configuration': config
UserModel = mongoose.model 'User', UserSchema

describe 'UserSchema', ->
  beforeEach ->
    @userData =
      username: 'testname'
      displayName: 'testDisplayName'
      email: 'test@test.te'
      password: 'testpassword'
      profile:
        karmaChanges: []
    @user = new UserModel @userData
    @setKarma = (values...) =>
      @user.profile.karmaChanges = values.map (v) -> value: v

  describe 'karma virtual property', ->
    it 'should equal 15 when user has karma changes [+5, +10]', ->
      @setKarma 5, 10
      expect @user.profile.karma
        .to.equal 15
    it 'should equal 3 when user has karma changes [+7, -4]', ->
      @setKarma 7, -4
      expect @user.profile.karma
        .to.equal 3
    it 'should equal 0 when user has karma changes [+5, -5, +5, -5]', ->
      @setKarma 5, -5, +5, -5
      expect @user.profile.karma
        .to.equal 0
    it 'should equal -13 when user has karma changes [+5, -10, -8]', ->
      @setKarma 5, -10, -8
      expect @user.profile.karma
        .to.equal -13
    it 'should equal 1 when user has karma changes [1]', ->
      @setKarma 1
      expect @user.profile.karma
        .to.equal 1
    it 'should equal 0 when user has no karma changes', ->
      delete @user.profile.karmaChanges
      expect @user.profile.karma
        .to.equal 0
