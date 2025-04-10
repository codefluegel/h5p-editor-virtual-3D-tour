import GoToScene from '@components/EditingDialog/GoToScene/Selector/GoToScene';
import { H5PContext } from '@context/H5PContext';
import { createModelForm, getDefaultModelParams } from '@h5phelpers/forms/sceneForm';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class GoToSceneWrapper extends Component {
  constructor(props) {
    super(props);

    this.newModel = React.createRef();

    this.state = {
      markedModel: parseInt(this.props.params.action.params.nextSceneId),
      isCreatingNewModel: false,
    };
  }

  createNewModel() {
    // Process semantics for new scene
    const models = this.context.params.models;
    const params = getDefaultModelParams(models);

    // Preserve parent's children
    this.parentChildren = this.context.parent.children;

    createModelForm(this.context.field, params, this.newModel.current, this.context.parent);

    // Capture own children and restore parent
    this.sceneChildren = this.context.parent.children;
    this.context.parent.children = this.parentChildren;

    this.setNextModelId(params.modelId);

    this.props.setScene({
      children: this.sceneChildren,
      params: params,
    });

    this.setState({
      isCreatingNewModel: true,
    });
  }

  setNextModelId(modelId) {
    // Update number widget and params

    const nextModelIdWidget = this.props.nextModelIdWidget;
    nextModelIdWidget.$input.val(modelId);
    this.props.params.action.params.nextSceneId = modelId;
    this.props.selectedModel();
    this.setState({
      markedModel: modelId,
    });
  }

  render() {
    const classes = ['go-to-scene-wrapper'];
    if (this.state.isCreatingNewModel) {
      classes.push('new-scene');
    }

    return (
      <div className={classes.join(' ')}>
        {!this.state.isCreatingNewModel && (
          <GoToScene
            params={this.props.params}
            markedModel={this.state.markedModel}
            currentModel={this.props.currentModel}
            hasInputError={this.props.hasInputError}
            newModel={this.createNewModel.bind(this)}
            setNextModelId={(modelId) => this.setNextModelId(modelId)}
          />
        )}
        <div ref={this.newModel} />
      </div>
    );
  }
}

GoToSceneWrapper.contextType = H5PContext;

GoToSceneWrapper.propTypes = {
  params: PropTypes.object.isRequired,
  nextModelIdWidget: PropTypes.object.isRequired,
  currentModel: PropTypes.number.isRequired,
  hasInputError: PropTypes.bool,
  selectedModel: PropTypes.func.isRequired,
  setScene: PropTypes.func.isRequired,
};
