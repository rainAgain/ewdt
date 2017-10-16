# ewdt

全名: epoint-web-develop-tool

## 源码目录规范
	.
	├── view
	│   └── index.html
	├── static
	│	├── lib
	│	├── images
	│   ├── js
	│	└── css
	├── mock
	│	└── mockData.js
	└── README.md


## 配置


```
	{	
		"name": 'myproject', //项目名字
		"output":''	//发布目录，默认该配置文件同级名字是 myprojectDist

		"supportAutoprefixer": true,	//自动添加版本前缀 true 或者false
		"autoprefixer": 'ie8',	// 支持的前缀版本，supportAutoprefixer 为true时有效
		
		"supportSpriteCss": true,	//是否合并雪碧图 ./img/list-1.png?__sprite 需要在图片资源后面添加?__sprite

		"supportImageTobase64": true	//生产环境是否支持转换图片为base64格式字符串
		"base64Size": 8,	//supportImageTobase64为true时，默认支持8kb以下的小图片(大图片不建议转换)

		"supportUglifyJs": true,	//生产环境是否压缩js
		"supportCleanCss": true,	//生产环境是否压缩css

		"useHash": true, //是否使用md5时间戳强刷缓存,对 .html 不进行处理,win环境，需要将项目放置在和软件同一个磁盘

		"liveReload": {
			"available": true,	//开启自动刷新
			
			"port": 9090,
			"startPath": ""  //默认根目录
		}
	}
```

##### autoprefixer 参数 (不区分大小写):

* `last 2 versions`: the last 2 versions for each browser.
* `last 2 Chrome versions`: the last 2 versions of Chrome browser.
* `last 2 major versions`: all minor/patch releases of the current
  and previous major versions.
* `last 2 iOS major versions`: all minor/patch releases of the current
  and previous major versions of iOS Safari.
* `> 5%` or `>= 5%`: versions selected by global usage statistics.
* `> 5% in US`: uses USA usage statistics. It accepts [two-letter country code].
* `> 5% in alt-AS`: uses Asia region usage statistics. List of all region codes
  can be found at [`caniuse-lite/data/regions`].
* `> 5% in my stats`: uses [custom usage data].
* `ie 6-8`: selects an inclusive range of versions.
* `Firefox > 20`: versions of Firefox newer than 20.
* `Firefox >= 20`: versions of Firefox newer than or equal to 20.
* `Firefox < 20`: versions of Firefox less than 20.
* `Firefox <= 20`: versions of Firefox less than or equal to 20.
* `Firefox ESR`: the latest [Firefox ESR] version.
* `iOS 7`: the iOS browser version 7 directly.
* `unreleased versions`: alpha and beta versions of each browser.
* `unreleased Chrome versions`: alpha and beta versions of Chrome browser.
* `not ie <= 8`: exclude browsers selected before by previous queries.
  You can add `not ` to any query.

[autoprefixer 参数具体参考地址](https://github.com/ai/browserslist#queries)
