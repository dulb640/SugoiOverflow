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
var angularFilesort =    require ('gulp-angular-filesort');
var inject =             require ('gulp-inject');
var eventStream =        require ('event-stream');
var connect =            require ('gulp-connect');
var livereload =         require('gulp-livereload');
var watch =              require ('gulp-watch');
var mainBowerFiles =     require ('main-bower-files');
var tar =                require('gulp-tar');
var gzip =               require('gulp-gzip');
var args =               require('yargs').argv;

var envType = gutil.env.NODE_ENV || args.env || 'development';
var isDev = envType === 'development';

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
  return gulp.src(['build', 'dist'])
    .pipe(rimraf());
});

gulp.task('scripts-lib', function(){
  return gulp.src(paths.bowerScripts,{
    base: 'bower_components'
  })
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
    .pipe(isDev ? gutil.noop() : concatCss('lib.css'))
    .pipe(isDev ? gutil.noop() : minifyCss())
    .pipe(gulp.dest('build/styles/lib'))
    .pipe(livereload());
});

gulp.task('styles-app', function(){
  return gulp.src(paths.styles)
    //.pipe(isDev ? gulp.dest('build'): gutil.noop())
    .pipe(isDev ? sourcemaps.init() : gutil.noop())
    .pipe(sass())
    .pipe(isDev ? gutil.noop() : concatCss('app.css'))
    .pipe(isDev ? gutil.noop() : minifyCss())
    .pipe(isDev ? sourcemaps.write('./') : gutil.noop())
    .pipe(gulp.dest('build/styles/app'))
    .pipe(livereload());
});


gulp.task('templates', function(){
  var cwd = path.resolve(__dirname, './build');
  var scriptsLib = gulp.src(['scripts/lib/**/jquery.js',
                              'scripts/lib/**/angular.js',
                              'scripts/lib/**/bootstrap.js',
                              'scripts/lib/**/*.js'],{ cwd: cwd });

  var scriptsApp = gulp.src(['scripts/app/**/*.js'],{ cwd: cwd })
    .pipe(angularFilesort());

  var stylesLib = gulp.src(['styles/lib/**/*.css'],{ cwd: cwd });
  var stylesApp = gulp.src(['styles/app/**/*.css'],{ cwd: cwd });

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
  var buildNumber = gutil.env.TRAVIS_BUILD_NUMBER || args.buildNumber;
  console.log('========== ' + buildNumber);
  console.log('========== ');
  console.log(gutil.env);
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

  if(includeEnv){
    name = util.format('%s[%s]', name, envType);
  }
  return gulp.src(srcList)
    .pipe(tar(util.format('%s.tar', name)))
    .pipe(gzip())
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['run']);
