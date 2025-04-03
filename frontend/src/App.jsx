import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import { Login } from './components/auth/Login'
import { Signup } from './components/auth/Signup'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobsDescription from './components/JobsDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'

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
    path: '/jobs',
    element: <Jobs/>
  },
  {
    path: '/description/:id',
    element: <JobsDescription />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  {
    path: '/profile',
    element: <Profile />
  },

  // for admin
  {
    path:"/admin/companies",
    element: <Companies/>
  },
  {
    path:"/admin/companies/create",
    element: <CompanyCreate/>
  },
])
function App() {

  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App
