import InteractionEditor, {
  InteractionEditingType,
} from '@components/EditingDialog/InteractionEditor.js';
import ModelEditor, { ModelEditingType } from '@components/EditingDialog/ModelEditor.js';
import InteractionsBar from '@components/InteractionsBar/InteractionsBar.js';
import '@components/Main.scss';
import ModelViewer from '@components/ModelViewer/ModelViewer';
import ToolBar from '@components/Toolbar/Toolbar';
import { H5PContext } from '@context/H5PContext.js';
import { deleteModel, getModelFromId, updateModel } from '@h5phelpers/modelParams.js';
import PropTypes from 'prop-types';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSource } from '../context/H5PContext';
import { showConfirmationDialog } from '../h5phelpers/h5pComponents.js';
import ControlBar from './ControlBar/ControlBar.js';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner.js';
import NoModel from './ModelViewer/NoModel.js';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modelPath: this.props.initialModelPath ? getSource(this.props.initialModelPath) : null,
      modelViewerInstance: null,
      editingInteraction: InteractionEditingType.NOT_EDITING,
      editingModel: ModelEditingType.NOT_EDITING,
      listeningForClicks: false,
      currentModel: this.props.initialModel,
      isModelSelectorExpanded: false,
      animations: [],
      currentClickPosition: 0,
      editingHotspotIndex: -1,
      activeElement: null,
      startModel: this.props.initialModel,
      loadingSpinner: false,
      hotspot: null,
    };
  }

  componentDidMount() {
    // get model viewer dom element by id

    const modelViewer = document.getElementById('model-viewer-' + this.state.currentModel);

    if (!modelViewer) {
      return;
    }
    modelViewer.autoRotate = false;

    modelViewer.addEventListener('load', () => {
      // create hotspots and set model viewer instance

      this.setState({
        loadingSpinner: false,
        modelViewerInstance: modelViewer,
        animations: modelViewer.availableAnimations,
      });
    });
  }

  componentDidUpdate() {
    // get model viewer dom element by id

    const modelViewer = document.getElementById(
      this.context.parent.params.subContentId || 'model-viewer'
    );

    if (!modelViewer) {
      return;
    }
    modelViewer.autoRotate = false;

    if (!this.state.modelViewerInstance) {
      modelViewer.addEventListener('load', () => {
        // create hotspots and set model viewer instance
        this.setState({
          modelViewerInstance: modelViewer,
          animations: modelViewer.availableAnimations,
        });
      });
    }
  }

  componentWillUnmount() {
    // remove event listener
    this.state.modelViewerInstance.removeEventListener('load');
  }

  handleLibraryChange = (library) => {
    this.setState({
      activeElement: library,
    });
  };

  handleModelClick = (event) => {
    // retrieve clicked point on 3D Model from model-viewer instance

    const modelViewer = this.state.modelViewerInstance
      ? this.state.modelViewerInstance
      : document.getElementById('model-viewer-0');

    if (!this.state.modelViewerInstance) {
      this.setState({
        modelViewerInstance: modelViewer,
      });
    }

    if (modelViewer) {
      const clickedPoint = modelViewer.surfaceFromPoint(event.clientX, event.clientY);
      if (this.state.isModelSelectorExpanded) {
        this.setState({
          isModelSelectorExpanded: false,
        });
      }

      if (!clickedPoint && this.state.activeElement) {
        toast.error(this.context.t('clickModel'), {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
        });
        return;
      }

      if (clickedPoint && this.state.activeElement) {
        // check if listening for clicks
        let editingInteraction = InteractionEditingType.NOT_EDITING;
        if (this.state.activeElement) {
          editingInteraction = InteractionEditingType.NEW_INTERACTION;
          this.setState({
            currentClickPosition: clickedPoint,
            hotspot: null,
          });
        } else {
          editingInteraction = InteractionEditingType.EDITING;
        }
        if (this.state.editingLibrary) {
          this.setState({
            currentClickPosition: clickedPoint,
            editingInteraction,
          });
        }
      }
    }
  };

  // handle play/pause of animations contained by the model
  handlePlayPause = () => {
    const { modelViewerInstance } = this.state;

    if (modelViewerInstance.paused) {
      modelViewerInstance.play();
    } else {
      modelViewerInstance.pause();
    }
  };

  /**
   * Edit model.
   * @param {number|null} modelId Model if of model to be edited.
   */
  editModel(modelId = ModelEditingType.NEW_MODEL) {
    this.toggleExpandModelSelector(false);
    this.setState({ editingModel: modelId });
  }

  /**
   * Update current model.
   * @param {number} deletedModelId Id of model that might be deleted.
   */
  updateCurrentModel(deletedModelId) {
    const hasDeletedCurrentModel = deletedModelId === this.state.currentModel;
    if (!hasDeletedCurrentModel) {
      return;
    }

    const models = this.context.params.models;
    if (models.length) {
      // Find the first model that is not current model and jump to it
      const newModel = models[0];
      this.changeModel(newModel.modelId);
      return;
    }

    // No models left
    this.changeModel(null);
  }

  /**
   * Update start model.
   * @param {number} deletedModelId Id of model that might be deleted.
   */
  updateStartModel(deletedModelId) {
    const hasDeletedStartModel = deletedModelId === this.state.startModel;
    if (!hasDeletedStartModel) {
      return;
    }

    let startModel = null;
    const models = this.context.params.models;
    if (models.length) {
      const newModel = models[0];
      startModel = newModel.modelId;
    }

    // No models left
    this.setStartModel(startModel);
  }

  /**
   * Open dialog for cloning a model.
   * @param {number} modelId Id of model to be cloned.
   */
  cloneModel(modelId) {
    const isNewModel = modelId === ModelEditingType.NEW_MODEL;
    const deleteModelText = isNewModel
      ? this.context.t('cloneModelText')
      : this.context.t('cloneModelTextWithObjects');

    // Confirm deletion
    showConfirmationDialog(
      {
        headerText: this.context.t('cloneModelTitle'),
        dialogText: deleteModelText,
        cancelText: this.context.t('cancel'),
        confirmText: this.context.t('confirm'),
      },
      this.confirmedCloneModel.bind(this, modelId)
    );
  }

  /**
   * Clone a model.
   * @param {number} modelId Id of model to be cloned.
   */
  confirmedCloneModel(modelId) {
    const models = this.context.params.models;
    const model = getModelFromId(models, modelId);
    const newModel = JSON.parse(JSON.stringify(model));

    newModel.modelId = 0;
    newModel.modelname = `${newModel.modelname} (${this.context.t('copy')})`;

    for (let i = 0; i < models.length; i++) {
      if (parseInt(models[i].modelId) >= Math.floor(newModel.modelId)) {
        newModel.modelId = models[i].modelId + 1;
      }
    }

    models.push(newModel);

    this.updateCurrentModel(model.modelId);
    this.updateStartModel(model.modelId);
    this.setState({ isModelUpdated: false });
  }

  /**
   * Open dialog for deleting a model.
   * @param {number} modelId Id of model to be deleted.
   */
  deleteModel(modelId) {
    const isNewModel = modelId === ModelEditingType.NEW_MODEL;
    const deleteModelText = isNewModel
      ? this.context.t('deleteModelText')
      : this.context.t('deleteModelTextWithObjects');

    // Confirm deletion
    showConfirmationDialog(
      {
        headerText: this.context.t('deleteModelTitle'),
        dialogText: deleteModelText,
        cancelText: this.context.t('cancel'),
        confirmText: this.context.t('confirm'),
      },
      this.confirmedDeleteModel.bind(this, modelId)
    );
  }

  /**
   * Delete model.
   * @param {number} modelId Id of model to be deleted.
   */
  confirmedDeleteModel(modelId) {
    this.setState({
      editingModel: ModelEditingType.NOT_EDITING,
      isModelSelectorExpanded: false,
    });

    // Model not added to params
    if (modelId === ModelEditingType.NEW_MODEL) {
      return;
    }

    const models = this.context.params.models;
    const model = getModelFromId(models, modelId);
    this.context.params.models = deleteModel(models, modelId);

    this.updateCurrentModel(model.modelId);
    this.updateStartModel(model.modelId);
    this.setState({ isModelUpdated: false });
  }

  /**
   * Handle user is done editing model.
   * @param {object} params Parameters.
   * @param {number|null} [editingModel] Id of model that was edited.
   * @param {boolean} [skipChangingModel] If true, skip changing model.
   */
  doneEditingModel(params, editingModel = null, skipChangingModel = false) {
    const models = this.context.params.models;

    editingModel = editingModel || this.state.editingModel;
    const isEditing = editingModel !== ModelEditingType.NEW_MODEL;

    // Add as start model if this is the first model we add
    if (!this.context.params.models.length) {
      this.setStartModel(params.modelId);
    }

    this.context.params.models = updateModel(models, params, editingModel);

    // Set current model
    const isChangingModel = !(skipChangingModel || isEditing);

    this.setState((prevState) => {
      return {
        isModelUpdated: false,
        currentModel: isChangingModel ? params.modelId : prevState.currentModel,
        editingModel: ModelEditingType.NOT_EDITING,
      };
    });
  }

  /**
   * Change to model.
   * @param {number} modelId Id of model to change to.
   */
  changeModel(modelId) {
    this.setState({
      loadingSpinner: true,
      isModelUpdated: false,
      currentModel: modelId,
      isModelSelectorExpanded: false,
    });
  }

  /**
   * Set start model.
   * @param {number} modelId Id of model to set as start model.
   */
  setStartModel(modelId) {
    this.context.params.startModelId = modelId;
    this.setState({
      startModel: modelId,
    });
  }

  /**
   * Set a model as initialized.
   */
  modelIsInitialized() {
    this.setState({ isModelUpdated: true });
  }

  createInteraction(library) {
    if (library === null) {
      this.setState({
        listeningForClicks: false,
      });
    } else {
      this.setState({
        listeningForClicks: true,
      });
    }
    this.setState({
      editingLibrary: library,
    });
  }

  removeInteraction() {
    if (this.state.editingInteraction === InteractionEditingType.NEW_INTERACTION) {
      this.setState({
        editingInteraction: InteractionEditingType.NOT_EDITING,
        editingHotspotIndex: -1,
        listeningForClicks: false,
        editingLibrary: null,
        activeElement: null,
        hotspot: null,
      });
      return;
    }

    const model = getModelFromId(this.context.params.models, this.state.currentModel);
    model.interactions.splice(this.state.editingHotspotIndex, 1);
    this.setState({
      editingInteraction: InteractionEditingType.NOT_EDITING,
      editingHotspotIndex: -1,
      listeningForClicks: false,
      editingLibrary: null,
      hotspot: null,
    });

    //this.context.setValue(this.context.params.models, this.context.models);
  }

  editInteraction(params, modelParams = null) {
    // Creating model as well
    if (modelParams) {
      this.doneEditingModel(modelParams, ModelEditingType.NEW_MODEL, true);
    }

    const newInteraction = params;
    newInteraction.interactionpos = params.interactionpos ?? this.state.currentClickPosition;

    const model = getModelFromId(this.context.params.models, this.state.currentModel);

    if (!model.interactions) {
      model.interactions = [];
    }

    if (this.state.editingInteraction === InteractionEditingType.EDITING) {
      model.interactions[this.state.editingHotspotIndex] = newInteraction;
      this.setState({
        editingInteraction: InteractionEditingType.NOT_EDITING,
        editingHotspotIndex: -1,
        listeningForClicks: false,
        editingLibrary: null,
        hotspot: newInteraction,
      });
    } else {
      model.interactions.push(newInteraction);
      this.setState({
        activeElement: null,
        listeningForClicks: false,
        editingLibrary: null,
        hotspot: newInteraction,
      });

      // set context params hotspots to new hotspots array
      // this.context.params.interactions = [...this.state.interactions, newInteraction];
      // this.context.setValue(this.context.field, this.context.params);

      this.setState({
        editingInteraction: InteractionEditingType.NOT_EDITING,
      });
    }
  }

  /**
   * Toggle expansion of model selector.
   * @param {boolean} [forceState] Optional state to set to.
   */
  toggleExpandModelSelector(forceState) {
    // Disabled
    if (this.state.currentModel === null) {
      return;
    }
    this.setState((prevState) => {
      const isExpanded = forceState !== undefined ? forceState : !prevState.isModelSelectorExpanded;

      return { isModelSelectorExpanded: isExpanded };
    });
  }

  showContentModal = (hotspot, index) => {
    this.setState({
      editingInteraction: InteractionEditingType.EDITING,
      hotspot: hotspot,
      editingLibrary: hotspot.action.library,
      editingHotspotIndex: index,
    });
  };

  render() {
    const hasModels = this.context.params.models.length > 0;
    const model = getModelFromId(this.context.params.models, this.state.currentModel);

    return (
      <div className='model-viewer-container'>
        <div className='container'>
          <div className='mv-container'>
            {hasModels && (
              <InteractionsBar
                isShowing={true}
                createInteraction={this.createInteraction.bind(this)}
                activeElement={this.state.activeElement}
                onActiveElementChange={this.handleLibraryChange}
              />
            )}
            {hasModels ? (
              <ModelViewer
                id={'model-viewer-' + model.modelId}
                handleClick={this.handleModelClick.bind(this)}
                hotspots={model.interactions}
                currentModel={model}
                modelPath={model.glbModel.path}
                showContentModal={this.showContentModal.bind(this)}
                mvInstance={this.state.modelViewerInstance}
              />
            ) : (
              <NoModel />
            )}
            <ToolBar
              animations={this.state.animations}
              modelViewerInstance={this.state.modelViewerInstance}
            />
          </div>
          {this.state.editingModel !== ModelEditingType.NOT_EDITING && (
            <ModelEditor
              removeAction={this.deleteModel.bind(this, this.state.editingModel)}
              doneAction={this.doneEditingModel.bind(this)}
              editingModel={this.state.editingModel}
            />
          )}
          {this.state.editingInteraction !== InteractionEditingType.NOT_EDITING && (
            <InteractionEditor
              removeAction={this.removeInteraction.bind(this)}
              doneAction={this.editInteraction.bind(this)}
              editingInteraction={this.state.editingInteraction}
              library={this.state.editingLibrary}
              hotspot={this.state.hotspot}
              newInteractionPosition={this.state.currentClickPosition}
              currentModel={this.state.currentModel}
            />
          )}
        </div>
        <ControlBar
          currentModel={this.state.currentModel}
          editModel={this.editModel.bind(this)}
          cloneModel={this.cloneModel.bind(this)}
          deleteModel={this.deleteModel.bind(this)}
          newModel={this.editModel.bind(this)}
          changeModel={this.changeModel.bind(this)}
          setStartModel={this.setStartModel.bind(this)}
          startModel={this.state.startModel}
          isModelSelectorExpanded={this.state.isModelSelectorExpanded}
          toggleExpandModelSelector={this.toggleExpandModelSelector.bind(this)}
        />
        {this.state.loadingSpinner && <LoadingSpinner />}
        <ToastContainer
          position='bottom-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
        />
      </div>
    );
  }
}

Main.contextType = H5PContext;

Main.propTypes = {
  modelPath: PropTypes.string,
};
