import React from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import WithAuth from "./hoc/WithAuth";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const AuthenticatedDashboard = WithAuth(Dashboard);

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/admin/dashboard" element={<AuthenticatedDashboard />}></Route>
        <Route path="/admin/login" element={<Login />}></Route>
        <Route path="/admin/register" element={<Register />}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;