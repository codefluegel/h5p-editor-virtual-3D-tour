import React from 'react';
import PropTypes from 'prop-types';
import { editingModelType } from '../../types/types.js';
import EditingDialog from './EditingDialog.js';
import { H5PContext } from '../../context/H5PContext.js';
import { getModelFromId } from '../../h5phelpers/modelParams.js';
import { createModelForm } from '../../h5phelpers/forms/sceneForm.js';
import { showConfirmationDialog } from '../../h5phelpers/h5pComponents.js';
import {
  getDefaultModelParams,
  isInteractionsValid,
  sanitizeModelForm,
  validateModelForm,
} from '@h5phelpers/forms/sceneForm.js';
import './ModelEditor.scss';

export const ModelEditingType = {
  NOT_EDITING: null,
  NEW_MODEL: -1,
};

export default class ModelEditor extends React.Component {
  /**
   * @class
   * @param {object} props React props.
   */
  constructor(props) {
    super(props);
    this.props = props;

    this.semanticsRef = React.createRef();
  }

  /**
   * Get model parameters.
   * @returns {object} Model parameters.
   */
  getModelParams() {
    const models = this.context.params.models;
    // New model
    if (this.props.editingModel === ModelEditingType.NEW_MODEL) {
      return getDefaultModelParams(models);
    }

    return getModelFromId(models, this.props.editingModel);
  }

  /**
   * React life-cycle handler: Component did mount.
   */
  componentDidMount() {
    this.params = this.getModelParams();

    // Preserve parent's children
    this.parentChildren = this.context.parent.children;

    createModelForm(
      this.context.field,
      this.params,
      this.semanticsRef.current,
      this.context.parent
    );

    // Capture own children and restore parent
    this.children = this.context.parent.children;
    this.context.parent.children = this.parentChildren;
  }

  /**
   * Handle done editing form.
   */
  handleDone() {
    const isValid = validateModelForm(this.children);
    if (!isValid) {
      return;
    }

    if (this.params.playlist && this.params.audioType === 'audio') {
      this.params.playlist = null;
    }

    if (isInteractionsValid(this.params)) {
      this.confirmDone();
      return;
    }

    showConfirmationDialog(
      {
        headerText: this.context.t('changeModelTitle'),
        dialogText: this.context.t('changeModelBody'),
        cancelText: this.context.t('cancel'),
        confirmText: this.context.t('confirm'),
      },
      this.confirmDone.bind(this)
    );
  }

  /**
   * Handle confirming done editing form.
   */
  confirmDone() {
    sanitizeModelForm(this.params);

    this.props.doneAction(this.params);
  }

  /**
   * React render function.
   * @returns {object} JSX element.
   */
  render() {
    return (
      <EditingDialog
        title={this.context.t('model')}
        titleClasses={['model']}
        removeAction={this.props.removeAction}
        doneAction={this.handleDone.bind(this)}
        doneLabel={this.context.t('done')}
        removeLabel={this.context.t('remove')}
      >
        <div ref={this.semanticsRef} />
      </EditingDialog>
    );
  }
}

ModelEditor.contextType = H5PContext;

ModelEditor.propTypes = {
  editingModel: editingModelType,
  doneAction: PropTypes.func.isRequired,
  removeAction: PropTypes.func.isRequired,
};
