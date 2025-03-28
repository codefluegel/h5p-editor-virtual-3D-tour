import React from 'react';
import PropTypes from 'prop-types';
import { H5PContext } from '@context/H5PContext.js';
import ActiveModelRow from './Row/ActiveModelRow.js';
import ExpandedModelSelector from './ExpandedModelSelector.js';
import './ModelSelector.scss';

export default class ModelSelector extends React.Component {
  /**
   * @class
   * @param {object} props React props.
   */
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      isExpanded: false,
    };
  }

  /**
   * React render function.
   * @returns {object} JSX element.
   */
  render() {
    const models = this.context.params.models;
    const activeModel = models.find((model) => {
      return model.modelId === this.props.currentModel;
    });

    const modelSelectorClasses = ['h5p-scene-selector'];
    if (!activeModel) {
      modelSelectorClasses.push('disabled');
    }

    return (
      <div className='scene-selector-wrapper'>
        <div
          id='scene-selector'
          className={modelSelectorClasses.join(' ')}
          onClick={this.props.toggleExpand.bind(this, undefined)}
        >
          <div className='h5p-select-content'>
            <ActiveModelRow
              noModelsTitle={this.context.t('noModelsTitle')}
              currentModelLabel='Current model'
              model={activeModel}
              simpleView={true}
            />
          </div>
          <div className='h5p-select-handle' />
        </div>
        {this.props.isExpanded && (
          <ExpandedModelSelector chooseModelLabel='Choose a model'>
            {this.props.children}
          </ExpandedModelSelector>
        )}
      </div>
    );
  }
}

ModelSelector.contextType = H5PContext;

ModelSelector.propTypes = {
  currentModel: PropTypes.number,
  isExpanded: PropTypes.bool,
  toggleExpand: PropTypes.func.isRequired,
  children: PropTypes.node,
};
