import { useDispatch, useSelector } from "react-redux"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useEffect, useState } from "react";
import gsap from "gsap";
import { deleteTransactionsHistory } from "../Store/userSlice";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
export default function Profile() { 
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const currentUser = useSelector((state) => state.userData.currentUserData)
    const dispatch = useDispatch();
    const centerTableElements = 'text-center align-middle';
    useEffect(() => { 
        console.log(currentUser);
    }, [])

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
    useEffect(() => {
        gsap.to('.site-logo', {rotate: 360, duration: 5, transformOrigin: 'center center', repeat: -1, ease:"none"});
    }, [])
    return (
        <>
                <div className="homepage-header d-flex justify-content-between align-items-center mx-5 my-2">
                    <Link to={"/homepage"} className="site-logo fs-1 site-logo d-flex align-items-center justify-content-center mt-1">B</Link>
                        <div to={"/profile"} className='profile-section d-flex align-items-center text-dark'>
                            <div className='me-3 fs-6 fw-bold'>{currentUser.username}</div>
                            <div className="profile-logo"><AccountCircleIcon fontSize='large'></AccountCircleIcon></div>
                    </div>
                </div>
                <div className="profile-page-content container d-flex flex-column mt-4 p-3">
                    <div className="profile-info d-flex flex-column p-5">
                        <span className="text-center display-4 fw-bold mb-5">Account Info</span>
                        <div className="d-flex align-items-center w-100 mt-4 justify-content-center">
                            <div className="me-5 d-flex align-items-center account-details">
                                <div className="profile-logo me-5 d-none d-md-block"><AccountCircleIcon sx={{fontSize: 300}}></AccountCircleIcon></div>
                                <div className="d-flex flex-column">
                                    <span className="fs-4 fw-bold me-5 mb-3">Name : {currentUser.username} </span>
                                    <span className="fs-4 fw-bold me-5 mb-3">Transactions Created : {currentUser.numberOfTransactions}</span>
                                    <span className="fs-4 fw-bold me-5 mb-3">Transactions Confirmed : {currentUser.transactionsConfirmed}</span>
                                    <span className="fs-4 fw-bold me-5 mb-3">Transactions Deleted : {currentUser.transactionsDeleted}</span>
                                </div>
                            </div>
                            <div className='budget-container d-flex flex-column align-items-center ms-5'>
                                <div className='my-5 budget-counter-profile'>{currentUser.budget}</div>
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