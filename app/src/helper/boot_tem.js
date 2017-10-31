// export function bootFile(config) {

// 	const basePath = config.basePath;
// 	const compress = config.compress || 0;
// 	const timestamp = new Date().getTime();


//     return `/**
//  * 全局配置 Config
//  */(function(){window.Config={version:"1.0.6",basePath:"/${basePath}",compress:{enabled: ${compress},exclude:[/js\\/libs/,/js\\/widgets/]},isLocalMock:1,timestamp: "${timestamp}",resExport:{css:{},js:{}},browserSupport:{ie:"8"},mockUrl:"",realUrl:"",ajaxUrls:{mock:{},real:{}},ajax:{timeout:6E3,withCredentials:1}}})();(function(){window.ResBoot={getResExt:function(a){-1!==a.indexOf("?")&&(a=a.split("?")[0]);var b=a.lastIndexOf(".");return a.substring(b+1)},getPath:function(a){return/^(http|https|ftp)/g.test(a)?a:a=(0===a.indexOf("./")||0===a.indexOf("../")?"":Config.basePath+"/")+a},handleResPath:function(a){a=this.getPath(a);if(Config.compress.enabled){var b;a:{b=a;for(var d=Config.compress.exclude,c=0,e=d.length;c<e;c++)if(d[c].test(b)){b=!1;break a}b=!0}b&&(a=a.replace(/(.+)\\/(\\w+)\\.(js|css)/,"$1/$2.min.$3"))}return[a,"?_\x3d",Config.version,"_",Config.timestamp].join("")},output:function(a){var b=[],d;"string"===typeof a?b.push(a):b=a;for(var c=0,e=b.length;c<e;c++)if(a=b[c],Config.isLocalMock||!/_test\\/test\\w+\\.js/i.test(a))d=this.getResExt(a),a=this.handleResPath(a),"js"===d?document.writeln('\x3cscript src\x3d"'+a+'"\x3e\x3c/script\x3e'):document.writeln('\x3clink rel\x3d"stylesheet" href\x3d"'+a+'"\x3e')}}})();Config.resExport={css:function(){var a=["css/_dist/core.css"];a.push("pages/css/biz_common.css");return a}(),js:function(){var a=[];a.push(document.all&&!document.addEventListener?"js/_dist/core_jq1.js":"js/_dist/core_jq3.js");a.push("js/widgets/layer/layer.js");window.JSON||a.push("js/libs/json3.min.js");a.push("pages/js/biz_common.js");if(Config.isLocalMock){a.push("js/libs/mock.min.js");var b=/pages\\/\\w+\\/(\\w+)\\.html/i.exec(window.location.toString())[1];a.push(["./_test/test_",b,".js"].join(""))}return a}()};ResBoot.output(Config.resExport.css);`;
// }
// 
const $fs = global.elRequire('fs');
const $path = global.elRequire('path');

const reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g;// 正则表达式  

//格式化代码函数,已经用原生方式写好了不需要改动,直接引用就好
const formatJson = function (json, options) {
    var reg = null,
            formatted = '',
            pad = 0,
            PADDING = '    ';
    options = options || {};
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    } else {
        json = JSON.parse(json);
        json = JSON.stringify(json);
    }
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ':');
    }
    (json.split('\r\n')).forEach(function (node, index) {
                var i = 0,
                        indent = 0,
                        padding = '';
                if (node.match(/\{$/) || node.match(/\[$/)) {
                    indent = 1;
                } else if (node.match(/\}/) || node.match(/\]/)) {
                    if (pad !== 0) {
                        pad -= 1;
                    }
                } else {
                    indent = 0;
                }
                for (i = 0; i < pad; i++) {
                    padding += PADDING;
                }
                formatted += padding + node + '\r\n';
                pad += indent;
            }
    );
    return formatted;
};

export function bootFile(config, callback) {

	const rootPath = config.rootPath;	//boot.js原型文件地址
	const outputPath = config.outputPath;	//boot.js文件输出地址

	const basePath = '/' + config.basePath;	//生成项目名称
	const compress = config.compress || 0;	//是否压缩
	const timestamp = new Date().getTime();	//时间戳

	console.log(config);
	//读取boot.js
	$fs.readFile(rootPath,'utf-8',(err,data) => {

		if(err) {
			console.log(err);
			return false;
		}

		const beginStr = 'window.Config = ';
		const endStr = 'configEnd';

		const begin = data.indexOf(beginStr) + beginStr.length;
		const end = data.indexOf(endStr) - 4; //4表示configEnd结尾的（;// ），注意有个空格

		const configStr = data.substring(begin, end);

		const headStr = data.substring(0, begin);
		const footStr = data.substring(end, data.length);

		const newStr = configStr.replace(reg, function(word) { // 去除注释后的文本  
		    return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;  
		});

		const configObj = JSON.parse(newStr);

		configObj.basePath = basePath;
		configObj.compress.enabled = compress;
		configObj.timestamp = timestamp;

		const totalStr = headStr + formatJson(JSON.stringify(configObj)) + footStr;

		$fs.writeFile( outputPath, totalStr, (err) => {
			if(err) {
				console.log(err);
				return;
			}

			if(typeof callback == 'function') {
				callback();
			}

			console.log('success');
		});

	});


    
}
