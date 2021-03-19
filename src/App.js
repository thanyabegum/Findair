import React from 'react';
import './App.css';
import AirportInfo from './components/AirportInfo';
import Header from './components/Header'

function App() {
  return (
    <div className="App">
      <Header title="Findair" />
      <AirportInfo />
    </div>
  );
}

export default App;