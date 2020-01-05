import React from 'react';
import GeoMap from './GeoMap';

export default class MapView extends React.Component {

    // private canvas: React.RefObject<HTMLCanvasElement>;
    
    constructor(props) {
        super(props);
        // this.canvas = React.createRef();
    }

    componentDidMount() {
        new GeoMap();
    }

    render() {
        return (
            <div className = 'map'></div>
        );
    }
}