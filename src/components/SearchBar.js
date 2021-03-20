import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import Places from './Places';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

/* Center search bar consisting of input fields, buttons, and dropdowns.
   On click of search button, a list of flights will pop up. */
function SearchBar() { 
    // Origin/Destination State Variables
    const [originPlaces,setOriginPlaces] = useState([])
    const [destPlaces,setDestPlaces] = useState([])
    const [originValue, setOriginValue] = useState("")
    const [destValue, setDestValue] = useState("")

    // Outbound/Inbound Date State Variables 
    const [outboundDate,setOutboundDate] = useState(new Date())
    const [inboundDate, setInboundDate] = useState(new Date())
    const [showInboundInput, setShowInboundInput] = useState(false)

    // Currency State Variables
    const [currency, setCurrency] = useState("USD")
    const [currencies, setCurrencies] = useState([])

    // Flights State Variables 
    const [flights, setFlights] = useState([])
    const [showFlights,setShowFlights] = useState(false)

    // Sort State Variables
    const [sortAsc, setSortAsc] = useState(true)
    const [sortType, setSortType] = useState([])
    const sortOptions = [
        { label: "Price: Low to High", value: "true" },
        { label: "Price: High to Low", value: "false" }
    ]
    
    /* On form submission, fetch flights according to origin, dest., and dates */
    function handleSubmit(e) {
        e.preventDefault() // Prevent page from refreshing after submit

        /* Convert date object to appropriate string format: YYYY-MM-DD */
        function toString(date) {
            return date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? 
                '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + 
                date.getDate()
        }

        // Since InboundDate is of type Date, create a local version that's a string 
        let localInboundDate
        if (showInboundInput) localInboundDate = toString(inboundDate)
        else localInboundDate = "anytime"

        async function fetchFlights() {
            const reqOptions = {
                method: 'GET',
                headers: {
                    "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
                    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
                }
            }
            let response = await fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/${currency}/en-US/${originValue}/${destValue}/${toString(outboundDate)}/?` + new URLSearchParams({inboundpartialdate: localInboundDate}), reqOptions)
            response = await response.json()
            console.log(response)
            setFlights(response.Quotes)
            setSortType(sortOptions[0])
            setSortAsc(true)
        }

        fetchFlights()
        setShowFlights(true)
    }

    // Origin Handler Functions
    /* Sets originValue according to value of option selected, then updates origin options */
    const handleOriginChange = (option, actionMeta) => {
        actionMeta.action === "clear" ? setOriginValue("") : setOriginValue(option.PlaceId)
        getOriginOptions(option ? option.PlaceName : "")
    }
    
    /* Updates origin options by fetching places that match the current originValue */
    function getOriginOptions(origin) {
        async function fetchOrigins() {
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

        fetchOrigins()
    }

    // Destination Handler Functions
    /* Sets destValue according to value of option selected, then updates destination options */
    const handleDestChange = (option, actionMeta) => {
        actionMeta.action === "clear" ? setDestValue("") : setDestValue(option.PlaceId)
        getDestOptions(option ? option.PlaceName : "")
    }

    /* Updates origin options by fetching places that match the current originValue */
    function getDestOptions(dest) {
        async function fetchDests() {
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
        
        fetchDests()
    }

    // Currency Functions
    /* Fetch list of currencies */
    const getCurrencies = () => {
        async function fetchCurrencies() {
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

        fetchCurrencies()
    }

    /* Fetch list of currencies when state changes instead of every render */
    useEffect(() => {
        getCurrencies()
    }, [])

    // Input/Select Components
    /* Input for inbound date. Hidden until Roundtrip is selected */
    const InboundInput = () => {
        return (
            <div id="inboundDateInput" className="searchInput">
                <label htmlFor="inboundDate" className="visuallyHidden">Return Date:</label>
                <DatePicker 
                    id="inboundDate"
                    name="inboundDate"
                    placeholderText="Return Date" 
                    todayButton="Today"
                    selected={inboundDate}
                    onChange={date => setInboundDate(date)}
                    required
                />
            </div>
        )
    }

    /* Dropdown for sort by price */
    const SortSelect = () => {
        /* Sorts according to option selected, then sets sortType and sortAsc */
        const handleSortChange = option => {
            // If the option is the different from last time, then reverse sort
            option.value === sortAsc ? setFlights(flights) : setFlights(flights.slice().reverse())
            setSortAsc(option.value)
            setSortType(option)
        }
        
        return (
            <div>
                <label htmlFor="sortSelect" className="visuallyHidden">Sort:</label>
                <Select 
                    id="sortSelect"
                    name="sortSelect"
                    isSearchable="true"
                    value={sortType}
                    defaultValue={sortOptions[0]}
                    onChange={handleSortChange}
                    options={sortOptions}
                    placeholder="Sort"
                />
            </div>
        )
    }

    return (
        <div className="searchBar">
            {/* Main Search Bar */}
            <form onSubmit={handleSubmit}>
                <div id="originInput" className="searchInput">
                    <label htmlFor="originSelect" className="visuallyHidden">Origin:</label>
                    <Select 
                        id="originSelect"
                        name="originSelect"
                        className="placeSelect"
                        isClearable
                        backspaceRemovesValue
                        onChange={handleOriginChange}
                        onInputChange={inputValue => getOriginOptions(inputValue)}
                        options={originPlaces}
                        getOptionLabel={({ PlaceName }) => PlaceName}
                        getOptionValue={({ PlaceId }) => PlaceId}
                        placeholder="Where from?"
                        filterOption={""}
                    />
                </div>
                <div id="destInput" className="searchInput">
                    <label htmlFor="destSelect" className="visuallyHidden">Destination:</label>
                    <Select 
                        id="destSelect"
                        name="destSelect"
                        className="placeSelect"
                        isClearable
                        backspaceRemovesValue
                        onChange={handleDestChange}
                        onInputChange={inputValue => getDestOptions(inputValue)}
                        options={destPlaces}
                        getOptionLabel={({ PlaceName }) => PlaceName}
                        getOptionValue={({ PlaceId }) => PlaceId}
                        placeholder="Where to?"
                        filterOption={""}
                    />
                </div>
                <div id="outboundDateInput" className="searchInput">
                    <label htmlFor="outboundDate" className="visuallyHidden">Departure Date:</label>
                    <DatePicker 
                        id="outboundDate"
                        name="outboundDate"
                        placeholderText="Departure Date" 
                        todayButton="Today"
                        selected={outboundDate}
                        onChange={date => setOutboundDate(date)}
                        required
                    />
                </div>
                { showInboundInput ? <InboundInput /> : <></> }
                <button id="search">Search</button>
            </form>

            <div id="searchOptions">
                {/* Trip Type Buttons */}
                <div id="leftOptions">
                    <button id="roundtrip"
                            onClick={e => setShowInboundInput(true)}>
                            Roundtrip
                    </button>
                    <button id="oneWay"
                        onClick={e => setShowInboundInput(false)}>
                        One Way
                    </button>
                </div>

                <div id="rightOptions">
                    {/* Sort Type Selector */}
                    { showFlights ? <SortSelect /> : <></> }

                    {/* Currency Picker */}
                    <div id="currency">
                        <label htmlFor="currencySelect" className="visuallyHidden">Currency:</label>
                        <Select 
                            id="currencySelect"
                            name="currencySelect"
                            defaultValue={{ Code: "USD" }}
                            onChange={(option) => setCurrency(option.Code)}
                            options={currencies}
                            getOptionLabel={({ Code }) => Code}
                            getOptionValue={({ Code }) => Code}
                            placeholder="Currency"
                        />
                    </div>
                </div>
            </div>

            {/* Flight List */}
            { showFlights ? <Places flights={flights} /> : <></> }
        </div>
    )
}

export default SearchBar;