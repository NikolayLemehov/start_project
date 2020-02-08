"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var del = require("del");
var uglify = require("gulp-uglify");


gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("minjs", function () {
  return gulp.src(["source/js/script.js"])
    .pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  // gulp.watch("source/img/*.svg", gulp.series("copysvg", "sprite", "html", "refresh"));
  gulp.watch("source/img/*.{png,jpg}", gulp.series("copypngjpg", "html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("minjs", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("copyjs", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico",
    "source/*.html",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("copysvg", function () {
  return gulp.src([
    "source/img/**/*.svg"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("copypngjpg", function () {
  return gulp.src([
    "source/img/**/*.{png,jpg}"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("copyjs", function () {
  return gulp.src([
    "source/js/**/*.js"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "minjs",
));

gulp.task("start", gulp.series("build", "server"));
