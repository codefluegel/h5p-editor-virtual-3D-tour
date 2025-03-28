import '@components/ModelViewer/ModelViewer.scss';
import he from 'he';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { getSource } from '../../context/H5PContext';
import './ModelViewer.scss';

const ModelViewer = (props) => {
  const { handleClick, hotspots, modelPath, id, showContentModal, mvInstance } = props;

  const [hs, sethotspots] = useState(null);
  const [filePath, setFilePath] = useState(null);

  const openModalByType = (hotspot, index) => {
    showContentModal(hotspot, index);
  };

  useEffect(() => {
    setFilePath(null);
    const timeoutId = setTimeout(() => {
      sethotspots(hotspots);
      setFilePath(getSource(modelPath));
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [hotspots, modelPath]);

  return (
    <>
      <model-viewer
        id={id}
        onClick={handleClick}
        style={{ width: '100%', height: '100%' }}
        src={filePath}
        camera-controls
        alt={modelPath.split('/').pop().split('.').slice(0, -1).join('.')}
      >
        {hs &&
          mvInstance &&
          mvInstance.loaded &&
          hs.map((hotspot, index) => {
            return (
              hotspot.interactionpos && (
                <div
                  className={`hotspot h5p_${hotspot.action.metadata.contentType
                    .replace(/[ ,]+/g, '_')
                    .toLowerCase()}`}
                  key={index}
                  slot={`hotspot-${index}`}
                  data-surface={hotspot.interactionpos}
                  onClick={() => openModalByType(hotspot, index)}
                >
                  <span className='hotspot-label' onClick={() => openModalByType(hotspot, index)}>
                    {he.decode(hotspot.labelText)}
                  </span>
                </div>
              )
            );
          })}
      </model-viewer>
    </>
  );
};

ModelViewer.propTypes = {
  handleClick: PropTypes.func.isRequired,
  hotspots: PropTypes.arrayOf(
    PropTypes.shape({
      interactionpos: PropTypes.string,
      labelText: PropTypes.string,
      action: PropTypes.shape({
        metadata: PropTypes.shape({
          contentType: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
  modelPath: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  showContentModal: PropTypes.func.isRequired,
  mvInstance: PropTypes.shape({
    loaded: PropTypes.bool.isRequired,
  }),
};

export default ModelViewer;
