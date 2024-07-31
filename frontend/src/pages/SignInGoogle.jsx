import React from "react";
import { Button } from "@mui/material";

const SignInGoogle = () => {
    const googleauthfunc = () => {
        // Redirect to backend to start OAuth flow
        window.location.href = 'http://localhost:8080/profile/auth/google'; // Ensure this matches your backend URL
    };

    return (
        <Button onClick={googleauthfunc} variant="contained">
            Sign In with Google
        </Button>
    );
};

export default SignInGoogle;
