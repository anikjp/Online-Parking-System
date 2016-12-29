var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");

var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var css2js = require("gulp-css2js");

var path = {
  src: ['./src/*.*']
};

gulp.task('html2js', function () {
  return gulp.src(['./src/*.html'])
    .pipe(minifyHtml())
    .pipe(ngHtml2Js({
      moduleName: "ionic-multi-date-picker.templates"
    }))
    .pipe(concat("templates.js"))
    //.pipe(uglify())
    .pipe(gulp.dest("./dist"));
});

gulp.task('scss', function () {
  gulp.src('./src/ionic-multi-date-picker.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./src/'));
  /*.pipe(minifyCss({
   keepSpecialComments: 0
   }))
   .pipe(rename({ extname: '.min.css' }))
   .pipe(gulp.dest('./www/css/'))
   .on('end', done);*/
});

gulp.task('css2js', function () {
  return gulp.src('./src/ionic-multi-date-picker.scss')
    .pipe(sass())
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(css2js())
    //.pipe(uglify())
    .pipe(gulp.dest("./dist/"));
});

gulp.task('make-bundle', ['del', 'html2js', 'css2js'], function () {
  return gulp.src(['dist/*.js', './src/*.js'])
    .pipe(concat('ionic-multi-date-picker.bundle.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('del-temp-files', ['make-bundle'], function () {
  return del(['dist/templates.js', 'dist/ionic-multi-date-picker.styles.js']);
});

gulp.task('del', function () {
  return del(['dist/*']);
});

gulp.task('build', ['del-temp-files']);


gulp.task('watch', function () {
  gulp.watch(path.src, ['build']);
});

gulp.task('default', ['watch']);