import './App.css';
import {gsap} from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './Components/WelcomePage';
import UserLogin from './Components/UserLogin';
import './Components/WelcomePage.css'
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<WelcomePage/>}/>
        <Route path='/userlogin' element={<UserLogin/>}/>
      </Routes>
    </Router>
  );
}

export default App;
