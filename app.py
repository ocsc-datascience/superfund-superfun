#!/usr/bin/env python3
import sys
from flask import Flask, render_template,jsonify,request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base

app = Flask(__name__)
CORS(app)

#app.config['STATIC_FOLDER'] = 'static'
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/superfund.sqlite"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

Base = automap_base(metadata=db.metadata)
engine = db.get_engine()
Base.prepare(engine, reflect=True)
Superfund = Base.classes.superfund
LifeExpectancy = Base.classes.life_expectancy



@app.route("/superfund_sites")
def superfund_sites():
    r""" This function returns the list of superfund sites
    with coordinates and zip codes """
    
    res = db.session.query(Superfund).all()

    dlist = []
    for dset in res:
        md = dset.__dict__.copy()
        del md['_sa_instance_state']
        dlist.append(md)
    
    return jsonify(dlist)

@app.route("/life_expectancy")
def life_expectancy():
    r""" This function returns the average life expectancy
    by zip code and geo coordinates"""

    res = db.session.query(LifeExpectancy).all()

    dlist = []
    for dset in res:
        md = dset.__dict__.copy()
        del md['_sa_instance_state']
        dlist.append(md)
        
    return jsonify(dlist)
    
@app.route("/")
def index():
    return render_template("index.html")




if __name__ == "__main__":
    app.run(debug=True)
