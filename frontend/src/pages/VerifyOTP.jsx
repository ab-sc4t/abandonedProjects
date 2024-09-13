import React, { useState } from 'react';

function VerifyOTP() {
    const [otp, setOTP] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp }),
        });

        if (response.ok) {
            window.location.href = '/'; // Redirect on success
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
