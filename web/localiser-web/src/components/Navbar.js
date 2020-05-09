import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import './Navbar.css';

export default class Menu extends Component {
    render() {
        return (
            <div className="Navbar">
                <h1><NavLink to="/">Localiser</NavLink></h1>
                <div className="Navlinks">
                    <ul>
                        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                        <li><NavLink to="/login">Login</NavLink></li>
                        <li><NavLink to="/signup">Sign Up</NavLink></li>
                    </ul>
                </div>
            </div>
        );
    }
}
