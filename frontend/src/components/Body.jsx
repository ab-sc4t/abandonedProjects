import React from "react";
import {Button} from "@mui/material"

const Body = () => {
    const goToLogin = () =>{
        window.open("/login")
    }
    return(
        <>
            <Button onClick={goToLogin}>
                Profile
            </Button>
        </>
    )
}

export default Body;