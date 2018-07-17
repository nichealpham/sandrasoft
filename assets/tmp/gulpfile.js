const gulp = require('gulp');
const path = require('path');

const config = {
    paths: {
        src: './src',
        build: './build'
    }
}

gulp.task('migrate', () => {
    return gulp.src(config.paths.src + '/**/*')
        .pipe(gulp.dest(config.paths.build));
});

gulp.task('zip', () => {
    gulp.src('./build/*')
        .pipe(zip('my-app.zip'))
        .pipe(gulp.dest('./release'));
});

gulp.task('clear', () => {
    del([config.paths.build + '/**/*'], { force: true }).then(paths => {
        console.log('Cleaning files in build folder: \n', paths.join('\n'));
    });;
});

gulp.task('build', gulp.series('clear', 'migrate'));