import React from 'react';
import GeoBuilding from './GeoBuilding';

export default class GeoBuildingView extends React.Component {
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        new GeoBuilding();
    }

    render() {
        return (
            <div className = 'geo-building'></div>
        );
    }
}