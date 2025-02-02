import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import gsap from 'gsap';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOnBudget, addToHistory, addTransactionToAccount, clearTransactionsFromAccount, reduceFromBudget, removeFromTransactions, setCurrentUser, transactionConfirmed, transactionCreated, transactionDeleted, updateBudget } from '../Store/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import {v4 as uuidv4} from 'uuid'
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip, Zoom } from '@mui/material';
import { Link } from 'react-router-dom';
import { current } from '@reduxjs/toolkit';

export default function Homepage() { 
    const [addProductFlag, setAddProductFlag] = useState(false);
    const [updateBudgetFlag, setUpdateBudgetFlag] = useState(false);
    const [productName, setProductName] = useState(''); 
    const [productPrice, setProductPrice] = useState('');
    const [addAmount, setAddAmount] = useState();
    const [newBudget, setNewBudget] = useState();
    const [reduceAmount, setReduceAmount] = useState();
    const dispatch = useDispatch();
    
    
    const userData = useSelector((state) => state.userData);
    const currentUser = useSelector((state) => state.userData.currentUserData);
    const transactions = useSelector((state) => state.userData.currentUserData.transactionsList); 
    


    useEffect(() => {
        localStorage.setItem('currentAccount', JSON.stringify(userData));
        gsap.to('.site-logo', {rotate: 360, duration: 5, transformOrigin: 'center center', repeat: -1, ease:"none"});
        gsap.to('.budget-counter', {
            duration: 1,
            boxShadow: '0 0 5px 2px rgb(52, 219, 102)',
            repeat: -1, // Repeat indefinitely
            yoyo: true, // Go back and forth
            ease: 'power1.inOut'
        });
        console.log(userData.accounts);
        console.log(currentUser);
    }, [userData])

    const centerTableElements = 'text-center align-middle';
    useEffect(() => { 
        console.log(currentUser);
    }, [])
    useEffect(() => {
        if (addProductFlag) {
            gsap.to('.add-product', {
            y: 0,
            opacity: 1,
            visibility: 'visible',
            duration: 0.1,
            ease: "none"
            });
        } else {
            gsap.to('.add-product', {
            y: -100,
            opacity: 0,
            visibility: 'hidden',
            duration: 0.3,
            ease: 'none'
        });
        }
    }, [addProductFlag]);
    useEffect(() => {
        if (updateBudgetFlag) {
            gsap.to('.update-budget', {
            y: 0,
            opacity: 1,
            visibility: 'visible',
            duration: 0.2,
            ease: "none"
            });
        } else {
            gsap.to('.update-budget', {
            y: -100,
            opacity: 0,
            visibility: 'hidden',
            duration: 0.3,
            ease: 'none'
        });
        }
    }, [updateBudgetFlag]);
    const showAddProduct = () => { 
        if (updateBudgetFlag === true) { 
            setUpdateBudgetFlag(!updateBudgetFlag)
        }
        setAddProductFlag(!addProductFlag);
    }
    const showUpdateBudget = () => { 
        if (addProductFlag === true) { 
            setAddProductFlag(!addProductFlag)
        }
        setUpdateBudgetFlag(!updateBudgetFlag);
    }
    const handleProductName = (e) => { 
        setProductName(e);
    }
    const handleProductPrice = (e) => { 
        setProductPrice(e);
    }
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        if (productName === '' || productPrice === '') { 
            toast.error('Oops! There is missing input(s)')
            return;
        } else { 
            toast.success('New Transaction Added!')
            const transaction = { 
                ProductID: uuidv4(),
                ProductName: productName,
                ProductPrice: Number(productPrice)
            }
            console.log(currentUser.transactionsList);
            dispatch(addTransactionToAccount({transaction}));
            dispatch(transactionCreated());
            setProductName('');
            setProductPrice('');
        }
    }

    const showTransactions = () => {
        if (!currentUser || !transactions) { 
            return null;
        } else {  
                return transactions.map((item) => (
                    <tr key={item.ProductID}>
                    <td className={centerTableElements}>{item.ProductName}</td>
                    <td className={centerTableElements}>{item.ProductPrice}</td>
                    <td className={centerTableElements}>{currentUser.budget - item.ProductPrice}</td>
                    <td className={`${centerTableElements} product-buy`} onClick={() => currentUser.budget - item.ProductPrice >= 0 && buyProduct(item)} 
                    style={{ cursor: currentUser.budget - item.ProductPrice < 0 ? 'not-allowed' : 'pointer' }}>Confirm</td>
                    <td className={`${centerTableElements} product-delete`} onClick={() => deleteProduct(item.ProductID, 'delete')}>Delete</td>
                    </tr>
                ));
            
        }
    };

    const deleteProduct = (id, e) => { 
        dispatch(removeFromTransactions({productID: id}));
        dispatch(transactionDeleted({type: e}));
        console.log(currentUser);
        toast.success('Transactions Deleted!')
    }

    const buyProduct = (item) => { 
        if(currentUser.budget - item.ProductPrice >= 0) { 
            console.log(currentUser);
            console.log('buying:', item)
            dispatch(reduceFromBudget({ amount: Number(item.ProductPrice) }));  
            dispatch(addToHistory({ item }));
            deleteProduct(item.ProductID, '');
            dispatch(transactionConfirmed());
            toast.success('Transaction Confirmed!');
        } else {
            toast.error('Not enough budget');
        }
    };

    const handleBudgetSubmit = (e) => {
        e.preventDefault();
        if (newBudget !== Number(newBudget) || addAmount !== Number(addAmount) || reduceAmount !== Number(reduceAmount)) { 
            toast.error("Oops! You can't enter non-numerical values");
            return;
        }
        if (newBudget < 0 || addAmount < 0 || reduceAmount < 0) { 
            toast.error("Oops! You can't enter a negative number");
            return; 
        } 
        
        if (newBudget) { 
            dispatch(updateBudget({ amount: Number(newBudget) }));
        } 
        if (addAmount) { 
            dispatch(addOnBudget({ amount: Number(addAmount) }));
        }
        if (reduceAmount) { 
            dispatch(reduceFromBudget({ amount: Number(reduceAmount) }));
        }
            setAddAmount('');
            setNewBudget('');
            setReduceAmount('');
            toast.success("Budget Updated Successfully!")
        } 

    return (
        <>
        <ToastContainer position="top-center" autoClose={3000} />
            <div className="homepage-header d-flex justify-content-between align-items-center mx-5 my-2">
                <div className="site-logo fs-1 site-logo d-flex align-items-center justify-content-center mt-1">B</div>
                <Tooltip title = "Show Profile" arrow slots={{transition: Zoom}}>
                    <Link to={"/profile"} className='profile-section d-flex align-items-center text-dark'>
                                <div className='me-3 fs-6 fw-bold'>{currentUser.username}</div>
                                <div className="profile-logo"><AccountCircleIcon fontSize='large'></AccountCircleIcon></div>
                    </Link>
                </Tooltip>
            </div>
            <div className='budget-container d-flex flex-column align-items-center container my-5'>
                <span className='display-5 fw-bold'>Your Current Budget</span>
                <div className={`${currentUser.budget.toString().length > 7 ? 'display-1 budget-counter-large' : 'display-6 budget-counter' } my-5`}>{Number(currentUser.budget ?? 0)}</div>
            </div>
            <div className='operations-buttons d-flex align-items-center justify-content-center gap-2'>
                <button className={`btn ${addProductFlag ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => showAddProduct()}>{addProductFlag ? 'Finish Adding' : 'Add Transactions'}</button>
                <button className={`btn ${updateBudgetFlag ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => showUpdateBudget()}>{updateBudgetFlag ? 'Finish Updating' : 'Update Budget'}</button>
            </div>
                <div className={`${addProductFlag ? 'd-flex' :'d-none'} add-product my-4 align-items-center justify-content-center flex-column`}>
                    <span className='display-6 fw-bold my-4'>Add Transactions</span>
                    <form className='d-flex justify-content-center align-items-center flex-column gap-3 w-100'>
                        <input placeholder='Enter Transaction Name' type='text' className='add-product-details' value={productName} onChange={(e) => handleProductName(e.target.value)}/>
                        <input placeholder='Enter Transaction Value' type='Number' className='add-product-details' value={productPrice} onChange={(e) => handleProductPrice(e.target.value)}/>
                        <button className='btn btn-outline-primary' onClick={(e) => handleSubmit(e)}>Submit</button>
                    </form>
                </div>
                <div className={`${updateBudgetFlag ? 'd-flex' :'d-none'} update-budget my-4 align-items-center justify-content-center flex-column`}>
                    <span className='display-6 fw-bold my-4'>Update Budget</span>
                    <form className='d-flex justify-content-center align-items-center flex-column gap-3 w-100'>
                        <input placeholder='Enter New Budget' type='number' className='add-product-details' value={newBudget} onChange={(e) => setNewBudget(e.target.value)}/>
                        <input placeholder='Add On Your Current Budget' type='Number' className='add-product-details' value={addAmount} onChange={(e) => setAddAmount(e.target.value)}/>
                        <input placeholder='Reduce From Your Current Budget' type='Number' className='add-product-details' value={reduceAmount} onChange={(e) => setReduceAmount(e.target.value)}/>
                        <button className='btn btn-outline-primary' onClick={(e) => handleBudgetSubmit(e)}>Finish</button>
                    </form>
                </div>
            <div className='products-to-buy my-5 container d-flex flex-column justify-content-center align-items-center'>
                <div className='container'><hr></hr></div>
                <span className='display-5 fw-bold my-4'>Your Transactions</span>
            <table className="table table-borderless fs-5">
                <thead className="table-dark ">
                    <tr>
                    <th scope="col" className={centerTableElements}>Name</th>
                    <th scope="col" className={centerTableElements}>Price</th>
                    <th scope="col" className={centerTableElements}>Remaining</th>
                    <th scope="col" className={centerTableElements}>Confirm Buy</th>
                    <th scope="col" className={centerTableElements}>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {showTransactions()}
                </tbody>
                </table>
            </div>
        </>
    )
}