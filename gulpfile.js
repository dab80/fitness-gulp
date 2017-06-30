'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var validate = require('gulp-w3c-css');
var htmlhint = require("gulp-htmlhint");
var babel = require('gulp-babel');
var beautify = require('gulp-beautify');

var gutil = require('gulp-util');

// --- extra plug-in #1 --- ok
var path = require('path');
var srcPath = path.join(__dirname, './assets/css/*.css');
var dstPath = path.join(__dirname, './dist/css');

//  --- extra plug-in #2 --- not working
// var cleanCSS = require('gulp-clean-css');
var cleancss = require('gulp-cleancss');

// --- extra plug-in #2 --- ok
var uglify = require('gulp-uglify');
var pump = require('pump');

//  --- extra plug-in #3 --- ok
var htmlmin = require('gulp-htmlmin');

// ---------------- Create CSS files from SASS files ---------------- ok
gulp.task('sass', function () {
    return gulp.src('./assets/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./assets/css/'));
});

// ---------------- validate CSS files ---------------- ok
// -- added sass so it will wait for sass to complete
gulp.task('validate', ['sass'], function () {
    gulp.src(srcPath)
        .pipe(validate())
        .pipe(gulp.dest(dstPath));
});

gulp.task('watch', function () {
    gulp.watch('./assets/sass/*.scss', ['sass']);
});

// ---------------- CSS Compress ----------------
gulp.task('cleancss', () => {
    return gulp.src('./assets/build/css/*.css')
        .pipe(cleancss({keepBreaks: false}))
        .pipe(gulp.dest('./dist/'));
});

// ---------------- HTML Error Checker ----------------
gulp.task('htmlhint', function () {
    gulp.src("./*.html")
        .pipe(htmlhint())
        .pipe(htmlhint.reporter());
});

// ---------------- HTML Minify ---------------- ok
// -- added htmlhint so it will wait for htmlhint to complete
gulp.task('minify', ['htmlhint'], function() {
  return gulp.src('./*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'));
});

// ---------------- JS Transpiler ----------------
gulp.task('babel', function () {
    gulp.src('./assets/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./assets/build/js/babel'));
});
 
// ---------------- JS Beautfier ----------------
// -- added babel so it will wait for babel to complete
gulp.task('beautify', ['babel'], function() {
//   gulp.src('./assets/js/*.js')
  gulp.src('./assets/build/js/babel/*.js')
    .pipe(beautify({indent_size: 2}))
    .pipe(gulp.dest('./assets/build/js'))
});

// ---------------- JS Compress Utility ----------------
// -- added beautify so it will wait for beautify to complete
gulp.task('compress', ['beautify'], function (cb) {
  pump([
        gulp.src('./assets/build/js/*.js'),
        uglify(),
        gulp.dest('./dist/js')
    ],
    cb
  );
});

// --- CSS Tasks ---
gulp.task('css', ['sass', 'validate']);

// --- JS Tasks ---
gulp.task('js', ['babel', 'beautify', 'compress']);

// --- HTML Tasks ---
gulp.task('html', ['htmlhint', 'minify']);

// --- Default Tasks ---
gulp.task('default', ['sass', 'watch']);