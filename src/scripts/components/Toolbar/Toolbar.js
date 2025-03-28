import PropTypes from 'prop-types';
import React from 'react';

const ToolBar = (props) => {
  const { animations, modelViewerInstance } = props;

  // buttonstate
  const [buttonState, setButtonState] = React.useState(false);

  const handlePlayPause = () => {
    setButtonState(!buttonState);

    if (modelViewerInstance) {
      modelViewerInstance.availableAnimations.length && modelViewerInstance.paused
        ? modelViewerInstance.play()
        : modelViewerInstance.pause();
    }
  };

  return (
    <div className='tool-bar'>
      <div>
        {animations.length > 0 && (
          <button className='toolbar-btn' onClick={handlePlayPause}>
            {buttonState ? 'pause' : 'play'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ToolBar;
ToolBar.propTypes = {
  animations: PropTypes.arrayOf(PropTypes.object).isRequired,
  modelViewerInstance: PropTypes.shape({
    availableAnimations: PropTypes.arrayOf(PropTypes.object).isRequired,
    paused: PropTypes.bool.isRequired,
    play: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
  }).isRequired,
};
