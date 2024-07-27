import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid'
import { Box, Button, Typography, IconButton, Chip, Stack } from '@mui/material'
import { useTheme, Theme } from '@mui/material/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import axios from "axios"

const Body = () => {
    const [projects, setProjects] = useState([]);
    const theme = useTheme();
    const fetchData = () => {
        axios.get(`http://localhost:8080/projects`)
            .then(function (res) {
                setProjects(res.data);
            })
            .catch(function (error) {
                console.log("Error fetching porjects", error);
            })
    }

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { field: 'id', headerName: '#', width: 90 },
        { field: 'name', headerName: 'Project Name', width: 180 },
        { field: 'owner', headerName: 'Owner', width: 180 },
        { field: 'githubLink', headerName: 'Github Link', width: 540 },
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

    const checkSession = async () => {
        try {
            const response = await axios.get('http://localhost:8080/profile/check-session', { withCredentials: true });
            console.log(response.data.message); 
            return response.data.loggedIn;
        } catch (error) {
            console.error('Error checking session:', error);
            return false;
        }
    };

    const goToLogin = async () => {
        const isLoggedIn = await checkSession();
        if (isLoggedIn) {
            window.location.href = "/your-profile";
        } else {
            window.location.href = "/login";
        }
    };

    // goToLogin = () =>{
    //     window.location.href = "/login";
    // }

    const goToAddProject = async () => {
        const isLoggedIn = await checkSession();
        if (isLoggedIn) {
            window.location.href = "/add-project";
        } else {
            // window.location.href = "/login";
            window.location.href = "/add-project";
        }
    }

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", px: 3 }}>
                <Button onClick={goToLogin}>
                    Profile
                </Button>
            </Box>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" component="h6">
                        ABONDONED PROJECTS
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
    )
}

export default Body;