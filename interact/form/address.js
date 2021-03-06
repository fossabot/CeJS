
/**
 * @name	CeL address input function
 * @fileoverview
 * 本檔案包含了 JavaScript 地址輸入表單支援 (address input form) 的 functions。
 * 現有臺灣地區(CeL.address.TW)縣市加路名可用。
 * @since	
 */


'use strict';
if (typeof CeL === 'function')
	CeL.run({
		name : 'interact.form.address',
		require : 'interact.form.address.TW.',
		code : function() {
			return {};
		},
		no_extend : '*'
	});
