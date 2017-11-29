const $fs = global.elRequire('fs');
const $path = global.elRequire('path');

import logFile from './logger';


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
                logFile(`[boot_tem writeFile] ${err}`)
				return;
			}

			if(typeof callback == 'function') {
				callback();
			}
		});
	});
}

export function bootVersion(config,callback) {
    
        const rootPath = config.rootPath;	//boot.js原型文件地址
    
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
            console.log(configObj)
            if(typeof callback == 'function') {
                callback(configObj.version);
            }
           
        });
    }