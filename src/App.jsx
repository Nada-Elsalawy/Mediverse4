import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from "../src/Pages/Register/Register"
import AuthLayOut from '../src/Layout/AuthLayOut'
import Home from '../src/Pages/Home/Home'
import FormPage from "../src/Pages/Form/FormPage"
import PatientDashboard from "../src/Pages/DashBoard/PatientDashboard"
import Reports from "../src/Pages/Reborts/Reborts"
import PatientReports from "../src/Pages/PationRports/PatientReports"

  import MainLayOut from "../src/Layout/MainLayOut"
// import ProtectedRoute from '../src/protectedRoutes/ProtectedRoute'
import ChatBot from './Pages/ChatBot/ChatBot'
import ProtectedRoute from './protectedRoutes/ProtectedRoute'
const router = createBrowserRouter([
{
  path:"" ,element: <AuthLayOut/>,children:[
  {path:"register" , element:<Register/>},/* login*/
  {path:"FormPage" , element: <FormPage/>},/* signUp*/
  ]}
,
  {path:"",element: <MainLayOut/>,children:[
    {index:true, element:<Home />},
   {path:"patient-Details" , element:<ProtectedRoute><PatientDashboard /></ProtectedRoute> },
  {path:"Reports" , element: <ProtectedRoute><Reports /></ProtectedRoute>  },
{path:"Patient-Reports" , element: <ProtectedRoute><PatientReports /> </ProtectedRoute> },
{path :"chatBot" , element:<ChatBot/>}]
  }
  ])

 
export default function App() {
  return <>
  <RouterProvider router ={router}></RouterProvider>

  </>
}
