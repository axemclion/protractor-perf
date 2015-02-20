# Protractor-Perf

Just like [Protractor](https://github.com/angular/protractor) is the end to end test case runner for [AngularJS](https://github.com/angular/angular.js/) to check for functional regressions, [this project](htto://npmjs.org/package/protractor-perf) is a way check for performance regressions while reusing the same test cases. 

## Usage

Install protractor-perf using `npm install -g protractor-perf`. 

Protractor test cases are re-used to run scenarios where performance needs to be measured. Protractor-perf can be used just like protractor, just that the test-cases need to be instrumented to indicated when to start and stop measuring performance. 

Protractor is usually invoked using `$ protractor conf.js`. Use `$ protractor-perf conf.js` instead to start measuring performance. 

> When the instrumented test cases are run using protractor, the code related to performance is a no-op. This way, adding instrumentation does not break your ability to run protractor to just test for functionality.  

## Instrumenting the test cases

The test case need to specify when to start and stop measuring performance metrics for a certain scenario. The following code is an example of a test case, with perf code snippets added. 

```javascript
var ProtractorPerf = require('protractor-perf');
describe('angularjs homepage todo list', function() {
    var perf = new ProtractorPerf(protractor, browser); // Initialize the perf runner
    it('should add a todo', function() {
        browser.get('http://www.angularjs.org');

        perf.start(); // Start measuring the metrics
        element(by.model('todoText')).sendKeys('write a protractor test');
        element(by.css('[value="add"]')).click();
        perf.stop(); // Stop measuring the metrics 

        if (perf.isEnabled) { // Is perf measuring enabled ?
            // Check for perf regressions, just like you check for functional regressions
            expect(perf.getStats('meanFrameTime')).toBeLessThan(60); 
        };

        var todoList = element.all(by.repeater('todo in todos'));
        expect(todoList.count()).toEqual(3);
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