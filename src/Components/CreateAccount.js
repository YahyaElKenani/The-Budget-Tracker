import { useEffect, useRef, useState } from "react"
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import { GoAlertFill } from "react-icons/go";
import { GoX } from "react-icons/go";
import {gsap} from 'gsap';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {toast, ToastContainer} from 'react-toastify'
import {v4 as uuidv4} from 'uuid'
import { addAccount, setCurrentUser, updateBudget, updateUsername } from "../Store/userSlice";
export default function CreateAccount() { 
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [budgetLimit, setBudgetLimit] = useState(0);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [budget, setBudget] = useState(0);
    const [existingAccounts, setExistingAccounts] = useState([]); 
    const alertRef = useRef(null);
    const dispatch = useDispatch();
    const userData = useSelector(state => state.userData);
    const currentUserData = useSelector((state) => state.userData.currentUserData);
    let userAlreadyExists = false;
    useEffect(() => { 
        gsap.fromTo(('.create-account-form'), {y: 100, opacity: 0}, {y: 0, opacity: 1}).delay(.2);
        gsap.fromTo(('.site-title'), {opacity: 0, y: -100}, {opacity: 1, y: 50});
    }, []);


    useEffect(() => {
        try { 
            setExistingAccounts(JSON.parse(localStorage.getItem('accounts')) || []); 
        } catch (error) { 
            console.error('Error')
            setExistingAccounts([]);
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('accounts', JSON.stringify(userData.accounts))
    }, [userData.accounts])

    const handleBudgetLimit = (e) => { 
        setBudgetLimit(e);
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
        console.log(currentUserData.budget);
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
                toast.error('User already Exists!');
                break;
            }
        }
        if (userAlreadyExists === false) { 
            if (username.length > 20 || username.length < 6 || username.length === 0) { 
                e.preventDefault();
                if (username.length > 20) { 
                    toast.error(`Username ean't be longer than 20 letters`)
                } else if (username.length < 6 && username.length !== 0) { 
                    toast.error(`Username can't be shorter than 6 letters`)
                } else if (username.length === 0) { 
                    toast.error(`Username Can't be empty`)
                }
            } else if (password.length > 20 || password.length < 12 || password.length === 0) { 
                e.preventDefault();
                if (password.length > 20) { 
                    toast.error(`Password ean't be longer than 20 letters`)
                } else if (password.length < 12 && password.length !== 0) { 
                    toast.error(`Password can't be shorter than 12 letters`)
                } else if (password.length === 0) { 
                    toast.error(`Password Can't be empty`)
                }
            } else if (confirmPassword !== password) { 
                e.preventDefault();
                toast.error('Invalid Password Confirmation! Please Try Again');
            } else { 
                toast.success('Account Created Successfully!');
                const newAccount = { 
                    userID: uuidv4(),
                    userName: username,
                    userPassword: password,
                    userBudget: budget,
                    budgetLimit: budgetLimit,
                    transactionsList: [],
                    budgetHistory: [],
                    numberOfTransactions: 0,
                    transactionsConfirmed: 0,
                    transactionsDeleted: 0,
                }
                setExistingAccounts((prevAccounts) => [...prevAccounts, newAccount]);
                setBudget('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                dispatch(addAccount(newAccount));
            }
        }
    }

    return (
        <>
        <ToastContainer position="top-center" autoClose={3000} />
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
                <div className="m-4 fs-5 d-flex align-items-center position-relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter Password" className="p-3 w-100 h-100"
                    onChange={(e) => {setPassword(e.target.value)}} value={password}/>
                    <span className="show-password position-absolute"onClick={() => {togglePasswordStatus()}}>{showPassword ? <GoEyeClosed /> : <GoEye/> }</span>
                </div>
                <div className="m-4 fs-5 d-flex align-items-center position-relative">
                    <input name="password confirmation" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" className="p-3 w-100 h-100"
                    onChange={(e) => {setConfirmPassword(e.target.value)}} value={confirmPassword}/>
                    <span className="show-password position-absolute"onClick={() => {toggleConfirmPasswordStatus()}}> {showConfirmPassword ? <GoEyeClosed /> : <GoEye/> } </span>
                </div>
                <input type="number" name="initial budget" placeholder="Enter Your Initial Budget (Optional)" className="m-4 p-3 fs-5"
                onChange={(e) => {setBudget(e.target.value)}}/>
                <input type="number" name="targer budget" placeholder="Enter Your Budget Limit (Optional)" className="m-4 p-3 fs-5" 
                onChange={(e) => {handleBudgetLimit(e.target.value)}}/>
                <Link to={'../homepage'} className="btn btn-success m-4" onClick={(e) => {handleSumbit(e)}}>Submit</Link>
            </form>
        </div>
        </>
    )
}