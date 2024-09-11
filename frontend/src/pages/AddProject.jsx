import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useTheme, Theme } from '@mui/material/styles'
import { Box, Stack, Button, TextField } from '@mui/material'

const AddProject = () => {
    // const theme = useTheme();
    const [projectData, setProjectData] = useState({ name: "", githubLink: '', owner: '', email: " ", typeProject: " " });
    useEffect(() => {
        const userEmail = sessionStorage.getItem('userEmail'); 
        if (userEmail) {
            setProjectData(prevData => ({
                ...prevData,
                email: userEmail,
            }));
        }
    }, []);
    const handleChange = (e) => {
        setProjectData({
            ...projectData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitAddProject = async (e) => {
        e.preventDefault();
        try {
            console.log("TESTING");
            const response = await axios.post('http://localhost:8080/projects/add', projectData);
            console.log('Data saved:', response.data);
            alert(response.data.message)
            console.log(response.data.message)
            window.location.href = response.data.route;
        } catch (error) {
            console.error('There was an error saving the data!', error);
        }
    };

    return (
        <>
            <Box sx={{ flexGrow: 1, p: 9 }}>
                <form onSubmit={handleSubmitAddProject}>
                    <Stack direction="column">
                        <TextField
                            id="outlined-required"
                            label="Project Name"
                            name="name"
                            value={projectData.name}
                            onChange={handleChange}
                            sx={{ margin: "2rem 2rem 1rem 2rem" }}
                        />
                        <TextField
                            id="outlined-required"
                            label="Owner"
                            name="owner"
                            value={projectData.owner}
                            onChange={handleChange}
                            sx={{ margin: "2rem 2rem 1rem 2rem" }}
                        />
                        <TextField
                            id="outlined-required"
                            label="Project Link"
                            name="githubLink"
                            value={projectData.githubLink}
                            onChange={handleChange}
                            sx={{ margin: "2rem 2rem 1rem 2rem" }}
                        />
                        <TextField
                            id="outlined-required"
                            label="Project Type"
                            name="typeProject"
                            value={projectData.typeProject}
                            onChange={handleChange}
                            sx={{ margin: "2rem 2rem 1rem 2rem" }}
                        />
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <Button type="submit" variant="contained" sx={{ width: "20vw", }}>
                                ADD PROJECT
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Box>
        </>
    )
}

export default AddProject;