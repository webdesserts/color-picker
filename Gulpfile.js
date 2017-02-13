var gulp = require('gulp');
var log = require('gulplog');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rollup = require('gulp-rollup');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var del = require('del');
var _ = require('lodash')
var path = require('path');

//TODO:
// - build directory
// - compile scss
// - consider npm for front end assets
// - hook up browser-sync
//
// what not to do
// - don't need to minimize, this isn't production code yet
// - don't need to concat files
// - don't need to worry about template files, just push code for now


gulp.task(function clean (cb) {
  del(['build/**/*'], cb)
})


// Compile sass into CSS & auto-inject into browsers
gulp.task(function styles () {
    return gulp.src("app/assets/styles/**/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("build/assets/styles"))
      .pipe(browserSync.stream());
});

gulp.task(function vendor () {
  return gulp.src('app/assets/scripts/vendor/**/*.js')
    .pipe(gulp.dest('build/assets/scripts/vendor'))
})

gulp.task(function scripts () {
  return gulp.src('app/assets/scripts/main.js', { read: false })
    .pipe(sourcemaps.init())
    .pipe(rollup({
      resolveExternal: function (importer, importee) {
        console.log('importer', importer)
        if (_(importer).startsWith('npm:')) {
          importer = importer.replace('npm:', 'node_modules/')
          console.log('importer', importer)
          return importer
        /*} else if (/node_modules/.test(importee)) {
          var base = importee.match(/.+node_modules+(.[^\/]+\/)/)[0]
          return path.join(base, path.join('node_modules', importer, 'index.js'));*/
        } else {
          return path.join(path.dirname(importee), importer);
        }
      }
    }))
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('build/assets/scripts'))
    .pipe(browserSync.stream());
})


gulp.task(function html () {
  return gulp.src(['app/**/*.html', '!app/assets/**/*'])
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream());
})

gulp.task('build', gulp.series(
  'clean', gulp.parallel([ 'styles', 'vendor', 'scripts', 'html' ])
))

// Static Server + watching scss/html files
gulp.task(function watch () {

    browserSync.init({
        server: "./build"
    });

    gulp.watch("app/assets/styles/**/*.scss", gulp.task('styles'));
    gulp.watch("app/assets/scripts/**/*.js", gulp.task('scripts'));
    gulp.watch(["app/**/*.html", "!app/assets/**/*"], gulp.task('html'));
});


gulp.task('default', gulp.series('build', 'watch'));

