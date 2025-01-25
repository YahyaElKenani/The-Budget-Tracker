import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import gsap from 'gsap';
import { useEffect, useState } from 'react';
export default function Homepage() { 
    const [username, setUsername] = useState('Username Not Found');
    useEffect(() => {
        setUsername(JSON.parse(localStorage.getItem('accounts'))[0].userName);
        gsap.to('.site-logo', {rotate: 360, duration: 5, transformOrigin: 'center center', repeat: -1, ease:"none"});
    }, [])
    return (
        <>
            <div className="homepage-header d-flex justify-content-between align-items-center mx-5 my-2">
                <div className="site-logo fs-1 site-logo d-flex align-items-center justify-content-center mt-1">B</div>
                <div className='profile-section d-flex align-items-center'>
                    <div className='me-3 fs-6 fw-bold'>{username}</div>
                    <div className="profile-logo"><AccountCircleIcon fontSize='large'></AccountCircleIcon></div>
                </div>
            </div>
        </>
    )
}