import React from 'react';
import './Places.css';

function Places(props) { 
    return(
        <div className="places">
            <table>
                <thead>
                    <tr>
                        <th>Minimum Price</th>
                        <th>Direct?</th>
                        <th>Carrier ID</th>
                        <th>Origin ID</th>
                        <th>Destination ID</th>
                        <th>Departure Date</th>
                        <th>Quote Date Time</th>
                    </tr>
                </thead>
                <tbody>
                    {props.flights ? props.flights.map(flight => {
                        return (<tr key={flight.QuoteId}>
                            <th>{flight.MinPrice}</th>
                            <th>{flight.Direct}</th>
                            <th>{flight.OutboundLeg.CarrierIds}</th>
                            <th>{flight.OutboundLeg.OriginId}</th>
                            <th>{flight.OutboundLeg.DestinationId}</th>
                            <th>{flight.OutboundLeg.DepartureDate}</th>
                            <th>{flight.OutboundLeg.DepartureDate}</th>
                        </tr>)
                    }) : <></>}
                </tbody>
            </table>
         </div>
    )
}

export default Places;