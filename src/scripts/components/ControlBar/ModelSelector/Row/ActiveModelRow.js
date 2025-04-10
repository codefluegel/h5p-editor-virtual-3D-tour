import PropTypes from 'prop-types';
import React from 'react';
import { modelType } from '@types/types';
import '@components/ControlBar/ModelSelector/Row/ActiveModelRow.scss';

/**
 * @param {object} props React props.
 * @returns {object} JSX element.
 */
const ActiveModelRow = (props) => {
  if (!props.model) {
    return <div>{props.noModelsTitle}</div>;
  }
  const rowClasses = ['active-scene'];

  return (
    <div className={rowClasses.join(' ')}>
      <div className='h5p-scene-denotation'>{props.currentModelLabel}:</div>
      <div
        className='h5p-scene-name'
        dangerouslySetInnerHTML={{ __html: props.model.modelName }}
      ></div>
    </div>
  );
};

ActiveModelRow.propTypes = {
  model: modelType,
  noModelsTitle: PropTypes.string.isRequired,
  currentModelLabel: PropTypes.string.isRequired,
};

export default ActiveModelRow;
