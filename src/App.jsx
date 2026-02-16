// import React from 'react'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Register from "../src/Pages/Register/Register"
// import AuthLayOut from '../src/Layout/AuthLayOut'
// import Home from '../src/Pages/Home/Home'
// import FormPage from "../src/Pages/Form/FormPage"
// import PatientDashboard from "../src/Pages/DashBoard/PatientDashboard"
// import Reports from "../src/Pages/Reborts/Reborts"
// import PatientReports from "../src/Pages/PationRports/PatientReports"

//   import MainLayOut from "../src/Layout/MainLayOut"
// // import ProtectedRoute from '../src/protectedRoutes/ProtectedRoute'
// import ChatBot from './Pages/ChatBot/ChatBot'
// import ProtectedRoute from './protectedRoutes/ProtectedRoute'
// import DrLayout from './Layout/DrLayout'

// import LoginDr from '../src/Dr/pages/LoginDr'
// import Wating from '../src/Dr/pages/Wating'
// import Doctor from '../src/Dr/pages/Doctor'
// import Managment from '../src/Dr/pages/Managment'
// import DoctorsManagement from "../src/Managment/DoctorsManagement"
// import MediVerseDashboard from "../src/Managment/MediVerseDashboard"
// import ManagmetLayout from "../src/Managment/Layout"
// const router = createBrowserRouter([
// {
//   path:"" ,element: <AuthLayOut/>,children:[
//   {path:"register" , element:<Register/>},/* login*/
//   {path:"FormPage" , element: <FormPage/>},/* signUp*/
//   ]}
// ,
//   {path:"",element: <MainLayOut/>,children:[
//     {index:true, element:<Home />},
//    {path:"patient-Details" , element:<ProtectedRoute><PatientDashboard /></ProtectedRoute> },
//   {path:"Reports" , element: <ProtectedRoute><Reports /></ProtectedRoute>  },
// {path:"Patient-Reports" , element: <ProtectedRoute><PatientReports /> </ProtectedRoute> },
// {path :"chatBot" , element:<ChatBot/>}],

//   }
//   ,
//    {path :'' , element: <DrLayout/>, children:[
//     // {index:true, element:<DrHome />},
// {path:"login",element:<LoginDr/>},
// {path:"managment",element:<Managment/>},
// {path:"wating",element:<Wating/>},
// {path:"dr",element:<Doctor/>},
//   ]},
   
//   {path :'' , element: <ManagmetLayout/>, children:[
   
// {path:"MediVerseDashboard",element:<MediVerseDashboard/>},
// {path:"doctors",element:<DoctorsManagement/>},

//   ]},

//   ])
  

 
// export default function App() {
//   return <>
//   <RouterProvider router ={router}></RouterProvider>

//   </>
// }




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
import ChatBot from './Pages/ChatBot/ChatBot'
import ProtectedRoute from './protectedRoutes/ProtectedRoute'
import DrLayout from './Layout/DrLayout'
import LoginDr from '../src/Dr/pages/LoginDr'
import WaitingQueue from '../src/Dr/pages/Wating' // الصفحة المحدثة
import Doctor from '../src/Dr/pages/Doctor'
import Managment from '../src/Dr/pages/Managment'
import DoctorsManagement from "../src/Managment/DoctorsManagement"
import MediVerseDashboard from "../src/Managment/MediVerseDashboard"
import ManagmetLayout from "../src/Managment/Layout"

const router = createBrowserRouter([
  {
    path: "",
    element: <AuthLayOut />,
    children: [
      { path: "register", element: <Register /> }, /* login */
      { path: "FormPage", element: <FormPage /> }, /* signUp */
    ]
  },
  {
    path: "",
    element: <MainLayOut />,
    children: [
      { index: true, element: <Home /> },
      { path: "patient-Details", element: <PatientDashboard />},
      { path: "Reports", element: <Reports /> },
      // { path: "Patient-Reports", element: <PatientReports /> },
      { path: "chatBot", element: <ChatBot /> }
    ]
  },
  {
    path: "",
    element: <DrLayout />,
    children: [
      { path: "login", element: <LoginDr /> },
      { path: "managment", element: <Managment /> },
      { path: "wating", element: <WaitingQueue /> }, // 🎯 صفحة الانتظار المحدثة
      { path: "dr", element: <Doctor /> }, // 🎯 صفحة الطبيب
    ]
  },
  {
    path: "",
    element: <ManagmetLayout />,
    children: [
      { path: "MediVerseDashboard", element: <MediVerseDashboard /> },
      { path: "doctors", element: <DoctorsManagement /> },
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router}></RouterProvider>
}
