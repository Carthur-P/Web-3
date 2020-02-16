import React from 'react';
import Data from './component/data';
import DropdownComponent from './component/dropdown';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            year: null,
            data: [],
          };
    }

    //this will update the 'app' class state base on what is given from the 'dropdown' component
    updateState(year, data){
        this.setState({
           year: year,
           data: data, 
        });
    }

    render(){
        return (
            <div>
                <DropdownComponent onClick={(year, data) => this.updateState(year, data)}/><br/>
                <Data year={this.state.year} data={this.state.data}/>
            </div>
        )
    }
}

export default App