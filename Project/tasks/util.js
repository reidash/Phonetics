var chalk = require('chalk');

exports.log = function (msg) {
	console.log(msg);
};

exports.success = function (msg) {
	console.log(chalk.green(msg));
};

exports.err = function (msg) {
	console.log(chalk.red(msg));
};