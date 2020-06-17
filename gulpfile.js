
// 第一種
// var gulp = require('gulp');

// gulp.task('html', function () {     //gulp.task帶入兩個參數，第一個是任務名稱"html"，第二是執行的function
//     return gulp.src('./src/**/*.html')  //回傳gulp的進入點"src"，參數是程式碼的路徑：src底下所有資料夾的所有html檔
//         .pipe(gulp.dest('./dist/'));     //pipe用水管接起，指定指定輸出的路徑 gulp.dest('./自訂資料夾名稱/')
// })

// 第二種
// var gulp = require('gulp');

// function copyHTML(){
//     return gulp.src('./src/**/*.html')
//         .pipe(gulp.dest('./dist/'));
// }

// exports.copy = copyHTML;


// 第三種

// var gulp = require('gulp');
// function copyHTML(cb){
//     gulp.src('./src/**/*.html')
//         .pipe(gulp.dest('./dist/'));
//     cb();
// }

// exports.copy = copyHTML;


//以第二種寫法為例：
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var ghPages = require('gulp-gh-pages');

sass.compiler = require('node-sass');

function copyHTML(){
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist/'))
        .pipe(
            browserSync.reload({    //瀏覽器自動重整頁面
                stream: true,
            }),
        );
}

function scss(){
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())  //先初始化sourcemaps
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))  //輸出後要寫入，一定要打'.'，不然無法正確寫入
        .pipe(gulp.dest('./dist/css')) //可自行定義路徑
        .pipe(
            browserSync.reload({    //瀏覽器自動重整頁面
                stream: true,
            }),
        );
}

// 模擬伺服器，執行時一定要放在最後
function browser() {
    browserSync.init({
        server: {
            baseDir: "./dist",   //指向要模擬的路徑
        },
        port: 8080,  //指定開啟瀏覽器的port號
    });
};

gulp.task('deploy', function() {
      return gulp.src('./dist/**/*')
        .pipe(ghPages());
    });

// 監聽：當檔案有修改時就要重新啟動瀏覽器
function watch(){
    gulp.watch('./src/**/*.html', gulp.series(copyHTML))
    gulp.watch('./src/scss/**/*.scss', gulp.series(scss))   
}

//希望copyHTML和scss一起執行時的寫法
// exports.default = gulp.series(gulp.parallel(copyHTML, scss), browser);

//browser和 watch一定要一起執行，不然開啟瀏覽器後就不會繼續watch了
exports.default = gulp.series(copyHTML, scss, gulp.parallel(browser, watch));






