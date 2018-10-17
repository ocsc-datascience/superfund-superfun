#!/usr/bin/env python3
import sys
import sqlite3
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Unicode, Float

Base = declarative_base()

infile = "../data/superfund_npl.csv"
df = pd.read_csv(infile)

engine = create_engine("sqlite:///../db/superfund.sqlite")
Session = sessionmaker(bind=engine)
session = Session()

class Superfund(Base):

    __tablename__ = 'superfund'
    id = Column(Integer, primary_key=True)
    epa_id = Column(Unicode(64))
    site_id = Column(Unicode(64))
    name = Column(Unicode(64))
    address = Column(Unicode(64))
    city = Column(Unicode(64))
    county = Column(Unicode(64))
    fips = Column(Unicode(64))
    state = Column(Unicode(2))
    xzip = Column(Unicode(16))
    latitude = Column(Float)
    longitude = Column(Float)
    nlp_status = Column(Unicode(32))
    nlp_status_date = Column(Unicode(32))
    hrs_score = Column(Float)


Base.metadata.create_all(engine)
    
for index,row in df.iterrows():

    sf = Superfund()
    sf.epa_id = row['EPA ID']
    sf.site_id = row['Site ID']
    sf.name = row['Name']
    sf.address = row['Address']
    sf.city = row['City']
    sf.county = row['County']
    sf.fips = row['FIPS']
    sf.state = row['State']
    sf.xzip = row['ZIP code']
    sf.latitude = float(row['Latitude'])
    sf.longitude = float(row['Longitude'])
    sf.npl_status = row['NPL status']
    sf.npl_status_date = row['NPL status date']
    sf.hrs_score = float(row['HRS score'])

    session.add(sf)
    session.commit()
    

    

    
