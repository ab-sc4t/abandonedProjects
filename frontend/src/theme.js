import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6200ea',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#FAFAFA', // Very Light Gray for good contrast
            secondary: '#455A64', // Medium Blue Gray for contrast
        },
        success: {
            main: '#81C784', // Light Green
            contrastText: '#455A64', // Medium Blue Gray text on light green background
        },
        info: {
            main: '#42A5F5', // Moderate Blue
            contrastText: '#FAFAFA', // Very Light Gray text on blue background
        },
        warning: {
            main: '#FFB74D', // Light Orange
            contrastText: '#455A64', // Medium Blue Gray text on orange background
        },
        error: {
            main: '#E57373', // Moderate Red
            contrastText: '#FAFAFA', // Very Light Gray text on red background
        },
        secondary: {
            main: '#BA68C8', // Moderate Purple
            contrastText: '#FAFAFA', // Very Light Gray text on purple background
        },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #333',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                h4: {
                    color: '#fff',
                },
            },
        },
    },
})

export default theme
