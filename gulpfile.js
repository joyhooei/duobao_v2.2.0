/*
 * htmlmin	html压缩
 * cssmin	css压缩、前缀
 * jsmin		js压缩、混淆
 * imagemin	图片压缩
 * sass		编译
 * allmin	htmlmin cssmin jsmin imagemin
 * watch		自动编译
 * rev		引用文件自动添加版本号   ?rev=@@hash
 * 
 * 
 * watch		src sass => src css		html header footer  src/html => src
 * include	include => src
 * allmin   htmlmin cssmin jsmin   	src => dist
 * rev		dist html => dist html
 * 
 * 
 * 项目初始化
 * gulp dir		创建项目文件夹
 * 
 * 开发
 * gulp watch	监控 自动编译sass、添加header footer
 * 
 * 发布
 * gulp include		添加header footer
 * gulp dist		sass编译，html、css、js压缩，复制img、libs目录
 * 
 * */


var gulp = require('gulp'),

	uglify = require('gulp-uglify'),
	
	sass = require('gulp-ruby-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	cleancss = require('gulp-clean-css'),
	
	htmlmin = require('gulp-htmlmin'),
	
//	imagemin = require('gulp-imagemin'),
	
	rev = require('gulp-rev-append'),
	
	fs = require('fs'),
	replace = require('gulp-replace'),
	
	mkdirp = require('mkdirp');
	
var babel = require('gulp-babel'),
	rename = require("gulp-rename");
	
	
//js压缩混淆
gulp.task('jsmin',function(){
	return gulp.src('src/js/*.js')
		.pipe(uglify({
			compress: {
		         drop_console: true
		    }
		}).on('error', function(e){
            console.log(e);
         }))
		.pipe(gulp.dest('dist/js/'));
});

//js压缩混淆
gulp.task('aaaa',function(){
	return gulp.src('src/libs/msui.js')
		.pipe(uglify({
			compress: {
		         drop_console: true
		    }
		}).on('error', function(e){
            console.log(e);
         }))
		.pipe(gulp.dest('./'));
});


//sass编译
gulp.task('sass', function() {
	return sass('src/sass/*.scss', {
		style: 'expanded',
		sourcemap: true
	})
	.pipe(sourcemaps.write("./"))
	.pipe(gulp.dest('src/css/'))
});



//css编译、自动添加前缀、压缩
gulp.task('cssmin',['sass'], function() {
	return sass('src/sass/*.scss', {
		style: 'expanded'
	})
//	gulp.src('src/sass/*.scss')
	.pipe(autoprefixer({
		browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
	}))
	.pipe(cleancss({
		advanced: true,
		compatibility: 'ie7',
		keepBreaks: true,
		keepSpecialComments: '*'
	}))
	.pipe(gulp.dest('dist/css/'))
});


//header footer
gulp.task('include', function() {
    var htmlDir = 'src/html/';
    fs.readdir(htmlDir, function(err, files) {
        files.forEach(function(f) {
            gulp.src(htmlDir + f)
                .pipe(replace(/<!--header-->[\s\S]*<!--headerend-->/, '<!--header-->\n' + fs.readFileSync('src/include/_header.html', 'utf-8') + '\n<!--headerend-->'))
                .pipe(replace(/<!--footer-->[\s\S]*<!--footerend-->/, '<!--footer-->\n' + fs.readFileSync('src/include/_footer.html', 'utf-8') + '\n<!--footerend-->'))
                .pipe(gulp.dest('src/'))
        });
    });
});


//html压缩
gulp.task('htmlmin', function() {
	gulp.src('src/*.html')
		.pipe(htmlmin({
			removeComments: true,//清除注释
			collapseWhitespace: true,//压缩HTML
			removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
			minifyJS: true,//压缩页面JS
			minifyCSS: true//压缩页面CSS
		}))
		.pipe(gulp.dest('dist/'))
});


//imagemin
gulp.task('imagemin', () =>
	gulp.src('src/img/*')
		.pipe(imagemin({
			optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
			progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
			interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
			multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
		}))
		.pipe(gulp.dest('dist/img/'))
);


var revFuc = function(){
	gulp.src('dist/*.html')
		.pipe(rev())
		.pipe(gulp.dest('dist/'));
}
var revFuc2 = function(){
	gulp.src('dist/css/*')
		.pipe(rev())
		.pipe(gulp.dest('dist/css/'));
}
var revFuc3 = function(){
	gulp.src('dist/js/*')
		.pipe(rev())
		.pipe(gulp.dest('dist/js/'));
}
//引用添加版本号   ?rev=@@hash
gulp.task('rev', function() {
	revFuc();
	revFuc2();
	revFuc3();
});


//引用添加版本号   ?rev=@@hash
gulp.task('revSrc', function() {
	gulp.src('src/*.html')
		.pipe(rev())
		.pipe(gulp.dest('src/'));
	gulp.src('src/js/*')
		.pipe(rev())
		.pipe(gulp.dest('src/js/'));
	gulp.src('src/css/*')
		.pipe(rev())
		.pipe(gulp.dest('src/css/'));	
});


//复制文件
gulp.task('copyimg', function() {
    return gulp.src(['src/img/*'])
        .pipe(gulp.dest('dist/img/'));
});
gulp.task('copylib', function() {
    return gulp.src(['src/libs/*'])
        .pipe(gulp.dest('dist/libs/'));
});



	//sass编译
	gulp.task('sass2', function() {
		return sass('other/activity/*/css/*.scss', {
			style: 'expanded',
			sourcemap: true
		})
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest('other/activity/'))
	});
	
	//sass编译
	gulp.task('sass3', function() {
		return sass('other/html/*/css/*.scss', {
			style: 'expanded',
			sourcemap: true
		})
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest('other/html/'))
	});
	
	//sass编译
	gulp.task('sass4', function() {
		return sass('other/web/*/css/*.scss', {
			style: 'expanded',
			sourcemap: true
		})
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest('other/web/'))
	});



// babel
gulp.task('babel', function() {
    return gulp.src('other/html/*/js/es6.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify({
			compress: {
//		         drop_console: true
		    }
		}).on('error', function(e){
            console.log(e);
        }))
        .pipe(rename(function (path) {
		    path.basename = "common";
		  }))
        .pipe(gulp.dest('other/html/'));
});



//自动watch sass编译
gulp.task('watch', function() {
	gulp.watch('src/sass/*.scss', ['sass']);
	gulp.watch(['src/include/_header.html', 'src/include/_footer.html','src/html/*.html'], ['include']);
	
	gulp.watch('other/activity/*/css/*.scss', ['sass2']);
	gulp.watch('other/html/*/css/*.scss', ['sass3']);
	gulp.watch('other/web/*/css/*.scss', ['sass4']);
	
	gulp.watch('other/html/*/js/es6.js', ['babel']);
});

//allmin
gulp.task('allmin', ['htmlmin','cssmin','jsmin']);


//发布
gulp.task('dist', ['htmlmin','cssmin','jsmin','copyimg','copylib'],function(){
	revFuc();
});


//创建文件夹
gulp.task('dir',function(){
	var dirs = ['src/','src/css/','src/html/','src/img','src/include/','src/js','src/libs','src/sass','dist/','dist/css/','dist/img/','dist/js/','dist/libs/'];
	dirs.forEach(dir => {
	    mkdirp.sync(dir);
	});
});

