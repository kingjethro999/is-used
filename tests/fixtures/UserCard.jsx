import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/date';
import UserAvatar from './UserAvatar';

export default function UserCard(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const userPreferences = props.preferences;

    useEffect(() => {
        setUserData(props.user);
    }, [props.user]);

    function handleClick() {
        console.log('This function is never called');
    }

    const handleSubmit = () => {
        console.log('Submitting:', userData);
    };

    return (
        <div className="user-card">
            <h2>{userData?.name}</h2>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}
