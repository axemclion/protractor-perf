module.exports = function(grunt) {
  var protractorperf = require('protractor-perf');
  grunt.registerTask('protractorperf', function() {
    var donerun = this.async();
    // Optional config Object that overwrites properties of conf.js.
    // Useful to set property values from grunt.option()
    var argv = {
      selenium: 'http://localhost:54321/wd/hub',
      seleniumPort: 54321
    };
    protractorperf.run('./merci-perf-conf.js', donerun, argv); // config file
  });
  grunt.registerTask('run', ['protractorperf']);
};