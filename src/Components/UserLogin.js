import { use, useEffect, useState } from "react"
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import { GoAlertFill } from "react-icons/go";
import { GoX } from "react-icons/go";
import { Link } from "react-router-dom";
import {gsap} from 'gsap';
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { createNewAccounts, setCurrentUser, updateBudget, updateUsername } from "../Store/userSlice";
import { create } from "@mui/material/styles/createTransitions";

export default function UserLogin() { 
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameErrorStatus, setUsernameErrorStatus] = useState(false);
    const [passwordErrorStatus, setPasswordErrorStatus] = useState(false);
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.userData.currentUserData);
    const existingAccounts = useSelector((state) => state.userData.accounts);
   
    useEffect(() => {
        try { 
            dispatch(createNewAccounts(JSON.parse(localStorage.getItem('accounts') || [])));
        } catch (error) { 
            console.error('Error')
            dispatch(createNewAccounts([]));
        } 
    }, []);


    useEffect(() => {  
        gsap.fromTo(('.create-account-form'), {y: 100, opacity: 0}, {y: 0, opacity: 1}).delay(.2);
        gsap.fromTo(('.site-title'), {opacity: 0, y: -100}, {opacity: 1, y: 50});
    }, []);
    const toggleShowPassword = () => { 
        setShowPassword(!showPassword);
    }
    const closeAlert = () => { 
        gsap.to('.user-exists-error', {opacity: 0, y: -100})
    }
    const handleSubmit = (e) => { 
        let userNotFound = true;
        if (username !== '' && password !== '') { 
            for (let i = 0; i < existingAccounts.length; i++) { 
                if (username === existingAccounts[i].userName && password === existingAccounts[i].userPassword) {
                    toast.success('Logged In!');
                    dispatch(setCurrentUser(existingAccounts[i].userID));
                    console.log(existingAccounts[i].userID);
                    console.log(existingAccounts);
                    console.log(currentUser);
                    userNotFound = false;
                    break;
                }
            }
            if (userNotFound) { 
                e.preventDefault();
                console.log(`user not existing`);
                toast.error('User Does Not Exist');
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
        <ToastContainer position="top-center" autoClose = {3000} />
        <div className="user-exists-error position-absolute d-flex align-items-center justify-content-between p-4">
                    <span><GoAlertFill />  User Does Not Exist</span>
                    <button className="close-alert" onClick={() => {closeAlert()}}> <GoX/> </button>
                </div>
        <div className="display-2 d-flex justify-content-center site-title">The<span className="title-special-letter">B</span>udgetTracker</div>
        <div className="container form-container d-flex flex-column align-items-center justify-content-center mt-5">
            <form className="d-flex flex-column create-account-form h-100">
                <div className="display-4 my-4 text-center form-title d-flex align-items-center justify-content-center fw-bold">Log In</div>
                <input type="text" name="username" placeholder="Enter Your Username" className="m-4 p-3 fs-5 responsive-placeholder" onChange={(e) => {setUsername(e.target.value)}}/>
                <small className="mx-4 input-error" style={{display: usernameErrorStatus ? "inline" : "none"}}>* Username Can't Be Empty</small>
                <div className="m-4 fs-5 d-flex align-items-center position-relative">
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter Your Password" className="p-3 w-100 h-100 responsive-placeholder"
                    onChange={(e) => {setPassword(e.target.value)}}/>
                    <span className="show-password position-absolute responsive-placeholder"onClick={() => {toggleShowPassword()}}>{showPassword ? <GoEyeClosed /> : <GoEye/> }</span>
                </div>
                <small className="mx-4 input-error" style={{display: passwordErrorStatus ? "inline" : "none"}}>* Password Can't Be Empty</small>
                <Link to={"/homepage"} className="btn btn-success m-4" onClick={(e) => {handleSubmit(e)}}>Submit</Link>
            </form>
        </div>
        </>
    )
}