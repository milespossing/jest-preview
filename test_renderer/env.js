const JSDOMEnvironment = require('jest-environment-jsdom-sixteen');
const writeTestFile = require('./writeTestFile');

function createDiffDom(window) {

  global.window = window;
      global.HTMLElement = window.HTMLElement;
  
      const { DiffDOM } = require("diff-dom")
  
      return new DiffDOM({ document: window.document });
}

class CustomEnvironment extends JSDOMEnvironment {
    constructor(config, context) {
      super(config, context);
      this.testPath = context.testPath;
      this.docblockPragmas = context.docblockPragmas;
      this.testResultData = {};
    }
  
    async setup(...other) {
      await super.setup();


      const { window } = this.dom;

      global.window = window;
      global.HTMLElement = window.HTMLElement;
  
      const { DiffDOM } = require("diff-dom")
  
      this.diffDom = new DiffDOM({ document: window.document });

      // console.log(this.dom);
    }
  
    async teardown() {
      await writeTestFile(this.testPath, this.testResultData);
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
    }
  
    runScript(script) {
      if (this.dom) {
        return script.runInContext(this.dom.getInternalVMContext());
      }
      return null;
    }
  }
  
  module.exports = CustomEnvironment;
