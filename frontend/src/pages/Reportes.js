import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Panel, PanelHeader, PanelBody } from "../components/panel/panel.jsx";

class Home extends React.Component {
  state = {
    operaciones_por_cuentahabiente: [],
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

  obtenerOperacionesPorCuentahabiente = (e) => {
    e.preventDefault();
    // let { operaciones_por_cuentahabiente } = this.state;
    let inputs = e.target.getElementsByTagName("input");
    let data = {
      cui: inputs[0].value,
      nombre: inputs[1].value,
      apellido: inputs[2].value,
    };
    // operaciones_por_cuentahabiente.push(data);
    // this.setState({ operaciones_por_cuentahabiente: operaciones_por_cuentahabiente });
    axios
      .post(
        "http://localhost:5000/api/reportes/cuentahabiente/operaciones/",
        data
      )
      .then(
        (res) => {
          const operaciones_por_cuentahabiente = res.data;
          // operaciones_por_cuentahabiente.push(response.data.payload);
          // this.setState({
          //   operaciones_por_cuentahabiente: operaciones_por_cuentahabiente,
          // });

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
                this.state.operaciones_por_cuentahabiente.map((operacion) => (
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
                ))
              ) : (
                <h1>Sin operaciones</h1>
              )}
            </table>
          </PanelBody>
        </Panel>
        <Panel>
          <PanelHeader>Movimientos por Cuentahabiente por mes</PanelHeader>
          <PanelBody>
            <p>Reporte</p>
          </PanelBody>
        </Panel>

        {/* Inicio de Cuenta habientes */}
        <hr />
        <Panel>
          <PanelHeader>Totales debitos por insitución financiera</PanelHeader>
          <PanelBody>
            <p>Reporte</p>
          </PanelBody>
        </Panel>
        {/* Final de Cuenta habientes */}

        {/* begin creación de cuentahabientes */}
        <Panel>
          <PanelHeader>Total de creditos por entidad financiera</PanelHeader>
          <PanelBody>
            <p>Reporte</p>
          </PanelBody>
        </Panel>
        {/* end creación de cuentahabientes */}
      </div>
    );
  }
}

export default Home;
