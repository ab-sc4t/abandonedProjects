import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from "axios";
import GoogleIcon from '@mui/icons-material/Google';

const Body = () => {
    const [projects, setProjects] = useState([]);
    const [myProjects, setMyProjects] = useState([]);
    const [user, setUser] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/projects`);
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects", error);
            }
        };

        const checkUser = async () => {
            try {
                console.log("HELLOOOOOOOO");
                const sessionResponse = await axios.get('http://localhost:8080/profile/check-session', { withCredentials: true });
                if (sessionResponse.data.loggedIn) {
                    console.log("SESSIONNNN");
                    const userResponse = await axios.get('http://localhost:8080/profile/user', { withCredentials: true });
                    setUser(userResponse.data);
                    sessionStorage.setItem('userEmail', userResponse.data.email);
                    console.log(user);
                }
            } catch (error) {
                console.log("Error")
                console.error('Error checking session:', error);
            }
        };

        fetchProjects();
        checkUser();
    }, []);

    useEffect(() => {
        const fetchProjects2 = async () => {
            const email = sessionStorage.getItem('userEmail');
            try {
                const response = await axios.get(`http://localhost:8080/projects/${email}`);
                setMyProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects", error);
            }
        };

        if (user) {
            fetchProjects2();
        }
    }, [user]);

    const columns = [
        { field: 'id', headerName: 'S. No', width: 90 },
        { field: 'name', headerName: 'Project Name', width: 180 },
        { field: 'owner', headerName: 'Owner', width: 180 },
        {
            field: 'githubLink',
            headerName: 'Project Link',
            width: 540,
            renderCell: (params) => (
                <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ color: "cyan" }}>
                    {params.value}
                </a>
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Issue Date',
            width: 180,
            renderCell: (params) => {
                const date = new Date(params.value);
                const formattedDate = date.toLocaleDateString();
                return formattedDate;
            }
        },
        { field: 'email', headerName: 'Email', width: 300 },
        { field: 'typeProject', headerName: 'Project Category', width: 240 },
    ];

    const columns2 = [
        { field: 'id', headerName: 'S. No', width: 90 },
        { field: 'name', headerName: 'Project Name', width: 180 },
        { field: 'owner', headerName: 'Owner', width: 180 },
        {
            field: 'githubLink',
            headerName: 'Project Link',
            width: 540,
            renderCell: (params) => (
                <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ color: "cyan" }}>
                    {params.value}
                </a>
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Issue Date',
            width: 180,
            renderCell: (params) => {
                const date = new Date(params.value);
                const formattedDate = date.toLocaleDateString();
                return formattedDate;
            }
        },
        { field: 'email', headerName: 'Email', width: 300 },
        { field: 'typeProject', headerName: 'Project Category', width: 240 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.id)}
                >
                    Delete
                </Button>
            ),
        },

    ];

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`http://localhost:8080/projects/delete/${id}`, { withCredentials: true });
                setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
                setMyProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
                alert('Project deleted successfully!');
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project. Please try again.');
            }
        }
    };

    const googleauthfunc = () => {
        window.location.href = 'http://localhost:8080/profile/auth/google'; // Ensure this matches your backend URL
    };

    const goToAddProject = async () => {
        const isLoggedIn = user !== null; // Check if user state is not null
        if (isLoggedIn) {
            window.location.href = "/add-project";
        } else {
            googleauthfunc();
        }
    };

    const logoutFunc = async () => {
        try {
            await axios.get('http://localhost:8080/profile/logout', { withCredentials: true });
            setUser(null); // Reset user state
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", px: 3 }}>
                {user ? (
                    <>
                        <Button variant="contained" sx={{ my: 3 }}>
                            Hi {user.firstname}
                        </Button>
                        <Button onClick={logoutFunc} variant="contained" sx={{ my: 3, ml: 2 }}>
                            Logout
                        </Button>
                    </>

                ) : (
                    <>
                        <Button onClick={googleauthfunc} variant="contained" sx={{ marginTop: 3 }}>
                            <GoogleIcon sx={{ padding: "0 0.4rem 0 0" }} />
                            Sign In with Google
                        </Button>
                    </>
                )}
            </Box>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" component="h4">
                        ABANDONED PROJECTS
                    </Typography>
                    <Button variant="contained" color="primary" onClick={goToAddProject}>
                        + ADD PROJECT
                    </Button>
                </Stack>
                {user ? (
                    <>
                        <Typography variant="h6" component="h6">
                            My Projects
                        </Typography>
                        <DataGrid
                            rows={myProjects}
                            columns={columns2}
                            autoHeight
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10 },
                                },
                            }}
                            pageSizeOptions={[10]}
                            slots={{ toolbar: GridToolbar }}
                            sx={{
                                '& .MuiDataGrid-cell': {
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: theme.palette.background.paper,
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    backgroundColor: theme.palette.background.paper,
                                },
                                '& .MuiButton-root': {
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiDataGrid-toolbarContainer': {
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiSvgIcon-root': {
                                    color: theme.palette.text.primary,
                                },
                                marginBottom: "2rem",
                            }}
                        />
                        <Typography variant="h6" component="h6">
                            All Projects
                        </Typography>
                        <DataGrid
                            rows={projects}
                            columns={columns}
                            autoHeight
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10 },
                                },
                            }}
                            pageSizeOptions={[10]}
                            slots={{ toolbar: GridToolbar }}
                            sx={{
                                '& .MuiDataGrid-cell': {
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: theme.palette.background.paper,
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    backgroundColor: theme.palette.background.paper,
                                },
                                '& .MuiButton-root': {
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiDataGrid-toolbarContainer': {
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiSvgIcon-root': {
                                    color: theme.palette.text.primary,
                                },
                            }}
                        />
                    </>

                ) : (
                    <>
                        <Typography variant="h6" component="h6">
                            All Projects
                        </Typography>
                        <DataGrid
                            rows={projects}
                            columns={columns}
                            autoHeight
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10 },
                                },
                            }}
                            pageSizeOptions={[10]}
                            slots={{ toolbar: GridToolbar }}
                            sx={{
                                '& .MuiDataGrid-cell': {
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: theme.palette.background.paper,
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    backgroundColor: theme.palette.background.paper,
                                },
                                '& .MuiButton-root': {
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiDataGrid-toolbarContainer': {
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiSvgIcon-root': {
                                    color: theme.palette.text.primary,
                                },
                            }}
                        />
                    </>
                )}

            </Box>
        </>
    );
};

export default Body;
