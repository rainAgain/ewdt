const $fs = require('fs');
const $path = require('path');

const rootPath = 'G://Electron/electronAppZoom/project/prototype/js/boot/boot.js';
var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g;// 正则表达式  
    //str = $('event').html(); // 欲处理的文本  

// console.log(str); // 打印出：原文本  
// console.log(str.match(reg));// 打印出：匹配子串  

// str.replace(reg, function(word) { // 去除注释后的文本  
//     return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;  
// });  

const basePath = '';
const compressEnabled = 1;
const timestamp = '';


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

$fs.readFile(rootPath,'utf-8',(err,data) => {
	if(err) {
		console.log(err);
		return false;
	}
	//console.log(data);
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
	configObj.compress.enabled = 1;
	configObj.timestamp = timestamp;

	const totalStr = headStr + formatJson(JSON.stringify(configObj)) + footStr;

	console.log(totalStr);

	$fs.writeFile('./boottest.js', totalStr, (err) => {
		if(err) {
			console.log(err);
		}
		
		console.log('success');
	});

});