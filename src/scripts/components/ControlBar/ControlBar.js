import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ModelEditingType } from '@components/EditingDialog/ModelEditor.js';
import { H5PContext } from '@context/H5PContext.js';
import ModelList from './ModelSelector/ModelList.js';
import ModelSelectorSubmenu from './ModelSelector/Row/Submenu/ModelSelectorSubmenu.js';
import ModelSelector from './ModelSelector/ModelSelector.js';
import './ControlBar.scss';

export default class ControlBar extends Component {
  /**
   * @class
   */
  constructor() {
    super();
  }

  /**
   * React render function.
   * @returns {object} JSX element.
   */
  render() {
    return (
      <div className='h5p-control-bar'>
        <ModelSelector
          currentModel={this.props.currentModel}
          isExpanded={this.props.isModelSelectorExpanded}
          toggleExpand={this.props.toggleExpandModelSelector.bind(this)}
        >
          <ModelList
            models={this.context.params.models}
            startModel={this.props.startModel}
            markedModel={this.props.currentModel}
          >
            {(isStartModel, modelId) => (
              <ModelSelectorSubmenu
                modelPath={this.props.currentModel}
                isStartModel={isStartModel}
                setStartModel={this.props.setStartModel.bind(this, modelId)}
                onJump={this.props.changeModel.bind(this, modelId)}
                onEdit={this.props.editModel.bind(this, modelId)}
                onClone={this.props.cloneModel.bind(this, modelId)}
                onDelete={this.props.deleteModel.bind(this, modelId)}
                setStartingModelLabel={this.context.t('setStartingModel')}
                goToModelLabel={this.context.t('goToModel')}
                editLabel={this.context.t('edit')}
                cloneLabel={this.context.t('clone')}
                deleteLabel={this.context.t('delete')}
              />
            )}
          </ModelList>
        </ModelSelector>
        <div className='buttons-wrapper'>
          <button
            className='h5p-new-scene-button'
            onClick={this.props.newModel.bind(this, ModelEditingType.NEW_MODEL)}
          >
            + {this.context.t('newModel')}
          </button>
        </div>
      </div>
    );
  }
}

ControlBar.contextType = H5PContext;

ControlBar.propTypes = {
  currentModel: PropTypes.number,
  startModel: PropTypes.number,
  isModelSelectorExpanded: PropTypes.bool.isRequired,
  toggleExpandModelSelector: PropTypes.func.isRequired,
  newModel: PropTypes.func.isRequired,
  changeModel: PropTypes.func.isRequired,
  setStartModel: PropTypes.func.isRequired,
  editModel: PropTypes.func.isRequired,
  cloneModel: PropTypes.func.isRequired,
  deleteModel: PropTypes.func.isRequired,
};
