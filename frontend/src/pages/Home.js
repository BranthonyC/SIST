import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Panel, PanelHeader, PanelBody } from "./../components/panel/panel.jsx";

class Home extends React.Component {
  state = {
    persons: [],
  };

  componentDidMount() {
    axios.get("http://localhost:5000/api/institucion/list").then((res) => {
      const persons = res.data;
      this.setState({ persons: JSON.parse(persons.payload) });
    });
  }

  crearNuevaEntidadFinanciera(e) {
    e.preventDefault();
    const formEntries = new FormData(e.target);
    console.log(e.target);
    console.log(formEntries);
  }

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
          <PanelBody>
            <ul>
              {this.state.persons.length > 0 ? (
                this.state.persons.map((person) => (
                  <li key={`${person.abreviacion}`}>{person.nombre}</li>
                ))
              ) : (
                <h1>Cargando...</h1>
              )}
            </ul>
          </PanelBody>
        </Panel>
        <Panel>
          <PanelHeader>Crear una nueva entidad</PanelHeader>
          <PanelBody>
            <form onSubmit={this.crearNuevaEntidadFinanciera}>
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Nombre</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Nombre de la entidad bancaria"
                    name="nombre"
                  />
                  <small className="f-s-12 text-grey-darker">
                    Nombre de la entidad financiera
                  </small>
                </div>
              </div>
              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Abreviatura</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Introduce una abreviatura"
                    name="abreviacion"
                  />
                  <small className="f-s-12 text-grey-darker">
                    Abreviatura de la entidad bancaria
                  </small>
                </div>
              </div>
              {/* End */}
              <button className="btn btn-reddit">
                Registrar nueva entidad financiera
              </button>
            </form>
          </PanelBody>
        </Panel>
      </div>
    );
  }
}

export default Home;
