#!/usr/bin/env python3
import sys
from flask import Flask, render_template,jsonify,request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import numpy as np

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
# load the state stats table
StateCombinedStats = Base.classes.state_combined_stat


@app.route("/map")
def map():

    return render_template("map.html",xpage="map")

@app.route("/state_stats")
def state_stats():
    r"""Display the state stats plot"""
    
    return render_template("state_stats.html",xpage="state stats")

@app.route("/data")
def data():
    r"""Display the data table plot"""
    
    return render_template("data.html",xpage="Data")



@app.route("/state_stats/get_data")
def state_stats_get_data():

    r"""API backend that returns a json of the
    state statistics for d3"""
    
    res = db.session.query(StateCombinedStats).all()

    dlist = []

    for dset in res:
        md = dset.__dict__.copy()
        del md['_sa_instance_state']
        dlist.append(md)


    # find min and max for
    # selected columns
    min_max_list = ['median_household_income',
                    'avg_hrsscore','population_density',
                    'cancer_death_rate']

    for item in min_max_list:

        dd = [ rec[item] for rec in dlist ]
        
        xmin = min(dd)
        xmax = max(dd)

        for i in range(len(dlist)):
            dlist[i][item+"_max"] = xmax
            dlist[i][item+"_min"] = xmin
        
    return jsonify(dlist)



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

@app.route("/superfund_sites/<id>")
def sample_metadata(id):
    """Return the metadata for a given superfund site name."""
    sel = [
        Superfund.id,
        Superfund.epa_id,
        Superfund.site_id,
        Superfund.name,
        Superfund.address,
        Superfund.city,
        Superfund.state,
        Superfund.xzip,
        Superfund.latitude,
        Superfund.longitude,
        Superfund.hrs_score,
    ]

    results = db.session.query(*sel).filter(Superfund.id == id).all()

    # Create a dictionary entry for each row of metadata information
    sample_metadata = {}
    for result in results:
        sample_metadata["id"] = result[0]
        sample_metadata["epa_id"] = result[1]
        sample_metadata["site_id"] = result[2]
        sample_metadata["name"] = result[3]
        sample_metadata["address"] = result[4]
        sample_metadata["city"] = result[5]
        sample_metadata["state"] = result[6]
        sample_metadata["xzip"] = result[7]
        sample_metadata["latitude"] = result[8]
        sample_metadata["longitude"] = result[9]
        sample_metadata["hrs_score"] = result[10]

    print(sample_metadata)
    return jsonify(sample_metadata)

# @app.route("/")

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
    return render_template("some_content.html")




if __name__ == "__main__":
    app.run(debug=True)
