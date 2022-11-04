import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import Logout from "./Logout";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <Navbar/>
            <Search/>
            <Chats/>
            <Logout/>
        </div>
    )
}

export default Sidebar