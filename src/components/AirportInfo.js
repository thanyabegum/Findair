import React, { useState, useEffect } from 'react';
import './AirportInfo.css';
import Places from './Places';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function AirportInfo() { 
    const [origin,setOrigin] = useState("")
    const [dest,setDest] = useState("")
    const [originPlaces,setOriginPlaces] = useState([])
    const [destPlaces,setDestPlaces] = useState([])
    const [originValue, setOriginValue] = useState("")
    const [destValue, setDestValue] = useState("")
    const [flights, setFlights] = useState([])
    const [showFlights,setShowFlights] = useState(false)
    const [outboundDate,setOutboundDate] = useState(new Date())
    const [inboundDate, setInboundDate] = useState(new Date())
    const [showInboundInput, setShowInboundInput] = useState(false)
    const [currency, setCurrency] = useState("USD")
    const [currencies, setCurrencies] = useState([])
    const [sortAsc, setSortAsc] = useState(true)
    const [sortType, setSortType] = useState([])

    const sortOptions = [
        { label: "Price: Low to High", value: "true" },
        { label: "Price: High to Low", value: "false" }
    ]

    function toString(date) {
        return date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? 
            '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + 
            date.getDate()
    }
    
    function handleSubmit(e) {
        e.preventDefault()
        let localOutboundDate, localInboundDate

        if (!outboundDate) localOutboundDate = "anytime"
        else localOutboundDate = toString(outboundDate)

        if (!inboundDate) localInboundDate = "anytime"
        else localInboundDate = toString(inboundDate)

        async function fetchMyAPI() {
            const reqOptions = {
                method: 'GET',
                headers: {
                    "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
                    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
                }
            }
            let response = await fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/${currency}/en-US/${originValue}/${destValue}/${localOutboundDate}/?` + new URLSearchParams({inboundpartialdate: localInboundDate}), reqOptions)
            response = await response.json()
            console.log(response)
            setFlights(response.Quotes)
        }

        fetchMyAPI()
        setShowFlights(true)
    }

    const handleOriginChange = (option, actionMeta) => {
        if (actionMeta.action === "clear") {
            setOrigin("")
            setOriginValue("")
        } else {
            setOrigin(option.PlaceName)
            setOriginValue(option.PlaceId)
        }
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
            let response = await fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/${currency}/en-US/?` + new URLSearchParams({query: origin }), reqOptions)
            response = await response.json()
            console.log(response.Places)
            setOriginPlaces(response.Places)
        }

        fetchMyAPI()
    }

    const handleDestChange = (option, actionMeta) => {
        if (actionMeta.action === "clear") {
            setDest("")
            setDestValue("")
        } else {
            setDest(option.PlaceName)
            setDestValue(option.PlaceId)
        }
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
            let response = await fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/${currency}/en-US/?` + new URLSearchParams({query: dest }), reqOptions)
            response = await response.json()
            console.log(response.Places)
            setDestPlaces(response.Places)
        }
        
        fetchMyAPI()
    }

    const InboundInput = () => {
        return (
            <div>
                <label htmlFor="inboundDate">Return Date:</label>
                <DatePicker 
                    id="inboundDate"
                    name="inboundDate"
                    placeholderText="Returning?" 
                    todayButton="Today"
                    selected={inboundDate}
                    onChange={date => setInboundDate(date)}
                    required
                />
            </div>
        )
    }

    const getCurrencies = () => {
        async function fetchMyAPI() {
            const reqOptions = {
                method: 'GET',
                headers: {
                    "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
                    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                    "useQueryString": true
                }
            }
            let response = await fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/reference/v1.0/currencies", reqOptions)
            response = await response.json()
            setCurrencies(response.Currencies)
        }
        fetchMyAPI()
    }

    const SortSelect = () => {
        const handleSortChange = option => {
            option.value === sortAsc ? setFlights(flights) : setFlights(flights.slice().reverse())
            setSortAsc(option.value)
            setSortType(option)
        }
        
        return (
            <div>
                <label htmlFor="sort">Sort:</label>
                <Select 
                    id="sort"
                    name="sort"
                    isSearchable="true"
                    value={sortType}
                    onChange={handleSortChange}
                    options={sortOptions}
                    placeholder="Sort"
                />
            </div>
        )
    }

    useEffect(() => {
        getCurrencies()
    }, [])

    return (
        <div className="airportinfo">
            <form onSubmit={handleSubmit}>
                <label htmlFor="originInput">Origin:</label>
                <Select 
                    id="originInput"
                    isClearable
                    backspaceRemovesValue
                    onChange={handleOriginChange}
                    onInputChange={handleOriginInputChange}
                    options={originPlaces}
                    getOptionLabel={({ PlaceName }) => PlaceName}
                    getOptionValue={({ PlaceId }) => PlaceId}
                    placeholder="Where from?"
                    filterOption={""}
                />
                <label htmlFor="destInput">Destination</label>
                <Select 
                    id="destInput"
                    isClearable
                    backspaceRemovesValue
                    onChange={handleDestChange}
                    onInputChange={handleDestInputChange}
                    options={destPlaces}
                    getOptionLabel={({ PlaceName }) => PlaceName}
                    getOptionValue={({ PlaceId }) => PlaceId}
                    placeholder="Where to?"
                    filterOption={""}
                />
                <label htmlFor="outboundDate">Departure Date</label>
                <DatePicker 
                    id="outboundDate"
                    name="outboundDate"
                    placeholderText="Departing?" 
                    todayButton="Today"
                    selected={outboundDate}
                    onChange={date => setOutboundDate(date)}
                    required
                />
                { showInboundInput ? <InboundInput /> : <></> }
                <button className="search">Search</button>
            </form>
            <div id="tripType">
                <button id="roundtripButton"
                        onClick={e => setShowInboundInput(true)}>
                        Roundtrip
                </button>
                <button id="oneWayButton"
                    onClick={e => setShowInboundInput(false)}>
                    One Way
                </button>
            </div>
            <SortSelect />
            <label htmlFor="currencySelect">Currency:</label>
            <Select 
                id="currencySelect"
                defaultValue={{ Code: "USD" }}
                onChange={(option) => setCurrency(option.Code)}
                options={currencies}
                getOptionLabel={({ Code }) => Code}
                getOptionValue={({ Code }) => Code}
                placeholder="Currency"
            />
            { showFlights ? <Places flights={flights} /> : <></> }
        </div>
    )
}

export default AirportInfo;