import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Panel, PanelHeader, PanelBody } from "../components/panel/panel.jsx";

class Home extends React.Component {
  state = {
    instituciones_financieras: [],
    cuentahabientes: [],
  };

  componentDidMount() {
    axios.get("http://localhost:5000/api/institucion/list").then((res) => {
      const instituciones_financieras = res.data;
      this.setState({
        instituciones_financieras: JSON.parse(
          instituciones_financieras.payload
        ),
      });
    });
  }

  crearNuevaEntidadFinanciera = (e) => {
    e.preventDefault();
    let { instituciones_financieras } = this.state;
    let inputs = e.target.getElementsByTagName("input");
    let data = {
      nombre: inputs[0].value,
      abreviacion: inputs[1].value,
    };
    // instituciones_financieras.push(data);
    // this.setState({ instituciones_financieras: instituciones_financieras });
    axios.post("http://localhost:5000/api/institucion/create/", data).then(
      (response) => {
        instituciones_financieras.push(response.data.payload);
        this.setState({ instituciones_financieras: instituciones_financieras });
        alert("Institución registrada con exito");
      },
      (error) => {
        console.log(error);
        alert("Error al crear, intenta de nuevo más tarde.");
      }
    );
  };

  // deleteOnClick = (e, nombre, abreviacion) => {
  //   e.preventDefault();
  // };
  eliminarInstitucion = (nombre, abreviacion) => {
    console.log("Eliminar tal cosa");
    let { instituciones_financieras } = this.state;
    let data = {
      nombre: nombre,
      abreviacion: abreviacion,
    };
    axios.post("http://localhost:5000/api/institucion/delete/", data).then(
      (response) => {
        instituciones_financieras.pop(response.data.payload);
        this.setState({ instituciones_financieras: instituciones_financieras });
        alert("Eliminado con exito");
      },
      (error) => {
        console.log(error);
        alert("Intenta de nuevo más tarde");
      }
    );
  };

  render() {
    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/">Sistema SIST </Link>
          </li>
          <li className="breadcrumb-item active">Listar, Crear, Actualizar</li>
        </ol>
        <h1 className="page-header">
          Sistema SIST | Institucion Financiera
          <br />
          <small>Sistema SIST para el proyecto final de Bases de Datos 2</small>
        </h1>
        <Panel>
          <PanelHeader>Crear una nueva entidad financiera</PanelHeader>
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

        <hr />
        <Panel>
          <PanelHeader>Entidades Financieras Existentes</PanelHeader>
          <PanelBody>
            <table className="w-100">
              <tr>
                <th>Nombre</th>
                <th>Abreviación</th>
                <th>Acciones</th>
              </tr>
              {this.state.instituciones_financieras.length > 0 ? (
                this.state.instituciones_financieras.map(
                  (institucion_financiera) => (
                    <tr key={`${institucion_financiera.abreviacion}`}>
                      <td>{institucion_financiera.nombre}</td>
                      <td>{institucion_financiera.abreviacion}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={(e) => {
                            e.preventDefault();
                            this.eliminarInstitucion(
                              institucion_financiera.nombre,
                              institucion_financiera.abreviacion
                            );
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <h1>Cargando...</h1>
              )}
            </table>
          </PanelBody>
        </Panel>
      </div>
    );
  }
}

export default Home;
