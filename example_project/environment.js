const JSDOMEnvironment = require('jest-environment-jsdom-sixteen');


class CustomEnvironment extends JSDOMEnvironment {

  async setup(...args) {
    await super.setup(...args);

    const { window } = this.dom;

    global.window = window;
    global.HTMLElement = window.HTMLElement;

    const { DiffDOM } = require("diff-dom")

    this.diffDom = new DiffDOM({ document: window.document });
  }

  async handleTestEvent(event) {
    if (event.name === 'test_fn_start') {
      this.testStarted(event);
    } else if (event.name === 'test_fn_success' || event.name === 'test_fn_failure') {
      this.testEnded(event);
    }
  }

  testStarted(event) {
    if (event.test.name !== 'todo item should be crossed out after completing') {
      return;
    }

    const { MutationObserver, document } = this.dom.window;

    const observer = new MutationObserver(this.domChanged.bind(this));
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, });

    this.testContext = {
      event,
      observer,
    }
  }

  testEnded(event) {
    if (event.test.name !== 'todo item should be crossed out after completing') {
      return;
    }


    this.testContext.observer.disconnect();
    this.testContext = null;
  }

  domChanged() {
    const { lastHTML } = this.testContext;
    const { document } = this.dom.window;
    const currentHTML = document.body.innerHTML;

    if (!lastHTML) {
      this.testContext.lastHTML = currentHTML;
      console.log('new html', JSON.stringify(this.diffDom.diff('<div></div>', currentHTML), null, 2));
    } else {
      const diff = this.diffDom.diff(lastHTML, currentHTML);
      console.log(JSON.stringify(diff, null, 2));
      // this.diffDom.apply(iframe.window.document.body, diff)
    }
  }
}

module.exports = CustomEnvironment;