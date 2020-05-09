import React from 'react';
import { Route, HashRouter } from "react-router-dom";
import './App.css';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import Navbar from './components/Navbar';

function App() {
    return (
        <HashRouter>
            <div>
                <Navbar />
                <div className="content">
                    <Route exact path="/" component={Home}/>
                    <Route path="/dashboard" component={Dashboard}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/signup" component={SignUp}/>
                </div>
            </div>
        </HashRouter>
    );
}

export default App;
