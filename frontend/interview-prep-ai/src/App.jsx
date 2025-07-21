import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Auth/Login"
import SignUp from './pages/Auth/SignUp';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Home/Dashboard';
import InterviewPrep from './pages/InterviewPrep/InterviewPrep';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>

          <Route path="/login" element={<Login />}></Route>
          <Route path="/signUp" element={<SignUp />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/interview-prep/:sessionId" element={<InterviewPrep />}></Route>
        </Routes>
      </Router>

      <Toaster
      toastOptions={{
        className: "",
        style: {
          fontSize: "13px",
        },
      }}
      />
    </div>
  )
}

export default App