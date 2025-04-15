import '@components/ModelViewer/ModelViewer.scss';
import { getSource } from '@context/H5PContext';
import { purifyHTML } from '@utils/utils.js';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

/** @constant {number} FILE_PATH_TIMEOUT_MS File path setting timeout. */
const FILE_PATH_TIMEOUT_MS = 500;

const ModelViewer = (props) => {
  const {
    handleClick,
    hotspots,
    modelPath,
    id,
    showContentModal,
    mvInstance,
    modelDescriptionARIA,
  } = props;

  const [hs, sethotspots] = useState(null);
  const [filePath, setFilePath] = useState(null);

  const openModalByType = (hotspot, index) => {
    showContentModal(hotspot, index);
  };

  const handleKeyDown = (event, hotspot, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModalByType(hotspot, index);
    }
  };

  const POLLING_INTERVAL_MS = 500;
  const MAX_POLL_ATTEMPTS = 50;

  useEffect(() => {
    let pollCount = 0;
    let intervalId;

    const attemptLoad = () => {
      if (window.modelViewerLoaded) {
        clearInterval(intervalId);
        return;
      }

      if (pollCount >= MAX_POLL_ATTEMPTS) {
        clearInterval(intervalId);
        import(/* webpackMode: "eager" */ '@google/model-viewer')
          .then(() => {
            window.modelViewerLoaded = true;
          })
          .catch((error) => {});
        return;
      }

      pollCount++;
    };

    if (!window.modelViewerLoaded) {
      intervalId = setInterval(attemptLoad, POLLING_INTERVAL_MS);

      import(/* webpackMode: "eager" */ '@google/model-viewer')
        .then(() => {
          window.modelViewerLoaded = true;
          clearInterval(intervalId);
        })
        .catch((error) => {});
    }

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setFilePath(null);
    const timeout = 100;
    const timeoutId = setTimeout(() => {
      sethotspots(hotspots);
      setFilePath(getSource(modelPath));
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [hotspots, modelPath]);

  return (
    <>
      <model-viewer
        id={id}
        onClick={handleClick}
        class='modelViewer'
        src={filePath}
        camera-controls
        alt={modelDescriptionARIA}
        auto-rotate
        ar
        ar-scale='fixed'
      >
        {hs &&
          mvInstance &&
          mvInstance.loaded &&
          hs.map((hotspot, index) => {
            return (
              hotspot.interactionpos && (
                <div
                  className='hotspot'
                  key={index}
                  slot={`hotspot-${index}`}
                  data-surface={hotspot.interactionpos}
                >
                  <button
                    className={`hotspot h5p_${hotspot.action.metadata.contentType
                      .replace(/[ ,]+/g, '_')
                      .toLowerCase()}`}
                    aria-label={purifyHTML(hotspot.labelText)}
                    onClick={() => openModalByType(hotspot, index)}
                    onKeyDown={(event) => handleKeyDown(event, hotspot, index)}
                  />
                  <div className='hotspot-label'>{purifyHTML(hotspot.labelText)}</div>
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
  modelDescriptionARIA: PropTypes.string.isRequired,
};

export default ModelViewer;
