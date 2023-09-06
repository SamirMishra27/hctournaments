from flask import jsonify, make_response, current_app
from sqlalchemy import select

from custom_types import SessionMaker
from models import Admins

__all__ = ['ROUTE', 'METHOD', '__callback__']

# Define route & method
ROUTE = '/admins'
METHOD = ['GET']

def get_admins():

    # Setup session
    Session: SessionMaker = current_app.session

    with Session() as session:
        query = select(Admins)
        admin_data = session.scalars(query).all()
        print(session.execute(query).all())

    json_data = []
    for admin in admin_data:
        json_data.append(admin.to_json())

    response = make_response(jsonify(json_data), 200)
    return response

__callback__ = get_admins