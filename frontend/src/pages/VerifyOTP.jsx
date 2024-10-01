import React, { useState } from 'react';
import {Box, Button, Typography} from "@mui/material"

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
            credentials: 'include' 
        });
    
        if (response.ok) {
            const result = await response.json(); 
            window.location.href = result.redirect; 
        } else {
            alert('Invalid OTP. Please try again.');
        }
    };
    
    

    return (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: "19rem" }}>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Typography
                            variant="h5"
                        >
                            Enter OTP:
                        </Typography>
                    </Box>
                    <Box>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                            style={{
                                margin: "0.6rem 0",
                                padding: "0.8rem",
                                borderRadius: "0.4rem",
                                backgroundColor: "#bfbfbf",
                                color: "black",
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Button variant="contained" sx={{ backgroundColor: "rgb(31 41 55)", padding: "0.6rem 3rem" }} type="submit">Verify OTP</Button>
                    </Box>
                </Box>
            </form>
        </Box>
    );
}

export default VerifyOTP;
