"use strict";

var gulp = require("gulp"),
    gp_clean = require("gulp-clean"),
    gp_concat = require("gulp-concat"),
    gp_less = require("gulp-less"),
    gp_util = require("gulp-util"),
    gp_watch = require("gulp-watch"),
    path = require("path");

var staticPrefix = "src/sentry/static/sentry",
    distPath = staticPrefix + "/dist";

// Workaround for https://github.com/gulpjs/gulp/issues/71
var origSrc = gulp.src;
gulp.src = function () {
    return fixPipe(origSrc.apply(this, arguments));
};
function fixPipe(stream) {
    var origPipe = stream.pipe;
    stream.pipe = function (dest) {
        arguments[0] = dest.on('error', function (error) {
            var nextStreams = dest._nextStreams;
            if (nextStreams) {
                nextStreams.forEach(function (nextStream) {
                    nextStream.emit('error', error.toString());
                });
            } else if (dest.listeners('error').length === 1) {
                throw error;
            }
        });
        var nextStream = fixPipe(origPipe.apply(this, arguments));
        (this._nextStreams || (this._nextStreams = [])).push(nextStream);
        return nextStream;
    };
    return stream;
}

function file(name) {
  return path.join(__dirname, staticPrefix, name);
}

function buildCssCompileTask(name, fileList) {
  return function(){
    gulp.src(fileList)
    .pipe(gp_less({
        paths: ['node_modules/bootstrap/less']
    }))
    .pipe(gp_concat(name))
    .pipe(gulp.dest(distPath))
    .on("error", gp_util.log);
  };
}

gulp.task("clean", function () {
  return gulp.src(distPath, {read: false})
    .pipe(gp_clean())
    .on("error", gp_util.log);
});


gulp.task("dist:css:sentry", buildCssCompileTask("sentry.css", [file("less/sentry.less")]))

gulp.task("dist:css:wall", buildCssCompileTask("wall.css", [file("less/wall.less")]))

gulp.task("dist:css:platformicons", buildCssCompileTask("platformicons.css", ['node_modules/platformicons/platformicons/platformicons.css']))

gulp.task("dist:css", ["dist:css:sentry", "dist:css:wall", "dist:css:platformicons"]);

gulp.task("dist", ["dist:css", "platformicons"]);

gulp.task("watch:css:sentry", ["dist:css:sentry"], function(){
  return gp_watch(file("less/**/*.less"), function(){
    gulp.start("dist:css:sentry");
  });
});

gulp.task("watch:css:wall", ["dist:css:wall"], function(){
  return gp_watch(file("less/wall.less"), function(){
    gulp.start("dist:css:wall");
  });
});

gulp.task('platformicons', function() {
  return gulp.src(['!node_modules/platformicons/platformicons/platformicons.css', 'node_modules/platformicons/platformicons/*'])
  .pipe(gulp.dest(distPath));
});

gulp.task("watch:css", ["watch:css:sentry", "watch:css:wall"]);

gulp.task("watch", function(){
  return gulp.start(["watch:css"]);
});

gulp.task("default", ["dist"]);
