var packageJson = require('../package.json');
var util = require('util.js');
var exec = require('child_process').exec;

util.log('Installing platforms...');

for (var i = 0; i < packageJson.platforms.length; i++) {
	util.log('Installing ' + packageJson.platforms[i]);
	try {
		exec('cordova platform add ' + packageJson.platforms[i] + ' --save');
	} catch (e) {
		util.err('Failed to install ' + packageJson.platforms[i]);
	}
}

util.success('Platforms installed.');