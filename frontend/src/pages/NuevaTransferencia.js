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
    cuenta_origen: {
      cui: "",
      nombre: "",
      apellido: "",
      tipo_cuenta: "",
      abreviacion: "",
    },
    cuenta_destino: {
      cui: "",
      nombre: "",
      apellido: "",
      tipo_cuenta: "",
      abreviacion: "",
    },
    saldo_disponible: 0.0,
    monto_transferido: 0.0,
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

  handleOnChangeCuiCuentaDestino = (e) => {
    e.preventDefault();
    console.log(e.target.value);
  };

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

  handleMontoATrasnferirChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCuentaOrigenChange = (e) => {
    e.preventDefault();
    this.setState(
      {
        cuenta_origen: {
          ...this.state.cuenta_origen,
          [e.target.name]: e.target.value,
        },
      },
      function () {
        console.log("Hacer una trasnferencia a ");
        console.log(this.state.cuenta_origen);
        if (this.state.cuenta_origen.tipo_cuenta) {
          axios
            .post(
              "http://localhost:5000/api/estado/cuenta/afavor/",
              this.state.cuenta_origen
            )
            .then((res) => {
              const saldo = res.data.payload;
              this.setState({ saldo_disponible: saldo });
              // console.log(JSON.parse(credito)[0].credito);
            });
        }
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
        cuenta_origen: { ...data },
      });
    } else {
      this.setState({
        cuenta_origen: { cui: searched_cui },
      });
    }
  };

  handleTipoCuentaOrigen = (e) => {
    e.preventDefault();
    let tipo_cuenta = e.target.value;
    if (
      tipo_cuenta === "Monetaria en $" ||
      tipo_cuenta === "Monetaria en Q" ||
      tipo_cuenta === "Ahorro"
    ) {
      console.log("Consultar el balance de cuenta de ");
      console.log(e.target.value);
    } else {
      console.log("Elige un tipo de cuenta valido");
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

  realizarTransferencia = (e) => {
    e.preventDefault();
    console.log(this.state.cuenta_origen);
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
          Sistema SIST | Transferencia Nueva
          <br />
          <small>Sistema SIST para el proyecto final de Bases de Datos 2</small>
        </h1>
        <Panel>
          <PanelHeader>Registrar Nueva Trasnferencia</PanelHeader>
          <PanelBody>
            <div className="row">
              <div className="col-12">
                <form onSubmit={this.realizarTransferencia}>
                  <div className="row">
                    <div className="col-5">
                      <h3>
                        Cuenta origen Saldo Disponible:{" "}
                        <strong className="text-primary">
                          {this.state.saldo_disponible}
                        </strong>
                      </h3>
                      {/* Begin testing with dataset */}
                      <div className="form-group row m-b-15">
                        <label className="col-form-label col-md-3">
                          CUI cuenta salida
                        </label>
                        <div className="col-md-9">
                          <input
                            list="CUIS"
                            name="cui"
                            className="form-control m-b-5"
                            id="cui"
                            placeholder="3024998490103"
                            onChange={
                              this.handleOnChangeOperacionesPorCuentahabiente
                            }
                            value={this.state.cuenta_origen.cui}
                          />
                          <datalist id="CUIS">
                            {this.state.cuentahabientes.map(
                              (cuentahabiente) => (
                                <option value={`${cuentahabiente.cui}`} />
                              )
                            )}
                          </datalist>
                        </div>
                      </div>
                      {/* <!--Begin--> */}
                      <div className="form-group row m-b-15">
                        <label className="col-form-label col-md-3">
                          Nombre
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control m-b-5"
                            placeholder="Nombre"
                            name="nombre"
                            value={this.state.cuenta_origen.nombre}
                          />
                        </div>
                      </div>
                      {/* End */}
                      {/* <!--Begin--> */}
                      <div className="form-group row m-b-15">
                        <label className="col-form-label col-md-3">
                          Apellido
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control m-b-5"
                            placeholder="Apellido"
                            name="apellido"
                            value={this.state.cuenta_origen.apellido}
                          />
                        </div>
                      </div>
                      {/* End */}
                      {/* <!--Begin--> */}
                      <div className="form-group row m-b-15">
                        <label className="col-form-label col-md-3">Banco</label>
                        <div className="col-md-9">
                          <input
                            list="tipo_cuentas"
                            name="abreviacion"
                            className="form-control m-b-5"
                            placeholder="G&T"
                            onChange={this.handleCuentaOrigenChange}
                            value={this.state.cuenta_origen.abreviacion}
                          />
                          <datalist id="tipo_cuentas">
                            {this.state.instituciones_financieras.map(
                              (banco) => (
                                <option value={`${banco.abreviacion}`} />
                              )
                            )}
                          </datalist>
                        </div>
                      </div>
                      {/* End */}
                      {/* <!--Begin--> */}
                      <div className="form-group row m-b-15">
                        <label className="col-form-label col-md-3">
                          Tipo de cuenta
                        </label>
                        <div className="col-md-9">
                          <input
                            list="tipo_cuentas"
                            name="tipo_cuenta"
                            className="form-control m-b-5"
                            placeholder="Monetaria en Q"
                            onChange={this.handleCuentaOrigenChange}
                            value={this.state.cuenta_origen.tipo_cuenta}
                          />
                          <datalist id="tipo_cuentas">
                            <option value="Monetaria en $" />
                            <option value="Monetaria en Q" />
                            <option value="Ahorro" />
                          </datalist>
                        </div>
                      </div>
                      {/* End */}
                    </div>
                    <div className="col"></div>
                    {/* Col 6 */}
                    <div className="col-5">
                      <h3>Cuenta destino: {this.state.monto_transferido}</h3>

                      <div className="form-group row m-b-15">
                        <label className="col-form-label col-md-3">
                          CUI cuenta salida
                        </label>
                        <div className="col-md-9">
                          <input
                            list="CUIS"
                            name="cui"
                            className="form-control m-b-5"
                            id="cui"
                            placeholder="3024998490103"
                            onChange={this.handleOnChangeCuiCuentaDestino}
                            value={this.state.cuenta_destino.cui}
                          />
                          <datalist id="CUIS">
                            {this.state.cuentahabientes.map(
                              (cuentahabiente) => (
                                <option value={`${cuentahabiente.cui}`} />
                              )
                            )}
                          </datalist>
                        </div>
                      </div>

                      <div className="form-group row m-b-15">
                        <label className="col-form-label col-md-3">
                          Nombre
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control m-b-5"
                            placeholder="Nombre"
                            name="cuenta_destino_nombre"
                            value={this.state.cuenta_destino.nombre}
                          />
                        </div>
                      </div>
                      <div className="form-group row m-b-15">
                        <label className="col-form-label col-md-3">
                          Apellido
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control m-b-5"
                            placeholder="Apellido"
                            name="cuenta_destino_apellido"
                            value={this.state.cuenta_destino.apellido}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col"></div>
                  </div>

                  <div className="row">
                    <div className="col-12 mt-5">
                      <div className="form-group row m-b-15">
                        <label className="col-form-label col-md-3">
                          Monto de Salida
                        </label>
                        <div className="col-md-9">
                          <input
                            name="monto_transferido"
                            className="form-control m-b-5"
                            id="cui"
                            placeholder="3024998490103"
                            onChange={this.handleMontoATrasnferirChange}
                            value={this.state.monto_transferir}
                            type="number"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      {this.state.saldo_disponible >
                      this.state.monto_transferido ? (
                        <button className="btn btn-primary">
                          Realizar trasnferencia
                        </button>
                      ) : (
                        <p>
                          No tienes saldo suficiente para realizar esta
                          operación.
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </PanelBody>
        </Panel>
        <hr />
      </div>
    );
  }
}

export default Home;
