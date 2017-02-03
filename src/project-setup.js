var util = require('./tasks/util');
var exec = require('child_process').exec;
var platforms = require('./tasks/platforms');
var plugins = require('./tasks/plugins');

exec(platforms);
exec(plugins);