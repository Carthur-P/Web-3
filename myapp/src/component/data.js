import React from 'react';

class Data extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                {this.props.year != null ?
                <div>
                    <h3>Life Expectency: {this.props.data['life_expectancy_years'][this.props.year]}</h3>
                    <h3>Food Supply Per Person Per Day (Kg): {this.props.data['food_supply_kilocalories_per_person_and_day'][this.props.year]}</h3>
                    <h3>Sugar Per Person Per Day (g): {this.props.data['sugar_per_person_g_per_day'][this.props.year]}</h3>
                </div>
                : 
                <div>
                    <h3>Life Expectency:</h3>
                    <h3>Food Supply Per Person Per Day (Kg):</h3>
                    <h3>Sugar Per Person Per Day (g):</h3>
                </div>
                }
            </div>
        )
    }
}

export default Data