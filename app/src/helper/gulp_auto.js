import { formatRootPath } from 'helper';

export function autoRelease(config) {
	console.log(config);
	const folderPath = config.folderPath;// 'F:/electronTest';
	const dirName = config.dirName;
	const outDirName = config.outDirName;
	const siteDir = config.siteDir;

	const outPutDir = folderPath + '/' + outDirName;

	const outPutPagesDir = folderPath + '/' + outDirName + '/' + siteDir;

	const outPutDirStr = config.folderName;


	const taskArr = config.tasks;
	let taskNewArr = [];
	let taskStr = `'${outPutDirStr}_release_clean', '${outPutDirStr}_release_copy',`;

	const useFuns = ['autoprefixer','sprite','imagemin','base64','minicss','uglifyJs'];

	/**
	 * '${outPutDirStr}_release_clean',
        '${outPutDirStr}_release_copy',
        '${outPutDirStr}_release_autoprefixer',
        '${outPutDirStr}_release_sprite',
        '${outPutDirStr}_release_base64',
        '${outPutDirStr}_release_minicss',
        '${outPutDirStr}_release_uglifyJs',
        '${outPutDirStr}_del_min'
	 */
    
    //如果存在，按顺序添加任务
	useFuns.forEach((item) => {
		if(taskArr.indexOf(item) > -1) {
            taskStr += `'${outPutDirStr}_release_${item}',`
		}
	});

	taskStr += `'${outPutDirStr}_del_min'`;

console.log(taskStr);

	return `gulp.task('${outPutDirStr}_release_clean', (cb) => {
    const stream = rimrafFolder('${outPutDir}', cb);
    return stream;
});

gulp.task('${outPutDirStr}_release_copy', () => {

    const stream = gulp.src('${folderPath}/${dirName}/**/*')
        .pipe(gulp.dest('${outPutDir}'));

    return stream;
});


gulp.task('${outPutDirStr}_release_autoprefixer', () => {

    const stream =  gulp.src('${outPutPagesDir}/**/*.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest('${outPutPagesDir}'));
    return stream;
});


gulp.task('${outPutDirStr}_release_sprite',  () => {

    const stream =  gulp.src('${outPutPagesDir}/**/*.css')
        .pipe(sprite({
              cssDesDir: '${outPutPagesDir}',
              imgDesDir: '${outPutPagesDir}/css/images',
              hash: false
          }))
        .pipe(gulp.dest('${outPutPagesDir}'));
    return stream;
});

gulp.task('${outPutDirStr}_release_imagemin', (cb) => {
    const stream = gulp.src('${outPutPagesDir}/**/*.{jpg,png,gif,ico}')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            use: [
                pngquant({
                  speed: 4
                })
              ]
        }))
        .pipe(gulp.dest('${outPutPagesDir}'));
    return stream;
})

gulp.task('${outPutDirStr}_release_base64',  () => {

    const stream =  gulp.src('${outPutPagesDir}/**/*.css')
        .pipe(base64())
        .pipe(gulp.dest('${outPutPagesDir}'));
    return stream;
});

gulp.task('${outPutDirStr}_release_minicss',  () => {

    const stream =  gulp.src('${outPutPagesDir}/**/*.css')
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('${outPutPagesDir}'));
    return stream;
});


gulp.task('${outPutDirStr}_release_uglifyJs', () => {

    const stream =  pump([
                            gulp.src('${outPutPagesDir}/**/*.js'),
                            uglify(),
                            rename({suffix: '.min'}),
                            gulp.dest('${outPutPagesDir}')
                        ]
                    );
    return stream;
});

gulp.task('${outPutDirStr}_del_min', () => {
    return gulp.src([ '${outPutPagesDir}/**/*.min.min.js', '${outPutPagesDir}/**/*.min.min.css'], { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('${outPutDirStr}', function(cb) {
    gulpSequence(
        ${taskStr}
    )(cb)
});
`
}

// '${outPutDirStr}_release_clean',
//         '${outPutDirStr}_release_copy',
//         '${outPutDirStr}_release_autoprefixer',
//         '${outPutDirStr}_release_sprite',
//         '${outPutDirStr}_release_base64',
//         '${outPutDirStr}_release_minicss',
//         '${outPutDirStr}_release_uglifyJs',
//         '${outPutDirStr}_del_min'
//         
