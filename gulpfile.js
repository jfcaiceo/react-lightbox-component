var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    globalShim = require('browserify-global-shim').configure({
      "react": "React",
      "react-dom": "ReactDOM",
    }),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    karma = require('karma').Server,
    reload = browserSync.reload;

/**
 * Cleaning dist/ folder
 */
gulp.task('clean', function(cb) {
  console.log('clean');
  del(['dist/**'], cb);
})

/**
 * Running livereload server
 */
gulp.task('server', function() {
  browserSync({
    server: {
     baseDir: './' 
    }
  });
})

/**
 * Sass compilation
 */
gulp.task('sass', function() {
  return gulp.src('./assets/sass/**/*.sass')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(concat('style.css'))
  .pipe(gulp.dest('./dist/css'));
})
gulp.task('sass:min', function() {
  return gulp.src('./assets/sass/**/*.sass')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(concat('style.min.css'))
  .pipe(cssmin())
  .pipe(gulp.dest('./dist/css'));
})

/** JavaScript compilation */
gulp.task('js', function() {
  return browserify({entries: './src/main.js', standalone: 'ReactLightbox', extensions: [ '.jsx', '.js' ]})
  .external(["react", "react-dom"])
  .transform('babelify', {presets: ['es2015', 'react']})
  .transform(globalShim)
  .bundle()
  .pipe(source('react-lightbox-component.js'))
  .pipe(gulp.dest('./dist/js'));
})
gulp.task('js:min', function() {
  return browserify({entries: './src/main.js', standalone: 'ReactLightbox', extensions: [ '.jsx', '.js' ]})
  .external(["react", "react-dom"])
  .transform('babelify', {presets: ['es2015', 'react']})
  .transform(globalShim)
  .bundle()
  .pipe(source('react-lightbox-component.min.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js'));
})

/** JavaScript docs compilation */
gulp.task('docs', function() {
  return gulp.src('docs/main.jsx')
  .pipe(babel({presets: ['es2015', 'react']}))
  .pipe(gulp.dest('docs/'));
})

/** Run karma once */
gulp.task('test', function (cb) {
  var server = new karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, cb)
  server.start();
})

/** Run karma */
gulp.task('tdd', function (cb) {
  console.log("Running TDD");
  var server = new karma({
    configFile: __dirname + '/karma.conf.js'
  }, cb);
  server.start();
})

/**
 * Compiling resources
 */
gulp.task('build', ['clean', 'sass', 'sass:min', 'js', 'js:min'])

/**
 * Compiling resources and serving application
 */
gulp.task('serve', ['clean', 'sass:min', 'js', 'server'], function() {
  return gulp.watch([
    './src/**/*.js', './src/**/*.jsx', './index.html', './assets/sass/**/*.sass'
  ], [
   'sass', 'js', browserSync.reload
  ]);
})

gulp.task('default', function() {
  console.log("gulp build       -> Build all javascripts and stylesheets");
  console.log("gulp server      -> Launch a web browser on localhost:3000");
  console.log("gulp clean       -> Clean the dist directory");
  console.log("gulp sass        -> Build the styles into the dist directory");
  console.log("gulp sass:min    -> Build the minified styles");
  console.log("gulp js          -> Build the javascripts into the dist directory");
  console.log("gulp js:min      -> Build the minified javascript");
  console.log("gulp test        -> Execute the tests once with config file karma.conf.js");
  console.log("gulp tdd         -> Execute the tests continuosly with config file karma.conf.js");
});