import React, { Component } from 'react';
import CurriculumMap from './CurriculumMap';

class Main extends Component{
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div>
                <h1>Curriculum Map</h1>
                <CurriculumMap />
            </div>
        );
    };
}

export default Main;