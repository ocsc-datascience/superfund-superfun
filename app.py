#!/usr/bin/env python3
import sys
from flask import Flask, render_template,jsonify,request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/superfund.sqlite"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

Base = automap_base(metadata=db.metadata)
engine = db.get_engine()
Base.prepare(engine, reflect=True)
Superfund = Base.classes.superfund

sys.exit()

for mappedclass in Base.classes:
    print(mappedclass)



@app.route("/superfund_sites")
def superfund_sites():

#    db.session.query(
    
    md = {}
    
    return jsonify(md)


@app.route("/")
def index():
    return render_template("index.html")




if __name__ == "__main__":
    app.run(debug=True)
