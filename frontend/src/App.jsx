import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'
import Library from './pages/Library'
import './index.css';
import Admin from './pages/Admin';
import Student from './pages/Student';
import Instructor from './pages/Instructor';
import Home from './components/Home';
import Feedback from './pages/FeedbackForm';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <div className='App'>
        {/* <Header /> */}

        <main>
          <Routes>
            <Route path = "/" element = { <Home/>} / > 
            <Route path="/login" element={ <Login /> } />
            <Route path="/student-dashboard" element={<ProtectedRoute><Student /></ProtectedRoute>} />
            <Route path="/instructor-dashboard" element={<ProtectedRoute><Instructor /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path= "/library-section" element = { < Library />  } />
            <Route path= "/feedback" element = { <Feedback /> } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
