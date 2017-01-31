var chalk = require('chalk');

var log = function (msg) {
	console.log(msg);
};

var success = function (msg) {
	console.log(chalk.green(msg));
};

var err = function (msg) {
	console.log(chalk.red(msg));
};