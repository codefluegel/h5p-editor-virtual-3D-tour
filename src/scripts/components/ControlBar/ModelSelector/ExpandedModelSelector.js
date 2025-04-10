import React from 'react';
import PropTypes from 'prop-types';
import '@components/ControlBar/ModelSelector/ExpandedModelSelector.scss';

/**
 * @param {object} props React props.
 * @returns {object} JSX element.
 */
const ExpandedModelSelector = (props) => (
  <div className='expanded-scene-selector'>
    <div className='header'>
      <div className='title'>{props.chooseModelLabel}</div>
    </div>
    {props.children}
  </div>
);

ExpandedModelSelector.propTypes = {
  children: PropTypes.node,
  chooseModelLabel: PropTypes.string.isRequired,
};

export default ExpandedModelSelector;
