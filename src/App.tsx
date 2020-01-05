import React from 'react';
// import logo from './logo.svg';
import './App.css';
import BuildingView from './building/BuildingView';
import MapView from './map/MapView';

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <MapView />
            </header>
        </div>
    );
}

export default App;
