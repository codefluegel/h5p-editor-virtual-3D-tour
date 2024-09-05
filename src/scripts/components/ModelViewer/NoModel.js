import React from 'react';
import { H5PContext } from '@context/H5PContext.js';
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
          <div className='title'>Keine Modelle bisher</div>
          <div className='description'>
            Klicke auf den "Neue Model"-Button, um ein erstes Model hinzuzufügen
          </div>
        </div>
      </div>
    );
  }
}

NoModel.contextType = H5PContext;
