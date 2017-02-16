var gulp = require('gulp')
var browserify = require('gulp-browserify')
var concatCss = require('gulp-concat-css')
var run = require('gulp-run')

var src = './process'
var app = './app'

gulp.task('js', function () {
  gulp.src(src + '/js/render.js')
    .pipe(browserify({
      transform: 'reactify',
      extensions: 'browserify-css',
      debug: true
    }))
    .on('error', function (err) {
      console.error('Error render.js!', err.message)
    })
    .pipe(gulp.dest(app + '/js'))
  gulp.src(src + '/js/preferencesRender.js')
    .pipe(browserify({
      transform: 'reactify',
      extensions: 'browserify-css',
      debug: true
    }))
    .on('error', function (err) {
      console.error('Error preferencesRender.js!', err.message)
    })
    .pipe(gulp.dest(app + '/js'))
})

gulp.task('html', function () {
  gulp.src(src + '/**/*.html')
})

gulp.task('css', function () {
  gulp.src(src + '/css/app.css')
  .pipe(concatCss('app.css'))
  .pipe(gulp.dest(app + '/css'))
  gulp.src(src + '/css/preferences.css')
  .pipe(concatCss('preferences.css'))
  .pipe(gulp.dest(app + '/css'))
})

gulp.task('fonts', function () {
  gulp.src('node_modules/bootstrap/dist/fonts/**/*')
  .pipe(gulp.dest(app + '/fonts'))
})

gulp.task('watch', ['serve'], function () {
  gulp.watch(src + '/js/**/*', ['js'])
  gulp.watch(src + '/css/**/*.css', ['css'])
  gulp.watch([app + '/**/*.html'], ['html'])
})

gulp.task('serve', ['html', 'js', 'css'], function () {
  run('electron app/main.js').exec()
})

gulp.task('default', ['watch', 'fonts', 'serve'])
