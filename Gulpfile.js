var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function() {
    gulp.src('_styles/SASS/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('_styles/css/'));
});

var concat = require('gulp-concat');

var files = [
    '_Scripts/vendor/jquery.js',
    '_Scripts/vendor/json2.js',
    '_Scripts/vendor/underscore.js',
    '_Scripts/vendor/backbone.js',
    '_Scripts/vendor/backbone.radio.js',
    '_Scripts/vendor/backbone.marionette.js',
    '_Scripts/files/_app.js',
    '_Scripts/files/**/*.js'
];
 
gulp.task('scripts', function() {
  return gulp.src(files)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./_scripts/'));
});

gulp.task('watch', function () {
    gulp.watch('_styles/SASS/**/*.scss', ['styles']);
    gulp.watch('_scripts/files/**/_*.js', ['scripts']);
});

gulp.task('default', ['watch']);