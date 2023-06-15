import React from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
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
        <Route path="/" element={<AuthenticatedDashboard />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;