var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('styles',function() {
  gulp.src('public/lib/adminlte/css/AdminLTE.min.css')
    .pipe(autoprefixer())
    .pipe(gulp.dest('public/stylesheets'))
});


gulp.task('watch',function() {
  gulp.watch('public/lib/adminlte/css/AdminLTE.min.css', ['styles']);
});
