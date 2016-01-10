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
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    //package = require('./package.json'),
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

/**
 * Compiling resources
 */
gulp.task('build', ['clean', 'sass', 'sass:min', 'js', 'js:min'])

/**
 * Compiling resources and serving application
 */
gulp.task('serve', ['clean', 'sass', 'js', 'server'], function() {
  return gulp.watch([
    './src/**/*.js', './src/**/*.jsx', './index.html', './assets/sass/**/*.sass'
  ], [
   'sass', 'js', browserSync.reload
  ]);
})