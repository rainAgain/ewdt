/**
 * 全局配置 Config
 */
(function() {
    window.Config = 
{
    "version":"1.0.6",
    "basePath":"",
    "compress":{
        "enabled":1,
        "exclude":[
            "/js/libs/",
            "/js/widgets/"
        ]
    },
    "isLocalMock":1,
    "timestamp":"",
    "resExport":{
        "css":{
        },
        "js":{
        }
    },
    "browserSupport":{
        "ie":"8"
    },
    "mockUrl":"",
    "realUrl":"",
    "ajaxUrls":{
        "mock":{
        },
        "real":{
        }
    },
    "ajax":{
        "timeout":6000,
        "withCredentials":1
    }
}

;// configEnd
    
}());

/**
 * 统一资源输出 ResBoot
 */
(function() {

    // 路径所指资源需启用压缩
    var isInCompress = function(path) {
        var ex = Config.compress.exclude;

        for(var i = 0, len = ex.length; i < len; i++) {
            if(ex[i].test(path)) {
                return false;
            }
        }

        return true;
    };

    window.ResBoot = {
        // 获取路径中文件的扩展名，如：js/libs/mock.js -> js
        getResExt: function(url) {
            if (url.indexOf('?') !== -1) {
                url = url.split('?')[0];
            }

            var dotPos = url.lastIndexOf('.');

            return url.substring(dotPos + 1);
        },

        // 从根路径开始
        getPath: function(path) {
            // 全路径
            if (/^(http|https|ftp)/g.test(path)) {
                return path;
            }

            // 是否是相对路径
            var isRelative = path.indexOf('./') === 0 || path.indexOf('../') === 0;

            path = (isRelative ? '' : (Config.basePath + '/')) + path;

            return path;
        },

        // 处理资源路径
        handleResPath: function(res) {
            res = this.getPath(res);

            // 如果开启压缩，切换压缩资源
            if(Config.compress.enabled) {
                if(isInCompress(res)) {
                    res = res.replace(/(.+)\/(\w+)\.(js|css)/, '$1/$2.min.$3');
                }
            }

            // 增加时间戳
            return [res, '?_=', Config.version, '_', Config.timestamp].join('');
        },

        // 以document.writeln方式输出css、js资源
        output: function(path) {
            var arr = [],
                res = '',
                ext = '';

            if (typeof path === 'string') {
                arr.push(path);
            } else {
                arr = path;
            }

            for (var i = 0, len = arr.length; i < len; i++) {
                res = arr[i];

                // 如果未开启本地数据模拟，_test/test[pagename].js 跳过
                if(!Config.isLocalMock && /_test\/test\w+\.js/i.test(res)) {
                    continue;
                }

                ext = this.getResExt(res);
                res = this.handleResPath(res);

                if (ext === 'js') {
                    document.writeln('<script src="' + res + '"></sc' + 'ript>');
                } else {
                    document.writeln('<link rel="stylesheet" href="' + res + '">');
                }
            }
        }
    };

}());

/**
 * 公共 资源输出配置
 */
Config.resExport = {
    // 通用 css 资源输出配置
    css: (function() {
        var css = ['css/_dist/core.css'];
        // 可以追加业务层面的通用css
        css.push('pages/css/biz_common.css');

        return css;
    }()),

    // 通用 js 资源输出配置
    js: (function() {
        var js = [];

        // IE8 用 core_jq1, IE9+ 用 core_jq3
        js.push(document.all && !document.addEventListener ? 'js/_dist/core_jq1.js' : 'js/_dist/core_jq3.js');
        // 默认引入 layer 组件
        js.push('js/widgets/layer/layer.js');

        // IE8 就支持 JSON 了
        if(!window.JSON) {
            js.push('js/libs/json3.min.js');
        }

        // 可以追加业务层面的通用 js
        js.push('pages/js/biz_common.js');

        if(Config.isLocalMock) {
            js.push('js/libs/mock.min.js');

            // 自动加载页面的测试资源，如果没有对应的测试资源会有404错误。
            var pageName = /pages\/\w+\/(\w+)\.html/i.exec(window.location.toString())[1];
            js.push(['./_test/test_', pageName, '.js'].join(''));
        }

        return js;
    }())
};

ResBoot.output(Config.resExport.css);
