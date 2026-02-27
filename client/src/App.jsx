import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import CompanyDashboard from './pages/dashboard/CompanyDashboard';
import ProfileSettings from './pages/dashboard/ProfileSettings';
import JobBoard from './pages/dashboard/JobBoard';
import MyApplications from './pages/dashboard/MyApplications';
import CareerAccelerator from './pages/dashboard/CareerAccelerator';
import ResumeIntelligence from './pages/dashboard/ResumeIntelligence';
import AdminJobs from './pages/dashboard/AdminJobs';
import ManageStudents from './pages/dashboard/ManageStudents';
import CompaniesPage from './pages/CompaniesPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          
          {/* Protected Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<ProfileSettings />} />
          <Route path="/student/jobs" element={<JobBoard />} />
          <Route path="/student/applications" element={<MyApplications />} />
          <Route path="/student/accelerator" element={<CareerAccelerator />} />
          <Route path="/student/resume" element={<ResumeIntelligence />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<ManageStudents />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/company" element={<CompanyDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
