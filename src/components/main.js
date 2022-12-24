import React, { Component } from 'react';
import CurriculumMap from './CurriculumMap';

class Main extends Component{
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div>
                <CurriculumMap />
            </div>
        );
    };
}

export default Main;