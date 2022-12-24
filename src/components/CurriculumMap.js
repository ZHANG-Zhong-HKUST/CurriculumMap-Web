import React, { Component } from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import courselist from '../assets/course_list.json'
import BuildGraph from './BuildGraph';

class CurriculumMap extends Component{
    constructor (props){
        super(props);
        this.state = {
            coursecode: ''
        };
        this.handleOnSelect = this.handleOnSelect.bind(this);
    }

    handleOnSelect (item) {
        this.setState({coursecode: item.name});
    }


    render(){
        return (
            <div className='container'>
                <div className='row'>
                    <h1>Curriculum Map</h1>
                </div>
                <div>
                    <ReactSearchAutocomplete
                        items={courselist}
                        onSelect={this.handleOnSelect}
                        autoFocus
                    />
                </div>
                <div>
                    <BuildGraph coursecode={this.state.coursecode}/>
                </div>
            </div>
        );
    }

}

export default CurriculumMap;