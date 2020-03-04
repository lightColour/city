import React from 'react';
// import logo from './logo.svg';
import './App.css';
import BuildingView from './building/BuildingView';
import MapView from './map/MapView';
import GeoBuildingView from './mapBuilding/GeoBuildingView';
import GaodeView from './gaode/GaodeView';


const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <GaodeView />
            </header>
        </div>
        
    );
}

export default App;
