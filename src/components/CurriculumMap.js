import React, { Component } from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import courselist from '../assets/course_list.json'
import BuildGraph from './BuildGraph';

class CurriculumMap extends Component{
    constructor (props){
        super(props);
        this.state = {
            coursecode: '',
            het:1000
        };
        this.handleOnSelect = this.handleOnSelect.bind(this);
    }

    handleResize = e => {
        this.setState({het:window.innerHeight-document.getElementById('paintarea').getBoundingClientRect().top});
    }
    componentDidMount(){
        window.addEventListener('resize', this.handleResize.bind(this));
        this.setState({het:window.innerHeight-document.getElementById('paintarea').getBoundingClientRect().top});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize.bind(this));
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
                <div className='row'>
                    <div style={{zIndex:'99999'}}>
                        <ReactSearchAutocomplete
                            items={courselist}
                            onSelect={this.handleOnSelect}
                            autoFocus
                        />
                    </div>
                </div>
                <div className='row' id='paintarea' style={{height:this.state.het}}>
                    <BuildGraph coursecode={this.state.coursecode}/>
                </div>
            </div>
        );
    }

}

export default CurriculumMap;