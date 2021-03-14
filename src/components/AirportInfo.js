import React, { useState } from 'react';
import './AirportInfo.css';
import Places from './Places';
import Select from 'react-select';

function AirportInfo() { 
    const [origin,setOrigin] = useState("")
    const [dest,setDest] = useState("")
    const [originPlaces,setOriginPlaces] = useState([])
    const [destPlaces,setDestPlaces] = useState([])
    const [originValue, setOriginValue] = useState("")
    const [destValue, setDestValue] = useState("")
    const [flights, setFlights] = useState([])
    const [showFlights,setShowFlights] = useState(false)
    const [outboundDate,setOutboundDate] = useState("")
    
    function handleSubmit(e) {
        e.preventDefault()
        if (outboundDate === "") setOutboundDate("anytime")
        async function fetchMyAPI() {
            const reqOptions = {
                method: 'GET',
                headers: {
                    "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
                    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                    "useQueryString": true
                }
            }
            // let response = await fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/${originValue}/${destValue}/anytime?` + new URLSearchParams({inboundpartialdate: '%20'}), reqOptions)
            let response = await fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${originValue}/${destValue}/${outboundDate}`, reqOptions)
            response = await response.json()
            console.log(response)
            setFlights(response.Quotes)
            // setOriginPlaces(response.Places)
        }
        fetchMyAPI()

        setShowFlights(true)
        // setShowPlaces(true)
        // setOrigin("")
        // setDest("")
    }

    const handleOriginChange = selectedOption => {
        setOrigin(selectedOption)
        setOriginValue(selectedOption.value)
        getOriginOptions()
    }

    const handleOriginInputChange = inputValue => {
        setOrigin(inputValue)
        getOriginOptions()
    }

    function getOriginOptions() {
        async function fetchMyAPI() {
            const reqOptions = {
                method: 'GET',
                headers: {
                    "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
                    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                    "useQueryString": true
                }
            }
            let response = await fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?" + new URLSearchParams({query: origin }), reqOptions)
            response = await response.json()
            console.log(response.Places)
            return response
        }
        
        fetchMyAPI().then(response => {
            if (response.Places) {
                const newPlaces = response.Places.map(item => {
                    return { label: item.PlaceName, value: item.PlaceId };
                });
                console.log(newPlaces)
                setOriginPlaces(newPlaces)
                return newPlaces
            }
        })
    }

    const handleDestChange = selectedOption => {
        setDest(selectedOption)
        setDestValue(selectedOption.value)
        getDestOptions()
    }

    const handleDestInputChange = inputValue => {
        setDest(inputValue)
        getDestOptions()
    }

    function getDestOptions() {
        async function fetchMyAPI() {
            const reqOptions = {
                method: 'GET',
                headers: {
                    "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
                    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                    "useQueryString": true
                }
            }
            let response = await fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?" + new URLSearchParams({query: dest }), reqOptions)
            response = await response.json()
            console.log(response.Places)
            return response
        }
        
        fetchMyAPI().then(response => {
            if (response.Places) {
                const newPlaces = response.Places.map(item => {
                    return { label: item.PlaceName, value: item.PlaceId };
                });
                console.log(newPlaces)
                setDestPlaces(newPlaces)
                return newPlaces
            }
        })
    }
    
    return(
        <div className="airportinfo">
            <form onSubmit={handleSubmit}>
                <label htmlFor="originInput">Origin:</label>
                <Select 
                    id="originInput"
                    className="select"
                    onChange={handleOriginChange}
                    onInputChange={handleOriginInputChange}
                    isSearchable="true"
                    options={originPlaces}
                    placeholder="Where from?"
                />
                <label htmlFor="destInput">Destination</label>
                <Select 
                    id="originInput"
                    className="select"
                    onChange={handleDestChange}
                    onInputChange={handleDestInputChange}
                    isSearchable="true"
                    options={destPlaces}
                    placeholder="Where to?"
                />
                <label htmlFor="outboundDate">Outbound Date</label>
                <input 
                    type="date" 
                    id="outboundDate" 
                    name="outboundDate"
                    value={outboundDate}
                    onChange={e => setOutboundDate(e.target.value)}
                />
                <button className="search">Submit</button>
            </form>
            { showFlights ? <Places flights={flights}></Places> : <></>}
        </div>
    )
}

export default AirportInfo;