import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Body from "./components/Body"
import { CssBaseline, ThemeProvider, Box } from '@mui/material'
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import AddProject from './pages/AddProject';
import YourProfile from "./pages/YourProfile"
import theme from './theme'


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route exact path="/" element={<Body />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/your-profile" element={<YourProfile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
