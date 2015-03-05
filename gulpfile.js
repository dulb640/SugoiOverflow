'use strict';

var gulp        = require('gulp');
var nodemon     = require('gulp-nodemon');
var gutil       = require('gulp-util');
var sourcemaps  = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var del         = require('del');
var jshint      = require ('gulp-jshint');
var plumber     = require('gulp-plumber');
var notify      = require('gulp-notify');
var fs          = require('fs');

var envType     = gutil.env.type || 'debug';
var isDebug     = envType === 'debug';

gulp.task('lint', function() {
  return gulp.src(['server/**/*.js', 'client/**/*.js'])
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
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
  return gulp.watch('**/*.js', ['lint'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['dev']);
