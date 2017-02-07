var packageJson = require('../package.json');
var util = require('./util');
var exec = require('child_process').exec;

util.log('Installing plugins...');

for (var i = 0; i < packageJson.plugins.length; i++) {
	util.log('Installing ' + packageJson.plugins[i]);
	try {
		exec('cordova plugin add ' + packageJson.plugins[i]);
	} catch (e) {
		util.err('Failed to install ' + packageJson.plugins[i]);
	}
}

util.success('Plugins installed.');