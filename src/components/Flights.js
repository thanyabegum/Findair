import React from 'react';
import './Flights.css';

const Flight = (props) => {
    return (
        <div className="flight" key={props.key}>
            <h2>${props.price}</h2>
            <p>{props.nonstop}</p>
        </div>
    )
}

function Flights(props) { 
    return(
        <div className="flights">
            {props.flights ? props.flights.map(flight => {
                return (
                    <Flight 
                        key={flight.QuoteId}
                        nonstop={flight.Direct ? "Nonstop" : ""}
                        price={flight.MinPrice}
                    />
                )
            }) : <h2>No Flights.</h2>}
         </div>
    )
}

export default Flights;