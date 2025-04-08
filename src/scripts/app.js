import Main from '@components/Main';
import { H5PContext } from '@context/H5PContext.js';
import React from 'react';
import { createRoot } from 'react-dom/client';

export default class Virtual3DTour {
  constructor(parent, field, params, setValue) {
    // geting the model from the parent
    // this depends on the parent structure
    // const customParams = parent.params.params || parent.params || {};
    this.params = params || {};
    this.params = Object.assign(
      {
        models: params ? params.models : [],
        startModelId: params ? params.startModelId : null,
      },
      this.params
    );

    this.parent = parent;
    this.field = field;
    this.setValue = setValue;
    this.wrapper = null;
  }

  /**
   * Fetch correct translations.
   * @param {string[]} args Arguments.
   * @returns {string} Correct translation.
   */
  t(...args) {
    const translations = ['H5PEditor.Virtual3DTour', ...args];
    return H5PEditor.t.apply(window, translations);
  }

  appendTo($container) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('h5p-editor-react-modelviewer-wrapper');
    this.wrapper = wrapper;

    $container[0].appendChild(wrapper);
    this.setValue(this.field, this.params);

    let startModel = null;
    if (this.params.models.length) {
      startModel = this.params.startModelId;
    }
    const root = createRoot(wrapper);
    root.render(
      <H5PContext.Provider value={this}>
        <Main initialModel={startModel} />
      </H5PContext.Provider>
    );
  }

  resize = () => {
    if (!this.wrapper) {
      return;
    }

    const mobileThreshold = 815;
    const wrapperSize = this.wrapper.getBoundingClientRect();
    if (wrapperSize.width < mobileThreshold) {
      this.wrapper.classList.add('mobile');
    } else {
      this.wrapper.classList.remove('mobile');
    }
  };

  ready = (ready) => {
    if (this.passReadies) {
      parent.ready(ready);
    } else {
      this.readies.push(ready);
    }
  };

  validate = function () {
    return true;
  };
}

H5PEditor.widgets.Virtual3DTour = H5PEditor.Virtual3DTour = Virtual3DTour;
