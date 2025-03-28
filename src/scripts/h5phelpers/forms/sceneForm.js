import { getModelField, isChildrenValid } from '../editorForms';

/**
 * Creates scene form and appends it to wrapper
 *
 * @param field
 * @param params
 * @param wrapper
 * @param parent
 */
export const createModelForm = (field, params, wrapper, parent) => {
  const modelField = getModelField(field);
  const hiddenModelFields = ['modelId', 'cameraStartPosition', 'interactions'];

  const modelFields = modelField.field.fields.filter((modelField) => {
    return !hiddenModelFields.includes(modelField.name);
  });

  H5PEditor.processSemanticsChunk(modelFields, params, wrapper, parent);
};

/**
 * Checks if scene form is valid and marks invalid fields
 *
 * @param children
 * @returns {boolean} True if valid
 */
export const validateModelForm = (children) => {
  H5PEditor.Html.removeWysiwyg();
  return isChildrenValid(children);
};

/**
 * Sets default values for scene parameters that are not initially set by
 * the user when creating a scene.
 *
 * @param params
 * @param isThreeSixty
 * @param cameraPos
 */
export const sanitizeModelForm = (params) => {
  if (!params.interactions) {
    params.interactions = [];
  }
};

/**
 * Check if all interactions has valid positions
 *
 * @param params
 * @param isThreeSixty
 * @returns {boolean}
 */
export const isInteractionsValid = (params) => {
  if (!params.interactions) {
    return true;
  }
};

/**
 * Get initial parameters for an empty scene
 *
 * @param models
 * @returns {{modelId: (number|*)}}
 */
export const getDefaultModelParams = (models) => {
  return {
    modelId: getUniqueSceneId(models),
  };
};

/**
 * Grabs a unique ID that is higher than the highest ID in our scenes collection
 *
 * @param scenes
 * @returns {number}
 */
const getUniqueSceneId = (models) => {
  if (!models.length) {
    return 0;
  }
  const modelIds = models.map((model) => model.modelId);
  const maxModelId = Math.max(...modelIds);
  return maxModelId + 1;
};
