from flask import Flask
from flask_cors import CORS
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from flask import request
import json
auth_provider = PlainTextAuthProvider(
    username='cassandra', password='cassandra')
keyspace = "sist"

app = Flask(__name__)
CORS(app)


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
    return {"status": 200, "payload": payload}


@app.route("/api/institucion/create/", methods=["POST"])
def create_institucion():
    """ Crea una nueva institución financiera en base a los parametros"""
    if request.method == 'POST':
        data = json.loads(request.data.decode("utf-8"))
        cluster = Cluster(['cassandra'], auth_provider=auth_provider)
        connection = cluster.connect(keyspace)
        resultado = connection.execute(
            "INSERT INTO sist.institucion_financiera (nombre, abreviacion) VALUES('{0}', '{1}')".format(data["nombre"], data["abreviacion"]))
        return {"status": 201, "payload": {"nombre": data["nombre"], "abreviacion": data["abreviacion"]}}


@app.route("/api/institucion/delete/", methods=["POST"])
def delete_institucion():
    """ borra una  institución financiera en base a los parametros"""
    if request.method == 'POST':
        data = json.loads(request.data.decode("utf-8"))
        cluster = Cluster(['cassandra'], auth_provider=auth_provider)
        connection = cluster.connect(keyspace)
        resultado = connection.execute(
            "DELETE FROM sist.institucion_financiera WHERE nombre='{0}' AND abreviacion='{1}'".format(data["nombre"], data["abreviacion"]))
        return {"status": 201, "payload": {"nombre": data["nombre"], "abreviacion": data["abreviacion"]}}


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
    return {"status": 200, "payload": payload}


@app.route("/api/cuentahabiente/delete/", methods=['POST'])
def delete_cuentahabiente():
    """ Ubica y elimina un cuentahabiente utilizando su cui"""
    if request.method == 'POST':
        data = json.loads(request.data.decode("utf-8"))
        print(data)
        cluster = Cluster(['cassandra'], auth_provider=auth_provider)
        connection = cluster.connect(keyspace)
        resultado = connection.execute(
            "DELETE FROM sist.cuentahabiente WHERE cui={0}".format(data["cui"]))
        return {"status": 201, "payload": {"cui": data["cui"]}}


@app.route("/api/cuentahabiente/create/", methods=["POST"])
def create_cuentahabiente():
    """ Crea un nuevo cuentahabiente en base a los parametros"""
    if request.method == 'POST':
        data = json.loads(request.data.decode("utf-8"))
        cluster = Cluster(['cassandra'], auth_provider=auth_provider)
        connection = cluster.connect(keyspace)
        resultado = connection.execute("INSERT INTO sist.cuentahabiente (cui, apellido, email, fecha_registro, genero, nombre) VALUES({0}, '{1}', '{2}', '{3}', '{4}', '{5}');".format(
            data["cui"],
            data["apellido"],
            data["email"],
            data["fecha_registro"],
            data["genero"],
            data["nombre"],
        ))
        return {"status": 201, "payload": {
            "cui": data["cui"],
            "apellido": data["apellido"],
            "email": data["email"],
            "fecha_registro": data["fecha_registro"],
            "genero": data["genero"],
            "nombre": data["nombre"],
        }}
