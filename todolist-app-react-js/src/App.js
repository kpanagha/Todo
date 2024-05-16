// import React from 'react';
import './App.css';
import { TodoWrapper } from './components/TodoWrapper';
import Login from './Login/Login';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from './Register/Register';
import Otp from './Otp/Otp';
import mixpanel from 'mixpanel-browser';

mixpanel.init('5ab560bcf67fd7ea0967d3fe88ce79d8');

// A component to handle redirection based on the presence of userId in session storage
// const ProtectedRoute = ({ children }) => {
//   const userId = sessionStorage.getItem('userId');
//   return userId ? children : <Navigate to="/login" />;
// };

// Main App component
function App() {
     const isAuthenticated =localStorage.getItem('id'); // Check if user ID exists in session storage
 console.log(isAuthenticated);
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={isAuthenticated ? <TodoWrapper /> : <Login />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/todo" element={<TodoWrapper/>}  />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;