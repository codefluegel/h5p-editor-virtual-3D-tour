import { H5PContext } from '@context/H5PContext.js';
import React from 'react';
import './NoModel.scss';

export default class NoModel extends React.Component {
  /**
   * React render function.
   * @returns {object} JSX element.
   */
  render() {
    return (
      <div className='no-scene-container'>
        <div className='no-scene-wrapper'>
          <div className='title'>{this.context.t('noModelsTitle')}</div>
          <div className='description'>{this.context.t('noModelDescription')}</div>
        </div>
      </div>
    );
  }
}

NoModel.contextType = H5PContext;
