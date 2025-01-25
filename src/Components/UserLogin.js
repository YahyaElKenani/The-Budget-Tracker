import { useEffect, useRef, useState } from "react"
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import { GoAlertFill } from "react-icons/go";
import { GoX } from "react-icons/go";
import { Link } from "react-router-dom";
import {gsap} from 'gsap';

export default function UserLogin() { 
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [existingAccounts, setExistingAccounts] = useState([]); 
    const [usernameErrorStatus, setUsernameErrorStatus] = useState(false);
    const [passwordErrorStatus, setPasswordErrorStatus] = useState(false);
    const alertRef = useRef();
    let userNotFound = true;
    useEffect(() => {
        setExistingAccounts(JSON.parse(localStorage.getItem('accounts')) || []); 
    }, []);
    useEffect(() => { 
        gsap.fromTo(('.create-account-form'), {y: 100, opacity: 0}, {y: 0, opacity: 1}).delay(.2);
        gsap.fromTo(('.site-title'), {opacity: 0, y: -100}, {opacity: 1, y: 50});
    }, []);
    const toggleShowPassword = () => { 
        setShowPassword(!showPassword);
    }
    const userExistsError = () => { 
        gsap.fromTo('.user-exists-error', {y: -100, opacity: 0}, {y: 5, opacity: 1});
    }
    const closeAlert = () => { 
        gsap.to('.user-exists-error', {opacity: 0, y: -100})
    }
    const loginFailed = () => { 
        gsap.fromTo(
            '.form-container',
            { x: -10 },
            {
                x: 10,
                duration: 0.1,
                repeat: 3,
                yoyo: true,
                ease: 'power1.inOut',
            }
        );
    }
    const handleSubmit = (e) => { 
        if (username !== '' && password !== '') { 
            for (let i = 0; i < existingAccounts.length; i++) { 
                if (username === existingAccounts[i].userName && password === existingAccounts[i].userPassword) { 
                    console.log(`existing user ${username}`);
                    userNotFound = false;
                    break;
                }
            }
            if (userNotFound) { 
                e.preventDefault();
                console.log(`user not existing`);
                loginFailed();
                userExistsError();
            }
        } else if (username === '') { 
            e.preventDefault();
            setUsernameErrorStatus(true);
            setTimeout(() => {
                setUsernameErrorStatus(false);
            }, 5000);
        } else if (password === '') {
            e.preventDefault();
            setPasswordErrorStatus(true);
            setTimeout(() => {
                setPasswordErrorStatus(false);
            }, 5000);
        }
    }
    return ( 
        <>
        <div className="user-exists-error position-absolute d-flex align-items-center justify-content-between p-4">
                    <span><GoAlertFill />  User Does Not Exist</span>
                    <button className="close-alert" onClick={() => {closeAlert()}}> <GoX/> </button>
                </div>
        <div className="display-2 d-flex justify-content-center site-title">The<span className="title-special-letter">B</span>udgetTracker</div>
        <div className="container form-container d-flex flex-column align-items-center justify-content-center mt-5">
            <form className="d-flex flex-column create-account-form h-100">
                <div className="display-4 my-4 text-center form-title d-flex align-items-center justify-content-center fw-bold">Log In</div>
                <input type="text" name="username" placeholder="Enter Your Username" className="m-4 p-3 fs-5" onChange={(e) => {setUsername(e.target.value)}}/>
                <small className="mx-4 input-error" style={{display: usernameErrorStatus ? "inline" : "none"}}>* Username Can't Be Empty</small>
                <div className="m-4 fs-5 d-flex align-items-center position-relative">
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter Your Password" className="p-3 w-100 h-100"
                    onChange={(e) => {setPassword(e.target.value)}}/>
                    <span className="show-password position-absolute"onClick={() => {toggleShowPassword()}}>{showPassword ? <GoEyeClosed /> : <GoEye/> }</span>
                </div>
                <small className="mx-4 input-error" style={{display: passwordErrorStatus ? "inline" : "none"}}>* Password Can't Be Empty</small>
                <Link to={"/homepage"} className="btn btn-success m-4" onClick={(e) => {handleSubmit(e)}}>Submit</Link>
            </form>
        </div>
        </>
    )
}