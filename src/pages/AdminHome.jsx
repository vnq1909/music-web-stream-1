import React, { useContext, useState, useEffect } from "react";
import { SidebarContext } from "../Context/SibebarContext";
import bg from "../assets/bg3.png";
import '../utils/style.css'
import { Link } from "react-router-dom";

const AdminHome = () => {
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  useEffect(() => {
    if (showMenu) setShowMenu(false);
  }, []);

  const token = localStorage.getItem("access_token") || null;
  
  return (
    <div
      className="w-full min-h-screen flex justify-center items-center flex-col"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col justify-center items-center space-y-3 bg-[rgba(0,0,0,0.2)] w-full h-screen -mt-40 lg:-mt-20">
        <h1 className="text-3xl lg:text-5xl text-white font-bold hero-enter-active">Admin Dashboard</h1>
        <p className="text-white text-xl lg:text-3xl">Manage your music streaming platform</p>
        <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5">
          <Link to={'/upload'} className="bg-lime-300 w-32 py-1 rounded-md flex justify-center text-[#461e74]">Upload</Link>
          <Link to={'/explore'} className="bg-lime-300 w-32 py-1 rounded-md flex justify-center text-[#461e74]">Stream</Link>
          <Link to={'/manage-users'} className="bg-red-500 w-32 py-1 rounded-md flex justify-center text-white">Users</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome; 