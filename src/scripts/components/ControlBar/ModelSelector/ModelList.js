import PropTypes from 'prop-types';
import React from 'react';
import ModelRow from './Row/ModelRow';

/**
 * @class
 * @param {object} props React props.
 * @returns {object} JSX element.
 */
const ModelList = (props) => {
  let previousElementHasTopBorder = false;

  return (
    <div className='h5p-scene-list'>
      {props.models.map((model) => {
        const isStartModel = model.modelId === props.startModel;
        const isMarkedModel = model.modelId === props.markedModel;
        let isAfterActiveModel = previousElementHasTopBorder;
        previousElementHasTopBorder = isMarkedModel;

        return (
          <ModelRow
            key={model.modelId}
            model={model}
            isStartModel={isStartModel}
            isMarkedModel={isMarkedModel}
            isShowingCheck={props.isShowingCheck}
            isAfterActiveModel={isAfterActiveModel}
            onTitleClick={() => {
              props.onTitleClick && props.onTitleClick(model.modelId);
            }}
            onModelClick={() => {
              props.onModelClick && props.onModelClick(model.modelId);
            }}
          >
            {props.children && props.children(isStartModel, model.modelId)}
          </ModelRow>
        );
      })}
    </div>
  );
};

ModelList.propTypes = {
  models: PropTypes.arrayOf(
    PropTypes.shape({
      modelId: PropTypes.number,
    })
  ),
  startModel: PropTypes.number,
  markedModel: PropTypes.number,
  isShowingCheck: PropTypes.bool,
  onTitleClick: PropTypes.func,
  onModelClick: PropTypes.func,
  children: PropTypes.func,
};

export default ModelList;
