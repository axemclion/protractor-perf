# Protractor-Perf

Just like [Protractor](https://github.com/angular/protractor) is the end to end test case runner for [AngularJS](https://github.com/angular/angular.js/) to check for functional regressions, [this project](htto://npmjs.org/package/protractor-perf) is a way check for performance regressions while reusing the same test cases. 

## Usage

Install protractor-perf using `npm install -g protractor-perf`. 

Protractor test cases are re-used to run scenarios where performance needs to be measured. Protractor-perf can be used just like protractor, just that the test-cases need to be instrumented to indicated when to start and stop measuring performance. 

Protractor is usually invoked using `$ protractor conf.js`. Use `$ protractor-perf conf.js` instead to start measuring performance. 

The config file is the same configuration file used for protractor tests. 

_Note_: If you run selenium using protractor's `webdriver-manager`, you would need to specify `seleniumPort` and `selenium` keys in the config file, to explicitly specify the port on which the selenium server will run. This port will also be picked up by `protractor-perf`. See `./test/conf.js` as an example.  

> When the instrumented test cases are run using protractor, the code related to performance is a no-op. This way, adding instrumentation does not break your ability to run protractor to just test for functionality.  

## Instrumenting the test cases

The test case need to specify when to start and stop measuring performance metrics for a certain scenario. The following code is an example of a test case, with perf code snippets added. 

```javascript
var PerfRunner = require('..');
describe('angularjs homepage todo list', function() {
	var perfRunner = new PerfRunner(protractor, browser);

	it('should add a todo', function() {
		browser.get('http://www.angularjs.org');
		perfRunner.start();

		element(by.model('todoList.todoText')).sendKeys('write a protractor test');
		element(by.css('[value="add"]')).click();

		perfRunner.stop();

		if (perfRunner.isEnabled) {
			expect(perfRunner.getStats('meanFrameTime')).toBeLessThan(60);
		};

		var todoList = element.all(by.repeater('todo in todoList.todos'));
		expect(todoList.count()).toEqual(3);
		expect(todoList.get(2).getText()).toEqual('write a protractor test');

	});
});
```

The four statements to note are 

1. Initialize the Perf monitor using `new ProtractorPerf(protractor, browser)`
2. To start measuring the perf, use `perf.start()`
3. Once the scenario that you would like to perf test completes, use `perf.stop()`
4. Finally, use `perf.getStats('statName')` in `expect` statements to ensure that all the performance metrics are within the acceptable range.

The `perf.isEnabled` is needed to ensure that perf metrics are not tested when the test case is run using `protractor` directly. 


### Metrics measured   

`protractor-perf` is based on [browser-perf](http://github.com/axemclion/browser-perf). `browser-perf` measures the metrics that can be tested for regressions. Look at [browser-perf's wiki page](https://github.com/axemclion/browser-perf/wiki) for more information about the project. 

### Grunt Integration
Invoke `protractor-perf` from a GruntFile as below
```javascript
module.exports = function(grunt) {
  var protractorperf = require('protractor-perf');
  grunt.registerTask('protractorperf', function() {
  	  var donerun = this.async();
      protractorperf.run('./merci-perf-conf.js',donerun); // config file
  });
  grunt.registerTask('run', ['protractorperf']);
};
```