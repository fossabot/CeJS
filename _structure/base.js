
/**
 * @name	CeL library base function
 * @fileoverview
 * 本檔案包含了 library 常用 base functions。
 * @since	2010/1/8 22:21:36
 */


/*
use <a href="http://prototyp.ical.ly/index.php/2007/03/01/javascript-design-patterns-1-the-singleton/" accessdate="2010/4/25 0:23" title="prototyp.ical.ly  &amp;raquo; Javascript Design Patterns - 1. The Singleton">Singleton pattern</a>,
Module 模式或單例模式（<a href="http://zh.wikipedia.org/wiki/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F" accessdate="2010/4/25 0:25" title="单例模式">Singleton</a>）<a href="http://www.comsharp.com/GetKnowledge/zh-CN/TeamBlogTimothyPage_K950.aspx" accessdate="2010/4/25 0:24" title="那些相见恨晚的 JavaScript 技巧 - 基于 COMSHARP CMS">為 Douglas Crockford 所推崇</a>，並被大量應用在 Yahoo User Interface Library YUI。

*/
//void(
//typeof CeL !== 'function' &&
(
/*
 * We can redefine native values only for undefined.<br/>
 * http://weblogs.asp.net/bleroy/archive/2006/08/02/Define-undefined.aspx<br/>
 * <br/>
 * Will speed up references to undefined, and allows redefining its name. (from jQuery)<br/>
 * <br/>
 * 用在比較或是 return undefined<br/>
 * 在舊的 browser 中，undefined 可能不存在。
 */
function(global, _undefined) {


//if(typeof global !== 'function') throw new Error('No global object specified!');


var
	library_name = 'CeL'

	/**
	 * default debug level
	 * @type	{Integral}
	 * @ignore
	 */
	,debug = 0

	//,window

	,old_library_namespace

	//	library base name-space
	,_

	//,_base_function_to_extend
	;


//		members of library	-----------------------------------------------
;


/**
 * Global Scope object<br/>
 * 於 CeL.eval_code 使用
 * @ignore
 */
//global = this;	//	isWeb()?window:this;


/*
var _Global=(function(){return this;})();
_Global.JustANumber=2;	//	var _GlobalPrototype=_Global.constructor.prototype;_GlobalPrototype.JustANumber=2;
if(typeof _Global=='undefined')_Global=this;
for(i in _Global)alert(i);
*/

//	若已經定義過，跳過。因為已有對 conflict 的對策，因此跳過。
//if(global[library_name] !== undefined) return;


/**
 * Will speed up references to DOM: window, and allows redefining its name. (from jQuery)
 * @ignore
 */
//window = this;


/**
 * 本 JavaScript framework 的框架基本宣告<br/>
 * base name-space declaration of JavaScript library framework
 * @example
 * //	load library
 * <script type="text/javascript" src="../ce.js"></script>
 * //	預防 initialization 到一半彈出警告視窗，所以設大一點。
 * CeL.log.max_length = 20;
 * //	set debug
 * CeL.set_debug();
 *
 * //	判別是否已經 load 過
 * if(typeof CeL !== 'function' || CeL.Class !== 'CeL')
 * 	;	//	CeL has not been loaded
 * @name	CeL
 * @class	Colorless echo JavaScript kit/library: base name-space declaration
 */
function _() {
	//	function CeL: library root
	//	declaration for debug
	//this.global = arguments[0] || arguments.callee.ce_doc;
	return new (_.init.apply(global, arguments));
};

/**
 * JavaScript library framework main class name.
 * @see	<a href="http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf">ECMA-262</a>: Object.Class: A string value indicating the kind of this object.
 * @constant
 */
_.Class = library_name;


/**
 * Map over main name-space in case of overwrite (from jQuery)
 * @ignore
 */
//old_library_namespace = global[library_name];
global[library_name] = _;


if (!_.prototype)
/**
 * framework main prototype definition
 * for JSDT: 有 prototype 才會將之當作 Class
 */
_.prototype = {
};




_// JSDT:_module_
.
/**
 * 本 library 專用之 evaluate()
 * @param code	script code to evaluate
 * @return	value that evaluate process returned
 */
eval_code = function eval_code(code) {
	/*
		JSC eval() takes an optional second argument which can be 'unsafe'.
		Mozilla/SpiderMonkey eval() takes an optional second argument which is the scope object for new symbols.

		use window.execScript(code,"JavaScript") in IE: window.execScript() 將直接使用全局上下文環境，因此，execScript(Str)中的字符串Str可以影響全局變量。——也包括聲明全局變量、函數以及對象構造器。
	*/
	//this.debug(global.eval, 2);
	//this.debug(global && global.eval && global.eval !== arguments.callee);
	return global && global.eval && global.eval !== eval_code ? global.eval.call(global, code) : eval(code);
};

_// JSDT:_module_
.
/**
 * evaluate @ Global scope.
 * By the ECMA-262, new Function() will 'Pass in the Global Environment as the Scope parameter.'
 * @param code	script code to evaluate
 * @return	value that evaluate process returned
 */
global_eval = new Function('code', 'return eval(code);');


_// JSDT:_module_
.
/**
 * simple evaluates to get value of specified various name
 * @param {String} various_name	various name
 * @param {Object|Function} [name_space]	initialize name-space. default: global
 * @return	value of specified various name
 * @since	2010/1/1 18:11:40
 * @note
 * 'namespace' 是 JScript.NET 的保留字
 * 
 * 在兩個子層(a.b.c)下，這樣作效率較差 @User agent: Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.29 Safari/533.4:
 * function(v){try{return(new Function('return('+v+')'))();}catch(e){}}
 */
get_various = function(various_name, name_space) {
	//this.debug('get value of [' + various_name + ']');
	if (typeof various_name !== 'string' || !various_name)
		return various_name;

	var i = 0,
	s = various_name.split('.'),
	l = s.length,
	v = name_space ||
		//_.env.global
		global
		;
	//this.debug('global.' + this.Class + ' = ' + _.env.global[this.Class]);

	try {
		while (i < l)
			if (v)
				// this.debug('to [' + s[i] + ']: ' + v[s[i]]),
				v = v[s[i++]];
			else
				throw 1;
	} catch (e) {
		s[i - 1] = '<em>' + s[i - 1] + '</em><span class="debug_weaken">';
		this.debug('Can\'t get [<span title="' + various_name + '">'
				+ s.join('.') + '</span></span>]!');
		return;
	}

	return v;
};




_// JSDT:_module_
.
/**
 * 取得執行 script 之 path, 在 .hta 中取代 WScript.ScriptFullName。
 * @return	{String}	執行 script 之 path
 * @return	''	unknown environment
 */
get_script_full_name = function(){
	return	typeof WScript === 'object'? WScript.ScriptFullName
			: typeof location === 'object'? unescape(location.pathname)
			: '';
};

_// JSDT:_module_
.
/**
 * 取得執行 script 之名稱
 * @return	{String} 執行 script 之 名稱
 * @return	''	unknown environment
 */
get_script_name = function(){
	var n, i, j;

	if (typeof WScript === 'object') {
		n = WScript.ScriptName;
		i = n.lastIndexOf('.');
		return i == -1 ? n : n.slice(0, i);
	}

	if (typeof location === 'object') {
		n = unescape(location.pathname), j = n.lastIndexOf('.');
		if (!(i = n.lastIndexOf('\\') + 1))
			//	location.pathname 在 .hta 中會回傳 '\' 形式的 path
			i = n.lastIndexOf('/') + 1;
		return i < j ? n.slice(i, j) : n.slice(i);
	}

	return typeof document === 'object' && document === window.document ? document.title : '';
};




_// JSDT:_module_
.
/**
 * 取得/設定環境變數 enumeration<br/>
 * （雖然不喜歡另開 name-space，但以 2009 當下的 JsDoc Toolkit 來說，似乎沒辦法創造 enumeration。）
 * @class	環境變數 (environment variables) 與程式會用到的 library 相關變數。
 * @param {String} name	環境變數名稱
 * @param value	環境變數之值
 * @return	舊環境變數之值
 */
env = function env(name, value) {
	if (!name)
		//return undefined;
		return;

	var _s = env, v = _s[name];

	if (arguments.length > 1) _s[name] = value;
	//if (typeof value !== 'undefined') _s[name] = value;

	return isNaN(v) ? '' + v : v;
};


/*
測試各 type:

undefined:
變數值存在且變數 'undefined' 存在時: various === undefined
否則: typeof(various) === 'undefined'

number, boolean, string:
typeof(various) === '~'

** NaN
** int/float

object:
null

不同frame中的Array擁有不同的constructor
*/
/**
 * A cache to the function we use to get the type of specified value.<br/>
 * Get the [[Class]] property of this object.<br/>
 * 不使用 Object.toString() 是怕被 overridden
 * @type	{Function}
 * @inner
 */
var get_object_type = Object.prototype.toString;

_// JSDT:_module_
.
/**
 * 判斷為何種 type。主要用在 Error, DOMException 等 native object 之判別。
 * @param	value	various or class instance to test
 * @param	{String} [want_type]	type to compare: number, string, boolean, undefined, object, function
 * @param	{Boolean} [get_Class]	get the class name of a class(function) instance.
 * @return	{Boolean}	The type is matched.
 * @return	{String}	The type of value
 * @return	{undefined}	error occurred
 * @example
 * CeL.is_type(value_to_test, 'Array');
 * @since	2009/12/14 19:50:14
 * @see
 * <a href="http://lifesinger.org/blog/2009/02/javascript-type-check-2/" accessdate="2009/12/6 19:10">JavaScript类型检测小结（下） - 岁月如歌</a><br/>
 * <a href="http://thinkweb2.com/projects/prototype/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/" accessdate="2009/12/6 19:10">Perfection kills &raquo; `instanceof` considered harmful (or how to write a robust `isArray`)</a>
 */
is_type = function(value, want_type, get_Class) {
	var type;
	if (want_type && (type = typeof want_type) !== 'string')
		want_type = type;

	type = value === null ? 'null' : typeof value;

	if (get_Class)
		try {
			if(type === 'function' && value.Class)
				//	get the class name of a class
				//	若 value 為 function 時，測試其本身之 Class。
				type = value.Class;
			else if (type === 'function' || type === 'object') {
				get_Class = value.constructor;
				if (get_Class.Class)
					// get the class name of a class instance
					// 若 value 為 function 且無 Class，或為 object 時，測試其 constructor 之 Class。
					type = get_Class.Class;
				else if (get_Class = ('' + get_Class)
						.match(/^\s*function\s([^\(\s]+)\s*\(/))
					// get Class by function name
					type = get_Class[1];
			}
		} catch (e) {
			this.err(this.Class + '.is_type: Fault to get ths class name of value!');
		}

	if (type !== 'object')
		//	type maybe 'unknown' or 'date'!
		return want_type ? type === want_type.toLowerCase() : type;

	try {
		get_Class = get_object_type.call(value);
	} catch (e) {
		this.err(this.Class + '.is_type: Fault to get object type of value!');
		get_Class = '';
	}

	if (want_type)
		return get_Class === (want_type.charAt(0) === '[' ? want_type
				: '[object ' + want_type + ']');

	if (want_type = get_Class.match(
					/^\[object ([^\]]+)\]$/))
		return want_type[1];

	return type;
};


_// JSDT:_module_
.
/**
 * get a type test function
 * @param	{String} want_type	object type to compare
 * @param	{String} [toString_reference]	a reference name to Object.prototype.toString
 * @return	{Function}	type test function
 * @since	2009/12/20 08:38:26
 * @example
 * // 大量驗證時，推薦另外在本身 scope 中造出捷徑：
 * this.OtS = Object.prototype.toString;
 * var is_Array = CeL.object_tester('Array', 'OtS');
 * // test
 * if(is_Array(value))
 * 	//	it's really a native Array
 * 	;
 */
object_tester = function(want_type, toString_reference) {
	var t = '[object ' + want_type + ']';

/*
	return new Function('v', 'return "' + t + '"==='
				+ (toString_reference ||
						//	在 Google Chrome 中 'Object.prototype.toString' 可以與其 reference 同速度，但其他的 reference 會快些。
						'Object.prototype.toString'
						//'get_object_type'
						)
				+ '.call(v);');
*/

	return typeof toString_reference === 'string'
		&& toString_reference ?
			new Function('v', 'return "' + t
				+ '"===' + toString_reference + '.call(v);')

			//	slow@Chrome
			: function(v) { return t === get_object_type.call(v); };
			//	fast@Chrome
			//: new Function('v', 'return "' + t + '"===Object.prototype.toString.call(v);');

};

_// JSDT:_module_
.
/**
 * Test if the value is a native Array.
 * @param	v	value to test
 * @return	{Boolean}	the value is a native Array.
 * @since	2009/12/20 08:38:26
 */
is_Array =
	// _.object_tester('Array');
	function(v) {
		// instanceof 比 Object.prototype.toString 快
		return v instanceof Array
				|| get_object_type.call(v) === '[object Array]';
	};

_// JSDT:_module_
.
/**
 * Test if the value is a native Object.
 * @param	v	value to test
 * @return	{Boolean}	the value is a native Object.
 * @since	2009/12/20 08:38:26
 */
is_Object =
	//_.object_tester('Object');
	function(v) {
		//	非如此不得與 jQuery 平起平坐…
		return get_object_type.call(v) === '[object Object]';
	};

_// JSDT:_module_
.
/**
 * Test if the value is a native Function.
 * @param	v	value to test
 * @return	{Boolean}	the value is a native Function.
 * @since	2009/12/20 08:38:26
 */
is_Function =
	//_.object_tester('Function');
	function(v) {
		//	typeof 比 Object.prototype.toString 快
		return typeof v === 'function' || get_object_type.call(v) === '[object Function]';
	};


_// JSDT:_module_
.
/**
 * Setup environment variables
 * @param	{String} [OS_type]	type of OS
 * @return	{Object}	environment variables set
 */
initial_env = function(OS_type){
	//this.env = {};
	var OS, env = this.env;

	/**
	 * default extension of script file.
	 * 設定成 '.' 時由 CeL.get_script_base_path 設定
	 * @type	String
	 * @see
	 * <a href="http://soswitcher.blogspot.com/2009/05/blogger-host-javascript-file-for-free.html" accessdate="2010/3/11 23:30">Blogger - Host Javascript File for Free - Blogger,Javascript - Blogger Blog by Switcher</a>
	 * @name	CeL.env.script_extension
	 */
	env.script_extension = typeof WScript === 'undefined' ? '.' : '.js';//'.txt'

	/**
	 * library main file base name<br/>
	 * full path: {@link CeL.env.registry_path} + {@link CeL.env.main_script}
	 * @example:
	 * CeL.log('full path: ['+CeL.env.registry_path+CeL.env.main_script+']');
	 * @name	CeL.env.main_script
	 * @type	String
	 */
	env.main_script = 'ce' + env.script_extension;

	/**
	 * module 中的這 member 定義了哪些 member 不被 extend
	 * @name	CeL.env.not_to_extend_keyword
	 * @type	String
	 */
	env.not_to_extend_keyword = 'no_extend';

	/**
	 * 本 library source 檔案使用之 encoding<br/>
	 * 不使用會產生語法錯誤
	 * @name	CeL.env.source_encoding
	 * @type	String
	 */
	env.source_encoding = 'UTF-16';

	/**
	 * default global object
	 * @name	CeL.env.global
	 * @type	Object
	 */
	env.global = global;

	/**
	 * creator group
	 * @name	CeL.env.company
	 * @type	String
	 */
	env.company = 'Colorless echo';

	env.registry_key = 'HKCU\\Software\\' + env.company + '\\' + this.Class
				+ '.path';
	//if(typeof WScript==='object')
	try {
		/**
		 * 存放在 registry 中的 path
		 * @name	CeL.env.registry_path
		 */
		env.registry_path = (WScript.CreateObject("WScript.Shell"))
				.RegRead(env.registry_key).replace(/[^\\\/]+$/, '');
		//this.debug(env.registry_path);
	} catch (e) {
		// this.warn(e.message);
	}


	//條件式編譯(条件コンパイル) for version>=4, 用 /*@ and @*/ to 判別
	/*@cc_on
	@if(@_PowerPC||@_mac)
	 OS='Mac';
	@else
	 @if(@_win32||@_win64||@_win16)
	  OS='DOS';
	 @else
	  OS='unix';	//	unknown
	 @end
	@end@*/

	/**
	 * 本次執行所在 OS 平台
	 * @name	CeL.env.OS
	 * @type	String
	 */
	env.OS = OS = typeof OS_type === 'string' ? OS_type
			// 假如未設定則取預設值
			: (OS || 'unix');

	/**
	 * 文件預設 new line
	 * @name	CeL.env.new_line
	 * @type	String
	 */
	env.new_line=		OS == 'unix' ? '\n' : OS == 'Mac' ? '\r' : '\r\n';	//	in VB: vbCrLf
	/**
	 * file system 預設 path separator<br/>
	 * platform-dependent path separator character, 決定目錄(directory)分隔
	 * @name	CeL.env.path_separator
	 * @type	String
	 */
	env.path_separator	=	OS == 'unix' ? '/' : '\\';
	/**
	 * 預設 module name separator
	 * @name	CeL.env.module_name_separator
	 * @type	String
	 */
	env.module_name_separator='.';
	/**
	 * path_separator in 通用(regular)運算式
	 * @name	CeL.env.path_separator_RegExp
	 * @type	RegExp
	 */
	env.path_separator_RegExp = this.to_RegExp_pattern ? this
			.to_RegExp_pattern(env.path_separator)
			: (env.path_separator == '\\' ? '\\' : '') + env.path_separator;
	/**
	 * 預設語系
	 * 0x404:中文-台灣,0x0411:日文-日本
	 * @name	CeL.env.locale
	 * @see	<a href="http://msdn.microsoft.com/zh-tw/library/system.globalization.cultureinfo(VS.80).aspx">CultureInfo 類別</a>
	 * @type	Number
	 */
	env.locale = 0x404;

	/**
	 * script name
	 * @name	CeL.env.script_name
	 * @type	String
	 */
	env.script_name = this.get_script_name();
	/**
	 * base path of library
	 * @name	CeL.env.library_base_path
	 * @type	String
	 */
	env.library_base_path = this.get_script_full_name(); // 以 reg 代替

	return env;
};




_// JSDT:_module_
.
/**
 * Tell if it's now debugging.
 * @param {Integral} [debug_level]	if it's now in this debug level.
 * @return	{Boolean}	It's now in specified debug level.
 * @return	{Number}	It's now in what debug level(Integral).
 */
is_debug = function(debug_level){
	return typeof debug_level === 'undefined' ? debug
				: debug >= debug_level;
};

_// JSDT:_module_
.
/**
 * Set debugging level
 * @param {Integral} [debug_level]	The debugging level to set.
 * @type	Integral
 * @return	{Number} debugging level now
 */
set_debug = function(debug_level){
	if (!isNaN(debug_level))
		debug = debug_level;

	else if (typeof debug_level === 'undefined' && !debug)
		debug = 1;

	return debug;
};


/*
CeL.extend(function f_name(){}, object || string, initial arguments);
CeL.extend({name:function(){},.. }, object || string);
CeL.extend([function1,function12,..], object || string);

set .name
*/







_// JSDT:_module_
.
/**
 * Get the hash key of text.
 * @param {String} text	text to test
 * @return	{String}	hash key
 */
_get_hash_key = function(text) {
	//text = '' + text;
	var l = text.length, take = 30, from = .3;
	from = Math.floor(l * from);
	//this.log(from + '~' + l + ': ' + (l - from < take ? text : text.substr(from, take)));
	return l - from < take ? text : text.substr(from, take);
};


_// JSDT:_module_
.
/**
 * 獲得函數名
 * @param {Function} fr	function reference
 * @param {String} ns	name-space
 * @param {Boolean} force_load	force reload this name-space
 * @return
 * @see
 * 可能的話請改用 {@link CeL.native.parse_Function}(F).funcName
 * @since	2010/1/7 22:10:27
 */
get_Function_name = function get_Function_name(fr, ns, force_load) {
	var _s = get_Function_name,
	//	初始化變數 'm'
	m = 0, ft, b, load, k, i;
	if (!fr)
		fr = _s.caller;

	//	get function text (函數的解譯文字)
	if (typeof fr === 'function') {
		if ('toString' in fr) {
			m = fr.toString;
			delete fr.toString;
		}
		ft = '' + fr;
		if (m)
			fr.toString = m;
	} else
		// typeof fr === 'string'
		ft = '' + fr;

	//	以函數的解譯文字獲得函數名
	m = ft.match(
			//	包含引數:	/^\s*function\s+(\w+)[^(]*\(([^)]*)\)/
			/^function[\s\n]+([^(\s{\n]+)/
			);
	//this.debug('matched ' + m, 1, this.Class + '.get_Function_name');
	if (m)
		//	包含引數:	+ '(' + (f ? m[2] : '') + ')';
		return m[1];


	if (b = _s.b)
		load = _s.ns;
	else
		_s.b = b = {}, _s.ns = load = {};

	if (!ns)
		ns = this;

	//	cache functions
	if ((typeof ns === 'function' || this.is_Object(ns)) && ns.Class
					&& (force_load || !load[ns.Class])) {
		for (i in ns)
			if (typeof ns[i] === 'function'){
				k = this._get_hash_key('' + ns[i]);
				m = ns.Class + '.' + i;
				//this.debug(m + ': ' + k + (', ' + ns[i]).slice(0, 200));
				if(!(m in load)){
					load[m] = 1;
					if (!b[k])
						b[k] = [];
					b[k].push( [ m, ns[i] ]);
				}
			}
		load[ns.Class] = 1;
	}

	//	將函數與 cache 比對以獲得函數名
	if (m = b[this._get_hash_key(ft)])
		for (i = 0; i < m.length; i++) {
			b= m[i][1];
			if (// typeof fr === 'function' &&
					fr === b)
				return m[i][0];
			if (ft === ('' + b))
				return m[i];
		}
};







_// JSDT:_module_
.
null_function = function() {};


//	Initialization

//	temporary decoration in case we call for nothing and raise error
_.debug = _.err = _.warn = _.log = function log(m) {
	/*
	 * 請注意:
	 * _.log.buffer !== log.buffer
	 * 在 WScript 中 需要用 _.log，其他則用 _.log。
	 * 因此應該將所有類似的值指定給雙方，並注意非[常數]的情況。
	 */
	var _s = log;
	//_s.function_to_call.apply(null,arguments);
	//_s.function_to_call.apply(global, arguments);

	_s.buffer.push(m);

	if (!_s.max_length)
		_s.max_length = 0;

	if (debug && _s.buffer.length > _s.max_length)
		_s.function_to_call.call(global, _s.buffer.join('\n\n')),
		_s.buffer = [];
};


/*
 * test:
 * var k=function l(){alert(l.m);};k.m=1;alert(l.m+','+k.m);k();
 * 
 * JScript 中
 * k();
 * 為 undefined, 其他會把 "l." 代換成 "k."？
 * 
 * @inner
 */
//_.debug.buffer = _.err.buffer = _.warn.buffer =
_.log.buffer =
log.buffer = [];

//_.debug.max_length = _.err.max_length = _.warn.max_length =
_.log.max_length =
log.max_length = 0;


var max_log_length = 1000;
//_.debug.function_to_call = _.err.function_to_call = _.warn.function_to_call =
_.log.function_to_call =
log.function_to_call =
	typeof JSalert === 'function' ? JSalert :
	typeof WScript === 'object' ? function(m){m=''+m;if(m.length>2*max_log_length)m=m.slice(0,max_log_length)+'\n\n..\n\n'+m.slice(-max_log_length);WScript.Echo(m);} :
	typeof alert === 'object' || typeof alert === 'function' ? function(m){m=''+m;if(m.length>2*max_log_length)m=m.slice(0,max_log_length)+'\n\n..\n\n'+m.slice(-max_log_length);alert(m);} :
	_.null_function;

_.initial_env();


/*
var test_obj = _(2, 'test: Initialization');

test_obj.test_print('OK!');
*/
;


}
)(
	//typeof window === 'undefined' ? this : window
	this
)
//)	//	void(
;﻿
