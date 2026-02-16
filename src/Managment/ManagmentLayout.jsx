import React from 'react'
import { Outlet } from 'react-router'
// import Sidebar from '../component/Sidebar'
import Layout from '../Managment/Layout'
export default function Layout() {
  return <>
    {/* <Sidebar /> */}
    <div >
        <Layout/>
  <Outlet/>
    </div>
  
 </>
}
