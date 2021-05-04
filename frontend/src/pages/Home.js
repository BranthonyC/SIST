import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Panel, PanelHeader, PanelBody } from "./../components/panel/panel.jsx";

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

    axios.get("http://localhost:5000/api/cuentahabiente/list").then((res) => {
      const cuentahabientes = res.data;
      this.setState({
        cuentahabientes: JSON.parse(cuentahabientes.payload),
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
      },
      (error) => {
        console.log(error);
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
      },
      (error) => {
        console.log(error);
      }
    );
  };

  eliminarCuentahabiente = (cui) => {
    let { cuentahabientes } = this.state;
    let data = {
      cui: cui,
    };
    axios.post("http://localhost:5000/api/cuentahabiente/delete/", data).then(
      (response) => {
        cuentahabientes.pop(response.data.payload);
        this.setState({ cuentahabientes: cuentahabientes });
      },
      (error) => {
        console.log(error);
      }
    );
  };

  crearNuevoCuentahabiente = (e) => {
    e.preventDefault();
    let { cuentahabientes } = this.state;
    let inputs = e.target.getElementsByTagName("input");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    let data = {
      nombre: inputs[0].value,
      apellido: inputs[1].value,
      cui: inputs[2].value,
      genero: inputs[3].value,
      email: inputs[4].value,
      fecha_registro: today,
    };
    // instituciones_financieras.push(data);
    // this.setState({ instituciones_financieras: instituciones_financieras });
    axios.post("http://localhost:5000/api/cuentahabiente/create/", data).then(
      (response) => {
        cuentahabientes.push(response.data.payload);
        this.setState({ cuentahabientes: cuentahabientes });
      },
      (error) => {
        console.log(error);
      }
    );
  };

  render() {
    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/">Sistema SIST</Link>
          </li>
          <li className="breadcrumb-item active">Listar, Crear, Actualizar</li>
        </ol>
        <h1 className="page-header">
          Sistema SIST
          <br />
          <small>Sistema SIST para el proyecto final de Bases de Datos 2</small>
        </h1>
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

        {/* Inicio de Cuenta habientes */}
        <hr />
        <Panel>
          <PanelHeader>Cuentahabientes Existentes</PanelHeader>
          <PanelBody>
            <table className="w-100">
              <tr>
                <th>Cui</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>fecha_registro</th>
                <th>genero</th>
              </tr>
              {this.state.cuentahabientes.length > 0 ? (
                this.state.cuentahabientes.map((cuentahabiente) => (
                  <tr key={`${cuentahabiente.cui}`}>
                    <td>{cuentahabiente.cui}</td>
                    <td>{cuentahabiente.nombre}</td>
                    <td>{cuentahabiente.apellido}</td>
                    <td>{cuentahabiente.email}</td>
                    <td>{cuentahabiente.fecha_registro}</td>
                    <td>{cuentahabiente.genero}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={(e) => {
                          e.preventDefault();
                          this.eliminarCuentahabiente(cuentahabiente.cui);
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <h1>Cargando...</h1>
              )}
            </table>
          </PanelBody>
        </Panel>
        {/* Final de Cuenta habientes */}

        {/* begin creación de cuentahabientes */}
        <Panel>
          <PanelHeader>Crear una nueva entidad financiera</PanelHeader>
          <PanelBody>
            <form onSubmit={this.crearNuevoCuentahabiente}>
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Nombre</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Nombres"
                    name="nombre"
                  />
                </div>
              </div>
              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Apellido</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Apellidos"
                    name="apellido"
                  />
                </div>
              </div>
              {/* End */}

              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">CUI</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="3024998490103"
                    name="cui"
                  />
                </div>
              </div>
              {/* End */}

              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Genero</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Genero"
                    name="genero"
                  />
                </div>
              </div>
              {/* End */}

              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Email</label>
                <div className="col-md-9">
                  <input
                    type="email"
                    className="form-control m-b-5"
                    placeholder="branthonycc@gmail.com"
                    name="email"
                  />
                </div>
              </div>
              {/* End */}
              <button className="btn btn-reddit">
                Registrar Cuentahabiente
              </button>
            </form>
          </PanelBody>
        </Panel>
        {/* end creación de cuentahabientes */}
      </div>
    );
  }
}

export default Home;
