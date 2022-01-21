import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { GUI } from './features/GUI/GUI';
import { DBConsole } from './features/geojson/DB';
import { Controller } from './features/Controller/Controller';

function App() {
  return (
    <div className="App">
      <Controller />
      <GUI />
      <DBConsole />
    </div>
  );
}

export default App;
