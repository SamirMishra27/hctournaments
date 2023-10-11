from flask import jsonify, make_response, current_app
from sqlalchemy import select

from custom_types import SessionMaker
from models import Tournaments

__all__ = ['ROUTE', 'METHOD', '__callback__']

# Define route & method
ROUTE = '/tournaments'
METHOD = ['GET']

def get_all_tournaments():

    # Setup session
    Session: SessionMaker = current_app.session

    with Session() as session:

        query = select(Tournaments)
        tournaments_data = session.scalars(query).all()

    tournaments_json = []
    for tournament_data in tournaments_data:
        tournaments_json.append(tournament_data.to_json())

    response = make_response(jsonify(tournaments_json), 200)
    return response

__callback__ = get_all_tournaments