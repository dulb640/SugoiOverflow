'use strict';

var gulp =               require('gulp');
var util =               require('util');
var nodemon =            require('gulp-nodemon');
var gutil =              require('gulp-util');
var sourcemaps =         require('gulp-sourcemaps');
var runSequence =        require('run-sequence');
var rimraf =             require('gulp-rimraf');
var jshint =             require('gulp-jshint');
var plumber =            require('gulp-plumber');
var notify =             require('gulp-notify');
var concat =             require('gulp-concat');
var uglify =             require('gulp-uglify');
var ngAnnotate =         require('gulp-ng-annotate');
var minifyCss =          require('gulp-minify-css');
var concatCss =          require('gulp-concat-css');
var sass =               require('gulp-sass');
var path =               require('path');
var angularFilesort =    require('gulp-angular-filesort');
var inject =             require('gulp-inject');
var eventStream =        require('event-stream');
var connect =            require('gulp-connect');
var livereload =         require('gulp-livereload');
var watch =              require('gulp-watch');
var mainBowerFiles =     require('main-bower-files');
var tar =                require('gulp-tar');
var gzip =               require('gulp-gzip');
var args =               require('yargs').argv;
var coffee =             require('gulp-coffee');
var mocha =              require('gulp-mocha');
var templateCache =      require('gulp-angular-templatecache');
var karma =              require('karma').server;
var apidoc =             require('gulp-apidoc');
var order =              require('gulp-order');
var Dgeni =              require('dgeni');
var shell = require('gulp-shell');
var envType = process.env.NODE_ENV ||args.NODE_ENV || args.env || 'development';
var isDev = envType === 'development';

var paths = {
  scripts        : ['client/scripts/**/*.js'],
  css            : [],
  styles         : ['client/styles/**/*.scss'],
  html           : ['client/**/*.html'],
  index          : ['client/index.html'],
  bowerScripts   : mainBowerFiles({filter:/.*\.js$/i}),
  bowerStyles    : mainBowerFiles({filter:/.*\.css$/i}),
  bowerFonts     : mainBowerFiles({filter:/.*\.(eot|ttf|woff|woff2|otf)$/i})
};

gulp.task('lint', function() {
  return gulp.src(['server/**/*.js', 'client/**/*.js'])
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function(){
  return gulp.src(['build', 'dist', './serverTests/specs/.compiled', 'clientdocs', 'apidocs'])
    .pipe(rimraf());
});

gulp.task('scripts-lib', function(){
  return gulp.src(paths.bowerScripts,{
    base: 'bower_components'
  })
  .pipe(order(['**/jquery.js',
    '**/angular.js',
    '**/bootstrap.js',
    '**/lodash.js',
    '**/*.js']))
  .pipe(isDev ? gutil.noop() : concat('lib.js'))
  .pipe(isDev ? gutil.noop() : uglify())
  .pipe(gulp.dest('build/scripts/lib'));
});

gulp.task('scripts-app', /*['lint-scripts'],*/ function(){
  return gulp.src(paths.scripts)
    .pipe(plumber({errorHandler:
      function(){
        notify.onError('Error: <%= error.message %>').apply(this, arguments);
        this.emit('end');
      }
    }))
    .pipe(ngAnnotate())
    .pipe(angularFilesort())
    .pipe(isDev ? gutil.noop() : concat('app.js'))
    .pipe(isDev ? gutil.noop() : uglify())
    .pipe(gulp.dest('build/scripts/app'));
});

gulp.task('styles-lib', /*['lint-styles'],*/ function(){
  return gulp.src(paths.bowerStyles)
    .pipe(isDev ? gutil.noop() : concatCss('lib.css', { rebaseUrls: false }))
    .pipe(isDev ? gutil.noop() : minifyCss())
    .pipe(gulp.dest('build/styles/lib'))
    .pipe(livereload());
});

gulp.task('styles-app', function(){
  return gulp.src(paths.styles)
    .pipe(isDev ? sourcemaps.init() : gutil.noop())
    .pipe(sass())
    .pipe(isDev ? gutil.noop() : concatCss('app.css', { rebaseUrls: false }))
    .pipe(isDev ? gutil.noop() : minifyCss())
    .pipe(isDev ? sourcemaps.write('./') : gutil.noop())
    .pipe(gulp.dest('build/styles/app'))
    .pipe(livereload());
});

gulp.task('fonts', function(){
  return gulp.src(paths.bowerFonts)
    .pipe(gulp.dest('build/styles/fonts'));
});

gulp.task('templates', function(){
  gulp.src(paths.html)
    .pipe(templateCache({standalone: true, module:'sugoiOverflow.templates'}))
    .pipe(gulp.dest('build/scripts/app'));
});

gulp.task('inject-index', ['scripts-lib', 'scripts-app', 'styles-lib', 'styles-app', 'templates', 'fonts'], function(){
  var cwd = path.resolve(__dirname, './build');
  var scriptsLib = gulp.src(['scripts/lib/**/jquery.js',
                              'scripts/lib/**/angular.js',
                              'scripts/lib/**/bootstrap.js',
                              'scripts/lib/**/lodash.js',
                              'scripts/lib/**/*.js'],{ cwd: cwd });

  var scriptsApp = gulp.src(['scripts/app/**/*.js'],{ cwd: cwd })
    .pipe(angularFilesort());

  var stylesLib = gulp.src(['styles/lib/**/*.css'],{ cwd: cwd });
  var stylesApp = gulp.src(['styles/app/**/*.css'],{ cwd: cwd });

  return gulp.src(paths.index, {base: 'client'})
    .pipe(inject(scriptsLib, {name: 'lib'}))
    .pipe(inject(scriptsApp, {name: 'app'}))
    .pipe(inject(stylesLib, {name: 'lib'}))
    .pipe(inject(stylesApp, {name: 'app'}))
    .pipe(gulp.dest('build'));
});

gulp.task('build', function(done){
  runSequence('clean',
              'inject-index',
              done);
});

gulp.task('run', function(){
  gulp.start(isDev ? 'run-dev' : 'run-prd');
});

gulp.task('run-dev', ['watch'], function(){
  nodemon({
    script: './server/index.js',
    ext: 'js css html yaml json',
  })
  .on('change')
  .on('restart', function(){gutil.log('restarted!');});
});

gulp.task('run-prd', ['build'], function(){
  nodemon({
    script: './server/index.js',
    ext: 'js css html yaml json',
  });
});

gulp.task('watch', ['build'], function(){
  livereload.listen();
  gulp.watch(['client/**/*.scss'], ['styles-lib', 'styles-app'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

  gulp.watch(['client/**/*.html', 'client/**/*.js'], ['build'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('connect', function(done){
  var callBack = function(){
    connect.server({
      root       : 'build',
      port       : 8085,
      livereload : true
    });

    watch('build/**/*.*')
      .pipe(connect.reload());

    done();
  };

  runSequence('build',
              'watch',
              callBack);
});

gulp.task('pack', ['clean', 'build'], function () {
  var buildNumber = process.env.TRAVIS_BUILD_NUMBER || args.buildNumber;
  var branch = process.env.TRAVIS_BRANCH || args.branch;
  var includeEnv = args.includeEnv || false;

  var packageJson = require('./package.json');
  var devDependencies = Object.keys(packageJson.devDependencies).map(function(dep){
    return util.format('!./node_modules/%s/**/*.*', dep);
  });

  var srcList = ['./**/*.*',
                 '!./bower_components/**/*.*',
                 '!*.log',
                 '!logs/**/*.*',
                 '!client/**/*.*',
                 '!gulpfile.js',
                 '!./**/.*',
                 '!./**/*.sublime-project',
                 '!./**/*.sublime-workspace',
                 '!./package.json',
                 '!./bower.json',
                 '!./config.yaml'].concat(devDependencies);

  var name = util.format('sugoi-overflow-%s', packageJson.version);
  if(buildNumber){
    name = util.format('%s-%s', name, buildNumber);
  }

  if(branch){
    name = util.format('%s[%s]', name, branch);
  }

  if(includeEnv){
    name = util.format('%s[%s]', name, envType);
  }
  return gulp.src(srcList)
    .pipe(tar(util.format('%s.tar', name)))
    .pipe(gzip())
    .pipe(gulp.dest('./dist'));
});

gulp.task('test-server', function(){
  var reporter = process.env.CI ? 'spec' : 'nyan';
  return gulp.src('./serverTests/specs/**/*.spec.coffee')
    .pipe(mocha({reporter: reporter}));
});

gulp.task('test-client', function(done) {
  var reporter = process.env.CI ? 'spec' : 'nyan';
  karma.start({
    configFile: __dirname + '/karma.conf.coffee',
    singleRun: true,
    action: 'run',
    reporters: [reporter]
  }, done);
});

gulp.task('test', ['test-server', 'test-client']);

gulp.task('apidocs', function(){
          apidoc.exec({
            src: 'server/',
            dest: 'apidocs/'
          });
});

gulp.task('dgeni', function(){
  var dgeni = new Dgeni([require('./dgeniConf')]);
  return dgeni.generate();
});

// gulp.task('clientdocs', function(){
//   var conf = require('angular-jsdoc/conf.json');
//   var template = {
//     path: 'node_modules/angular-jsdoc/template',
//   };

//   return gulp.src('./client/**/*.js')
//     .pipe(jsdoc.generator('./clientdocs/', template, conf));
// });

gulp.task('clientdocs', shell.task([
 'node_modules/jsdoc/jsdoc.js '+
   '-c node_modules/angular-jsdoc/conf.json '+   // config file
   '-t node_modules/angular-jsdoc/template '+    // template file
   '-d clientdocs '+                             // output directory
   '-r client'                              // source code directory
]));

gulp.task('default', ['run']);
