import React from 'react';

class DropdownComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          jsonData: [],
          isLoaded: false,
        };
    }

    componentWillMount(){
      //setting the state to the data stored in the localStorage
      localStorage.getItem("jsonData") && this.setState({
        jsonData: JSON.parse(localStorage.getItem("jsonData")),
        isLoaded: true,
      });
    }

    componentDidMount() {
      //if localStroage have not been set then fetch the data from the first web app's api
      if(!localStorage.getItem("jsonData")){
        fetch('http://10.25.100.151:80/country')
        .then(response => response.json())
        .then($response => {
          this.setState({
            jsonData: $response,
            isLoaded: true,
          });
        })
        .catch(error => console.log("Parsing failed", error));
      } else {
        //else use the data stored in the localStorage to set the state
        console.log("Using data from localstorage");
      }
    }

    componentWillUpdate(nextProps, nextState){
      //setting the localStorage data base on what is in the state
      localStorage.setItem("jsonData", JSON.stringify(nextState.jsonData));
    }

    //local onClick function that will pass the value in the select box to the data component so it can display the correct data 
    onClick(){
      //if the user have not select a country or year then an alert box will pop up informing the user to do so
      if((document.getElementById("dataYears").value == "null") || (document.getElementById("countryName").value == "null")){
        window.alert("Please select a country and year to display data");
      } else {
        //else pass the data to the parent class 'app' which will pass it to the 'data' component
        this.props.onClick(
          document.getElementById("dataYears").value,
          this.state.jsonData[document.getElementById("countryName").value].data,
          );
      }
    }

    render(){
      //index for getting the correct country data out of the json object, this will be use for the value of the country select box
      let index = -1;
      //setting the variable for the year that weill be used for the value in the year select box
      let years = [];
      for(let i = 1965; i <= 2013; i++){
        years.push(<option value={i}>{i}</option>);
      }
      return (
        <div>
          {this.state.isLoaded ? <div>Data is loaded</div> : <div>Loading...</div>}
          <div>
            <select id="countryName">
              <option value="null">Select a country:</option>
              {this.state.jsonData.map((country)=>{
                index ++
                return <option value={index}>{country.name}</option> 

              })}
            </select>

            <select id="dataYears">
              <option value="null">Select year:</option>
              {years.map((year) => {
                return year;
              })}
            </select>

            <br/>
            <button id="submitButton" value="submit" onClick={() => this.onClick()}>Get Country Information</button>
          </div>
        </div>
      )   
    }
}

export default DropdownComponent

