import { Link } from "react-router-dom";
import './WelcomePage.css'
import {gsap} from 'gsap';
import { useEffect, useRef } from "react";
import { GoArrowRight } from "react-icons/go";
export default function WelcomePage() { 
    const welcomeTitleRef = useRef(null);
    const getStartedRef = useRef(null);
    const loginButtonsRef = useRef(null);
    useEffect(() => { 
        gsap.fromTo(welcomeTitleRef.current,{opacity: 0, y: -100}, {opacity: 1, y: 0}).delay(.4);
        gsap.fromTo(getStartedRef.current, {opacity: 0, y: 100}, {opacity: 1, y: 0}).delay(.4);
    }, [])
    const fadeButton = async (e) => { 
        await gsap.to(e, {opacity: 0, x: -100});
        // document.querySelector('.get-started').remove();
        gsap.fromTo(loginButtonsRef.current,{opacity: 0, x: 100}, {opacity: 1, x: 0});
    }
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <h1 ref={welcomeTitleRef} className="welcome-text display-1 fw-bold text-center my-5">Welcome To TheBudgetTracker</h1>
        <button to={'/userlogin'} ref={getStartedRef} className="btn btn-success btn-lg p-4 fs-3 get-started" onClick={(e) => fadeButton(e.target)}>Get Started <GoArrowRight className="mx-1" /></button>
        <div ref={loginButtonsRef} className="login-btns">
            <button className="btn btn-outline-primary mx-2 px-3 fs-4 btn-lg">Create Account</button>
            <button className="btn btn-outline-success mx-2 px-3 fs-4 btn-lg">Log In</button>
        </div>
        </div>
    )
}

// import { Link } from "react-router-dom";
// import './WelcomePage.css';
// import { gsap } from 'gsap';
// import { useEffect, useRef } from "react";
// import { GoArrowRight } from "react-icons/go";

// export default function WelcomePage2() { 
//     const welcomeTitleRef = useRef(null);
//     const getStartedRef = useRef(null);
//     const loginButtonsRef = useRef(null);
    
//     useEffect(() => { 
//         gsap.fromTo(welcomeTitleRef.current, { opacity: 0, y: -100 }, { opacity: 1, y: 0, delay: 0.4 });
//         gsap.fromTo(getStartedRef.current, { opacity: 0, y: 100 }, { opacity: 1, y: 0, delay: 0.4 });
//     }, []);
    
//     const fadeButton = (e) => {
//         // Fade out "Get Started" button
//         gsap.to(e, { opacity: 0, x: -100, duration: 0.5 });

//         // Fade in login buttons from the right to the same position
//         gsap.fromTo(
//             loginButtonsRef.current.children,
//             { opacity: 0, x: 100 }, // Initial state
//             { opacity: 1, x: 0, stagger: 0.2, duration: 0.5 } // End state
//         );
//     };

//     return (
//         <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
//             <h1 ref={welcomeTitleRef} className="welcome-text display-1 fw-bold text-center my-5">
//                 Welcome To TheBudgetTracker
//             </h1>
//             <button
//                 ref={getStartedRef}
//                 className="btn btn-success btn-lg p-4 fs-3 get-started"
//                 onClick={(e) => fadeButton(e.target)}
//             >
//                 Get Started <GoArrowRight className="mx-1" />
//             </button>
//             <div ref={loginButtonsRef} className="login-btns d-flex justify-content-center align-items-center mt-4">
//                 <button className="btn btn-info mx-2 btn-lg">Log in</button>
//                 <button className="btn btn-info mx-2 btn-lg">Sign up</button>
//             </div>
//         </div>
//     );
// }