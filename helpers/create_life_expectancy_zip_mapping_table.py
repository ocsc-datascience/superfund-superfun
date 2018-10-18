#!/usr/bin/env python3
import sys
import sqlite3
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Unicode, Float

Base = declarative_base()

infile = "../data/AVG_LIFE_EXP_BY_US_ZIP.csv"
df = pd.read_csv(infile)

engine = create_engine("sqlite:///../db/superfund.sqlite")
Session = sessionmaker(bind=engine)
session = Session()

class LifeExpectancy(Base):

    __tablename__ = 'life_expectancy'
    id = Column(Integer, primary_key=True)
    xzip = Column(Unicode(16))
    latitude = Column(Float)
    longitude = Column(Float)
    avg_life_expectancy = Column(Float)


Base.metadata.create_all(engine)
    
for index,row in df.iterrows():

    sf = LifeExpectancy()
    sf.xzip = row['zip']
    sf.latitude = float(row['LAT'])
    sf.longitude = float(row['LNG'])
    sf.avg_life_expectancy = float(row['AVG_LIFE_EXP'])
    

    session.add(sf)
    session.commit()
    

    

    
