import React from 'react';

/**
 * Get absolute path to image from relative parameters path
 *
 * @param {string} path Relative path as found in content parameters
 * @returns {string} Absolute path to image
 */
export const getSource = (path) => {
  return H5P.getPath(path, H5PEditor.contentId);
};

export const getInteractionsField = (field) => {
  const modelFields = getModelField(field);

  return H5PEditor.findSemanticsField('interactions', modelFields);
};

export const getModelField = (field) => {
  return H5PEditor.findSemanticsField('modelViewerWidget', field);
};

export const getLibraries = async (field) => {
  const actionField = H5PEditor.findSemanticsField('action', getInteractionsField(field));

  return new Promise((resolve) => {
    H5PEditor.LibraryListCache.getLibraries(actionField.options, (libraries) => {
      resolve(libraries);
    });
  });
};

export const H5PContext = React.createContext(null);
