import '@components/EditingDialog/GoToScene/Selector/GoToScene.scss';
import GoToSceneSelector from '@components/EditingDialog/GoToScene/Selector/GoToSceneSelector.js';
import { H5PContext } from '@context/H5PContext';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class GoToScene extends Component {
  render() {
    // Filter out current scene
    const models = this.context.params.models.filter((model) => {
      return model.modelId !== this.props.currentModel;
    });

    const sceneClasses = ['go-to-scene'];
    if (this.props.hasInputError) {
      sceneClasses.push('has-error');
    }

    return (
      <div className={sceneClasses.join(' ')}>
        {models.length > 0 && (
          <div className='go-to-scene-selector-wrapper'>
            <GoToSceneSelector
              models={models}
              markedModel={this.props.markedModel}
              setNextModelId={(modelId) => {
                this.props.setNextModelId(modelId);
              }}
              selectASceneErrorLabel={this.context.t('selectAModelerror')}
              pickAnExistingSceneLabel={this.context.t('pickAnExistingModel')}
            />
            <div className='selector-separator'>{this.context.t('or')}</div>
          </div>
        )}
        <div className='create-new-scene-wrapper'>
          <div className='new-scene-title'>{this.context.t('createAModelToGoTo')}:</div>
          {this.props.hasInputError && !models.length && (
            <div className='error-message'>{this.context.t('createModelError')}</div>
          )}
          <button className='h5p-new-scene-button' onClick={this.props.newModel.bind(this)}>
            + {this.context.t('newModel')}
          </button>
        </div>
      </div>
    );
  }
}

GoToScene.contextType = H5PContext;

GoToScene.propTypes = {
  currentModel: PropTypes.number.isRequired,
  markedModel: PropTypes.number,
  hasInputError: PropTypes.bool,
  setNextModelId: PropTypes.func.isRequired,
  newModel: PropTypes.func.isRequired,
};
