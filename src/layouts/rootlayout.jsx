import React from 'react';
import { Outlet } from "react-router";
import Footer from '../pages/shared/footer/footer';
import Header from '../pages/shared/header/header';
import Home from '../pages/home/home/Home';


const rootlayout = () => {
    return (
        <div>
            <Header></Header>
        
            <Home></Home>
            <Footer></Footer>
        </div>
    );
};

export default rootlayout;