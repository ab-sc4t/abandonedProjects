import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from "axios";

const Body = () => {
    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState(null); // Add state for user
    const theme = useTheme();

    useEffect(() => {
        // Fetch projects
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/projects`);
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects", error);
            }
        };

        // Check session and user details
        const checkUser = async () => {
            try {
                console.log("HELLOOOOOOOO");
                const sessionResponse = await axios.get('http://localhost:8080/profile/check-session', { withCredentials: true });
                if (sessionResponse.data.loggedIn) {
                    console.log("SESSIONNNN");
                    const userResponse = await axios.get('http://localhost:8080/profile/user', { withCredentials: true });
                    setUser(userResponse.data);
                }
            } catch (error) {
                console.log("Error")
                console.error('Error checking session:', error);
            }
        };

        fetchProjects();
        checkUser();
    }, []);

    const columns = [
        { field: 'id', headerName: '#', width: 90 },
        { field: 'name', headerName: 'Project Name', width: 180 },
        { field: 'owner', headerName: 'Owner', width: 180 },
        {
            field: 'githubLink',
            headerName: 'Github Link',
            width: 540,
            renderCell: (params) => (
                <a href={params.value} target="_blank" rel="noopener noreferrer">
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
    ];
    

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
                    <Button onClick={googleauthfunc} variant="contained" sx={{ my: 3 }}>
                        Sign In with Google
                    </Button>
                )}
            </Box>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" component="h6">
                        ABANDONED PROJECTS
                    </Typography>
                    <Button variant="contained" color="primary" onClick={goToAddProject}>
                        + ADD PROJECT
                    </Button>
                </Stack>
                <DataGrid
                    rows={projects}
                    columns={columns}
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
            </Box>
        </>
    );
};

export default Body;
