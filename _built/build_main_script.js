
/**
 * @name	CeL base framework build tool using JScript
 * @since	2010/1/9 01:16:35
 * 2010/1/14 20:19:27	整理、簡化。
 */


/*

@ Linux ubuntu:
sudo cp -pru /media/366A99896A994691/USB/cgi-bin/lib/JS /usr/share/javascript/CeL && cd /usr/share/javascript/CeL && find . -type f -exec chmod 644 {} \; && find . -type d -exec chmod 755 {} \;

cd /usr/share/javascript/jquery && sudo wget -O jquery-nightly.js http://code.jquery.com/jquery-nightly.js && sudo chmod go+r jquery-nightly.js

*/

//	[CeL]library_loader_by_registry
try{var o;try{o=new ActiveXObject('Microsoft.XMLHTTP')}catch(e){o=new XMLHttpRequest()}with(o)open('GET',(new ActiveXObject("WScript.Shell")).RegRead('HKCU\\Software\\Colorless echo\\CeL.path'),false),send(null),eval(responseText)}catch(e){}
//	[CeL]End

var script_name = 'build_main_script', main_script = 'ce.js', backup_directory = 'old\\', to_directory = '..\\', error_recover = function(message){
	WScript.Echo(script_name + ': '+message+'\nTry to recover!\n (Or you can stop the process.)');

	var fso = WScript.CreateObject("Scripting.FileSystemObject");
	try{fso.DeleteFile(to_directory+main_script,true);}catch(e){}
	fso.CopyFile(backup_directory+main_script,to_directory+main_script);

	WScript.Quit(1);
};

// WScript.Echo((new ActiveXObject("WScript.Shell")).RegRead('HKCU\\Software\\Colorless echo\\CeL.path'));

if(typeof CeL === 'undefined')
	error_recover("Can't load library!");

if(CeL.env.main_script)
	main_script=CeL.env.main_script;

CeL.cache_code = true;

CeL.set_debug();

//CeL.use('code.log');
//var sl = CeL.log;

//CeL.use('code.reorganize');

//CeL.use('IO.file');
CeL.use('IO.Windows.file');
if(!CeL.is_loaded('IO.Windows.file'))
	error_recover("Can't load module!\n" + CeL.env.registry_path);

var structure_directory = '_structure\\',
	main_structure_file = structure_directory + 'structure.js',
	file_list = [ main_structure_file ],
	target_file = CeL.env.registry_path + main_script,
	structure_code;

structure_code = CeL.read_all_file(CeL.env.registry_path + main_structure_file,
	CeL.env.source_encoding)
	.replace(/[\r\n\s]+\/\*((.|\n)*?)\*\/[\r\n\s]+/, '')
	.replace(/\/\/\s*add\s+([a-z]+\.js)/g,
		function($0, $1) {
			file_list.push($1);
			return CeL.read_all_file(
					CeL.env.registry_path + structure_directory + $1,
					CeL.env.source_encoding)
					.replace(/\/\*((.|\n)*?)\*\//, '');
		}
	)
	//	特殊：第一個 undefined
	.replace(/_undefined/,'undefined');

structure_code =
	[
		'',
		'/*',
		'	本檔案為自動生成，請勿編輯！',
		'	This file is auto created from ' + file_list.join(', '),
		'		by tool: ' + CeL.get_script_name() + '.',
		'*/',
		'',
		'',
		''
	].join(CeL.env.new_line)
	+ structure_code;

if (structure_code !== CeL.read_all_file(target_file)) {
	//	backup
	CeL.move_1_file(target_file, main_script, backup_directory);

	// chmod: change to writeable
	CeL.change_attributes(target_file, -CeL.fso_attributes.ReadOnly);

	//	write contents
	CeL.write_to_file(target_file, structure_code, CeL.env.source_encoding);

	// chmod
	CeL.change_attributes(target_file, CeL.fso_attributes.ReadOnly);
}
