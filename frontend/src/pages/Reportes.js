import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Panel, PanelHeader, PanelBody } from "../components/panel/panel.jsx";

class Home extends React.Component {
  state = {
    operaciones_por_cuentahabiente_mes: [],
    operaciones_por_cuentahabiente: [],
    cuentahabientes: [],
    total_creditos: [],
    total_debitos: [],
  };

  obtenerOperacionesPorCuentahabiente = (e) => {
    e.preventDefault();
    let inputs = e.target.getElementsByTagName("input");
    let data = {
      cui: inputs[0].value,
      nombre: inputs[1].value,
      apellido: inputs[2].value,
    };
    axios
      .post(
        "http://localhost:5000/api/reportes/cuentahabiente/operaciones/",
        data
      )
      .then(
        (res) => {
          const operaciones_por_cuentahabiente = res.data;
          this.setState({
            operaciones_por_cuentahabiente: JSON.parse(
              operaciones_por_cuentahabiente.payload
            ),
          });
        },
        (error) => {
          console.log(error);
        }
      );
  };

  obtenerTotalDeCreditosPorInstitucionBancaria = (e) => {
    e.preventDefault();
    let inputs = e.target.getElementsByTagName("input");
    let data = {
      nombre: inputs[0].value,
    };
    axios.post("http://localhost:5000/api/reportes/creditos/", data).then(
      (res) => {
        const total_creditos = res.data;
        this.setState({
          total_creditos: JSON.parse(total_creditos.payload),
        });
      },
      (error) => {
        console.log(error);
      }
    );
  };

  obtenerTotalDeDebitosPorInstitucionBancaria = (e) => {
    e.preventDefault();
    let inputs = e.target.getElementsByTagName("input");
    let data = {
      nombre: inputs[0].value,
    };
    axios.post("http://localhost:5000/api/reportes/debitos/", data).then(
      (res) => {
        const total_debitos = res.data;
        this.setState({
          total_debitos: JSON.parse(total_debitos.payload),
        });
      },
      (error) => {
        console.log(error);
      }
    );
  };

  obtenerOperacionesPorCuentaHabientePorMes = (e) => {
    e.preventDefault();
    console.log("POR MES!");
    let inputs = e.target.getElementsByTagName("input");
    let data = {
      cui: inputs[0].value,
      nombre: inputs[1].value,
      apellido: inputs[2].value,
      mes: inputs[3].value,
      anio: inputs[4].value,
    };
    axios
      .post(
        "http://localhost:5000/api/reportes/cuentahabiente/operaciones/mes/",
        data
      )
      .then(
        (res) => {
          const operaciones_por_cuentahabiente_mes = res.data;
          this.setState({
            operaciones_por_cuentahabiente_mes: JSON.parse(
              operaciones_por_cuentahabiente_mes.payload
            ),
          });
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
            <Link to="/">Sistema SIST Reportes</Link>
          </li>
          <li className="breadcrumb-item active">Listar, Crear, Actualizar</li>
        </ol>
        <h1 className="page-header">
          Sistema SIST Reportes
          <br />
          <small>Sistema SIST para el proyecto final de Bases de Datos 2</small>
        </h1>
        <Panel>
          <PanelHeader>Operaciones por Cuentahabiente</PanelHeader>
          <PanelBody>
            <form onSubmit={this.obtenerOperacionesPorCuentahabiente}>
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
              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Nombre</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Nombre"
                    name="nombre"
                  />
                </div>
              </div>
              {/* End */}
              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Apellido</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Apellido"
                    name="apellido"
                  />
                </div>
              </div>
              {/* End */}
              <button className="btn btn-reddit">Consultar operaciones</button>
            </form>
            {this.state.operaciones_por_cuentahabiente.length > 0 ? (
              <React.Fragment>
                {" "}
                <table className="w-100">
                  <tr>
                    <th>Cui</th>
                    <th>Fecha operación</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Institución</th>
                    <th>Tipo de cuenta</th>
                    <th>Monto Transferido</th>
                  </tr>
                  {this.state.operaciones_por_cuentahabiente.length > 0 ? (
                    this.state.operaciones_por_cuentahabiente.map(
                      (operacion) => (
                        <tr key={`${operacion.fecha_operacion}`}>
                          <td>{operacion.cui}</td>
                          <td>{operacion.fecha_operacion}</td>
                          <td>{operacion.nombre}</td>
                          <td>{operacion.apellido}</td>
                          <td>{operacion.email}</td>
                          <td>{operacion.institucion_abr}</td>
                          <td>{operacion.tipo_cuenta}</td>
                          <td>{operacion.monto_transferido}</td>
                        </tr>
                      )
                    )
                  ) : (
                    <h1>Sin operaciones</h1>
                  )}
                </table>
              </React.Fragment>
            ) : (
              <React.Fragment></React.Fragment>
            )}
          </PanelBody>
        </Panel>
        {/* Operaciones por cuenta habiente por mes */}
        <Panel>
          <PanelHeader>Movimientos por Cuentahabiente por mes</PanelHeader>
          <PanelBody>
            <form onSubmit={this.obtenerOperacionesPorCuentaHabientePorMes}>
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
              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Nombre</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Nombre"
                    name="nombre"
                  />
                </div>
              </div>
              {/* End */}
              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Apellido</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Apellido"
                    name="apellido"
                  />
                </div>
              </div>
              {/* End */}
              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Mes</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Mes en numeros"
                    name="mes"
                  />
                </div>
              </div>
              {/* End */}
              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Año</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Año en numeros"
                    name="anio"
                  />
                </div>
              </div>
              {/* End */}
              <button className="btn btn-reddit">Consultar operaciones</button>
            </form>
            {this.state.operaciones_por_cuentahabiente_mes.length > 0 ? (
              <React.Fragment>
                <table className="w-100">
                  <tr>
                    <th>Cui</th>
                    <th>Fecha operación</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Institución</th>
                    <th>Tipo de cuenta</th>
                    <th>Monto Transferido</th>
                  </tr>
                  {this.state.operaciones_por_cuentahabiente_mes.length > 0 ? (
                    this.state.operaciones_por_cuentahabiente_mes.map(
                      (operacion) => (
                        <tr key={`${operacion.fecha_operacion}`}>
                          <td>{operacion.cui}</td>
                          <td>{operacion.fecha_operacion}</td>
                          <td>{operacion.nombre}</td>
                          <td>{operacion.apellido}</td>
                          <td>{operacion.email}</td>
                          <td>{operacion.institucion_abr}</td>
                          <td>{operacion.tipo_cuenta}</td>
                          <td>{operacion.monto_transferido}</td>
                        </tr>
                      )
                    )
                  ) : (
                    <h1>Sin operaciones</h1>
                  )}
                </table>
              </React.Fragment>
            ) : (
              <React.Fragment></React.Fragment>
            )}
          </PanelBody>
        </Panel>

        {/* Inicio de Cuenta habientes */}
        <hr />
        <Panel>
          <PanelHeader>Totales debitos por insitución financiera</PanelHeader>
          <PanelBody>
            <form onSubmit={this.obtenerTotalDeDebitosPorInstitucionBancaria}>
              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Nombre</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Nombre"
                    name="nombre"
                  />
                </div>
              </div>
              {/* End */}
              <button className="btn btn-reddit">Consultar operaciones</button>
            </form>
            {this.state.total_debitos.length > 0 ? (
              <React.Fragment>
                <table className="w-100">
                  <tr>
                    <th>Operacion</th>
                    <th>Monto Total</th>
                    <th>Total de operaciones</th>
                  </tr>
                  {this.state.total_debitos.length > 0 ? (
                    this.state.total_debitos.map((total) => (
                      <tr key={`${total.total_debitos}`}>
                        <td>Creditos</td>
                        <td>{total.total_debitos}</td>
                        <td>{total.total_operaciones}</td>
                      </tr>
                    ))
                  ) : (
                    <h1>Sin operaciones</h1>
                  )}
                </table>
              </React.Fragment>
            ) : (
              <React.Fragment></React.Fragment>
            )}
          </PanelBody>
        </Panel>
        {/* Final de Cuenta habientes */}

        {/* begin creación de cuentahabientes */}
        <Panel>
          <PanelHeader>Total de creditos por entidad financiera</PanelHeader>
          <PanelBody>
            <form onSubmit={this.obtenerTotalDeCreditosPorInstitucionBancaria}>
              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Nombre</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Nombre"
                    name="nombre"
                  />
                </div>
              </div>
              {/* End */}
              <button className="btn btn-reddit">Consultar operaciones</button>
            </form>
            {this.state.total_creditos.length > 0 ? (
              <React.Fragment>
                <table className="w-100">
                  <tr>
                    <th>Operacion</th>
                    <th>Monto Total</th>
                    <th>Total de operaciones</th>
                  </tr>
                  {this.state.total_creditos.length > 0 ? (
                    this.state.total_creditos.map((total) => (
                      <tr key={`${total.total_creditos}`}>
                        <td>Creditos</td>
                        <td>{total.total_creditos}</td>
                        <td>{total.total_operaciones}</td>
                      </tr>
                    ))
                  ) : (
                    <h1>Sin operaciones</h1>
                  )}
                </table>
              </React.Fragment>
            ) : (
              <React.Fragment></React.Fragment>
            )}
          </PanelBody>
        </Panel>
        {/* end creación de cuentahabientes */}
      </div>
    );
  }
}

export default Home;
