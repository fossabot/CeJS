
(function (){

	/**
	 * 本 library / module 之 id
	 */
	var lib_name = 'HTA';

	//	若 CeL 尚未 loaded 或本 library 已經 loaded 則跳出。
	if(typeof CeL !== 'function' || CeL.Class !== 'CeL' || CeL.is_loaded(lib_name))
		return;


/**
 * compatibility/相容性 test
 * @memberOf	CeL
 * @param	msg	msg
 */
CeL.HTA = function(msg){
	alert(msg);
};



//CeL.extend(lib_name, {});

})();



/*	Internet Explorer Automation

TODO:
JavaScript closure and IE 4-6 memory leak
Mozilla ActiveX Project	http://www.iol.ie/%7Elocka/mozilla/mozilla.htm
IE臨時文件的位置可以從註冊表鍵值 HKLM\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Cache\paths\Directory 中讀取。
*/
function IEA(URL){

 try{
/*	COM objects
WScript.CreateObject("InternetExplorer.Application","Event_");
new ActiveXObject(class[, servername]);

http://www.cnblogs.com/xdotnet/archive/2007/04/09/javascript_object_activexobject.html
var obj=new ActiveXObject(servername,typename[,location]);
servername提供該對象的應用程序名稱；
typename要創建的對象地類型或類；
location創建該對象得網絡服務器名稱。
*/
  this.app=new ActiveXObject("InternetExplorer.Application");
 }catch(e){
  //return;
 }
 if(!this.app)return;
 this.go(URL||'');	//	要先瀏覽了網頁，才能實行IEApp.Document其他功能。

 return this;

/*	other functions
	http://msdn2.microsoft.com/en-us/library/aa752085.aspx
	http://msdn2.microsoft.com/en-us/library/Aa752084.aspx
IEApp.Visible=true;
IEApp.Offline=true;
IEApp.Document.frames.prompt();
*/
}
IEA.frame=function(d,n){	//	document, name
 try{
  d=d.getElementsByTagName('frame');
  return n?d[n].contentWindow.document:d;
 }catch(e){}
};
IEA.prototype={
//	w:以有無視窗，否則以有無內容判別OK	關掉視窗時， typeof this.app.Visible=='unknown'
OK:function(w){try{if(w?typeof this.app.Visible=='boolean':this.doc().body.innerHTML)return this.app;}catch(e){}},
autoSetBase:true,
baseD:'',
baseP:'',
//initP:'about:blank',
timeout:3e4,	//	ms>0
setBase:function(URL){
 var m=(URL||'').match(/^([\w\d\-]+:\/\/[^\/]+)(.*?)$/);
 if(m)this.baseD=m[1],this.baseP=m[2].slice(0,m[2].lastIndexOf('/')+1);
 //WScript.Echo('IEA.setBase:\ndomin: '+this.baseD+'\npath: '+this.baseP);
 return this.baseD;
},
go:function(URL){	//	URL or history num
 var _t=this;
 try{
  if(URL===''||isNaN(URL)){
   if(URL==='')URL='about:blank';//_t.initP;
   if(URL){
    if(URL.indexOf(':')==-1)//if(URL.indexOf('://')==-1&&URL.indexOf('about:')==-1)
     URL=_t.baseD+(URL.charAt(0)=='/'?'':_t.baseP)+URL;
    _t.app.Navigate(URL);	//	IEApp.Document.frames.open(URL);	**	請注意：這裡偶爾會造成script停滯，並跳出警告視窗！
    if(_t.autoSetBase)_t.setBase(URL);
    _t.wait();
    //_t.win().onclose=function(){return false;};//_t.win().close=null;	//	防止自動關閉
   }
  }else _t.win().history.go(URL),_t.wait();
 }catch(e){}
 eName=0;
 return _t;
},
/*	完全載入
TODO:
http://javascript.nwbox.com/IEContentLoaded/
try{document.documentElement.doScroll('left');}
catch(e){setTimeout(arguments.callee, 50);return;}
instead of onload
*/
waitStamp:0,
waitInterval:200,	//	ms
waitState:3,	//	1-4: READYSTATE_COMPLETE=4	usual set to interactive=3
wait:function(w){
 if(!w&&!(w=this.waitState)||this.waitStamp)return;	//	!!this.waitStamp: wait中
 this.waitStamp=new Date;
 try{	//	可能中途被關掉
  while(new Date-this.waitStamp<this.timeout && (!this.OK(1)||this.app.busy||this.app.readyState<w))
   try{WScript.Sleep(this.waitInterval);}catch(e){}	//	Win98的JScript沒有WScript.Sleep
 }catch(e){}
 w=new Date-this.waitStamp,this.waitStamp=0;
 return w;
},
quit:function(){
 try{this.app.Quit();}catch(e){}
 this.app=null;
 if(typeof CollectGarbage=='function')
  setTimeout('CollectGarbage();',0);	//	CollectGarbage() undocumented IE javascript method: 先置為 null 再 CollectGarbage(); 設置為null,它會斷開對象的引用，但是IE為了節省資源（經常釋放內存也會佔系統資源），因此採用的是延遲釋放策略，你調用CollectGarbage函數，就會強制立即釋放。	http://www.cnblogs.com/stupidliao/articles/797659.html
 return;
},
//	用IE.doc().title or IE.app.LocationName 可反映狀況
doc:function(){
 try{return this.app.document;}catch(e){}
},
href:function(){
 try{return this.app.LocationURL;}catch(e){}
},
win:function(){
 try{return this.doc().parentWindow;}catch(e){}
},
/*
reload:function(){
 try{IE.win().history.go(0);IE.wait();}catch(e){}
},
*/
getE:function(e,o){
 try{return (o||this.doc()).getElementById(e);}catch(e){}
},
getT:function(e,o){
 try{return (o||this.doc()).getElementsByTagName(e);}catch(e){}
},
//	name/id, HTML object to get frame, return document object or not
//	.getElementsByName()
//	http://www.w3school.com.cn/htmldom/met_doc_getelementsbyname.asp
frame:function(n,f,d){
 try{
  f=f?f.getElementsByTagName('frame'):this.getT('frame');
  if(isNaN(n))
   if(!n)return f;
   else for(var i=0;i<f.length;i++)if(f[i].name==n){n=i;break;}
  if(!isNaN(n))return d?f[n].contentWindow.document:f[n];
 }catch(e){}
},
//	IE.frames()['*']	IEApp.document.frames
//	Cross Site AJAX	http://blog.joycode.com/saucer/archive/2006/10/03/84572.aspx
//	Cross-Site XMLHttpRequest	http://ejohn.org/blog/cross-site-xmlhttprequest/
frames:function(){
 try{
  var i=0,f=this.getT('frame'),r=[];
  for(r['*']=[];i<f.length;i++)
   r['*'].push(f(i).name),r[f(i).name]=r[i]=f(i);
  //	use frame.window, frame.document
  return r;
 }catch(e){}
},
//formNA:0,	//	form name array
fillForm_rtE:0,	//	return name&id object. 設置這個還可以強制 do submit 使用 name 為主，不用 id。
fillForm:function(pm,l,fi){	//	parameter={id/name:value}, do submit(num) 或 button id, submit 之 form index 或 id
 try{
  //	,g=f.getElementById	
  var i,j,n={},h=0,f=this.doc().forms[fi||0]||{},t,s=function(o,v){
	 t=o.tagName.toLowerCase();
	 if(t=='select')o.selectedIndex=v;	//	.options[i].value==v	.selectedIndex= 的設定有些情況下會失效
	 //	參考 cookieForm
	 else if(t=='input'){
	  t=o.type.toLowerCase();	//	.getAttribute('type')
	  if(t=='checkbox')o.checked=v;
	  else if(t!='radio')o.value=v;
	  else if(o.value==v)o.checked=true;else return true;	//	return true: 需要再處理
	 }else if(t=='textarea')o.value=v;
	};
/*	needless
  if(!f){
   f=this.getT('form');
   for(i in f)if(f[i].name==fi){f=a[i];break;}
  }
  if(!f)f={};
*/
  for(j in pm)
   if(!(i=/*f.getElementById?f.getElementById(j):*/this.getE(j)) || s(i,pm[j]))n[j]=1,h=1;
  if((h||this.fillForm_rtE) && (i=f.getElementsByTagName?f.getElementsByTagName('input'):this.getT('input')))
   for(j=0;j<i.length;j++)
    if(i[j].name in n)s(i[j],pm[i[j].name]);
    else if(l&&typeof l!='object'&&l==i[j].name)l=i[j];
    //if(i[j].name in pm)s(i[j],pm[i[j].name]);
  if(l){
   if(i=typeof l=='object'?l:/*f.getElementById&&f.getElementById(l)||*/this.getE(l))i.click();
   else f.submit();
   this.wait();
  }else if(this.fillForm_rtE){
   h={'':i};
   for(j=0;j<i.length;j++)if(i[j].name)h[i[j].name]=i[j];
   return h;
  }
 }catch(e){}
 return this;
},
setLoc:function(w,h,l,t){
 try{
  var s=this.win().screen;
  with(this.app){
   if(w){Width=w;if(typeof l=='undefined')l=(s.availWidth-w)/2;}
   if(h){Height=h;if(typeof t=='undefined')t=(s.availHeight-h)/2;}
   if(l)Left=l;
   if(t)Top=t;
  }
 }catch(e){}
 return this;
},
write:function(h){
 try{
  if(!this.doc())this.go('');
  with(this.doc())open(),write(h||''),close();
 }catch(e){}
 return this;
},
//	使之成為 dialog 形式的視窗	http://members.cox.net/tglbatch/wsh/
setDialog:function(w,h,l,t,H){
 try{
  with(this.app)FullScreen=true,ToolBar=false,StatusBar=false;
 }catch(e){}
 this.setLoc(w,h,l,t);
 if(H)this.write(H).focus();
 try{
  //	太早設定 scroll 沒用。
  with(this.doc().body)scroll='no',style.borderStyle='outset',style.borderWidth='3px';
 }catch(e){}
 return this;
},
show:function(s){try{this.app.Visible=s||typeof s=='undefined';}catch(e){}return this;},
focus:function(s){try{if(s||typeof s=='undefined')this.win().focus();else this.win().blur;}catch(e){}return this;}
};	//	IEA.prototype={




//	WSH環境中設定剪貼簿的資料：多此一舉	http://yuriken.hp.infoseek.co.jp/index3.html	http://code.google.com/p/zeroclipboard/
setClipboardText[generateCode.dLK]='IEA';//,clipboardFunction
function setClipboardText(cData,cType){
 if(typeof clipboardFunction=='function')return clipboardFunction();
 var IE=new IEA;
 if(!IE.OK(1))return '';
 if(!cType)cType='text';

 with(IE.win())
  if(cData)window.clipboardData.setData(cType,cData);
  else cData=window.clipboardData.getData(cType);

 IE.quit();//try{IEApp.Quit();}catch(e){}
 return cData||'';
}

//	WSH環境中取得剪貼簿的資料
var getClipboardText=setClipboardText;



