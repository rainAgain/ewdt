/**
 * [createServerTask 创建并启动服务器]
 * @param  {[type]} name  [任务名称]
 * @param  {[type]} path  [服务器根目录]
 * @param  {[type]} files [监听的文件]
 * @param  {[type]} port  [端口]
 * @return {[type]}       [description]
 */
const createServerTask = function(name, path, files, port) {
	files = files ? files: ['**'];

	return `gulp.task('${name}', function() {
    browserSync.init({
        files: ${files},
        server: {
            baseDir: '${path}',
            index: 'index.html'
        },
        port: ${port}
    });
});

`
      };

//压缩css文件
const createMiniCss = function(name, path, outPath) {
	path = `${path}/**/*.css`; 
	return `gulp.task('${name}',(cb) => {
    pump([
        gulp.src('${path}'),
        autoprefixer(),
        cleanCSS(),
        gulp.dest('${outPath}')
    ],cb)
});

`
      };

//给css添加兼容浏览器的前缀
const createAutoprefixer = function(name, path, outPath) {
	path = `${path}/**/*.css`;
	return `gulp.task('${name}',(cb) => {
    pump([
            gulp.src('${path}'),
            autoprefixer(),
            gulp.dest('${outPath}')
        ],
        cb
    );
});

`
      };

//混淆压缩js
const createUglify = function(name, path, outPath) {
	const folderPath = `${path}/**/*.js`;
	return `gulp.task('${name}', (cb) => {
    pump([
            gulp.src('${folderPath}'),
            uglify(),
            rename({suffix: '.min'}),
            gulp.dest('${outPath}')
        ],
        cb
    );
});

`
      };

//将图片转为base64图片
const createBase64 = function(name, path, outPath) {
          path = `${path}/**/*.css`;
          return `gulp.task('${name}', (cb) => {
    pump([
            gulp.src('${path}'),
            base64(),
            gulp.dest('${outPath}')
        ],
        cb
    );
});

`
      };

//生成雪碧图
//图片路径后面添加?_spriter
const createSprite = function(name, path, outPath) {
          const rePath = `${path}/**/*.css`;
          const imgOutPath = `${outPath}/images2`
          return `gulp.task('${name}', (cb) => {
    return gulp.src('${rePath}')
        .pipe(sprite({
              cssDesDir: '${outPath}',
              imgDesDir: '${imgOutPath}',
              hash: true
          }))
        .pipe(gulp.dest('${outPath}'))
});

`
      };

//添加hash值防止缓存
const createHash = function(name, path, outPath) {
          path = `${path}/**`;
          return `gulp.task('${name}', () => {
    const revAll = {
        dontRenameFile: [/^\\/favicon.ico$/g,'.html']
    };
    return gulp.src('${path}')
        .pipe(rainRevAll.revision(revAll))
        .pipe(gulp.dest('${outPath}'))
});

`
      };

//--------------------一键生成功能-------------------------------

//拷贝文件夹及文件夹内容
const copy = function(name, path, outPath) {
	return `gulp.task('${name}',() => {
return gulp.src('${path}/**/*')
    .pipe(gulp.dest('${outPath}'));
});

	`
};

//混淆压缩boot.js
const uglifyBootJS = function(name, path, outPath) {
  const folderPath = `${path}/boot.js`;
  return `gulp.task('${name}', (cb) => {
    pump([
            gulp.src('${folderPath}'),
            uglify(),
            rename({suffix: '.min'}),
            gulp.dest('${outPath}')
        ],
        cb
    );
});

`
      };

/**
 * [startAutoServer auto创建并启动服务器]
 * @param  {[type]} name  [任务名称]
 * @param  {[type]} path  [服务器根目录]
 * @param  {[type]} files [监听的文件]
 * @param  {[type]} port  [端口]
 * @param  {[type]} startPath  [默认打开目录]
 * @return {[type]}       [description]
 */
const startAutoServer = function(name, path, files, port, startPath, isSass) {
  let fileUrl;
  console.log(files);
  if(!isSass) {
      fileUrl = files ? `['${files}/**']` : ['**'];
  } else {
    fileUrl = `[
      '${files}/**/*.{html,js,css}',
      {
        match:['${files}/**/*.scss'],
        fn: function() {
          return gulp.src('${files}/**/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('${files}'))
        }
      }
    ]`;
  }
  

  return `
gulp.task('${name}', function() {
    browserSync.init({
        files: ${fileUrl},
        server: {
            baseDir: '${path}',
            index: 'index.html'
        },
        notify: {
            styles: [
                "margin: 0",
                "padding: 5px",
                "position: fixed",
                "font-size: 10px",
                "z-index: 9999",
                "bottom: 0px",
                "right: 0px",
                "border-radius: 0",
                "border-top-left-radius: 5px",
                "background-color: rgba(60,197,31,0.5)",
                "color: white",
                "text-align: center"
            ]
        },
        startPath: '${startPath}',
        reloadDelay: 0,
        port: ${port}
    });
});

`
      };


export {
	createServerTask,
	createMiniCss,
	createAutoprefixer,
	createUglify,
	createBase64,
	createSprite,
	createHash,

	copy,
  uglifyBootJS,
  startAutoServer
}