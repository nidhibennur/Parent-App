import React from 'react';
import { Outlet } from "react-router";
import Footer from '../pages/shared/footer/footer';
import Header from '../pages/shared/header/header';
import Home from '../pages/home/home/Home';
import QuickActionSidebar from '../pages/Chat card/Chat_Card/QuickActionSidebar';


const rootlayout = () => {
    return (
        <div>
            <Header></Header>
            <Outlet></Outlet>
           
            <Footer></Footer>
        </div>
    );
};

export default rootlayout;