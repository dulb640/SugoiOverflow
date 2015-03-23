module.exports = (config) ->
  config.set
    basePath: ''
    frameworks: [
      'mocha'
      'sinon-chai'
    ]
    files: [
      './bower_components/jquery/dist/jquery.js'
      './bower_components/moment/moment.js'
      './bower_components/lodash/lodash.js'
      './bower_components/underscore.string/dist/underscore.string.min.js'
      './bower_components/bootstrap/dist/js/bootstrap.js'
      './bower_components/angular/angular.js'
      './bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
      './bower_components/angular-jwt/dist/angular-jwt.js'
      './bower_components/angular-messages/angular-messages.js'
      './bower_components/angular-pageslide-directive/dist/angular-pageslide-directive.js'
      './bower_components/angular-route/angular-route.js'
      './bower_components/angular-sanitize/angular-sanitize.js'
      './bower_components/ng-file-upload/angular-file-upload.js'
      './bower_components/ng-tags-input/ng-tags-input.js'
      './bower_components/ngstorage/ngStorage.js'
      './bower_components/sugoi-mark-down/wizMarkdown/wizMarkdown.js'
      './bower_components/angular-mocks/angular-mocks.js'
      './client/scripts/**/*Module.js'
      './client/scripts/settings.js'
      './client/scripts/interceptors.js'
      './client/scripts/index.js'
      './client/scripts/**/*.js'
      './client/scripts/**/*.html'
      './clientTests/specs/**/*.spec.coffee'
    ]
    exclude: []
    preprocessors:
      '**/*.coffee': 'coffee'
      '**/*.html': 'ng-html2js'
    reporters: ['spec'],
    specReporter:
      maxLogLines: 5
    port: 9876
    colors: true
    logLevel: config.LOG_INFO
    autoWatch: true
    browsers: ['PhantomJS']
    singleRun: false
    ngHtml2JsPreprocessor:
      #stripPrefix: 'public/'
      #stripSufix: '.ext'
      #prependPrefix: 'served/'
      moduleName: 'sugoiOverflow.templates'
