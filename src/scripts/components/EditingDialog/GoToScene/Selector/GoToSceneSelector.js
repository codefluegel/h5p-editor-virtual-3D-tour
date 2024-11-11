import React from 'react';
import PropTypes from 'prop-types';
import ModelList from '../../../ControlBar/ModelSelector/ModelList';
import './GoToSceneSelector.scss';

const GoToSceneSelector = (props) => (
  <div className='go-to-scene-selector'>
    <div className='go-to-scene-selector-title'>{props.pickAnExistingSceneLabel}:</div>
    <div className='error-message'>{props.selectASceneErrorLabel}</div>
    <ModelList
      models={props.models}
      markedModel={props.markedModel}
      onModelClick={(modelId) => {
        props.setNextModelId(modelId);
      }}
      isShowingCheck={true}
    />
  </div>
);

GoToSceneSelector.propTypes = {
  models: PropTypes.arrayOf(PropTypes.object).isRequired,
  markedModel: PropTypes.number,
  setNextModelId: PropTypes.func.isRequired,
  pickAnExistingSceneLabel: PropTypes.string.isRequired,
  selectASceneErrorLabel: PropTypes.string.isRequired,
};

export default GoToSceneSelector;
