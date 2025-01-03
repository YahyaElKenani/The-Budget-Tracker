import { Link } from "react-router-dom";
import './WelcomePage.css'
import {gsap} from 'gsap';
import { useEffect, useRef } from "react";
import { GoArrowRight } from "react-icons/go";
export default function WelcomePage2() { 
    const welcomeTitleRef = useRef(null);
    const getStartedRef = useRef(null);
    useEffect(() => { 
        gsap.fromTo(welcomeTitleRef.current,{opacity: 0, y: -100}, {opacity: 1, y: 0}).delay(.4);
        gsap.fromTo(getStartedRef.current, {opacity: 0, y: 100}, {opacity: 1, y: 0}).delay(.4);
    }, [])
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <h1 ref={welcomeTitleRef} className="welcome-text display-1 fw-bold text-center my-5">Welcome To TheBudgetTracker</h1>
        <Link to={'/userlogin'} ref={getStartedRef} className="btn btn-success btn-lg p-4 fs-3">Get Started <GoArrowRight className="mx-1" /></Link>
        </div>
    )
}