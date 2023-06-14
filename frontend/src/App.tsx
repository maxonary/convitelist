import React from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { RequireAuth } from "react-auth-kit";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<RequireAuth loginPath="/login"><Dashboard /></RequireAuth>}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;