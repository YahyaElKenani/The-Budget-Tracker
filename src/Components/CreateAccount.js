import { useEffect, useRef, useState } from "react"
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import { GoAlertFill } from "react-icons/go";
import { GoX } from "react-icons/go";
import {gsap} from 'gsap';
import { Link } from "react-router-dom";
export default function CreateAccount() { 
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [budget, setBudget] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [existingAccounts, setExistingAccounts] = useState([]); 
    const alertRef = useRef(null);
    let userAlreadyExists = false;
    useEffect(() => { 
        gsap.fromTo(('.create-account-form'), {y: 100, opacity: 0}, {y: 0, opacity: 1}).delay(.2);
        gsap.fromTo(('.site-title'), {opacity: 0, y: -100}, {opacity: 1, y: 50});
    }, []);

    // fetch local storage accounts into existing accounts state
    useEffect(() => {
        setExistingAccounts(JSON.parse(localStorage.getItem('accounts')) || []); 
    }, [])

    const usernameErrorMsg = { 
        display: usernameError ? 'inline' : 'none'
    }
    const passwordErrorMsg = { 
        display: passwordError ? 'inline' : 'none'
    }
    const confirmPasswordErrorMsg = { 
        display: confirmPasswordError ? 'inline' : 'none'
    }
    const togglePasswordStatus = () => { 
        setShowPassword(!showPassword);
    }
    const toggleConfirmPasswordStatus = () => { 
        setShowConfirmPassword(!showConfirmPassword);
    }

    const userExistsError = () => { 
        gsap.fromTo('.user-exists-error', {y: -100, opacity: 0}, {y: 5, opacity: 1});
    }

    //after the user creates the account, add it to the local storage
    useEffect (() => {
        if (existingAccounts.length !== 0) { 
            localStorage.setItem('accounts', JSON.stringify(existingAccounts)); 
        }  
        
    }, [existingAccounts])

    const closeAlert = () => {
        gsap.to('.user-exists-error', {y: -100, opacity: 0} )
    }

    const handleSumbit = (e) => {
        for (let i = 0; i < existingAccounts.length ; i ++) { 
            if (username === existingAccounts[i].userName) { 
                e.preventDefault(); 
                userExistsError();
                userAlreadyExists = true;
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
                break;
            }
        }
        if (userAlreadyExists === false) { 
            if (username.length > 20 || username.length < 6 || username.length === 0) { 
                e.preventDefault();
                setUsernameError(true);
                setTimeout(() => {
                    setUsernameError(false);
                }, 10000);
            } else if (password.length > 20 || password.length < 12 || password.length === 0) { 
                e.preventDefault();
                setPasswordError(true);
                setTimeout(() => {
                    setPasswordError(false);
                }, 10000);
            } else if (confirmPassword !== password) { 
                e.preventDefault();
                setConfirmPasswordError(true);
                setTimeout(() => {
                    setConfirmPasswordError(false);
                }, 10000);
            } else { 
                const newAccount = { 
                    userID: existingAccounts.length + 1,
                    userName: username,
                    userPassword: password,
                    userBudget: budget === '' ? 0 : budget,
                }
                setExistingAccounts((prevAccounts) => [...prevAccounts, newAccount]);
                setBudget('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
            }
        }
    }

    return (
        <>
        <div className="user-exists-error position-absolute d-flex align-items-center justify-content-between p-4" ref={alertRef}>
            <span><GoAlertFill />  User Already Exists</span>
            <button className="close-alert" onClick={() => {closeAlert()}}> <GoX/> </button>
        </div>
        <div className="display-2 d-flex justify-content-center site-title">The<span className="title-special-letter">B</span>udgetTracker</div>
        <div className="container d-flex justify-content-center align-items-center form-container">
            <form className="d-flex flex-column p-3 create-account-form justify-content-center h-100">
                <span className="display-4 my-4 text-center form-title d-flex align-items-center justify-content-center fw-bold">Create New Account</span>
                        {/* <div className="alert alert-danger align-items-center" role="alert" style={{display: userAlreadyExists ? 'flex' : 'none'}}><GoAlertFill className="me-2"/> User Already Exists</div> */}
                <input name="username" placeholder="Enter Username" className="m-4 p-3 fs-5" onChange={(e) => {setUsername(e.target.value)}} value={username}/>
                <small className="mx-4 input-error" style={usernameErrorMsg}>* Username Must Be 6-20 Letters</small>
                <div className="m-4 fs-5 d-flex align-items-center position-relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter Password" className="p-3 w-100 h-100"
                    onChange={(e) => {setPassword(e.target.value)}} value={password}/>
                    <span className="show-password position-absolute"onClick={() => {togglePasswordStatus()}}>{showPassword ? <GoEyeClosed /> : <GoEye/> }</span>
                </div>
                <small className="mx-4 input-error" style={passwordErrorMsg}>* Password Must Be 12-20 Letters</small>
                <div className="m-4 fs-5 d-flex align-items-center position-relative">
                    <input name="password confirmation" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" className="p-3 w-100 h-100"
                    onChange={(e) => {setConfirmPassword(e.target.value)}} value={confirmPassword}/>
                    <span className="show-password position-absolute"onClick={() => {toggleConfirmPasswordStatus()}}> {showConfirmPassword ? <GoEyeClosed /> : <GoEye/> } </span>
                </div>
                <small className="mx-4 input-error" style={confirmPasswordErrorMsg}>* Invalid Password Confirmation</small>
                <input type="number" name="initial budget" placeholder="Enter Your Initial Budget (Optional)" className="m-4 p-3 fs-5"
                onChange={(e) => {setBudget(e.target.value)}}/>
                <Link to={'../homepage'} className="btn btn-success m-4" onClick={(e) => {handleSumbit(e)}}>Submit</Link>
            </form>
        </div>
        </>
    )
}