from flask import Flask
from flask_cors import CORS
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from datetime import datetime
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
        print(data)
        resultado = connection.execute("INSERT INTO sist.cuentahabiente (cui, apellido, email, fecha_registro, genero, nombre) VALUES({0}, '{1}', '{2}', '{3}', '{4}', '{5}')".format(
            data["cui"],
            data["apellido"],
            data["email"],
            data["fecha_registro"],
            data["genero"],
            data["nombre"],
        ))
        print(resultado)
        return {"status": 201, "payload": {
            "cui": data["cui"],
            "apellido": data["apellido"],
            "email": data["email"],
            "fecha_registro": data["fecha_registro"],
            "genero": data["genero"],
            "nombre": data["nombre"],
        }}


@app.route("/api/reportes/cuentahabiente/operaciones/", methods=["POST"])
def operaciones_por_cuentahabiente():
    """ Crea un nuevo cuentahabiente en base a los parametros"""
    if request.method == 'POST':
        data = json.loads(request.data.decode("utf-8"))
        cluster = Cluster(['cassandra'], auth_provider=auth_provider)
        connection = cluster.connect(keyspace)
        print(data)
        resultado = connection.execute("SELECT * FROM sist.operaciones_cuentahabiente  WHERE cui = {0} AND nombre = '{1}' AND apellido = '{2}' ALLOW FILTERING".format(
            data["cui"],
            data["nombre"],
            data["apellido"],
        ))
        print(resultado)
        payload = []
        for response in resultado:
            payload.append({
                "cui": response.cui,
                "nombre": response.nombre,
                "apellido": response.apellido,
                "email": response.email,
                "institucion_abr": response.institucion_abr,
                "tipo_cuenta": response.tipo_cuenta,
                "monto_transferido": "{0}".format(response.monto_transferido)
            })
        payload = json.dumps(payload)
        return {"status": 200, "payload": payload}


@app.route("/api/reportes/cuentahabiente/operaciones/mes/", methods=["POST"])
def operaciones_por_cuentahabiente_mes():
    """ Crea un nuevo cuentahabiente en base a los parametros"""
    if request.method == 'POST':
        data = json.loads(request.data.decode("utf-8"))
        cluster = Cluster(['cassandra'], auth_provider=auth_provider)
        connection = cluster.connect(keyspace)
        print(data)
        resultado = connection.execute(
            "select * from movimientos_cuentahabiente_mes where cui={0} and nombre = '{1}' and apellido = '{2}' and mes = {3} and anio = {4} allow filtering".format(
                data["cui"],
                data["nombre"],
                data["apellido"],
                data["mes"],
                data["anio"]
            ))
        print(resultado)
        payload = []
        for response in resultado:
            payload.append({
                "cui": response.cui,
                "nombre": response.nombre,
                "apellido": response.apellido,
                "email": response.email,
                "institucion_abr": response.institucion_abr,
                "tipo_cuenta": response.tipo_cuenta,
                "monto_transferido": "{0}".format(response.monto_transferido),
                "tipo_operacion": response.tipo_operacion,
                "fecha_operacion": "{0}".format(response.fecha_operacion)
            })
        payload = json.dumps(payload)
        return {"status": 200, "payload": payload}


@app.route("/api/reportes/creditos/", methods=["POST"])
def creditos():
    """ Obtiene el total de creditos dada una insitución bancaria """
    data = json.loads(request.data.decode("utf-8"))
    cluster = Cluster(['cassandra'], auth_provider=auth_provider)
    connection = cluster.connect(keyspace)
    resultado = connection.execute(
        "select SUM(monto) as total_creditos , COUNT(*) as total_operaciones from sist.totales_creditos_debitos_institucion  where nombre = '{0}' and tipo_operacion ='credito' allow filtering".format(
            data["nombre"]
        )
    )

    payload = []
    for response in resultado:
        payload.append({
            "total_creditos": "{0}".format(response.total_creditos),
            "total_operaciones": "{0}".format(response.total_operaciones),
        })
    payload = json.dumps(payload)
    return {"status": 200, "payload": payload}


@app.route("/api/reportes/debitos/", methods=["POST"])
def debitos():
    """ Obtiene el total de debitos dada una insitución bancaria """
    data = json.loads(request.data.decode("utf-8"))
    cluster = Cluster(['cassandra'], auth_provider=auth_provider)
    connection = cluster.connect(keyspace)
    resultado = connection.execute(
        "select SUM(monto) as total_debitos , COUNT(*) as total_operaciones from sist.totales_creditos_debitos_institucion  where nombre = '{0}' and tipo_operacion ='debito' allow filtering".format(
            data["nombre"]
        )
    )

    payload = []
    for response in resultado:
        payload.append({
            "total_debitos": "{0}".format(response.total_debitos),
            "total_operaciones": "{0}".format(response.total_operaciones),
        })
    payload = json.dumps(payload)
    return {"status": 200, "payload": payload}


@app.route("/api/estado/cuenta/afavor/", methods=["POST"])
def saldoAFavor():
    """ Obtiene el saldo a favor del sistema"""
    data = json.loads(request.data.decode("utf-8"))
    cluster = Cluster(['cassandra'], auth_provider=auth_provider)
    connection = cluster.connect(keyspace)
    print(data)
    resultado = connection.execute(
        """ select SUM(monto_transferido) as a_favor from movimientos_cuentahabiente_por_cuenta
            where cui={0}
            and nombre = '{1}'
            and apellido = '{2}'
            and institucion_abr ='{3}'
            and tipo_cuenta = '{4}'
            and tipo_operacion = 'credito';
        """.format(
            data["cui"],
            data["nombre"],
            data["apellido"],
            data["abreviacion"],
            data["tipo_cuenta"]
        )
    )

    credito = 0
    for response in resultado:
        credito = response.a_favor

    resultado = connection.execute(
        """ select SUM(monto_transferido) as en_contra from movimientos_cuentahabiente_por_cuenta
            where cui={0}
            and nombre = '{1}'
            and apellido = '{2}'
            and institucion_abr ='{3}'
            and tipo_cuenta = '{4}'
            and tipo_operacion = 'debito';
        """.format(
            data["cui"],
            data["nombre"],
            data["apellido"],
            data["abreviacion"],
            data["tipo_cuenta"]
        )
    )

    debito = 0
    for response in resultado:
        debito = response.en_contra

    resultado = "{0}".format(credito - debito)
    return {"status": 200, "payload": resultado}


@app.route("/api/nueva/transferencia/", methods=["POST"])
def registrarNuevaTransferencia():
    """ Obtiene el total de debitos dada una insitución bancaria """
    data = json.loads(request.data.decode("utf-8"))
    cluster = Cluster(['cassandra'], auth_provider=auth_provider)
    connection = cluster.connect(keyspace)
    data_origen = data["origen"]
    data_destino = data["destino"]
    resultado = connection.execute(
        """ INSERT INTO sist.operaciones_cuentahabiente
            (cui, fecha_operacion, apellido, email, fecha_registro, institucion_abr, institucion_nombre, monto_transferido, nombre, tipo_cuenta)
            VALUES({0}, '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', {7}, '{8}', '{9}');
        """.format(
            data_origen["cui"],
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            data_origen["apellido"],
            data_origen["email"],
            data_origen["fecha_registro"],
            data_origen["abreviacion"],
            data_origen["institucion_nombre"],
            data["monto_transferido"],
            data_origen["nombre"],
            data_origen["tipo_cuenta"]
        )
    )

    query = """
        INSERT INTO sist.movimientos_cuentahabiente_por_cuenta
        (cui, nombre, apellido, institucion_abr, tipo_cuenta, tipo_operacion, fecha_operacion, email, fecha_registro, institucion_nombre, monto_transferido)
        VALUES({0}, '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}', '{9}', {10});
        """
    print(data_origen)
    resultado = connection.execute(
        query.format(
            data_origen["cui"],
            data_origen["nombre"],
            data_origen["apellido"],
            data_origen["abreviacion"],
            data_origen["tipo_cuenta"],
            "debito",
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            data_origen["email"],
            data_origen["fecha_registro"],
            data_origen["institucion_nombre"],
            data["monto_transferido"],
        )
    )

    resultado = connection.execute(
        query.format(
            data_destino["cui"],
            data_destino["nombre"],
            data_destino["apellido"],
            data_destino["abreviacion"],
            data_destino["tipo_cuenta"],
            "credito",
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            data_destino["email"],
            data_destino["fecha_registro"],
            data_destino["institucion_nombre"],
            data["monto_transferido"],
        )
    )

    query = """
        INSERT INTO sist.movimientos_cuentahabiente_por_cuenta
        (cui, nombre, apellido, institucion_abr, tipo_cuenta, tipo_operacion, fecha_operacion, email, fecha_registro, institucion_nombre, monto_transferido)
        VALUES({0}, '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}', '{9}', {10})
        """
    resultado = connection.execute(
        query.format(
            data_origen["cui"],
            data_origen["nombre"],
            data_origen["apellido"],
            data_origen["abreviacion"],
            data_origen["tipo_cuenta"],
            "debito",
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            data_origen["email"],
            data_origen["fecha_registro"],
            data_origen["institucion_nombre"],
            data["monto_transferido"],
        )
    )

    resultado = connection.execute(
        query.format(
            data_destino["cui"],
            data_destino["nombre"],
            data_destino["apellido"],
            data_destino["abreviacion"],
            data_destino["tipo_cuenta"],
            "credito",
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            data_destino["email"],
            data_destino["fecha_registro"],
            data_destino["institucion_nombre"],
            data["monto_transferido"],
        )
    )

    query = """
        INSERT INTO sist.movimientos_cuentahabiente_mes
        (cui, nombre, apellido, mes, anio, fecha_operacion, tipo_operacion, email, fecha_registro, institucion_abr, institucion_nombre, monto_transferido, tipo_cuenta)
        VALUES({0}, '{1}', '{2}', {3}, {4}, '{5}', '{6}', '{7}', '{8}', '{9}', '{10}', {11}, '{12}')
    """

    resultado = connection.execute(
        query.format(
            data_origen["cui"],
            data_origen["nombre"],
            data_origen["apellido"],
            datetime.now().month,
            datetime.now().year,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "debito",
            data_origen["email"],
            data_origen["fecha_registro"],
            data_origen["abreviacion"],
            data_origen["institucion_nombre"],
            data["monto_transferido"],
            data_origen["tipo_cuenta"],
        )
    )

    resultado = connection.execute(
        query.format(
            data_destino["cui"],
            data_destino["nombre"],
            data_destino["apellido"],
            datetime.now().month,
            datetime.now().year,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "debito",
            data_destino["email"],
            data_destino["fecha_registro"],
            data_destino["abreviacion"],
            data_destino["institucion_nombre"],
            data["monto_transferido"],
            data_destino["tipo_cuenta"]
        )
    )

    query = """ 
    INSERT INTO sist.totales_creditos_debitos_institucion
    (nombre, tipo_operacion, fecha_operacion, monto)
    VALUES('{0}', '{1}', '{2}', {3});
    """
    resultado = connection.execute(
        query.format(
            data_origen["institucion_nombre"],
            "debito",
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            data["monto_transferido"],
        )
    )

    resultado = connection.execute(
        query.format(
            data_destino["institucion_nombre"],
            "credito",
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            data["monto_transferido"],
        )
    )

    return {"status": 200, "payload": "ok"}
