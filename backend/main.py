from flask import Flask
from flask_cors import CORS

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models import BaseModel
from custom_types import RouteInfo

# Load config file
from json import load
with open('config.json') as f:
    config = load(f)

# Setup cloudinary
import cloudinary

cloudinary.config(
    cloud_name = config['CLOUDINARY_CLOUD_NAME'],
    api_key = config['CLOUDINARY_API_KEY'],
    api_secret = config['CLOUDINARY_API_SECRET'],
    secure = True
)

# Initiate flask app and setup Cors
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

from routes import (
    tournaments,
    groups,
    playerstats,
    schedule
)


# Connect to database and store session in app
def establish_database_connection(connection_link: str):
    Engine = create_engine(connection_link)
    BaseModel.metadata.create_all(Engine)
    Session = sessionmaker(Engine)

    app.db_engine = Engine
    app.session = Session
    app.logger.warning('Established connection with the database!')

if __name__ == "__main__":

    establish_database_connection(config['POSTGRES_DATABASE_CONN_LINK'])
    app.logger.warning("Running flask server...")

    app.run(
        host = config.get('HOST', '0.0.0.0'),
        port = config.get('PORT', 3000),
        debug = False if config.get('STAGE') == 'PROD' else True,
        ssl_context = ('cert.pem', 'key.pem') if config.get('STAGE') == 'PROD' else None
    )