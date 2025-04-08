import React from 'react';
import Whiteboard from './pages/WhiteBoard';
const App = () => {
    return (React.createElement("div", null,
        React.createElement("h1", { style: { textAlign: 'center' } }, "Collaborative Whiteboard"),
        React.createElement(Whiteboard, null)));
};
export default App;
