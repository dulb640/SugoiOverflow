'use strict';

var gulp        = require('gulp');
var nodemon     = require('gulp-nodemon');
var gutil       = require('gulp-util');
var sourcemaps  = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var rimraf      = require ('gulp-rimraf');
var jshint      = require ('gulp-jshint');
var plumber     = require('gulp-plumber');
var notify      = require('gulp-notify');
var concat       = require ('gulp-concat');
var uglify       = require ('gulp-uglify');
var ngAnnotate   = require ('gulp-ng-annotate');
var minifyCss    = require ('gulp-minify-css');
var concatCss    = require ('gulp-concat-css');
var sass         = require ('gulp-sass');
var fs          = require('fs');
var path        = require('path');
var angularFilesort = require ('gulp-angular-filesort');
var inject          = require ('gulp-inject');
var eventStream     = require ('event-stream');
var connect         = require ('gulp-connect')
var watch           = require ('gulp-watch');
var mainBowerFiles  = require ('main-bower-files');

var envType = gutil.env.type || 'debug';
var isDebug = envType === 'debug';
var isDebug = true;

var paths = {
  scripts        : ['client/scripts/**/*.js'],
  css            : [],
  styles         : ['client/styles/**/*.scss'],
  html           : ['client/views/**/*.html'],
  index          : ['client/index.html'],
  bowerScripts   : mainBowerFiles({filter:/.*\.js$/i}),
  bowerStyles    : mainBowerFiles({filter:/.*\.css$/i}),
};

gulp.task('lint', function() {
  return gulp.src(['server/**/*.js', 'client/**/*.js'])
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function(){
  return gulp.src('build')
          .pipe(rimraf());
});

gulp.task('scripts-lib', function(){
  return gulp.src(paths.bowerScripts,{
    base: 'bower_components'
  })
  .pipe(isDebug ? gutil.noop() : concat('lib.js'))
  .pipe(isDebug ? gutil.noop() : uglify())
  .pipe(gulp.dest('build/scripts/lib'));
});

gulp.task('scripts-app', /*['lint-scripts'],*/ function(){
  return gulp.src(paths.scripts)
    .pipe(ngAnnotate())
    .pipe(angularFilesort())
/*    .pipe(isDebug ? gutil.noop() : concat('app.js'))
    .pipe(isDebug ? gutil.noop() : uglify())*/
    .pipe(gulp.dest('build/scripts/app'));
});

gulp.task('styles-lib', /*['lint-styles'],*/ function(){
  return gulp.src(paths.bowerStyles)
    .pipe(isDebug ? gutil.noop() : concatCss('lib.css'))
    .pipe(isDebug ? gutil.noop() : minifyCss())
    .pipe(gulp.dest('build/styles/lib'));
});

gulp.task('styles-app', function(){
  return gulp.src(paths.styles)
    //.pipe(isDebug ? gulp.dest('build'): gutil.noop())
    .pipe(isDebug ? sourcemaps.init() : gutil.noop())
    .pipe(sass())
    .pipe(isDebug ? gutil.noop() : concatCss('app.css'))
    .pipe(isDebug ? gutil.noop() : minifyCss())
    .pipe(isDebug ? sourcemaps.write('./') : gutil.noop())
    .pipe(gulp.dest('build/styles/app'));
});


gulp.task('templates', function(){
  var cwd = path.resolve(__dirname, './build');
  var scriptsLib = gulp.src(['scripts/lib/**/*.js'],{
    cwd: cwd
  });

  var scriptsApp = gulp.src(['scripts/app/**/*.js'],{
    cwd: cwd
  })
    .pipe(angularFilesort());

  var stylesLib = gulp.src(['styles/lib/**/*.css'],{
    cwd: cwd
  });

  var stylesApp = gulp.src(['styles/app/**/*.css'],{
    cwd: cwd
  });

  var index = gulp.src(paths.index, {base: 'client'})
          .pipe(inject(scriptsLib, {name: 'lib'}))
          .pipe(inject(scriptsApp, {name: 'app'}))
          .pipe(inject(stylesLib, {name: 'lib'}))
          .pipe(inject(stylesApp, {name: 'app'}))
          .pipe(gulp.dest('build'));

  var html = gulp.src(paths.html, {base: 'client'})
          .pipe(gulp.dest('build'));

  return eventStream.merge(index, html);
});

gulp.task('build', function(done){
  runSequence('clean',
              ['scripts-lib', 'scripts-app', 'styles-lib', 'styles-app'],
              'templates',
              done);
});

gulp.task('dev', function(){
  nodemon({
    script: './server/index.js',
    ext: 'js',
    nodeArgs: '--harmony'
  })
  .on('change', ['lint'])
  .on('restart', function(){gutil.log('restarted!');});
});

gulp.task('watch', function(){
  return gulp.watch(['client/**/*'], ['build'])
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

gulp.task('default', ['watch']);


