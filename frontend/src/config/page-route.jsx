import React from "react";
import Home from "./../pages/Home.js";
import Reportes from "./../pages/Reportes.js";
import Cuentahabientes from "./../pages/Cuentahabientes.js";
import InstitucionesFinancieras from "./../pages/InstitucionesFinancieras.js";

const routes = [
  {
    path: "/",
    exact: true,
    title: "Home",
    component: () => <Home />,
  },
  {
    path: "/cuentahabientes",
    exact: true,
    title: "Cuentahabientes",
    component: () => <Cuentahabientes />,
  },
  {
    path: "/instituciones",
    exact: true,
    title: "Instituciones Financieras",
    component: () => <InstitucionesFinancieras />,
  },
  {
    path: "/reportes",
    exact: true,
    title: "Reportes",
    component: () => <Reportes />,
  },
];

export default routes;
