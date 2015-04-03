// An example configuration file.
exports.config = {
  // The address of a running selenium server.
  // seleniumAddress: 'http://localhost:4444/wd/hub',

  // if we are using protractor's webdriver-manager locally, you cannot use selenium Address
  // If the webdriver-manager needs to start a local server, you can use 
  selenium: 'http://localhost:12345/wd/hub',
  seleniumPort: 12345, // Port matches the port above

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['example.spec.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 300000
  },

  allScriptsTimeout: 200000
};