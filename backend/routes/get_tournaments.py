from flask import jsonify, make_response, current_app
from sqlalchemy import and_, select

from custom_types import SessionMaker
from models import Hosts, Tournaments
from utils import (
    get_image_from_cloudinary,
    no_tournament_found,
    cloud_name
)

__all__ = ['ROUTE', 'METHOD', '__callback__']

# Define route & method
ROUTE = '/tournaments/<string:tournament_slug>/<int:season_no>'
METHOD = ['GET']

def get_tournaments(tournament_slug: str, season_no: int):

    # Setup session
    Session: SessionMaker = current_app.session

    with Session() as session:
        query = select(Tournaments).where(and_(
            Tournaments.slug_name == tournament_slug.lower(),
            Tournaments.season_no == season_no
        ))
        tournament_data = session.scalars(query).one_or_none()

        if not tournament_data:
            return no_tournament_found(tournament_slug, season_no)

        query = select(Hosts).where(Hosts.tournament_id == tournament_data.tournament_id)
        hosts_data = session.scalars(query).all()

    image_path = f'hctournaments/{tournament_slug}/s{season_no}/info'

    image, _, _ = get_image_from_cloudinary(
        public_id = image_path,
        cloud_name = cloud_name,
        data_last_edited = None
    )
    image_url = '' if image is None else image.get('secure_url')

    hosts_info = []
    for host_data in hosts_data:
        hosts_info.append(host_data.to_json())

    json_data = tournament_data.to_json()
    json_data['embed_theme_link'] = image_url
    json_data['hosts'] = hosts_info

    response = make_response(jsonify(json_data), 200)
    return response

__callback__ = get_tournaments