from flask import jsonify, make_response, current_app
from sqlalchemy import and_, select

from custom_types import SessionMaker
from models import TeamStandings, Tournaments
from utils import (
    get_image_from_cloudinary,
    no_tournament_found,
    cloud_name
)

__all__ = ['ROUTE', 'METHOD', '__callback__']

# Define route & method
ROUTE = '/groups/<string:tournament_slug>/<int:season_no>'
METHOD = ['GET']

def get_groups(tournament_slug: str, season_no: int):

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
            return no_tournament_found(tournament_slug, season_no)

        query = select(TeamStandings).where(TeamStandings.tournament_id == tournament_id).order_by(TeamStandings.row_no)
        team_standings_data = session.scalars(query).all()

    distinct_group_ids = set([standing.group_id for standing in team_standings_data])
    image_urls = {}

    for group_id in distinct_group_ids:
        image_path = f'hctournaments/{tournament_slug}/s{season_no}/groups/{group_id}'

        image, _, _ = get_image_from_cloudinary(
            public_id = image_path,
            cloud_name = cloud_name,
            data_last_edited = None
        )
        image_urls[group_id] = '' if image is None else image.get('secure_url')

    team_standings = []
    for standing_data in team_standings_data:
        team_standings.append(standing_data.to_json())

    json_data = {
        'tournament_id': tournament_id,
        'embed_image_urls' : image_urls,
        'team_standings': team_standings
    }
    response = make_response(jsonify(json_data), 200)
    return response

__callback__ = get_groups