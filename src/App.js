import './App.css';
import {gsap} from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './Components/WelcomePage';
import UserLogin from './Components/UserLogin';
import './Components/WelcomePage.css'
import CreateAccount from './Components/CreateAccount';
import Homepage from './Components/Homepage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<WelcomePage/>}/>
        <Route path='/create-account' element={<CreateAccount/>}/>
        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/homepage' element={<Homepage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
