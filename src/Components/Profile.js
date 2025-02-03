import { useDispatch, useSelector } from "react-redux"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from "react";
import gsap from "gsap";
import { deleteTransactionsHistory, updateUsername } from "../Store/userSlice";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
export default function Profile() { 
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [editName, setEditName] = useState(false);
    const [newName, setNewName] = useState('');
    const accounts = useSelector((state) => state.userData.accounts)
    const currentUser = useSelector((state) => state.userData.currentUserData)
    const dispatch = useDispatch();
    const centerTableElements = 'text-center align-middle';
    useEffect(() => { 
        console.log(currentUser, accounts);
    }, [])

        const updateName = (e) => { 
            setNewName(e);
        }

        const triggerEdit = () => { 
            setEditName(!editName);
        }

        const finishRename = () => { 
            for (let i = 0; i < accounts.length; i ++) { 
                if (accounts[i].userName === newName) { 
                    toast.error(`Username Already Taken!`);
                    return;
                }
            }
            if (newName.length > 20) {
                toast.error(`Username Can't be longer than 20 letter`)
                return;
            } else if (newName.length < 6 && newName.length !== 0) { 
                toast.error(`Username can't be shorter than 6 letters`)
                return;
            } else if (newName.length === 0) { 
                toast.error(`Username can't be empty`)
                return;
            }
            dispatch(updateUsername(newName))
            setEditName(!editName)
            toast.success(`Username Updated Successfully!`)
        }

        const showTransactionsHistory = () => {
            if (!currentUser.transactionsHistory) {
                return null
            } else { 
                return currentUser.transactionsHistory.map((item, index) => (
                    <tr key={index}>
                    <td className={centerTableElements}>{item.ProductName}</td>
                    <td className={centerTableElements}>{item.ProductPrice}</td>
                    </tr>
                ));
            }
        };
        const handleShow = () => setDeleteConfirmation(true);
        const handleClose = () => setDeleteConfirmation(false);
        const handleDelete = () => {
            dispatch(deleteTransactionsHistory());
            setDeleteConfirmation(false);
        };
    return (
        <>
        <ToastContainer position="top-center" autoClose={3000} />
                <div className="homepage-header d-flex justify-content-between align-items-center mx-5 my-2">
                    <Link to={"/homepage"} className="site-logo fs-1 site-logo d-flex align-items-center justify-content-center mt-1">B</Link>
                        <div to={"/profile"} className='profile-section d-flex align-items-center text-dark'>
                            <div className='me-3 fs-6 fw-bold'>{currentUser.username}</div>
                            <div className="profile-logo"><AccountCircleIcon fontSize='large'></AccountCircleIcon></div>
                    </div>
                </div>
                <div className="profile-page-content container d-flex flex-column mt-4 p-3">
                    <div className="profile-info d-flex flex-column p-5 ">
                        <span className="text-center display-4 fw-bold mb-5">Account Info</span>
                        <div className="d-flex align-items-center w-100 mt-4 justify-content-center row">
                            <div className="me-5 d-flex align-items-center account-details flex-md-row">
                                <div className="large-profile-logo me-md-5 d-none d-md-block col-md-3 col-lg-3"><AccountCircleIcon sx={{fontSize: 300}}></AccountCircleIcon></div>
                                <div className="d-flex flex-column col-sm-10 col-md-9 col-lg-9 account-data">
                                    <div className={`${editName ? 'flex-column gap-2' : ''}  fs-3 fs-sm-4 fw-bold me-5 mb-3 d-flex justify-content-between align-items-center update-name-field`}>
                                        {editName ? 
                                        <input type="text" placeholder="Enter New Name" className="edit-name p-2 responsive-placeholder" onChange={(e) => updateName(e.target.value)}/> 
                                        : <span>Name : {currentUser.username} </span>}
                                        {editName ? 
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-success ms-3" onClick={() => {finishRename()}}>Save</button>
                                            <button className="btn btn-secondary ms-3" onClick={() => {triggerEdit()}}>Cancel</button>
                                        </div> 
                                        : <EditIcon className="edit-icon" fontSize="large" onClick={() => {triggerEdit()}}/>}
                                        </div>
                                    <span className="fs-3 fs-sm-4 fw-bold me-5 mb-3">Transactions Created : {Number(currentUser.numberOfTransactions)}</span>
                                    <span className="fs-3 fs-sm-4 fw-bold me-5 mb-3">Transactions Confirmed : {Number(currentUser.transactionsConfirmed)}</span>
                                    <span className="fs-3 fs-sm-4 fw-bold me-5 mb-3">Transactions Deleted : {Number(currentUser.transactionsDeleted)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                            <div className='budget-container d-flex align-items-center justify-content-between ms-md-5 mt-5 col-sm-6 col-md-4 w-100'>
                                <div className="d-flex flex-column">
                                    <span className="text-center display-4 fw-bold">Current Budget</span>
                                    <div className='my-5 budget-counter-profile align-self-center'>{currentUser.budget}</div>
                                </div>
                                <div className="d-flex flex-column">
                                    <span className="text-center display-4 fw-bold">Budget Limit</span>
                                    <div className={`${currentUser.budget < currentUser.budgetLimit ? 'limit-exceed' : 'limit-safe'} my-5 budget-limit-counter-profile align-self-center`}>
                                        {currentUser.budgetLimit}
                                        </div>
                                </div>
                            </div>
                    <hr className="mt-5"></hr>
                    <div className="transactions-history d-flex flex-column">
                            <Tooltip title = "History Shows Only Confirmed Transactions" arrow>
                            <span className="display-5 fw-bold my-4 text-center">Transactions History</span>
                            </Tooltip>
                        <table className="table table-borderless fs-5">
                <thead className="table-dark ">
                    <tr>
                    <th scope="col" className={centerTableElements}>Name</th>
                    <th scope="col" className={centerTableElements}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {showTransactionsHistory()}
                </tbody>
                </table>
                <button className="btn btn-danger" onClick={() => handleShow()}>Delete All</button>
                <Modal show = {deleteConfirmation} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Are You Sure You Want To Delete?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>This includes the transactions history, transactions created, transactions confirmed and transactions deleted</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
                    </div>
                </div>
        </>
    )
    }