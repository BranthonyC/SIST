import React from "react";
import { Link } from "react-router-dom";
import { Panel, PanelHeader, PanelBody } from "./../components/panel/panel.jsx";

class Home extends React.Component {
  render() {
    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/">Instituciones Bancarias</Link>
          </li>
          <li className="breadcrumb-item active">Listar, Crear, Actualizar</li>
        </ol>
        <h1 className="page-header">
          Instituciones Bancarias
          <br />
          <small>
            En general, las actividades de financiamiento de una institución
            bancaria conllevan varios tipos de préstamos, como financiamiento
            para empresas, vivienda, proyectos, minorista, financiamiento a
            corto plazo, pequeñas y medianas empresas, comercio y de otro tipo.
          </small>
        </h1>
        <Panel>
          <PanelHeader>Entidades Existentes</PanelHeader>
          <PanelBody>Panel Content Here</PanelBody>
        </Panel>
        <Panel>
          <PanelHeader>Crear una nueva entidad</PanelHeader>
          <PanelBody>Panel Content Here</PanelBody>
        </Panel>
      </div>
    );
  }
}

export default Home;
