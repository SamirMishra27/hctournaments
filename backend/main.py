from flask import Flask, request, jsonify
from flask_cors import CORS

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models import BaseModel
from custom_types import RouteInfo

# Load config file using python-dotenv
from dotenv import load_dotenv
load_dotenv()

from os import environ
config = environ

# Setup cloudinary
import cloudinary

cloudinary.config(
    cloud_name = config['CLOUDINARY_CLOUD_NAME'],
    api_key = config['CLOUDINARY_API_KEY'],
    api_secret = config['CLOUDINARY_API_SECRET'],
    secure = True
)

# Initiate flask app and setup Cors
def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Connect to database and store session in app
    Engine = create_engine(
        config['POSTGRES_DATABASE_CONN_LINK'],
        pool_pre_ping = True,
        pool_recycle = 3600   # 1 hour
    )
    BaseModel.metadata.create_all(Engine)
    Session = sessionmaker(Engine)

    app.db_engine = Engine
    app.session = Session
    app.logger.warning('Established connection with the database!')

    return app
app = create_app()

# Add middleware or before route invoked callback
@app.before_request
def verify_auth_key():

    authorization_key: str = request.headers.get('Authorization')
    client_api_key: str = config['CLIENT_API_KEY']

    if authorization_key == client_api_key:
        return None

    if authorization_key is None:
        reject_reason = 'No authorization key provided'

    else:
        reject_reason = 'Invalid authorization key'

    response = jsonify({'message' : reject_reason})
    return response, 401

# Import all routes
import routes

for name, route_info in vars(routes).items():
    name: str
    route_info: RouteInfo

    if name in routes.__all__:
        app.add_url_rule(
            route_info.ROUTE,
            view_func = route_info.__callback__,
            methods = route_info.METHOD
        )

if __name__ == "__main__":

    app.logger.warning("Running flask server...")
    app.run(
        host = config.get('HOST', '0.0.0.0'),
        port = int( config.get('PORT', 3000) ),
        debug = False if config.get('STAGE') == 'PROD' else True
    )