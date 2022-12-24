import React, { Component } from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import courselist from '../assets/course_list.json'
import BuildGraph from './BuildGraph';
import CourseDetail from './CourseDetail';

class CurriculumMap extends Component{
    constructor (props){
        super(props);
        this.state = {
            coursecode: '',
            het:1000
        };
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.handleChangeCode = this.handleChangeCode.bind(this);
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

    handleChangeCode(code){
        this.setState({selectedCode: code});
    }


    render(){
        return (
            <div className='container container-fluid'>
                <div className='row'>
                    <div className='col-8 col-offset-2'>
                        <h1>Curriculum Map</h1>
                    </div>
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

                <div className='row top-margin' id='paintarea'>
                    <div className='col-12 col-md-9'>
                        <div>
                            <BuildGraph het={this.state.het} coursecode={this.state.coursecode} changeCode={this.handleChangeCode}/>
                        </div>
                    </div>
                    <div className='col-12 col-md-3'>
                        <CourseDetail code={this.state.selectedCode} />
                    </div>
                </div>
            </div>
        );
    }

}

export default CurriculumMap;