module.exports = function(grunt) {
  var protractorperf = require('protractor-perf');
  grunt.registerTask('protractorperf', function() {
  	  var donerun = this.async();
      protractorperf.run('./merci-perf-conf.js',donerun); // config file
  });
  grunt.registerTask('run', ['protractorperf']);
};