import React from 'react';
// import logo from './logo.svg';
import './App.css';
import BuildingView from './building/BuildingView';

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <BuildingView />
            </header>
        </div>
    );
}

export default App;
