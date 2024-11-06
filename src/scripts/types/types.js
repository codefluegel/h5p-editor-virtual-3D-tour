import PropTypes from 'prop-types';
// import {InteractionEditingType} from "../components/EditingDialog/InteractionEditor";

export const modelType = PropTypes.shape({
  modelname: PropTypes.string,
  modelId: PropTypes.number,
});

export const editingModelType = PropTypes.oneOfType([
  PropTypes.number,
  // PropTypes.oneOf(Object.values(InteractionEditingType)),
]);
