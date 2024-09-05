import React from 'react';
import PropTypes from 'prop-types';
import '@components/InteractionsBar/InteractionsBar.scss';
import { getLibraries, H5PContext } from '@context/H5PContext';

export default class InteractionsBar extends React.Component {
  constructor(props) {
    super(props);

    this.buttonClicked = this.buttonClicked.bind(this);
    this.state = {
      isInitialized: false,
      libraries: null,
      // activeElement: null,
    };
  }

  async componentDidMount() {
    const libraries = await getLibraries(this.context.field);
    this.setState({
      isInitialized: true,
      libraries: libraries,
    });
  }

  buttonClicked = (library) => {
    if (this.props.activeElement && library.name === this.props.activeElement) {
      this.props.createInteraction(null);
      this.props.onActiveElementChange(null);
      // this.setState({
      //   activeElement: null,
      // });
    } else {
      this.props.createInteraction(library);
      this.props.onActiveElementChange(library.name);
      // this.setState({
      //   activeElement: library.name
      // });
    }
  };

  render() {
    if (!this.props.isShowing) {
      return null;
    }

    if (!this.state.isInitialized) {
      return <div>{this.context.t('loading')}...</div>;
    }

    return (
      <div className='h5p-interactions-bar'>
        {this.state.libraries.map((library) => {
          let isActive = false;

          if (this.props.activeElement && this.props.activeElement === library.name) {
            isActive = true;
          }
          let className = library.name.toLowerCase().replace('.', '-');
          className += isActive ? ' on' : '';

          return (
            <button
              className={className}
              key={library.name}
              onClick={() =>
               this.buttonClicked(library)}
            >
              <div className='tooltip'>{library.title}</div>
            </button>
          );
        })}
      </div>
    );
  }
}

InteractionsBar.contextType = H5PContext;

InteractionsBar.propTypes = {
  isShowing: PropTypes.bool,
  createInteraction: PropTypes.func.isRequired,
  onActiveElementChange: PropTypes.func,
  activeElement: PropTypes.string,
};
