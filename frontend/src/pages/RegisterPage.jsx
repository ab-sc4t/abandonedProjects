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

const RegisterPage = () => {
    const [formData, setFormData] = useState({firstname: '', lastname: '', email: "", password: ''});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    

    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:8080/profile/register', formData)
            console.log('Data saved:', response.data);
                const {userID } = response.data;
                if (userID) {
                    window.open(`/`, 'blank'); 
                } else {
                    console.error('User ID not found in the response');
                }
        }catch(error){
                console.error('There was an error saving the data!', error);
            };
    }

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
                                REGISTER
                            </Typography>
                        </div>
                        <form onSubmit={handleSubmitRegister}>
                            <div className="leftAlign" style={{ marginTop: "2rem" }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="FIRST NAME"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    sx={{ width: "100%" }}
                                />
                            </div>
                            <div className="leftAlign" style={{ marginTop: "2rem" }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="LAST NAME"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    sx={{ width: "100%" }}
                                />
                            </div>
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
                                    label="PASSWORD"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    sx={{ width: "100%" }}
                                />
                            </div>
                            <div className="leftAlign" style={{ marginTop: "1.2rem" }}>
                                <Button type="submit" variant="contained" sx={{ backgroundColor: "#EAEDF0", color: "black" }}>
                                    REGISTER
                                </Button>
                            </div>
                        </form>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default RegisterPage;