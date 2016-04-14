/**
 *用户代理字符串检测脚本，包括检测呈现引擎，平台，Windows操作系统，移动设备和游戏系统。
 */

function client () {
	// body...
	// 呈现引擎
	var engine = {
		ie: 0,
		gecko: 0,
		webkit: 0,
		khtml: 0,
		opera: 0,

		// 完整的版本号
		ver: null
	};
	// 浏览器
	var browser = {

		// 主要浏览器
		ie: 0,
		firefox: 0,
		safari: 0,
		konq: 0,
		opera: 0,
		chrome: 0,

		// 具体版本号
		ver: null
	};

	// 平台、设备和操作系统
	var system = {
		win: false,
		mac: false,
		x11: false,

		// 移动设备
		iphone: false,
		ipod: false,
		ipad: false,
		ios: false,
		android: false,
		nokiaN: false,
		winMobile: false,

		// 游戏系统
		wii: false,
		ps: false
	};

	// 检测呈现引擎和浏览器
	var ua = navigator.userAgent;
	if(window.opera){
		engine.ver = browser.ver = window.opera.version();
	}else if(/AppleWebKit\/(\S+)/.test(ua)){
		//正则表达式中'\S'表示'not whitespace'。例：AppleWebKit/534.7
		engine.ver = RegExp["$1"];//534.7,'$1'表示正则表达式中的第一个分组，就是匹配正则表达式括号中的内容，一对括号是一个分组
		engine.webkit = parseFloat(engine.ver);

		// 确定是Chrome还是Safari
		if(/Chrome\/(\S+)/.test(ua)){
			// 例如：Chrome/47.0.2526.106
			browser.ver = RegExp["$1"];
			browser.chrome = parseFloat(browser.ver);
		}else if(/Version\/(\S+)/.test(ua)){
			browser.ver = RegExp["$1"];
			browser.safari = parseFloat(browser.ver);
		}else{
			// 近似的确定版本号,因为只有Safari3以后版本的Safari才能通过检测Version的方式识别
			var safariVersion = 1;
			if(engine.webkit < 100){
				safariVersion = 1;
			}else if(engine.webkit < 312){
				safariVersion = 1.2;
			}else if(engine.webkit < 412){
				safariVersion = 1.3;
			}else{
				safariVersion = 2;
			}

			browser.safari = broser.ver = safariVersion;
		}
	}else if(/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
		engine.ver = browser.ver = RegExp['$1'];
		engine.khtml = browser.konq = parseFloat(engine.ver);
	}else if(/rv:([^]+)\) Gecko\/\d{8}/.test(ua)){
		// 例如：rv:0.9.4) Gecko/20111128
		engine.ver = RegExp['$1'];
		browser.gecko = parseFloat(engine.ver);

		// 确定是不是Firefox
		if(/Firefox\/(\S+)/.test(ua)){
			browser.ver = RegExp['$1'];
			browser.firefox = parseFloat(browser.ver);
		}
	}else if(/MSIE ([^;]+)/.test(ua)){
		engine.ver = browser.ver = RegExp['$1'];
		engine.ie = browser.ie = parseFloat(engine.ver);
	}

	// 检测浏览器
	browser.ie = engine.ie;
	browser.opera = engine.opera;

	// 检测平台
	var p = navigator.platform;
	system.win = p.indexOf('Win') == 0;
	system.mac = p.indexOf('Mac') == 0;
	system.x11 = (p == 'X11') || (p.indexOf('Linux') == 0);

	// 检测Windows操作系统
	if(system.win){
		if(/Win(?:dows)?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
			if(RegExp['$1'] == 'NT'){
				switch(RegExp['$2']){
					case '5.0':
						system.win = '2000';
						break;
					case '5.1':
						system.win = 'XP';
						break;
					case '6.0':
						system.win = 'Vista';
						break;
					case '6.1':
						system.win = '7';
						break;
					default:
						system.win = 'NT';
						break;
				}
			}else if(RegExp['$1'] == '9x'){
				system.win = "ME";
			}else{
				system.win = RegExp["$1"];
			}
		}
	}

	// 移动设备
	system.iphone = ua.indexOf('iPhone') > -1;
	system.ipod = ua.indexOf('iPod') > -1;
	system.ipad = ua.indexOf('iPad') > -1;
	system.nokiaN = ua.indexOf('NokiaN') > -1;

	// windows mobile
	if(system.win == 'CE'){
		system.winMobile = system.win;
	}else if(system.win == 'Ph'){
		if(/Windows Phone OS (\d+.\d+)/.test(ua)){
			system.win = 'Phone';
			system.winMobile = parseFloat(RegExp['$1']);
		}
	}

	// 检测iOS版本
	if(system.mac && ua.indexOf('Mobile') > -1){
		if(/CPU (?:iphone)?OS (\d+_\d+)/.test(ua)){
			system.ios = parseFloat(RegExp.$1.replace('_','.'));
		}else{
			system.ios = 2; //不能真正检测出来，所以只能猜测
		}
	}

	//判断是否是微信
	var isWeChat = /micromessenger/.test(u.toLowerCase()) ? true : false;

	// 检测Android版本
	if(/Android (\d+\.\d+)/.test(ua)){
		system.android = parseFloat(RegExp.$1);
	}

	// 游戏系统
	system.wii = ua.indexOf('Wii') > -1;
	system.ps = /playstation/i.test(ua);

	// 返回这些对象
	var obj = {
		engine: engine,
		browser: browser,
		system: system
	};
	return obj;
};

module.exports = client;