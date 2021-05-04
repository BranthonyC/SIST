import React from "react";
import Home from "./../pages/Home.js";
import Reportes from "./../pages/Reportes.js";

const routes = [
  {
    path: "/",
    exact: true,
    title: "Home",
    component: () => <Home />,
  },
  {
    path: "/reportes",
    exact: true,
    title: "Reportes",
    component: () => <Reportes />,
  },
];

export default routes;
