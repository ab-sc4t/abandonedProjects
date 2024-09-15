import React, { useState } from 'react';

function VerifyOTP() {
    const [otp, setOTP] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const response = await fetch('http://localhost:8080/profile/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp }),
            credentials: 'include'  // This ensures cookies are sent
        });
    
        if (response.ok) {
            const result = await response.json(); // Parse JSON response
            window.location.href = result.redirect; // Redirect based on response
        } else {
            alert('Invalid OTP. Please try again.');
        }
    };
    
    

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Enter OTP:
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                />
            </label>
            <button type="submit">Verify OTP</button>
        </form>
    );
}

export default VerifyOTP;
