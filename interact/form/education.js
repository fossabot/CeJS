/**
 * @name CeL 輸入教育程度 (educational attainment, 最高學歷) 的範例 module。
 * @fileoverview 本檔案包含了輸入教育程度的 (educational attainment, 最高學歷) functions。
 * @since 2010/1/7 23:50:43 草創。<br />
 *        2012/12/18 0:16:9 為 .run() 體制重寫。
 */

'use strict';
if (typeof CeL === 'function')
	CeL.run({
		name : 'interact.form.education',
		require : 'interact.form.education.TW.',
		code : function() {
			return {};
		},
		no_extend : '*'
	});
