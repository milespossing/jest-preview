const JSDOMEnvironment = require('jest-environment-jsdom-sixteen');
const fs = require('fs');

class CustomEnvironment extends JSDOMEnvironment {
    constructor(config, context) {
      super(config, context);
      this.testPath = context.testPath;
      this.docblockPragmas = context.docblockPragmas;
    }
  
    async setup(...other) {
      console.log('setup');
      console.log(other);
      await super.setup();
      // console.log(this.dom);
    }
  
    async teardown() {
      // const test = this.dom.window.document;
      // const test2 = this.dom.window.document.body;
      // console.log(this.dom.window.document);
      // await fs.writeFile('output.test.html', 
      //   this.dom.window.document.body.innerHTML, 
      //   err => err && console.log(err));
      console.log('teardown');
      await super.teardown();
    }
  
    getVmContext() {
      return super.getVmContext();
    }
  
    async handleTestEvent(event, state) {
      console.log('hello');
      // console.log("event", event);
      // console.log("state", state);
      // return super.handleTestEvent(event, state);
    }
  
    runScript(script) {
      if (this.dom) {
        return script.runInContext(this.dom.getInternalVMContext());
      }
      return null;
    }
  }
  
  module.exports = CustomEnvironment;
