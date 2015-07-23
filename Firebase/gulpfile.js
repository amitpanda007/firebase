var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('content', function () {
	gulp.src('content/*')
});

gulp.task('watch', function() {
	gulp.watch('content/*', ['content']);
});

gulp.task('webserver', function() {
	gulp.src('content/')
	.pipe(webserver({
		livereload: true,
		open: true
	}));
});

gulp.task('default', ['content','watch','webserver']);