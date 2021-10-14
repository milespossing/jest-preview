const JSDOMEnvironment = require('jest-environment-jsdom-sixteen');
const writeTestFile = require('./writeTestFile');

class CustomEnvironment extends JSDOMEnvironment {
    constructor(config, context) {
      super(config, context);
      this.testPath = context.testPath;
      this.docblockPragmas = context.docblockPragmas;
      this.testResultData = {};
    }
  
    async setup(...other) {
      console.log('setup');
      console.log(other);
      await super.setup();
      // console.log(this.dom);
    }
  
    async teardown() {
      await writeTestFile(this.testPath, this.testResultData);
      console.log('teardown');
      await super.teardown();
    }
  
    getVmContext() {
      return super.getVmContext();
    }

    currentTest(state) { return state.currentlyRunningTest.name; }

    async handleTestEvent(event, state) {
      if (event.name === 'test_start') {
        const testName = event.test.name;
        const parent = event.test.parent.name;
        this.testResultData[testName] = { testName, parent, errors: [] };
      } else if (event.name === 'error') {
        this.testResultData[this.currentTest(state)].errors.push(event.error);
      } else if (event.name === 'test_fn_failure' || event.name === 'test_fn_success') {
        this.testResultData[this.currentTest(state)].finalBody = this.dom.window.document.body.innerHTML;
        this.testResultData[this.currentTest(state)].result = event.name === 'test_fn_success' ? 'success' : 'failure';
      }
      // console.log("state", state);
    }
  
    runScript(script) {
      if (this.dom) {
        return script.runInContext(this.dom.getInternalVMContext());
      }
      return null;
    }
  }
  
  module.exports = CustomEnvironment;
