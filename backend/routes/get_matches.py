from flask import jsonify, make_response, current_app
from sqlalchemy import select, and_

from custom_types import SessionMaker
from models import Matches, Tournaments
from utils import (
    get_image_from_cloudinary,
    send_404_json_response,
    cloud_name
)

__all__ = ['ROUTE', 'METHOD', '__callback__']

# Define route & method
ROUTE = '/matches/<string:tournament_slug>/<int:season_no>'
METHOD = ['GET']

def get_matches(tournament_slug: str, season_no: int):

    # Setup session
    Session: SessionMaker = current_app.session

    with Session() as session:

        # Get tournament id
        query = select(Tournaments.tournament_id).where(and_(
            Tournaments.slug_name == tournament_slug.lower(),
            Tournaments.season_no == season_no
        ))
        tournament_id = session.scalars(query).one_or_none()

        if not tournament_id:
            return send_404_json_response(
                success = False,
                message = 'No tournament with slug `{}` & season `{}` found'.format(tournament_slug, season_no)
            )

        query = select(Matches).where(Matches.tournament_id == tournament_id)
        matches_data = session.scalars(query).all()

    # Get embed image from cloudinary
    image_path = f'hctournaments/{tournament_slug}/s{season_no}/matches'

    image, _, _ = get_image_from_cloudinary(
        public_id = image_path,
        cloud_name = cloud_name,
        data_last_edited = None
    )
    image_url = '' if image is None else image.get('secure_url')
    matches = []

    for match_data in matches_data:
        matches.append(match_data.to_json())

    json_data = {
        'embed_image_url' : image_url,
        'matches' : matches
    }

    response = make_response(jsonify(json_data), 200)
    return response

__callback__ = get_matches