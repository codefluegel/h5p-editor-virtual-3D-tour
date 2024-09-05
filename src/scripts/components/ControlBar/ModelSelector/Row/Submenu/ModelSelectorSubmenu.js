import React from 'react';
import PropTypes from 'prop-types';
import './ModelSelectorSubmenu.scss';

/**
 * @param {object} props React props.
 * @returns {object} JSX element.
 */
const ModelSelectorSubmenu = (props) => {
  const handleClick = (event, type) => {
    event.stopPropagation();
    props[type]();
  };

  return (
    <div className='scene-selector-submenu'>
      <button
        className='set-start-scene'
        disabled={props.isStartModel}
        onClick={(event) => {
          handleClick(event, 'setStartModel');
        }}
      >
        <div className='tooltip'>{props.setStartingModelLabel}</div>
      </button>
      <button
        className='jump'
        onClick={(event) => {
          handleClick(event, 'onJump');
        }}
      >
        <div className='tooltip'>{props.goToModelLabel}</div>
      </button>
      <button
        className='edit'
        onClick={(event) => {
          handleClick(event, 'onEdit');
        }}
      >
        <div className='tooltip'>{props.editLabel}</div>
      </button>
      <button
        className='clone'
        onClick={(event) => {
          handleClick(event, 'onClone');
        }}
      >
        <div className='tooltip'>{props.cloneLabel}</div>
      </button>
      <button
        className='delete'
        onClick={(event) => {
          handleClick(event, 'onDelete');
        }}
      >
        <div className='tooltip'>{props.deleteLabel}</div>
      </button>
    </div>
  );
};

ModelSelectorSubmenu.propTypes = {
  isStartModel: PropTypes.bool.isRequired,
  setStartModel: PropTypes.func.isRequired,
  onJump: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onClone: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  setStartingModelLabel: PropTypes.string.isRequired,
  goToModelLabel: PropTypes.string.isRequired,
  editLabel: PropTypes.string.isRequired,
  cloneLabel: PropTypes.string.isRequired,
  deleteLabel: PropTypes.string.isRequired,
};

export default ModelSelectorSubmenu;
