/* 
 * grunt-protractor-perf
 */
'use strict';
var protractorperf = require('protractor-perf');

module.exports = function(grunt) {
	grunt.registerTask('protractorperf', function() {
	var donerun = this.async();
	protractorperf.run(this.options()['configFile'], donerun)
	});
}