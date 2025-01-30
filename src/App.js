import './App.css';
import {gsap} from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './Components/WelcomePage';
import UserLogin from './Components/UserLogin';
import './Components/WelcomePage.css'
import CreateAccount from './Components/CreateAccount';
import Homepage from './Components/Homepage';
import { Provider } from 'react-redux';
import { persistor, store } from './Store/store';
import { PersistGate } from 'redux-persist/integration/react';
import Profile from './Components/Profile';

function App() {
  return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
    <Router>
      <Routes>
        <Route path='/' element={<WelcomePage/>}/>
        <Route path='/create-account' element={<CreateAccount/>}/>
        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/homepage' element={<Homepage/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </Router>
      </PersistGate>
      </Provider>
  );
}

export default App;
