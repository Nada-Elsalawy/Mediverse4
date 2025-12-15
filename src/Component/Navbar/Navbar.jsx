import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@heroui/react";
import logo from "../../assets/img/WhatsApp Image 2025-10-28 at 8.26.50 PM.jpeg"
import { NavLink, useNavigate } from "react-router-dom";


export default function App() {
  const navigate = useNavigate();
  return (
    <Navbar className="bg-gray-50">
      <NavbarBrand>
       <img onClick={()=> navigate("")} src={logo} className="w-[30%] cursor-pointer active"  alt="" />
       
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4 " justify="center">
        <NavbarItem>
          <NavLink color="foreground" to={"/"}>
           Home
          </NavLink>
        </NavbarItem>
        <NavbarItem >
          <NavLink  to={"/Register"}>
            Register
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink color="foreground" to={"/chatbot"}>
           ChatBot
          </NavLink>
        </NavbarItem>
        
          
      </NavbarContent>
      
    </Navbar>
  );
}
