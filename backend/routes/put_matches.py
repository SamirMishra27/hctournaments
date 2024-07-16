from flask import jsonify, make_response, current_app, request
from sqlalchemy import and_, select, update

from custom_types import SessionMaker
from models import Matches, Tournaments
from utils import (
    get_image_from_cloudinary,
    no_tournament_found
)

__all__ = ['ROUTE', 'METHOD', '__callback__']

# Define route & method
ROUTE = '/matches/<string:tournament_slug>/<int:season_no>'
METHOD = ['PUT']

def put_matches(tournament_slug: str, season_no: int):

    # Setup session
    Session: SessionMaker = current_app.session

    request_body: dict = request.json
    with Session() as session:

        # Get tournament id
        query = select(Tournaments).where(and_(
            Tournaments.slug_name == tournament_slug.lower(),
            Tournaments.season_no == season_no
        ))
        tournament_id = session.scalars(query).one().tournament_id

        if not tournament_id:
            return no_tournament_found(tournament_slug, season_no)

        query = select(Matches).where(Matches.tournament_id == tournament_id)
        matches_data = session.scalars(query).all()

        matches_to_be_updated = []
        deleted_matches_ids = [match_info['match_id'] for match_info in request_body['deleted']]

        for match_info in request_body['updated']:
            matches_to_be_updated.append(match_info)

        if matches_to_be_updated:
            session.execute(update(Matches), matches_to_be_updated)

        for match_info in request_body['added']:

            new_match = Matches.from_json(match_info)
            session.add(new_match)

        for match_data in matches_data:
            if match_data.match_id in deleted_matches_ids:
                session.delete(match_data)

        session.commit()

    response = make_response(jsonify({'success': True}), 204)
    return response

__callback__ = put_matches