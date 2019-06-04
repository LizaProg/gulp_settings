const gulp = require('gulp'); //подключение модуля гальп
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();


const cssFiles = [
    './node_modules/normalize.css/normalize.css', //добавление normalize.css
    './src/css/some.css',
    './src/css/other.css'
];

const jsFiles = [
    './src/js/lib.js',
    './src/js/some.js'
];

function styles() {
    return gulp.src(cssFiles)
        .pipe(concat('all.css'))
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream()); //browserSync
}

function scripts() {
    return gulp.src(jsFiles)
        .pipe(concat('all.js'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream()); //browserSync
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        tunnel: true
})
    ; //browserSync
    gulp.watch('./src/css/**/*.css', styles); //** - смотреть во вложенных папках, *.css все файлы с таким расширением
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch("./*.html").on('change', browserSync.reload);//browserSync

}

function clean() {
    return del(['build/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);


gulp.task('build', gulp.series(clean, //выполнить последовательно команду clean(очистить все что находится в папке build)
    gulp.parallel(styles, scripts) //выполнить параллельно команды styles scripts
));

gulp.task('dev', gulp.series('build', 'watch'));