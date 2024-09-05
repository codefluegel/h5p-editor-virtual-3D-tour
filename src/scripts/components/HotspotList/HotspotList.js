// component to render hotspots from main a functional component
import React from 'react';

const HotspotList = (props) => {
  props.hotspots.map((hotspot) => {});
  return (
    <div className='hotspots-list-container'>
      <h2>Hotspots</h2>
      <ul>
        {props.hotspots.length > 0 ? (
          props.hotspots.map((hotspot, index) => {
            return (
              <div className='hotspots-listItem' key={index}>
                <span style={{ margin: '3px' }}>{`${index + 1}.`}</span>
                <input
                  className='hotspot-label-input'
                  type='text'
                  value={hotspot.labelText}
                  onChange={(e) => {
                    const newHotspots = props.hotspots;
                    newHotspots[index].labelText = e.target.value;

                    props.setHotspots(newHotspots);
                  }}
                />
                <button
                  className='remove-hotspot-button'
                  onClick={() => {
                    const newHotspots = props.hotspots;
                    newHotspots.splice(index, 1);
                    props.setHotspots(newHotspots);
                  }}
                >
                  X
                </button>
              </div>
            );
          })
        ) : (
          <div className='hotspots-listItem'>
            <span className='infoText'>No hotspots added</span>
          </div>
        )}
      </ul>
    </div>
  );
};

export default HotspotList;
