
/**
 * @name	CeL data function
 * @fileoverview
 * 本檔案包含了 data 處理的 functions。
 * @since	
 */


if (typeof CeL === 'function'){

/**
 * 本 module 之 name(id)，<span style="text-decoration:line-through;">不設定時會從呼叫時之 path 取得</span>。
 * @type	String
 * @constant
 * @inner
 * @ignore
 */
var module_name = 'data';

//===================================================
/**
 * 若欲 include 整個 module 時，需囊括之 code。
 * @type	Function
 * @param	{Function} library_namespace	namespace of library
 * @param	load_arguments	呼叫時之 argument(s)
 * @return
 * @_name	_module_
 * @constant
 * @inner
 * @ignore
 */
var code_for_including = function(library_namespace, load_arguments) {

/**
 * null module constructor
 * @class	data 處理的 functions
 */
var _// JSDT:_module_
= function() {
	//	null module constructor
};

/**
 * for JSDT: 有 prototype 才會將之當作 Class
 */
_// JSDT:_module_
.prototype = {
};




/*
	eval(uneval(o)): IE 沒有 uneval
	http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone

way1:
return YAHOO.lang.JSON.parse( YAHOO.lang.JSON.stringify( obj ) );

TODO:
1.
防止交叉參照版: try
var a=function(){this.a=1,this.b={a:this.a},this.a={b:this.b};},b=cloneObject(a);
.or.
var a={},b;
a.a={a:1};
a.b={a:a.a};
a.a={b:a.b};
b=cloneObject(a);

恐須改成
=new cloneObject();


2.
equal()

*/
_// JSDT:_module_
.
clone_object =
/**
 * clone native Object
 * @param {Object} object
 * @param {Boolean} not_trivial
 * @return
 * @since	2008/7/19 11:13:10
 */
function clone_object(object, not_trivial) {
	if (!object || !(object instanceof Object)
			// || typeof(object) != 'object'
			)
		return object;
	var i, r = new object.constructor(object); // o.constructor()
	for (i in object)
		// o[i]===o: 預防 loop, 但還是不能防止交叉參照
		r[i] = not_trivial/* ||o[i]===o */? object[i] : clone_object(object[i], deep);
	return r;
};


/*	2004/5/5
	輸入('"','dh"fdgfg')得到2:指向"的位置
*/
function getQuoteIndex(quote,str){	//	quote:['"/]，[/]可能不太適用，除非將/[/]/→/[\/]/
 var i,l=0;
 while(i=str.indexOf(quote,l),i>0&&str.charAt(i-1)=='\\')
  if( str.slice(l,i-2).match(/(\\+)$/) && RegExp.$1.length%2 )break;
  else l=i+1;
 return i;
}



/*	2008/12/21 18:53:42
	value to json
	JavaScript Object Notation	ECMA-262 3rd Edition

	http://stackoverflow.com/questions/1500745/how-to-pass-parameters-in-eval-in-an-object-form
	json={name:'~',values:..,description:'~'}
	window[json.name].apply(null, json.values)


usage:
json(value)

parse:
data=eval('('+data+')');	//	字串的前後記得要加上刮號 ()，這是用來告知 Javascript Interpreter 這是個物件描述，不是要執行的 statement。
eval('data='+data);

TODO:

useObj
	加入function object成員，.prototype可用with()。加入函數相依性(dependency)

array用name:
(function(){
 var o;
 o=[..];
 var i,v={..};
 for(i in v)o[i]=v[i];
 return o; 
})()


據說toJSONString跟parseJSON有可能成為ECMAScript第四版的標準


recursion 循環參照
(function(){
 var o;
 o={a:[]};
 o['b']=[o['a']],
 o['a'].push([o['b']]);
 return o; 
})()



BUG:
function 之名稱被清除掉了，這可能會產生問題！
(function(){
 var f=function(){..};
 f.a=..;
 f.b=..;
 f.prototype={
  a:..,
  b:..
 }
 return f; 
})()


*/
//json[generateCode.dLK]='qNum,dQuote';

json.dL='dependencyList';	//	dependency List Key
json.forceArray=1;

json.indentString='	';
json.NewLine='\n';
json.separator=' ';
function json(val,name,type){	//	type==2: inside object, treat undefined as ''
 var _f=arguments.callee,expA=[],expC=[],vType=typeof val
	,addE=function(o,l,n){
		if(l){
		 o=_f(o,0,2);
		 n=typeof n=='undefined'||n===''?''
			:(/^(\d{1,8})?(\.\d{1,8})?$/.test(n)||/^[a-z_][a-z_\d]{0,30}$/i.test(n)?n:dQuote(n))+':'+_f.separator;
		 expA.push(n,o[1]);

		 //expC.push(_f.indentString+n+o[0].join(_f.NewLine+_f.indentString)+',');
		 o=o[0];
		 o[0]=n+(typeof o[0]=='undefined'?'':o[0]);
		 o[o.length-1]+=',';
		 for(var i=0;i<o.length;i++)
		  o[i]=_f.indentString+(typeof o[i]=='undefined'?'':o[i]);
		 expC=expC.concat(o);
		}else expA.push(o),expC.push(o);
	}
	//	去掉最後一組的 ',' 並作結
	,closeB=function(c){
		var v=expC[expC.length-1];
		if(v.charAt(v.length-1)==',')
		 expC[expC.length-1]=v.slice(0,v.length-1);
		addE(c);
	};

 switch(vType){
  case 'number':
	//	http://msdn2.microsoft.com/zh-tw/library/y382995a(VS.80).aspx
	//	isFinite(value) ? String(value)
	var k=0,m='MAX_VALUE,MIN_VALUE,NEGATIVE_INFINITY,POSITIVE_INFINITY,NaN'.split(','),t=0;
	if(val===NaN||val===Infinity||val===-Infinity)t=''+val;
	else for(;k<m.length;k++)
	 if(val===Number[m[k]]){t='Number.'+m[k];break;}
	if(!t){
	 //	http://msdn2.microsoft.com/zh-tw/library/shydc6ax(VS.80).aspx
	 for(k=0,m='E,LN10,LN2,LOG10E,LOG2E,PI,SQRT1_2,SQRT2'.split(',');k<m.length;k++)
	  if(val===Math[m[k]]){t='Math.'+m[k];break;}
	 if(!t)
	  if(k=(''+val).match(/^(-?\d*[1-9])(0{3,})$/))
	   t=k[1]+'e'+k[2].length;
	  else{

	   //	有理數判別
	   k=qNum(val);

	   //	小數不以分數顯示. m==1:非分數
	   m=k[1];
	   while(m%2==0)m/=2;
	   while(m%5==0)m/=5;

	   t=k[2]==0 && m!=1?k[0]+'/'+k[1]:
		//	TODO: 加速(?)
		(t=Math.floor(val))==val&&(''+t).length>(t='0x'+val.toString(16)).length?t:val;
	  }

	}
	addE(t);
	break;
  case 'null':
	addE(''+val);
	break;
  case 'boolean':
	addE(val);
	break;
  case 'string':
	addE(dQuote(val));
	break;
  case 'undefined':
	addE(type==2?'':'undefined');
	break;

  case 'function':
	//	加入function object成員，.prototype可用with()。加入函數相依性(dependency)
	var toS,f;
	//	這在多執行緒有機會出問題！
	if(typeof val.toString!='undefined'){toS=val.toString;delete val.toString;}
	f=''+val;
	if(typeof toS!='undefined')val.toString=toS;

	f=f.replace(/\r?\n/g,_f.NewLine);	//	function 才會產生 \r\n 問題，所以先處理掉
	var r=/^function\s+([^(\s]+)/,m=f.match(r),t;
	if(m)m=m[1],addE('//	function ['+m+']'),t=f.replace(r,'function'+_f.separator);
	if(m&&t.indexOf(m)!=-1)alert('function ['+m+'] 之名稱被清除掉了，這可能會產生問題！');
	addE(t||f);
	//	UNDO
	break;

  case 'object':
   try{
	if(val===null){addE(''+val);break;}
	var c=val.constructor;
	if(c==RegExp){
	 addE(val);
	 break;
	}
	if(c==Date || vType=='date'){	//	typeof val.getTime=='function'
	 //	與 now 相隔過短(<1e7, 約3h)視為 now。但若是 new Date()+3 之類的會出現誤差！
	 addE('new Date'+((val-new Date)>1e7?'('+val.getTime()+')':''));	//	date被當作object
	 break;
	}
	if((''+c).indexOf('Error')!=-1){
	 addE('new Error'+(val.number||val.description?'('+(val.number||'')+(val.description?(val.number?',':'')+dQuote(val.description):'')+')':''));
	 break;
	}

	var useObj=0;
	if(c==Array){
	 var i,l=0;
	 if(!_f.forceArray)for(i in val)
	  if(isNaN(i)){useObj=1;break;}else l++;

	 if(_f.forceArray || !useObj && l>val.length*.8){
	  addE('[');
	  for(i=0;i<val.length;i++)
	   addE(val[i],1);
	  closeB(']');
	  break;
	 }else useObj=1;
	}

	if(useObj||c==Object){// instanceof
	 addE('{');
	 for(var i in val)
	  addE(val[i],1,i);
	 closeB('}');
	 break;
	}
	addE(dQuote(val));
	break;
   }catch(e){
    if(28==(e.number&0xFFFF))
     alert('json: Too much recursion?\n循環參照？');
    return;
   }

  case 'unknown':	//	sometimes we have this kind of type
  default:
	alert('Unknown type: ['+vType+'] (constructor: '+val.constructor+'), please contract me!\n'+val);
	break;
	//alert(vType);
 }
 return type?[expC,expA]:expC.join(_f.NewLine);
}

/*
var a=[],b;a.push(b=[a]);json(a);

recursion 循環參照
(function(){
 var o,_1;
 _1=[o];
 o.push(_1];
 return o; 
})()

*/





//{var a=[],b,t='',i;a[20]=4,a[12]=8,a[27]=4,a[29]=4,a[5]=6,a.e=60,a.d=17,a.c=1;alert(a);b=sortValue(a);alert(a+'\n'+b);for(i in b)t+='\n'+b[i]+'	'+a[b[i]];alert(t);}
//	依值排出key array…起碼到現在，我還看不出此函數有啥大功用。
function sortValue(a,mode){	//	array,否則會出現error!	mode=1:相同value的以','合併,mode=2:相同value的以array填入
 var s=[],r=[],i,j,b,k=[];
 for(i in a)	//	使用(i in n)的方法，僅有數字的i會自動排序；這樣雖不必用sort()，但數字亦會轉成字串。
  if((b=isNaN(i)?i:parseFloat(i)),typeof s[j=isNaN(j=a[i])?j:parseFloat(j)]=='undefined')
   k.push(j),s[j]=b;
  else if(typeof s[j]=='object')s[j].push(b);
  else s[j]=[s[j],b];
 for(i=0,k.sort(function(a,b){return a-b;});i<k.length;i++)	//	sort 方法會在原地排序 Array 物件
  if(typeof(b=s[k[i]])=='object')
   if(mode==1)r.push(b.join(','));	//	b.join(',')與''+b效能相同
   else if(mode==2)r.push(b);
   else for(j in b)r.push(b[j]);
  else r.push(b);
 return r;
}


/*	2005/7/18 21:26
	依照所要求的index(sortByIndex_I)對array排序。
	sortByIndex_Datatype表某index為數字/字串或function
	先設定sortByIndex_I,sortByIndex_Datatype再使用array.sort(sortByIndex);

	example:
var array=[
'123	avcf	334',
'131	hj	562',
'657	gfhj	435',
'131	ajy	52',
'345	fds	562',
'52	gh	435',
];
sortByIndex_I=[0,1],sortByIndex_Datatype={0:1,2:1};
for(i in array)array[i]=array[i].split('	');
array.sort(sortByIndex);
alert(array.join('\n'));
*/
var sortByIndex_I,sortByIndex_Datatype;
function sortByIndex(a,b){
 //alert(a+'\n'+b);
 for(var i=0,n;i<sortByIndex_I.length;i++)
  if(sortByIndex_Datatype[n=sortByIndex_I[i]]){
   if(typeof sortByIndex_Datatype[n]=='function'){
    if(n=sortByIndex_Datatype[n](a[n],b[n]))return n;
   }else if(n=a[n]-b[n])return n;
  }else if(a[n]!=b[n])return a[n]>b[n]?1:-1;
 return 0;
}

/*	2005/7/18 21:26
	依照所要求的index對array排序，傳回排序後的index array。
	**假如設定了separator，array的元素會先被separator分割！

	example:
var array=[
'123	avcf	334',
'131	hj	562',
'657	gfhj	435',
'131	ajy	52',
'345	fds	562',
'52	gh	435',
];
alert(getIndexSortByIndex(array,'	',[0,1],[0,2]));
alert(array.join('\n'));	//	已被separator分割！

*/
function getIndexSortByIndex(array,separator,indexArray,isNumberIndex){
 //	判定與事前準備(設定sortByIndex_I,sortByIndex_Datatype)
 if(typeof indexArray=='number')sortByIndex_I=[indexArray];
 else if(typeof indexArray!='object'||indexArray.constructor!=Array)sortByIndex_I=[0];
 else sortByIndex_I=indexArray;
 var i,sortByIndex_A=[];
 sortByIndex_Datatype={};
 if(typeof isNumberIndex=='object'){
  if(isNumberIndex.constructor==Array){
   sortByIndex_Datatype={};
   for(i=0;i<isNumberIndex.length;i++)sortByIndex_Datatype[isNumberIndex[i]]=1;
  }else sortByIndex_Datatype=isNumberIndex;
  for(i in sortByIndex_Datatype)
   if(isNaN(sortByIndex_Datatype[i])||parseInt(sortByIndex_Datatype[i])!=sortByIndex_Datatype[i])delete sortByIndex_Datatype[i];
 }
 if(typeof array!='object')return;

 //	main work: 可以不用重造array資料的話..
 for(i in array){
  if(separator)array[i]=array[i].split(separator);
  sortByIndex_A.push(i);
 }
 sortByIndex_A.sort(function (a,b){return sortByIndex(array[a],array[b]);});

/*	for: 重造array資料
 var getIndexSortByIndexArray=array;
 for(i in getIndexSortByIndexArray){
  if(separator)getIndexSortByIndexArray[i]=getIndexSortByIndexArray[i].split(separator);
  sortByIndex_A.push(i);
 }
 sortByIndex_A.sort(function (a,b){return sortByIndex(getIndexSortByIndexArray[a],getIndexSortByIndexArray[b]);});
*/

 return sortByIndex_A;
}







/*
{var d=new Date;try1();alert(gDate(new Date-d));}
function try1(){
 var s='sde'.x(9999),t='',m,i=0;
 while(m=s.substr(i).match(/s[^s]+/))t+=s.substr(i,RegExp.index),i+=RegExp.lastIndex;	//	way 1:3.24,3.19,3.13
 //while(m=s.match(/s[^s]+/))t+=s.slice(0,RegExp.index),s=s.substr(RegExp.lastIndex);	//	way 2:3.52,3.24,3.29
 //	way 1 is litter better than way 2.
}*/


/*
//	TODO: 對 encodeCode/decodeCode/reduceCode 嚴厲的測試（笑）
{var tr=1,c=simpleRead('function.js'),testF='try.txt',p='',range=99	,sp='='.x(80)+NewLine,tr2=tr,i,j,t,d,d0=new Date,da,db,dc;try{simpleWrite('try.js',c=reduceCode(c),TristateTrue);
 do{da=new Date;t=''+encodeCode(c,p);db=new Date;d=''+decodeCode(t,p);dc=new Date;}while(--tr&&new Date-d0<2e4&&c==d);	//	find different
 //if(d)alert('['+c.length+']→['+t.length+']	( '+(100*t.length/c.length).to_fixed(2)+' %)\n'+t.slice(0,range)+'\n..\n\ndecode →\n'+d.slice(0,range));//+'\n'+c
 for(i=0,j=[];i<c.length;i++)j.push((i%80?'':NewLine)+c.charCodeAt(i));c+=j;
 for(i=0,j=[];i<t.length;i++)j.push((i%80?'':NewLine)+t.charCodeAt(i));t+=j;
 for(i=0,j=[];i<d.length;i++)j.push((i%80?'':NewLine)+d.charCodeAt(i));d+=j;
 simpleWrite(testF,'start at '+gDate(da)+NewLine+'encode: '+gDate(db-da)+NewLine+'decode: '+gDate(dc-db)+NewLine+sp+'['+c.length+']→['+t.length+']	( '+(100*t.length/c.length).to_fixed(2)+' %)'+NewLine+c+NewLine+NewLine+t+NewLine+sp+(typeof encodeCodeC!='undefined'?encodeCodeC+sp:'')+NewLine+d+NewLine+sp+(typeof decodeCodeC!='undefined'?decodeCodeC+sp:'')+'try '+(tr2-tr)+' times '+(c==d?'OK!':'failed @ '+(i=same(c,d))+' .'+NewLine+c.substr(i-9,range)+NewLine+'-'.x(20)+NewLine+d.substr(i-9,range))+NewLine,TristateTrue);
 alert('Test encodeCode over!');
}catch(e){simpleWrite(testF,popErr(e));}}	*/
//{a=simpleRead('function.js');for(i=0;i<encodeCodeDwordsRef.length;i++)a=a.replace(encodeCodeDwordsRef[i].replace(/([()])/g,'\\$1'),'');simpleWrite('try.txt',a);}
/*	編程式碼
	[0-\uffff=65535]
	↓	mapping to
	[1-10,13-29,32-127]:123個	普通char98[9,10,13,32-126], control chars25[1-8,14-29,127]
		[unicode control chars:ucC~ucC+5=1~5 *123^2]+unicode[*123][*1], [low unicode control chars:lucC~lucC+1=6~7]+[c]:char[0-31,127~255(最多2*122-32+127=339)], [片語char code:wordC=8]+片語index, [片語設定char code:wordSet=127]+[ (3 upper bits+) 4 len bits]+[片語index]+words
		尚可用char：16個[14-29]（未來擴充用，如\uhhhhhhhh:19個+4chars，不夠～）
	↓	mapping to
	char[1-9,11-12,14-127]-["\]:123個index

	未來：unicode片語編碼

	JavaScript五大關鍵字 - hax的技術部落格 - JavaEye技術網站	http://hax.javaeye.com/blog/380285
	if,this,function,return,var

	下兩行調到檔案頭
var encodeCodeCC,encodeCodeDwordsRef=['function ','return ','return','undefined','for(','var ','.length','typeof','continue;','if(','else','while(','break;','this.','try{','}catch(','true','false','eval(','new ','Array','Object','RegExp','.replace(','.match(','.push(','.pop(','.split(','isNaN(','.indexOf(','.substr(','with('];
set_obj_value('encodeCodeCC','ucC=1,lucC=6,wordC=8,wordS=127','int');
*/
function encodeCode(code,K){	//	code,key
 code=''+code;//code=reduceCode(code);
 if(!code)return;
 var ucC=encodeCodeCC.ucC,lucC=encodeCodeCC.lucC,wordC=encodeCodeCC.wordC,wordS=encodeCodeCC.wordS,rC=87	//	2<rC<ch.length!
 ,rc='',c,i,k=[nullCode('3-'+(code.length>rC?rC:code.length<7?7:code.length),0)],l=nullCode('1-'+rC,0),p,q,r,count,po=0	//	rc:return code,k:encode key array,l:每次跳l個,c,p,q,r:tmp,po:point
 ,recent,words={},wordsRef=encodeCodeDwordsRef.join('\0').split('\0')//,countC=[]	//	最近一次出現時間與出現頻率（次數:frequency）,片語index,片語index參照(reference)
 ,ind=[],ch=[];	//	設定加碼chars：ind:index,用ch[(ind[]+k[])%ch.length]來取得所欲轉換成的字元
 while(k.length<3&&!(l%=k.length))l=nullCode('1-'+rC,0);count=l+l;	//	確保多變性
 //	設定加碼chars
/*
 for(i=1;i<128;i++)
  if(i!=10&&i!=13&&i!=34&&i!=92)ch.push(String.fromCharCode(i));
 for(i=1,j=k.length;i<128;i++)
  if(i!=11&&i!=12&&i!=30&&i!=31){if(++j>=ch.length)j=0;ind[i]=j;}
*/
 for(i=1,j=0;i<128;i++){
  if(i!=11&&i!=12&&i!=30&&i!=31)ind[i]=j++;
  if(i!=10&&i!=13&&i!=34&&i!=92)ch.push(String.fromCharCode(i));
 }
 //	設定加碼key
 for(i=0;i<k.length;i++)k[i]=nullCode('0-'+rC,0);
 if(typeof K=='string')for(i=0,p=K,K=[];i<p.length;i++)K.push(p.charCodeAt(i)%ch.length);
 if(K instanceof Array&&K.length)k=K.concat(k);else K=[];	//	加入自訂key:k=自訂key+亂數key
	//l=51,count=l+l,k=[50,22,22];alert('l='+l+'\ncount='+count+'\n'+k);	//	自行初始設定key
 //	使用下列keyword約可減一成
 recent=[ch.length];
 if(wordsRef.length>recent.length)wordsRef.length=recent.length;//alert(wordsRef.length+','+20*l);
 for(p=20*l,i=0;i<wordsRef.length;i++)recent[words[wordsRef[i]]=i]=p;	//	初始優先權

 //encodeCodeC=['wordsRef='+wordsRef+NewLine,k.length,l+NewLine].concat(k);encodeCodeC.push(NewLine,'-'.x(9),NewLine);if(K.length)encodeCodeC.push('use password['+K.length+']'+K+NewLine);var mm;
 //	開始壓縮與編碼charcode>127
 while(po<code.length){
  if(126<(c=code.charCodeAt(po))||c<9||c<32&&c!=10&&c!=13)
   if(po++,c<340)	//	low unicode
    p=c<32?c:c-95//,mm='low unicode['+c+','+code.charAt(po-1)+'→'+p+']['+(lucC+(p<123?0:1))+','+p%123+']'//95=127-32
    ,c=String.fromCharCode(lucC+(p<123?0:1),p%123),q=2;//q=c.length
   else	//	unicode
    q=(p=(c-(r=c%123))/123)%123,p=(p-q)/123//,mm='unicode['+code.charAt(po-1)+']:[ucC+'+p+']['+q+']['+r+']'
    ,c=String.fromCharCode(ucC+p,q,r),q=3;//q=c.length
  else if(p=code.substr(po).match(/^([.};'"]?\w{2,15})([ (.;{'"])?/)){	//	片語，雖然想在找出[.};'"]時一起處理，但因過於麻煩作罷
   if(!isNaN(words[q=p[1]+p[2]])||!isNaN(words[q=p[1]]))	//	已有此片語
    po+=q.length,c=String.fromCharCode(wordC,q=words[q]),recent[q]=count
    //,mm='已有此片語['+q+']['+wordsRef[q]+']'
    ,q=2;//,countC[q]++
   else if(r=code.indexOf(q=p[1],po+RegExp.lastIndex),r!=-1&&r<5e3+po+RegExp.lastIndex){	//	後面還有此詞：建新片語
    if(p[2]&&(r+=q.length)<code.length&&code.charAt(r)==p[2])q+=p[2];	//	尋求最長片語
    for(r=0,i=1;i<recent.length;i++)if(!recent[i]){r=i;break;}else if(recent[i]<recent[r])r=i;	//	找出最不常用的
    delete words[wordsRef[r]]	//	別忘了刪除原值。But注意！這個delete相當於 words[wordsRef[r]]='' 如此而已！（並不更改length，用.join()仍可發現其存在！）but typeof=='undefined'
    ,po+=q.length,recent[words[wordsRef[r]=q]=r]=count,c=String.fromCharCode(wordS,q.length,r)+q
    //,mm='建新片語['+r+']['+q+']'
    ,q=3;//,countC[r]=1
   }
   else
    c=code.charAt(po++),q=0
    //,mm='片語['+p[1]+']→直接encode['+code.charCodeAt(po-1)+','+c+']'	//	沒有就直接encode
    ;
  }
  else
   c=code.charAt(po++),q=0
   //,mm='直接encode['+code.charCodeAt(po-1)+','+c+']'	//	都不行就直接encode
   ;

  //	加碼與de-quote
  //for(r=[],i=0;i<c.length;i++)r.push(c.charCodeAt(i));alert('get '+mm+' ['+c.length+']'+r+'\n'+c);
  for(r='',i=0;i<c.length;i++)r+=ch[((i&&i<q?c.charCodeAt(i):ind[c.charCodeAt(i)])+k[count%k.length])%ch.length];	//	char code(0)+control code(1-q)+char code
  //encodeCodeC.push(count,'next:'+po,code.charCodeAt(po)+'['+code.charAt(po)+']','control code len:'+q,'編成'+r.length+'['+r+']	'+mm+'	');for(var a,i=0;i<c.length;i++)encodeCodeC.push((i?' ':'')+'ch[('+(i&&i<q?a=c.charCodeAt(i):'ind['+(a=c.charCodeAt(i))+']='+(isNaN(a=ind[a])?'(null)':a))+' +k['+(p=count%k.length)+']='+(!isNaN(p)&&(p=k[p])?p:'(null)')+' )%'+ch.length+'='+(a=((a||0)+(p||0))%ch.length)+' ]=[ '+(!isNaN(a)&&(a=ch[a])?a.charCodeAt(0):'(null)')+' ]'+(a.charCodeAt(0)==r.charCodeAt(i)?'':'err:['+r.charCodeAt(i)+']'));encodeCodeC.push(NewLine);
  rc+=r,count+=l;
 }

 //	組合	p:加碼組
 for(i=K.length,p=(i?ch[0]:'')+ch[k.length-i]+ch[l];i<k.length;i++)p+=ch[k[i]];
 //alert(toCharCode(p)+'\n'+toCharCode(rc));//4,55,54,25,25	53,56,86,22,22,54,86,22
 return p+rc;
}
function toCharCode(s){
 s+='';if(!s)return;var i=0,c=[];
 for(;i<s.length;i++)c.push(s.charCodeAt(i));
 return c;
}
//	解程式碼
function decodeCode(c,K){	//	code,key
 if(!c)return;//c:encoded code
 //var ucC=encodeCodeCC.ucC,lucC=encodeCodeCC.lucC,wordC=encodeCodeCC.wordC,wordS=encodeCodeCC.wordS,words=encodeCodeDwordsRef.join('\0').split('\0')
 var ucC=1,lucC=6,wordC=8,wordS=127,words=['function ','return ','return','undefined','for(','var ','.length','typeof','continue;','if(','else','while(','break;','this.','try{','}catch(','true','false','eval(','new ','Array','Object','RegExp','.replace(','.match(','.push(','.pop(','.split(','isNaN(','.indexOf(','.substr(','with(']	//	精簡實戰版
 ,i,k,l,p,q,r='',w=1,cr=[]
 //	tr:b===''時return a之char code，其他無b時return a之index code，有b時return a-b之char set。出錯時無return
 ,trSet={},tr=function(s,a,b){if(!isNaN(b)&&b){var c,t="";while(a<b)if(!isNaN(c=s.ind[s.c.charCodeAt(a++)])&&!isNaN(c=s.ch[(c+s.k[s.count%s.k.length])%s.ch.length]))t+=String.fromCharCode(c);else return;return t;}else if(!isNaN(a=s.ind[s.c.charCodeAt(a)])&&((a=(a+s.k[s.count%s.k.length])%s.ch.length),typeof b!="string"||!isNaN(a=s.ch[a])))return a;}
 ,ind=[],ch=[];	//	設定解碼chars：ind:index
 //	設定解碼chars
 for(i=1,p=0;i<128;i++){
  if(i!=10&&i!=13&&i!=34&&i!=92)ind[i]=p++;
  if(i!=11&&i!=12&&i!=30&&i!=31)ch.push(i);
 }
 //	取得及設定解碼key
 if(!(p=ind[c.charCodeAt(q=0)])){
  if(typeof K=='string')for(i=0,p=K,K=[];i<p.length;i++)K.push(ch.length-p.charCodeAt(i)%ch.length);
  if(K instanceof Array&&K.length)p=ind[c.charCodeAt(++q)];else return;
 }else K=[];	//	需要密碼
 for(k=[],l=ind[c.charCodeAt(++q)],p+=i=q+1;i<p;i++)k.push(ch.length-ind[c.charCodeAt(i)]);
 if(K.length)k=K.concat(k);
 trSet.c=c=c.substr(p),
 trSet.ind=ind,trSet.ch=ch,trSet.k=k,trSet.count=l;

 //decodeCodeC=['words:'+words+NewLine,k.length,l+NewLine].concat(k);decodeCodeC.push(NewLine+'-'.x(9)+NewLine+'c:	');var mm;for(i=0;i<c.length;i++)decodeCodeC.push(c.charCodeAt(i));decodeCodeC.push(NewLine+'-'.x(9)+NewLine);if(K.length)decodeCodeC.push('use password['+K.length+']'+K+NewLine);
 i=-1;//alert('-1:'+i);
 //	開始解碼
 while((trSet.count+=l),++i<c.length){
  //if((p=c.charCodeAt(i))>127)trSet.c=c=c.slice(0,)+;
  //decodeCodeC.push(trSet.count+'	ch[(ind['+(q=c.charCodeAt(i))+']='+ind[q]+' +k['+(q=trSet.count%k.length)+']='+(q=k[q])+'('+(ch.length-q)+') )%'+ch.length+'='+(q=(ind[c.charCodeAt(i)]+q)%ch.length)+' ]=[ '+ch[q]+' ]',tr(trSet,i,'')+NewLine);
  //decodeCodeC.push(trSet.count+'	ch[(ind['+(q=c.charCodeAt(i+1))+']='+ind[q]+' +k['+(q=trSet.count%k.length)+']='+(q=k[q])+'('+(ch.length-q)+') )%'+ch.length+'='+(q=(ind[c.charCodeAt(i+1)]+q)%ch.length)+' ]=[ '+ch[q]+' ]',tr(trSet,i+1,'')+NewLine);
  //decodeCodeC.push(trSet.count+'	ch[(ind['+(q=c.charCodeAt(i+2))+']='+ind[q]+' +k['+(q=trSet.count%k.length)+']='+(q=k[q])+'('+(ch.length-q)+') )%'+ch.length+'='+(q=(ind[c.charCodeAt(i+2)]+q)%ch.length)+' ]=[ '+ch[q]+' ]',tr(trSet,i+2,'')+NewLine);
  if(isNaN(p=tr(trSet,i,''))){
   alert('decodeCode filed: illegal char ('+c.charCodeAt(i)+') @ '+i+'/'+c.length+'\n'+r);for(i=0,p=String.fromCharCode(k.length,l);i<k.length;i++)p+=String.fromCharCode(k[i]);return p+','+r;
   return;
  }	//	illegal
  //	[ucC|lucC]+unicode, [wordC]+片語index, [wordS]+[ (3 upper bits+) 4 len bits]+[片語index]+words
  if(p==wordS)
   q=tr(trSet,++i),p=tr(trSet,++i),r+=words[p]=tr(trSet,++i,i+q),i+=q-1
   //,mm='設定片語 長'+q+'['+p+']:'+words[p]
   ;
  else if(p==wordC)r+=words[tr(trSet,++i)]
   //,mm='片語'+tr(trSet,i)+'['+words[tr(trSet,i)]+']'
   ;
  else if(p==lucC||p==lucC+1)
   p+=tr(trSet,++i)-lucC,r+=String.fromCharCode(p<32?p:p+95)
   //,mm='low unicode['+r.charCodeAt(r.length-1)+','+r.slice(-1)+'][p='+p+']'
   ;
  else if(ucC<=p&&p<ucC+5)
   r+=String.fromCharCode(((p-ucC)*123+tr(trSet,++i))*123+tr(trSet,++i))
   //,mm='unicode['+r.charCodeAt(r.length-1)+','+r.slice(-1)+'][p='+p+']'
   ;
  else
   r+=String.fromCharCode(p)
   //,mm='普通char('+p+')['+String.fromCharCode(p)+']'
   ;	//	普通char

  //alert(mm+'\n'+r);
  //decodeCodeC.length--,decodeCodeC.push('	'+mm+NewLine);
 }

 return r;
}

//simpleWrite('charCount report3.txt',charCount(simpleRead('function.js')+simpleRead('accounts.js')));
//{var t=reduceCode(simpleRead('function.js')+simpleRead('accounts.js'));simpleWrite('charCount source.js',t),simpleWrite('charCount report.txt',charCount(t));}	//	所費時間：十數秒（…太扯了吧！）
/**
 * 測出各字元的出現率。
 * 普通使用字元@0-127：9-10,13,32-126，reduce後常用：9,32-95,97-125
 * @param text	文檔
 * @return
 */
function charCount(text) {
	var i, a, c = [], d, t = '' + text, l = t.length, used = '', unused = '', u1 = -1, u2 = u1;
	for (i = 0; i < l; i++)
		if (c[a = t.charCodeAt(i)])
			c[a]++;
		else
			c[a] = 1;
	for (i = u1; i < 256; i++)
		if (c[i]) {
			if (u2 + 1 === i)
				used += ',' + i, unused += (u2 < 0 ? '' : '-' + u2);
			u1 = i;
		} else {
			if (u1 + 1 === i)
				unused += ',' + i, used += (u1 < 0 ? '' : '-' + u1);
			u2 = i;
		}
	//	若是reduceCode()的程式，通常在120項左右。
	for (i = 0, t = 'used:' + used.substr(1) + '\nunused:' + unused.substr(1)
			+ '\n', d = sortValue(c, 2).reverse(); i < d.length; i++) {
		t += NewLine
				+ (a = d[i])
				+ '['
				+ fromCharCode(a).replace(/\0/g, '\\0').replace(/\r/g, '\\r')
						.replace(/\n/g, '\\n').replace(/\t/g, '\\t') + ']'
				+ ':	' + (a = c[typeof a === 'object' ? a[0] : a]) + '	'
				+ (100 * a / l);
		//if(200*v<l)break;	//	.5%以上者←選購
	}
	alert(t);
	return t;
};

/*	
flag:
	(flag&1)==0	表情符號等不算一個字
	(flag&1)==1	連表情符號等也算一個字
	(flag&2)==1	將 HTML tag 全部消掉

可讀性/適讀性
http://en.wikipedia.org/wiki/Flesch-Kincaid_Readability_Test
http://en.wikipedia.org/wiki/Gunning_fog_index
Gunning-Fog Index：簡單的來說就是幾年的學校教育才看的懂你的文章，數字越低代表越容易閱讀，若是高於17那表示你的文章太難囉，需要研究生才看的懂，我是6.08，所以要受過6.08年的學校教育就看的懂囉。
Flesch Reading Ease：這個指數的分數越高，表示越容易了解，一般標準的文件大約介於60~70分之間。
Flesch-Kincaid grade level：和Gunning-Fog Index相似，分數越低可讀性越高，越容易使閱讀者了解，至於此指數和Gunning-Fog Index有何不同，網站上有列出計算的演算法，有興趣的人可以比較比較。

DO.normalize(): 合併所有child成一String, may crash IE6 Win!	http://www.quirksmode.org/dom/tests/splittext.html
*/
/**
 * 計算字數 word counts.
 * @param text
 * @param flag
 * @return
 */
function wordCount(text, flag) {
	var isHTML = flag & 2;

	//	is HTML object
	if (typeof text === 'object')
		if (text.innerText)
			text = text.innerText, isHTML = 0;
		else if (text.innerHTML)
			text = text.innerHTML, isHTML = 1;

	if (typeof text != 'string')
		return 0;

	//	和perl不同，JScript常抓不到(.*?)之後還接特定字串的東西，大概因為沒有s。(.*?)得改作((.|\n)*?)？ 或者該加/img？
	if (isHTML)
		text = text
				.replace(/<!--((.|\n)*?)-->/g, '')
				.replace(/<[\s\n]*\/?[\s\n]*[a-z][^<>]*>/gi, '');

	if (flag & 1)
		//	連表情符號等也算一個字
		text = text.replace(/[\+\-*\\\/?!,;.()<>{}\[\]@#$%^&_|"'~`]{2,}/g, ';');

	return text
			//	將英文等字改成單一字母。[.]: 縮寫
			//	http://en.wikibooks.org/wiki/Unicode/Character_reference/0000-0FFF
			.replace(/[a-zA-ZÀ-ÖØ-öø-ʨ\-'.]{2,}/g, 'w')
			//	date/time or number
			.replace(/[\d:+\-\.\/,]{2,}/g, '1')
			//	再去掉*全部*空白
			.replace(/[\s\n　]+/g, '')
			.length;
};







_// JSDT:_module_
.
/**
 * 運算式值的二進位表示法	已最佳化:5.82s/100000次dec_to_bin(20,8)@300(?)MHz,2.63s/100000次dec_to_bin(20)@300(?)MHz
 * @param {Number} number	number
 * @param places	places,字元數,使用前置0來填補回覆值
 * @return
 * @example
 * {var d=new Date,i,b;for(i=0;i<100000;i++)b=dec_to_bin(20);alert(gDate(new Date-d));}
 * @_memberOf	_module_
 */
dec_to_bin = function(number, places) {
	if (places && number + 1 < (1 << places)) {
		var h = '', b = number.toString(2), i = b.length;
		for (; i < places; i++)
			h += '0';
		return h + b;
	}
	//	native code 還是最快！
	return number.toString(2);

	//	上兩代：慢	var b='',c=1;for(p=p&&n<(p=1<<p)?p:n+1;c<p;c<<=1)b=(c&n?'1':'0')+b;return b;	//	不用'1:0'，型別轉換比較慢.不用i，多一個變數會慢很多
	//	上一代：慢	if(p&&n+1<(1<<p)){var h='',c=1,b=n.toString(2);while(c<=n)c<<=1;while(c<p)c<<=1,h+='0';return h+(n?n.toString(2):'');}
};





/*
	value	(Array)=value,(Object)value=
	[null]=value	累加=value
	value=[null]	value=''

	type: value type	['=','][int|float|_num_]
	*前段
		以[']或["]作分隔重定義指定號[=]與分隔號[,]
	*後段
		數字表累加
		'int'表整數int，累加1
		'float'表示浮點數float，累加.1	bug:應該用.to_fixed()
		不輸入或非數字表示string

	mode
	_.set_obj_value.F.object
	_.set_obj_value.F.array(10進位/當做數字)
	number: key部分之base(10進位，16進位等)

	example:
	set_obj_value('UTCDay','Sun,Mon,Tue,Wed,Thu,Fri,Sat','int');	//	自動從0開始設，UTCDay.Tue=2
	set_obj_value('UTCDay','Sun,Mon,Tue,Wed,Thu,Fri,Sat');	//	UTCDay.Sun=UTCDay.Fri=''
	set_obj_value('add','a=3,b,c,d',2);	//	累加2。add.b=5
	set_obj_value('add','a,b,c,d',1,_.set_obj_value.F.array);	//	add[2]='c'
	set_obj_value('add','4=a,b,c,d',2,_.set_obj_value.F.array);	//	累加2。add[8]='c'

*/
_// JSDT:_module_
.
/**
 * 設定object之值，輸入item=[value][,item=[value]..]。
 * value未設定會自動累加。
 * 使用前不必需先宣告…起碼在現在的JS版本中
 * @param obj	object name that need to operate at
 * @param value	valueto set
 * @param type	累加 / value type
 * @param mode	mode / value type
 * @return
 * @_memberOf	_module_
 */
set_obj_value = function(obj, value, type, mode) {
	if (!value || typeof o !== 'string')
		return 1;

	var a, b, i = 0, p = '=', sp = ',', e = "if(typeof " + obj + "!='object')"
			+ obj + "=new " + (mode ?
				//	"[]":"{}"
				//	Array之另一種表示法：[value1,value2,..], Object之另一種表示法：{key1:value1,key2:value2,..}
				"Array" : "Object")
			+ ";",
		//	l: item, n: value to 累加
		n, Tint = false, cmC = '\\u002c', eqC = '\\u003d';
	if (type) {
		if (typeof a === 'string') {
			a = type.charAt(0);
			if (a === '"' || a === "'") {
				a = type.split(a);
				p = a[1], sp = a[2], type = a[3];
			}
		}
		if (type === 'int')
			type = 1, Tint = true;
		else if (type === 'float')
			type = .1;
		else if (isNaN(type))
			type = 0;
		else if (type == parseInt(type))
			type = parseInt(type), Tint = true;
		else
			type = parseFloat(type); // t被設成累加數
	}
	//else t=1;

	if (typeof value === 'string')
		value = value.split(sp);
	// escape regex characters from jQuery
	cmC = new RegExp(cmC.replace(
			/([\.\\\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1"), 'g'),
			eqC = new RegExp(eqC.replace(
					/([\.\\\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1"), 'g');

	if (type)
		//	n: 現在count到..
		n = -type;

	for (; i < value.length; i++) {
		if (value[i].indexOf(p) === -1)
			value[i] = mode ? p + value[i] : value[i] + p;// if(v[i].indexOf(p)==-1&&m)v[i]=p+v[i];//
			if (mode && value[i] === p) {
				n += type;
				continue;
			}
			a = value[i].split(p);
			if (!mode && !a[0])
				//	去掉不合理的(Array可能有NaN index，所以不設條件。)
				continue;
			a[0] = a[0].replace(cmC, ',').replace(eqC, '='), a[1] = a[1].replace(
					cmC, ',').replace(eqC, '=');
			if (type)
				if (mode) {
					if (!a[0])
						a[0] = (n += type);
					else if (!isNaN(b = mode > 0 ? parseInt(a[0], mode) : a[0]))
						n = Tint ? (a[0] = parseInt(b)) : parseFloat(b);
				} else if (!a[1])
					a[1] = (n += type);
				else if (!isNaN(a[1]))
					n = Tint ? parseInt(a[1]) : parseFloat(a[1]);
					if (!type || Tint && isNaN(b = parseInt(a[1]))
							|| isNaN(b = parseFloat(a[1])))
						b = a[1];
					a = a[0];
					e += obj + '[' + (!type || isNaN(a) ? dQuote(a) : a) + ']='
						+ (!type || isNaN(b) ? dQuote(b) : b) + ';';
	}

	try {
		//if(o=='kk')alert(e.slice(0,500));
		//	因為沒想到其他方法可存取Global的object，只好使用eval..可以試試obj=set_obj_value(0,..){this=new Aaaray/Object}
		library_namespace.eval_code(e);
	} catch (e) {
		library_namespace.err('Error @ ' + obj);
		library_namespace.err(e);
		return 2;
	}
};

_.set_obj_value.F = {
	// object is default
	'object' : 0,
	'array' : -1
};



_// JSDT:_module_
.
/**
 * 將字串組分作 Object
 * @param {String} value_set	字串組, e.g., 'a=12,b=34'
 * @param assignment_char	char to assign values, e.g., '='
 * @param end_char	end char of assignment
 * @return
 * @since	2006/9/6 20:55, 2010/4/12 23:06:04
 * @_memberOf	_module_
 */
split_String_to_Object = function(value_set, assignment_char, end_char) {
	if (typeof value_set !== 'string' || !value_set)
		return {};

	value_set = value_set.split(end_char || /[,;]/);

	if (!assignment_char)
		assignment_char = /[=:]/;

	var a, o = {}, _e = 0, l = value_set.length;
	for (; _e < l; _e++) {
		//	http://msdn.microsoft.com/library/en-us/jscript7/html/jsmthsplit.asp
		a = value_set[_e].split(assignment_char, 2);
		//library_namespace.debug(value_set[_e] + '\n' + a[0] + ' ' + a[1], 2);
		if (a[0] !== '')
			o[a[0]] = a[1];
	}
	return o;
};






/*	2003/10/1 15:46
	比較string:m,n從起頭開始相同字元數
	return null: 格式錯誤，-1: !m||!n
	若一開始就不同：0


TODO:

test starting with

2009/2/7 7:51:58
看來測試 string 的包含，以 .indexOf() 最快。
即使是比較 s.length 為極小常數的情況亦復如此

下面是快到慢：

//	long,short
var contain_substring=[
function(l,s){
 var a=0==l.indexOf(s);
 return a;
}
,function(l,s){
 return 0==l.indexOf(s);
}
,function(l,s){
 return s==l.slice(0,s.length);
}
,function(l,s){
 return l.match(s);
}
,function(l,s){
 for(var i=0;i<s.length;i++)
  if(s.charAt(i)!=l.charAt(i))return 0;
 return 1;
}
];

function test_contain_substring(){
 for(var i=0;i<contain_substring.length;i++){
  var t=new Date;
  for(var j=0;j<50000;j++){
   contain_substring[i]('sdfgjk;sh*dn\\fj;kgsamnd nwgu!eoh;nfgsj;g','sdfgjk;sh*dn\\fj;kgsamnd nwgu!');
   contain_substring[i]('sdbf6a89* /23hsauru','sdbf6a89* /23');
  }
  sl(i+': '+(new Date-t));
 }
}


//	極小常數的情況:
//	long,short
var contain_substring=[
function(l,s){
 var a=0==l.indexOf(s);
 return a;
}
,function(l,s){
 return 0==l.indexOf(s);
}
,function(l,s){
 return s==l.slice(0,1);
}
,function(l,s){
 return s.charAt(0)==l.charAt(0);
}
,function(l,s){
 return l.match(/^\//);
}
];

function test_contain_substring(){
 for(var i=0;i<contain_substring.length;i++){
  var t=new Date;
  for(var j=0;j<50000;j++){
   contain_substring[i]('a:\\sdfg.dfg\\dsfg\\dsfg','/');
   contain_substring[i]('/dsfg/adfg/sadfsdf','/');
  }
  sl(i+': '+(new Date-t));
 }
}


*/

/**
 * test if 2 string is at the same length
 * @param s1	string 1
 * @param s2	string 2
 * @return
 */
function same_length(s1, s2) {
	if (typeof m !== 'string' || typeof n !== 'string')
		return;
	if (!s1 || !s2)
		return 0;

	var i = s1.length, b = 0, s = s2.length;
	if (i < s) {
		if (
				//m==n.slice(0,i=m.length)
				0 === s2.indexOf(s1))
			return i;
	} else if (
			//s2==s1.slice(0,i=s2.length)
			i = s, 0 === s1.indexOf(s2))
		return i;

	//sl('*same_length: start length: '+i);
	while ((i = (i + 1) >> 1) > 1 && (s = s2.substr(b, i)))
		//{sl('same_length: '+i+','+b+'; ['+m.substr(b)+'], ['+s+'] of ['+n+']');
		if (s1.indexOf(s, b) === b)
			b += i;
	//sl('*same_length: '+i+','+b+'; ['+m.charAt(b)+'], ['+n.charAt(b)+'] of ['+n+']');
	//var s_l=i&&m.charAt(b)==n.charAt(b)?b+1:b;
	//sl('*same_length: '+s_l+':'+m.slice(0,s_l)+',<em>'+m.slice(s_l)+'</em>; '+n.slice(0,s_l)+',<em>'+n.slice(s_l)+'</em>');
	return i && s1.charAt(b) === s2.charAt(b) ? b + 1 : b;
};



//-----------------------------------------------------------------------------



/*	將數字轉為 K, M, G 等 SI prefixes 表示方式，例如 6458 轉成 6.31K
	http://en.wikipedia.org/wiki/International_System_of_Units
	http://www.merlyn.demon.co.uk/js-maths.htm#RComma
	http://physics.nist.gov/cuu/Units/prefixes.html
	http://www.uni-bonn.de/~manfear/numbers_names.php
	http://wawa.club.hinet.net/cboard1/HCB_Dis.asp?BrdNo=78&SubNo=78761&Club=0&ClsName=%B1%D0%A8%7C%BE%C7%B2%DF
	http://bbs.thu.edu.tw/cgi-bin/bbscon?board=English&file=M.1046073664.A&num=106
*/
//to_SI[generateCode.dLK]='setTool,to_fixed,-to_SI.n,-to_SI.v';
function to_SI(num,d){
 var _f=arguments.callee,p=0,v=_f.v;
 if(!v){
  _f.v=v=[1024];	//	1000 in disk space
  for(var i=1,n=_f.n='k,M,G,T,P,E,Z,Y'.split(','),l=n.length;i<l;i++)
   v[i]=v[i-1]*v[0];
 }
 if(num<v[0])
  return num;

 while(num>=v[p])p++;
 return (num/v[--p]).to_fixed(isNaN(d)?2:d) + _f.n[p];
}

//	將漢字轉為阿拉伯數字表示法(0-99999)
function turnKanjiToNumbers(num){
 if(!num)return 0;
 if(!isNaN(num))return num;
 var i=0,l,m,n='〇,一,二,三,四,五,六,七,八,九'.split(','),d='萬,千,百,十,'.split(','),r=0
	//	Ｏ, ○=[〇]	http://zh.wikipedia.org/wiki/%E6%97%A5%E8%AA%9E%E6%95%B8%E5%AD%97
	,p=(''+num).replace(/\s/g,'').replace(/[Ｏ○]/g,'〇')
	;
 for(;i<n.length;i++)n[n[i]]=i;
 for(i=0;i<d.length;i++){
  if(p&&(m=d[i]?p.indexOf(d[i]):p.length)!=-1)
   if(!m&&d[i]==='十')r+=1,p=p.slice(1);else if(isNaN(l=n[p.slice(0,m).replace(/^〇+/,'')]))return num;else r+=l,p=p.slice(m+1);
  if(d[i])r*=10;
 }
 return r;
}
//alert(turnKanjiToNumbers('四萬〇三百七十九'));
//alert(turnKanjiToNumbers('十'));

//	將數字轉為大寫漢字表示的讀法	,turnToKanjiD,turnToKanjiInit,"turnToKanjiInit();",_turnToKanji,turnToKanji
var turnToKanjiD;
//turnToKanjiInit[generateCode.dLK]='turnToKanjiD';
function turnToKanjiInit(){
 turnToKanjiD={
  'num':['〇,一,二,三,四,五,六,七,八,九'.split(','),'零,壹,貳,參,肆,伍,陸,柒,捌,玖'.split(',')]	//	數字	叄
  //	http://zh.wikipedia.org/wiki/%E5%8D%81%E8%BF%9B%E5%88%B6	http://zh.wikipedia.org/wiki/%E4%B8%AD%E6%96%87%E6%95%B0%E5%AD%97	http://lists.w3.org/Archives/Public/www-style/2003Apr/0063.html	http://forum.moztw.org/viewtopic.php?t=3043	http://www.moroo.com/uzokusou/misc/suumei/suumei.html	http://espero.51.net/qishng/zhao.htm	http://www.nchu.edu.tw/~material/nano/newsbook1.htm
  //	十億（吉）,兆（萬億）,千兆（拍）,百京（艾）,十垓（澤）,秭（堯）,秭:禾予;溝(土旁);,無量大數→,無量,大數;[載]之後的[極]有的用[報]	異體：阿僧[禾氏],For Korean:阿僧祗;秭:禾予,抒,杼,For Korean:枾	For Korean:不可思議(不:U+4E0D→U+F967)
  //	Espana應該是梵文所譯 因為根據「大方廣佛華嚴經卷第四十五卷」中在「無量」這個數位以後還有無邊、無等、不可數、不可稱、不可思、不可量、不可說、不可說不可說，Espana應該是指上面其中一個..因為如果你有心查查Espana其實應該是解作西班牙文的「西班牙」
  ,'d':',萬,億,兆,京,垓,秭,穰,溝,澗,正,載,極,恒河沙,阿僧祇,那由他,不可思議,無量大數,Espana'	//	denomination, 單位
  //	http://zh.wikipedia.org/wiki/%E5%8D%81%E9%80%80%E4%BD%8D
  //	比漠微細的，是自天竺的佛經上的數字。而這些「佛經數字」已成為「古代用法」了。
  //	小數單位(十退位)：分,釐(厘),毫(毛),絲,忽,微,纖,沙,塵（納）,埃,渺,漠(皮),模糊,逡巡,須臾（飛）,瞬息,彈指,剎那（阿）,六德(德),虛,空,清,淨	or:,虛,空,清,淨→,空虛,清淨（仄）,阿賴耶,阿摩羅,涅槃寂靜（攸）
  ,'bd':0	//	暫時定義
 };
 with(turnToKanjiD)
  bd=[(',十,百,千'+turnToKanjiD.d).split(','),(',拾,佰,仟'+turnToKanjiD.d).split(',')]	//	base denomination
  ,d=d.split(',');
}
turnToKanjiInit();
/*	處理1-99999的數,尚有bug
	東漢時期的《數述記遺》
		一是上法，為自乘系統: 萬萬為億，億億為兆，兆兆為京。
		二是中法，為萬進系統，皆以萬遞進
		三是下法，為十進系統，皆以十遞進←現代的科學技術上用的“兆”，以及_turnToKanji()用的
*/
//_turnToKanji[generateCode.dLK]='turnToKanjiD,*turnToKanjiInit();';
function _turnToKanji(numStr,kind){
 if(!kind)kind=0;
 var i=0,r='',l=numStr.length-1,d,tnum=turnToKanjiD.num[kind],tbd=turnToKanjiD.bd[kind],zero=tnum[0];	//	用r=[]約多花一倍時間!
 for(;i<=l;i++)
  if((d=numStr.charAt(i))!='0')//if(d=parseInt(numStr.charAt(i)))比較慢
   r+=tnum[d]+tbd[l-i];//'〇一二三四五六七八'.charAt(d) 比較慢
  else if(r.slice(-1)!=zero)if(Math.floor(numStr.substr(i+1)))r+=zero;else break;
 return r;
}
//2.016,2.297,2.016
//{var d=new Date,v='12345236',i=0,a;for(;i<10000;i++)a=turnToKanji(v);alert(v+'\n→'+a+'\ntime:'+gDate(new Date-d));}

//	將數字轉為漢字表示法	num>1京時僅會取概數，此時得轉成string再輸入！
//	統整:尚有bug	廿卅
//turnToKanji[generateCode.dLK]='turnToKanjiD,turnToKanjiInit,_turnToKanji,turnToKanji';//,*turnToKanjiInit();
function turnToKanji(num,kind){
 //num=parseFloat(num);
 if(typeof num=='number')num=num.toString(10);
 num=(''+num).replace(/[,\s]/g,'');
 if(isNaN(num))return '(非數值)';
 if(num.match(/(-?[\d.]+)/))num=RegExp.$1;
 if(!kind)kind=0;

 var j,i,d=num.indexOf('.'),k,l,m,addZero=false,tnum=turnToKanjiD.num[kind],zero=tnum[0],td=turnToKanjiD.d;//i:integer,整數;d:decimal,小數
 if(d==-1)d=0;
 else for(num=num.replace(/0+$/,''),i=num.substr(d+1),num=num.slice(0,d),d='',j=0;j<i.length;j++)
	d+=tnum[i.charAt(j)];	//	小數

 //	至此num為整數
 if(num.charAt(0)=='-')i='負',num=num.substr(1);else i='';
 num=num.replace(/^0+/,'');

 for(m=num.length%4,j=m-4,l=(num.length-(m||4))/4;j<num.length;m=0,l--)//addZero=false,	l=Math.floor((num.length-1)/4)
  if(Math.floor(m=m?num.slice(0,m):num.substr(j+=4,4)))	//	這邊不能用parseInt: parseInt('0~')會用八進位，其他也有奇怪的效果。
   m=_turnToKanji(m,kind),addZero=addZero&&m.charAt(0)!=zero
   ,i+=(addZero?(addZero=false,zero):'')+m+td[l];
  else addZero=true;

 return (i?i.slice(0,2)=='一十'?i.substr(1):i:zero)+(d?'點'+d:'');
}

//	轉換成金錢表示法
//turnToMoney[generateCode.dLK]='turnToKanji';
function turnToMoney(num){
 var i=(num=turnToKanji(num,1)).indexOf('點');
 return i==-1?num+'圓整':num.slice(0,i)+'圓'+num.charAt(++i)+'角'+(++i==num.length?'':num.charAt(i++)+'分')+num.substr(i);
}


//	分斷行	2003/1/25 22:40
function getText(){//html→text
 //<.+?>	<[^>]+>	<\s*\/?\s*[a-zA-Z](.*?)>	<!	過慢?
 return this.valueOf().replace(/<s>[^<]*<\/s>/gi,'').replace(/<w?br[^>]*>/gi,'\n').replace(/<\/?[A-Za-z][^>]*>/g,'');
}
function trimStr_(s,l,m){
 var lt,lt2,gt,i=0,c=l,t='',I=0;//less than,great than,index,left count index(left length now),text now,text index
 while(I<s.length){
  //將lt,gt定在下一label之首尾,i為下一次搜尋起點.label定義:/<.+?>/
  if(i!=-1)if((lt=s.indexOf('<',i))!=-1){
   if((gt=s.indexOf('>',lt+1))==-1)i=lt=-1;
   else{i=gt+1;while(lt!=-1&&(lt2=s.indexOf('<',lt+1))!=-1&&lt2<gt)lt=lt2;}
  }else i=lt=-1;
  //if(s.indexOf('')!=-1)alert(i+','+lt+','+gt+';'+l+','+c+'\n'+t);
  if(lt==-1)gt=lt=s.length;
  //未來:考慮中英文大小，不分隔英文字。前提:'A'<'z'..或許不用
  while(I+c<=lt){t+=s.substr(I,c)+(m?'\n':'<br/>');I+=c;c=l;}
  t+=s.slice(I,gt+1);c-=lt-I;I=gt+1;
 }
 return t;
}
/*	將字串以長l分隔
	m==0: html用, 1:text
*/
//trimStr[generateCode.dLK]='trimStr_';
function trimStr(l,m){
 var s=this.valueOf(),t=[],sp='<br/>';
 if(!s||!l||l<1||!String.fromCharCode)return m?s.gText():s;//||!String.charCodeAt:v5.5
 s=s.turnU(m);//(m):這樣就不用再費心思了.不過既然都作好了,就留著吧..不,還是需要
 if(s.length<=l)return s;
 if(!m)s=s.replace(/<w?br([^>]*)>/gi,sp);

 s=s.split(sp=m?'\n':sp);//deal with line
 try{
  //	預防JS5不能push
  for(var i=0;i<s.length;i++)t.push(trimStr_(s[i],l,m));
 }catch(e){return this.valueOf();}
 return t.join(sp);
}





//-----------------------------------------------------------------------------


//mode=1:不取空字串
//	.split() appears from Internet Explorer 4.0
//	<a href="http://msdn.microsoft.com/en-us/library/s4esdbwz%28v=VS.85%29.aspx" accessdate="2010/4/16 20:4">Version Information (Windows Scripting - JScript)</a>
function strToArray(s,mode){
	var a=[],last=0,i;
	while((i=s.indexOf(sp,last))!=-1){
		if(mode==0||last!=i)a[a.length]=s.slice(last,i);
		last=i+1;
	}
	if(mode==0||last!=s.length)a[a.length]=s.slice(last);
	return a;
}

//去除s之空白,包括字與字之間的
function disposeSpace(s){
	if(!s)return s;
	var r="",i,last;
	while((i=s.indexOf(' ',last))!=-1)
		r+=s.slice(last,i),last=i+1;
	r+=s.slice(last);
	return r;
}

//以label,mode:m置換s,先找到先贏
//輸入t['$k']=..會有問題，需用t['\\$k']=..
function changeV(s,l,m){
	var i,r,re,t;//var I='';
	if(!m)m='g';
	if(s&&(t=l?l:label))for(i in t){
		//I+=', '+i+'='+t[i];
		re=new RegExp(i,m);
		s=s.replace(re,t[i]);//r=s.replace(re,t[i]);s=r;
	}
	//pLog(I.substr(2));
	//pLog('changeV:'+s);
	return s;
}

/*
//以label置換s,先找到先贏
function changeV(s){
	for(var i,j=0;j<labelN.length;j++)
		if((i=s.indexOf(labelN[j]))!=-1)
			s=s.slice(0,i)+labelV[j]+s.slice(i+labelN[j].length)
			,j=0;//research from begin
	return s;
}*/





return (
	_// JSDT:_module_
);
};

//===================================================

CeL.setup_module(module_name, code_for_including);

};
