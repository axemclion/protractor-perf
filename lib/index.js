#!/usr/bin/env node

var browserPerf = require('browser-perf');
var fs = require('fs');

var ProtractorPerf = function(protractor, browser) {
	this.sessionId = null;
	this.protractor = protractor;
	this.browser = browser;

	var conf = browser.params;
	if (conf.perf) {
		this.isEnabled = true;
		this.browserPerfRunner = new browserPerf.runner(conf.perf);
	}
};

ProtractorPerf.prototype.callBrowserPerfRunner_ = function(method, sessionId) {
	var d = this.protractor.promise.defer();
	if (typeof this.browserPerfRunner === 'undefined') {
		d.fulfill();
	} else {
		var cb = function(err, data) {
			if (err) {
				d.reject(err);
			} else {
				d.fulfill(data);
			}
		};
		if (typeof sessionId === 'undefined') { // for stop
			sessionId = cb;
			cb = undefined;
		}
		this.browserPerfRunner[method](sessionId, cb);
	}
	return d.promise;
};

ProtractorPerf.prototype.getSession_ = function() {
	if (this.sessionId) {
		return this.protractor.promise.fulfilled(this.sessionId);
	} else {
		return this.browser.driver.getSession().then(function(session) {
			this.sessionId = session.getId();
			return this.protractor.promise.fulfilled(this.sessionId);
		}.bind(this));
	}
};

function insideControlFlow(fn) {
	return function() {
		var args = arguments;
		return this.browser.controlFlow().execute(function() {
			return fn.apply(this, args);
		}.bind(this));
	}
}

ProtractorPerf.prototype.start = insideControlFlow(function() {
	return this.getSession_().then(function(sessionId) {
		return this.callBrowserPerfRunner_('start', sessionId);
	}.bind(this));
});

ProtractorPerf.prototype.stop = insideControlFlow(function() {
	return this.callBrowserPerfRunner_('stop').then(function(data) {
		this.stats_ = data || {};
		return this.protractor.promise.fulfilled(data);
	}.bind(this));
});

ProtractorPerf.prototype.getStats = insideControlFlow(function(metric) {
	// Metric name was changed in browserPerf 1.3.0
	// Keeping it the same to prevent breaking change
	if (metric === 'meanFrameTime') {
		metric = 'meanFrameTime_raf';
	}

	return this.protractor.promise.fulfilled(typeof metric === 'undefined' ? this.stats_ : this.stats_[metric]);
});

ProtractorPerf.prototype.printStats = insideControlFlow(function(print) {
	if (typeof print === 'undefined') {
		print = console.log.bind(console);
	}
	print(this.stats_);
});

module.exports = ProtractorPerf;
module.exports.getConfig = function(cfg, cb) {
	var runner = new browserPerf.runner({
		selenium: cfg.seleniumAddress || cfg.selenium,
		browsers: [cfg.capabilities]
	});

	runner.config(function(err, data) {
		cfg.capabilities = data.browsers[0];
		cfg.params = cfg.params || {};
		cfg.params.perf = data;
		if (typeof cb === 'function') {
			cb(cfg);
		}
	});
};

module.exports.run = function(configFilePath,done) {
	var ConfigParser = require('protractor/lib/configParser');
	var configParser = new ConfigParser();
	if (!fs.existsSync(configFilePath)) {
		console.log("Config File "+configFilePath+" does not exist");
	 	process.exit(1);   
    }
    configParser.addFileConfig(configFilePath);
	require('..').getConfig(configParser.getConfig(), function(data) {
	  require('protractor/lib/launcher').init(undefined, data);
	});
};