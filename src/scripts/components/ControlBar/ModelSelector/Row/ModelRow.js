import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { H5PContext } from '@context/H5PContext.js';
import './ModelRow.scss';
import { modelType } from '@types/types';

export default class ModelRow extends Component {
  /**
   * @class
   * @param {object} props React props.
   */
  constructor(props) {
    super(props);
    this.props = props;
  }

  /**
   * Handle scene clicked.
   */
  onModelClick() {
    if (this.props.onModelClick) {
      this.props.onModelClick(this.props.model.modelId);
    }
  }

  /**
   * Handle title clicked.
   */
  onTitleClick() {
    if (this.props.onTitleClick) {
      this.props.onTitleClick(this.props.model.modelId);
    }
  }

  /**
   * React render function.
   * @returns {object} JSX element.
   */
  render() {
    const rowClasses = ['h5p-scene-row'];

    if (this.props.isMarkedModel) {
      rowClasses.push('marked-scene');

      if (this.props.isShowingCheck) {
        rowClasses.push('checked');
      }
    }

    if (this.props.isAfterActiveModel) {
      rowClasses.push('no-top-border');
    }

    return (
      <div className={rowClasses.join(' ')} onClick={this.onModelClick.bind(this)}>
        <div className='scene-wrapper'>
          <div
            className='h5p-scene-name'
            onClick={this.onTitleClick.bind(this)}
            dangerouslySetInnerHTML={{ __html: this.props.model.modelName }}
          ></div>
          {this.props.isStartModel && (
            <div className='starting-scene'>{this.context.t('startingModel')}</div>
          )}
        </div>
        {this.props.children}
      </div>
    );
  }
}

ModelRow.contextType = H5PContext;

ModelRow.propTypes = {
  model: modelType,
  isMarkedModel: PropTypes.bool,
  isShowingCheck: PropTypes.bool,
  isAfterActiveModel: PropTypes.bool,
  isStartModel: PropTypes.bool,
  onModelClick: PropTypes.func,
  onTitleClick: PropTypes.func,
  children: PropTypes.node,
};
