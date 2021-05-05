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
    instituciones_financieras: [],
    cuentahabientes: [],
    operacionesxcuentahbiente: { cui: "", nombre: "", apellido: "" },
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

  obtenerOperacionesPorCuentahabiente = (e) => {
    e.preventDefault();
    let inputs = e.target.getElementsByTagName("input");
    let data = {
      cui: inputs[0].value,
      nombre: inputs[1].value,
      apellido: inputs[2].value,
    };

    console.log("Consultadndo datos de");
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
    let inputs = e.target.getElementsByTagName("select");
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
    let inputs = e.target.getElementsByTagName("select");
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

  handleOnChangeOperacionesPorCuentahabiente = (e) => {
    e.preventDefault();
    let searched_cui = e.target.value;
    let result = this.state.cuentahabientes.filter(function (el) {
      return el.cui == searched_cui;
    });
    if (result.length > 0) {
      let nombre = result[0].nombre;
      let apellido = result[0].apellido;
      let cui = result[0].cui;
      let data = { nombre: nombre, apellido: apellido, cui: cui };

      // console.log(nombre, apellido, cui);
      this.setState({
        operacionesxcuentahbiente: { ...data },
      });
    }
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
              {/* Begin testing with dataset */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">CUI</label>
                <input
                  list="CUIS"
                  name="cui"
                  className="form-control m-b-5"
                  id="cui"
                  onChange={this.handleOnChangeOperacionesPorCuentahabiente}
                />
                <datalist id="CUIS">
                  {this.state.cuentahabientes.map((cuentahabiente) => (
                    <option value={`${cuentahabiente.cui}`} />
                  ))}
                </datalist>
              </div>
              {/* End testing with dataset */}
              {/* <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">CUI</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="3024998490103"
                    name="cui"
                    value={this.state.operacionesxcuentahbiente.cui}
                  />
                </div>
              </div> */}
              {/* <!--Begin--> */}
              <div className="form-group row m-b-15">
                <label className="col-form-label col-md-3">Nombre</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Nombre"
                    name="nombre"
                    value={this.state.operacionesxcuentahbiente.nombre}
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
                    value={this.state.operacionesxcuentahbiente.apellido}
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
                  <select
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Nombre"
                    name="nombre"
                  >
                    <option value="">--Please choose an option--</option>
                    {this.state.instituciones_financieras.map((institucion) => (
                      <option value={`${institucion.nombre}`}>
                        {institucion.nombre}
                      </option>
                    ))}
                  </select>
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
                  {/* <input
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Nombre"
                    name="nombre"
                  /> */}
                  <select
                    type="text"
                    className="form-control m-b-5"
                    placeholder="Nombre"
                    name="nombre"
                  >
                    <option value="">--Please choose an option--</option>
                    {this.state.instituciones_financieras.map((institucion) => (
                      <option value={`${institucion.nombre}`}>
                        {institucion.nombre}
                      </option>
                    ))}
                  </select>
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
