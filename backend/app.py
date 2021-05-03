from flask import Flask
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import json
auth_provider = PlainTextAuthProvider(
    username='cassandra', password='cassandra')
keyspace = "sist"

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "Hello world!"


@app.route("/api/institucion/list")
def lista_institucion():
    """ Ontengo la lista de todas las instituciones financieras registradas"""
    cluster = Cluster(['cassandra'], auth_provider=auth_provider)
    connection = cluster.connect(keyspace)
    first_orders = connection.execute("select * from institucion_financiera")
    print(first_orders)
    payload = []
    for response in first_orders:
        payload.append({"nombre": response.nombre,
                       "abreviacion": response.abreviacion})
    payload = json.dumps(payload)
    return {"status": 200, payload: payload}


@app.route("/api/cuentahabiente/list")
def lista_cuentahabiente():
    """ Obtengo la lista de todos los cuentahabientes en el sistema"""
    cluster = Cluster(['cassandra'], auth_provider=auth_provider)
    connection = cluster.connect(keyspace)
    first_orders = connection.execute("select * from cuentahabiente")
    print(first_orders)
    payload = []
    for response in first_orders:
        payload.append({"cui": response.cui,
                       "nombre": response.nombre,
                        "apellido": response.apellido,
                        "email": response.email,
                        "fecha_registro": "{0}".format(response.fecha_registro),
                        "genero": response.genero
                        })
    payload = json.dumps(payload)
    return {"status": 200, payload: payload}
