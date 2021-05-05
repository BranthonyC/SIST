import React from "react";
import Home from "./../pages/Home.js";
import Reportes from "./../pages/Reportes.js";
import Cuentahabientes from "./../pages/Cuentahabientes.js";
import InstitucionesFinancieras from "./../pages/InstitucionesFinancieras.js";
import Login from "./../pages/Login.js";
import NuevaTransferencia from "./../pages/NuevaTransferencia.js";

const routes = [
  {
    path: "/",
    exact: true,
    title: "Login",
    component: () => <Login />,
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
    path: "/dashboard",
    exact: true,
    title: "Reportes",
    component: () => <Reportes />,
  },
  {
    path: "/nuevatransferencia",
    exact: true,
    title: "Nueva Transferencia",
    component: () => <NuevaTransferencia />,
  },
];

export default routes;
