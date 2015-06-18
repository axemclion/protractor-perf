module.exports = function(grunt) {
  var protractorperf = require('protractor-perf');
  grunt.registerTask('protractorperf', function() {
      protractorperf.run('./merci-perf-conf.js'); // config file
  });
  grunt.registerTask('run', ['protractorperf']);
};