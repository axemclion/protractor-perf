module.exports = function(grunt) {
  grunt.initConfig({
    protractorperf: {
      options: {
          configFile: "./grunt-test/conf.js",
      }
    }
  });
  grunt.loadNpmTasks('protractor-perf');
  grunt.registerTask('perf', 'protractorperf');
};
