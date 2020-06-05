import React from 'react';
import './App.scss';
import "antd/dist/antd.css";
import '@csstools/normalize.css';
import RegistrationForm from './components/RegistrationForm'

function App() {
  return (
    <div className="App">
      <p>some app</p>
      <RegistrationForm />
    </div>
  );
}

export default App;
