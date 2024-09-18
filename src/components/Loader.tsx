import React from 'react';

const cubeFaces = ['shadow', 'bottom', 'top', 'left', 'right', 'back', 'front'];

const Loader: React.FC = () => {
  return (
    <div className="scene">
      <div className="cube-wrapper">
        <div className="cube">
          <div className="cube-faces">
            {cubeFaces.map((face, index) => (
              <div key={index} className={`cube-face ${face}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
