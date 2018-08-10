'use strict';

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const connect = require('gulp-connect');
const mocha = require('gulp-mocha');

const browserify = require('browserify');
const shim = require('browserify-shim');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const port = process.env.port || 5000;

gulp.task('jshint', () => {
	return gulp.src('./src/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter());
});

gulp.task('browserify', () => {
	return browserify({
		entries: ['./src/index.js'],
		standalone: 'kulper',
		debug: true
	})
	.transform('babelify', {
		presets: ['es2015']
	})
	.bundle()
	.pipe(source('kulper.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({
		loadMaps: true
	}))
	.pipe(gulp.dest('./release/'))
	.pipe(uglify())
	.pipe(rename('kulper.min.js'))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./release/'));
});

gulp.task('test', () => {
	return gulp.src(['./test/**/*.js'])
	.pipe(mocha());
});

gulp.task('connect', () => {
	connect.server({
		root: './',
		port: port,
		livereload: true
	});
});

gulp.task('js', () => {
	gulp.src('./release/**/*.js')
	.pipe(connect.reload());
});

gulp.task('watch', () => {
    gulp.watch('./release/**/*.js', ['js']);
	gulp.watch('./src/**/*.js', ['browserify']);
});

gulp.task('default', ['browserify']);
gulp.task('serve', ['browserify', 'connect', 'watch']);