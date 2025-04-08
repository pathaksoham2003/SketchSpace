import React from 'react';
import Whiteboard from './pages/WhiteBoard';

const App: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Collaborative Whiteboard</h1>
      <Whiteboard />
    </div>
  );
};

export default App;
