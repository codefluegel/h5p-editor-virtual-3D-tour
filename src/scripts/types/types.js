import PropTypes from 'prop-types';
// import {InteractionEditingType} from "../components/EditingDialog/InteractionEditor";

export const modelType = PropTypes.shape({
  modelname: PropTypes.string.isRequired,
  scenesrc: PropTypes.shape({
    path: PropTypes.string.isRequired,
    alt: PropTypes.string,
  }).isRequired,
});

export const editingModelType = PropTypes.oneOfType([
  PropTypes.number,
  // PropTypes.oneOf(Object.values(InteractionEditingType)),
]);
