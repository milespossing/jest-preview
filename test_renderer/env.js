const JSDOMEnvironment = require('jest-environment-jsdom-sixteen');
const {prettyDOM} = require('@testing-library/react')
const io = require('socket.io-client');
const writeTestFile = require('./writeTestFile');

function createDiffDom(window) {
  global.window = window;
  global.HTMLElement = window.HTMLElement;

  const { DiffDOM } = require("diff-dom")

  return new DiffDOM({ document: window.document });
}

let printed =false;
function getAllStyles(document) {
  const css = [];

  if (!printed) {
    console.log('dom', document.head.toString() ,);
    printed = true;
  }
  for (let i=0; i<document.styleSheets.length; i++)
  {
      const sheet = document.styleSheets[i];
      const rules = ('cssRules' in sheet)? sheet.cssRules : sheet.rules;
      if (rules)
      {
          css.push('\n/* Stylesheet : '+(sheet.href||'[inline styles]')+' */');
          for (let j=0; j<rules.length; j++)
          {
              const rule = rules[j];
              if ('cssText' in rule)
                  css.push(rule.cssText);
              else
                  css.push(rule.selectorText+' {\n'+rule.style.cssText+'\n}\n');
          }
      }
  }
  return css.join('\n');
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

      this.diffDom = createDiffDom(this.dom.window);
      // connect to to the websocket server

      // this.socket = io.connect('ws://localhost:9000');
      // this.socket.on('connect', () => {
      //   console.log('jest client websocket connected')
      // })
    }
  
    async teardown() {
      await writeTestFile(this.testPath, this.testResultData);
      
      // disconnect from the websocket sever
      // this.socket.disconnect()

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
        this.testResultData[testName] = { testName, parent, errors: [], doms: [] };

        const { MutationObserver, document } = this.dom.window;

        this.observer = new MutationObserver(() => this.domChanged(this.testResultData[testName]));
        this.observer.observe(document.body, { subtree: true, childList: true, attributes: true, });

      } else if (event.name === 'error') {
        this.testResultData[this.currentTest(state)].errors.push(event.error);
      } else if (event.name === 'test_fn_failure' || event.name === 'test_fn_success') {
        this.observer.disconnect();

        this.testResultData[this.currentTest(state)].finalBody = this.dom.window.document.body.innerHTML;
        this.testResultData[this.currentTest(state)].result = event.name === 'test_fn_success' ? 'success' : 'failure';
      }
    }

    domChanged(testResultData) {
      // add to the list
      const styles = getAllStyles(this.dom.window.document);
      const html = this.dom.window.document.body.innerHTML;
      const dom = `
        <style>
          ${styles}
        </style>
        ${html}
      `;

      testResultData.doms.push(dom);

      const diff = this.getDiff(testResultData);
      const {testPath} = this;
      const {testName} = testResultData;
   
      const message = {
        testPath,
        testName,
        diff
      };

      // post to websocket
      // this.socket.emit('jestCall', {
      //   message
      // });
    }

    getDiff(testResultData) {
      let { lastHTML } = testResultData;
      const { document } = this.dom.window;
      const currentHTML = document.body.innerHTML;

      if (!lastHTML) {
        lastHTML = '<div></div>';
      }

      testResultData.lastHTML = currentHTML;
      return this.diffDom.diff(lastHTML, currentHTML);
    }
  
    runScript(script) {
      if (this.dom) {
        return script.runInContext(this.dom.getInternalVMContext());
      }
      return null;
    }
  }
  
  module.exports = CustomEnvironment;
