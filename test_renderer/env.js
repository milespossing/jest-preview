const JSDOMEnvironment = require('jest-environment-jsdom-sixteen');
const writeTestFile = require('./writeTestFile');
const socket = io.connect('ws://localhost:9000');

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

      this.diffDom = createDiffDom(window);
      // connect to to the websocket server
    }
  
    async teardown() {
      await writeTestFile(this.testPath, this.testResultData);
      
      // disconnect from the websocket sever
      socket.disconnect()

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
        this.testResultData[testName] = { test: event.test, testName, parent, errors: [] };


        const { MutationObserver, document } = this.dom.window;

        this.observer = new MutationObserver(() => this.domChanged(state));
        this.observer.observe(document.body, { subtree: true, childList: true, attributes: true, });


      } else if (event.name === 'error') {
        this.testResultData[this.currentTest(state)].errors.push(event.error);
      } else if (event.name === 'test_fn_failure' || event.name === 'test_fn_success') {
        this.observer.disconnect();

        this.testResultData[this.currentTest(state)].finalBody = this.dom.window.document.body.innerHTML;
        this.testResultData[this.currentTest(state)].result = event.name === 'test_fn_success' ? 'success' : 'failure';
      }
    }

    domChanged(state) {
      const testResultData = this.testResultData[this.currentTest(state)];
      let { lastHTML } = testResultData;
      const { document } = this.dom.window;
      const currentHTML = document.body.innerHTML;
      let diff;


      if (!lastHTML) {
        lastHTML = '<div></div>';
      }

      testResultData.lastHTML = currentHTML;
      const diff = this.diffDom.diff(lastHTML, currentHTML);

      const message = {
        test: {
          filename: this.testPath,
          name: testResultData.testName
        },
        diff
      };

      // post to websocket
      socket.emit('jestCall', {
        message
      });
    }
  
    runScript(script) {
      if (this.dom) {
        return script.runInContext(this.dom.getInternalVMContext());
      }
      return null;
    }
  }
  
  module.exports = CustomEnvironment;
