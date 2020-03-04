import React from 'react';
import Scene from './Scene';
import Axios from 'axios';

export default class GaodeView extends React.Component {
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const scene = new Scene({
            id: 'gaode-map',
            mapStyle: 'dark', // 样式URL
            center: [121.507674, 31.223043],
            pitch: 65.59312320916906,
            zoom: 15.4,
            minZoom: 15,
            maxZoom: 18
        });

        scene.on('loaded', () => {
            Axios.get('https://gw.alipayobjects.com/os/rmsportal/vmvAxgsEwbpoSWbSYvix.json').then(res => {
                if (res.status === 200) {
                    const data = res.data;
                    console.log(data)
                    scene.PolygonLayer({
                        zIndex: 2
                    })
                    .source(data)
                    .shape('extrude')
                    .size('floor', [0, 2000])
                    .color('rgba(242,246,250,1.0)').animate({
                        enable: true
                    })
                    .style({
                        opacity: 1.0,
                        baseColor: 'rgb(16,16,16)',
                        windowColor: 'rgb(30,60,89)',
                        //brightColor:'rgb(155,217,255)'
                        brightColor: 'rgb(255,176,38)'
                    })
                    .render();
                }
            })
        });
    }

    render() {
        return (
            <div id = 'gaode-map'></div>
        );
    }
}