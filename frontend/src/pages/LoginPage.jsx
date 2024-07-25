import React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from "react";
import {
    Container,
    Box,
    Grid,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Button
} from '@mui/material';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const goToResult = (e) => {
        navigate(e)
    }
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", firstname: '', lastname: '', email: "", password: "", mobile: "", address: "" });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    // const handleSubmitLogin = (e) => {
    //     e.preventDefault();

    //     axios.post('http://localhost:8080/profile/login', formData)
    //         .then(response => {
    //             if (response.data.redirectUrl) {
    //                 console.log('Redirecting to:', response.data.redirectUrl);
    //                 goToResult(response.data.redirectUrl);
    //             } else {
    //                 console.error('No redirect URL provided');
    //             }
    //         })
    //         .catch(error => {
    //             console.error('There was an error saving the data!', error);
    //             alert(error.response ? error.response.data.error : 'An error occurred');
    //         });
    // };


    return (
        <Container
            maxWidth={false}
            sx={{
                width: {
                    xs: '88%',
                    md: '76%',
                },
                height: '100vh',
                mx: 'auto',
            }}
        >
            <Box sx={{ flexGrow: "1", padding: "4rem 0 2rem 0" }}>
                <Box>
                    <Typography variant="h4" component="h4" sx={{ textAlign: "left", color: "#484F56", fontWeight: "bold" }}>
                        My Account
                    </Typography>
                </Box>
                <Grid container spacing={2} sx={{ marginTop: "2rem" }}>
                    <Grid item xs={12} md={6}>
                        <div>
                            <Typography variant="h6" component="h6" sx={{ textAlign: "left", color: "#484F56", fontWeight: "450" }}>
                                LOGIN
                            </Typography>
                        </div>
                        {/* <form onSubmit={handleSubmitLogin}> */}
                        <form>
                            <div className="leftAlign" style={{ marginTop: "2rem" }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="EMAIL"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    sx={{ width: "100%" }}
                                />
                            </div>
                            <div className="leftAlign" style={{ marginTop: "2rem" }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    type="password"
                                    label="PASSWORD"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    sx={{ width: "100%" }}
                                />
                            </div>
                            <div>
                                <div className="leftAlign">
                                    <FormControlLabel
                                        control={<Checkbox name="rememberMe" color="primary" />}
                                        label="Remember Me"
                                        sx={{ marginTop: "1rem" }}
                                    />
                                </div>
                                <div className="leftAlign" style={{ marginTop: "0.8rem" }}>
                                    <Button variant="contained" sx={{ backgroundColor: "#EAEDF0", color: "black" }}>
                                        LOGIN
                                    </Button>
                                </div>
                                <div className="leftAlign" style={{ marginTop: "0.8rem" }} onClick={() => {
                                    goToResult("/register")
                                }}>
                                    <Button sx={{ px: "0", backgroundColor: "transparent", color: "black", border: "none" }}>
                                        Don't have an account
                                    </Button>
                                </div>
                                <div className="leftAlign" style={{ marginTop: "0.8rem" }}>
                                    Lost your password?
                                </div>
                            </div>
                        </form>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default LoginPage;