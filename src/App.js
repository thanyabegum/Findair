import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import Header from './components/Header'

function App() {
  return (
    <div className="App">
      <Header title="Findair" />
      <div id="content">
        <h1>We’ll Find You The <br /><span>Cheapest Flights</span></h1>
        <SearchBar />
      </div>
    </div>
  );
}

export default App;