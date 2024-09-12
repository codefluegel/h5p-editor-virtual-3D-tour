// component to render hotspots from main a functional component
import React, { useCallback, useEffect, useState } from 'react';
import NoModel from './NoModel';
import { getSource } from '../../context/H5PContext';
import '@components/ModelViewer/ModelViewer.scss';

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
  }, [hotspots]);

  return (
    <>
      <model-viewer
        id={id}
        onClick={handleClick}
        style={{ width: '100%', height: '100%' }}
        src={filePath}
        alt={modelPath}
        camera-controls
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
                    {`${index + 1}. ${hotspot.labelText}`}{' '}
                  </span>
                </div>
              )
            );
          })}
      </model-viewer>
    </>
  );
};

export default ModelViewer;
