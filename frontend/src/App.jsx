import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminJobs from "./components/admin/AdminJobs"
import Applicants from './components/admin/Applicants'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import CompanyDetails from './components/admin/CompanyDetails'
import PostJob from './components/admin/PostJob'
import JobEdit from './components/admin/JobEdit'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AnalyticsDashboard from './components/admin/AnalyticsDashboard'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import AboutUs from './components/AboutUs'
import Browse from './components/Browse'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobDescription from './components/JobsDescription'
import { BackGroundLayout } from './components/Layouts/BackgroudLayout'
import Profile from './components/Profile'
import { ThemeProvider } from 'next-themes'
import './App.css'
import AllApplicants from './components/admin/AllApplicants'


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/about",
    element: <AboutUs />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  // admin ke liye yha se start hoga
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/details/:id",
    element:<ProtectedRoute><CompanyDetails/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/edit",
    element:<ProtectedRoute><JobEdit/></ProtectedRoute> 
  },
  {
    path:"/admin/analytics",
    element:<ProtectedRoute><AnalyticsDashboard/></ProtectedRoute> 
  },
  {
    path:"/admin/all-applicants",
    element:<ProtectedRoute><AllApplicants/></ProtectedRoute> 
  },
  {
    path: '/background',
    element: <BackGroundLayout />
  }

])

function App() {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <div className="dark">
        <BackGroundLayout>
          <RouterProvider router={appRouter} />
        </BackGroundLayout>
      </div>
    </ThemeProvider>
  )
}

export default App