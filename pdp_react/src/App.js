import React,{useEffect } from 'react';
import './App.css';
import PostList from './components/PostList';
import ArticleList from './components/articleList';
import AppLayout from './components/AppLayout.jsx';
import FindDoctor from './components/FindDoctor';
import DoctorProfile from './components/DoctorProfile';
import PatientsPage from './components/PatientSearchPage';
import DoctorLoginPage from './components/login_register/DoctorLoginPage';
import PatientLoginPage from './components/login_register/PatientLoginPage';
import PatientRegisterPage from './components/login_register/PatientRegisterPage';
import DoctorRegisterPage from './components/login_register/DoctorRegisterPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import axios from 'axios';

function App() {
  const { updateUser } = useUser();

  useEffect(() => {
      const fetchCurrentUser = async () => {
          try {
              const response = await axios.get('http://localhost:8000/api/user/', {
                  withCredentials: true 
              });
              if (response.status === 200) {
                  updateUser(response.data.user);
              } else {
                  console.log('未能获取用户信息');
              }
          } catch (error) {
              console.error('获取用户信息失败:', error);
          }
      };

      fetchCurrentUser();
  }, []);
  
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route exact path="/" element={<PatientLoginPage />} />
            <Route exact path="/doctor-register" element={<DoctorRegisterPage />} />
            <Route exact path="/doctor-login" element={<DoctorLoginPage />} />
            <Route exact path="/patient-register" element={<PatientRegisterPage />} />
            <Route exact path="/patient-login" element={<PatientLoginPage />} />
            <Route
              path="/page1"
              element={
                <AppLayout>
                  <PostList />
                </AppLayout>
              }
            />
            <Route
              path="/page2"
              element={
                <AppLayout>
                  <ArticleList />
                </AppLayout>
              }
            />
            <Route
              path="/find_doctors"
              element={
                <AppLayout>
                  <FindDoctor />
                </AppLayout>
              }
            />
            <Route
              path="/doctor/:doctorId"
              element={
                <AppLayout>
                  <DoctorProfile />
                </AppLayout>
              }
            />
            <Route
              path="/patients"
              element={
                <AppLayout>
                  <PatientsPage />
                </AppLayout>
              }
            />
        </Routes>
      </div>
    </Router>
  );
}

export default App;