from flask import jsonify, make_response, current_app
from sqlalchemy import and_, select

from custom_types import SessionMaker
from models import Hosts, Tournaments
from utils import send_404_json_response

__all__ = ['ROUTE', 'METHOD', '__callback__']

# Define route & method
ROUTE = '/hosts/<string:tournament_slug>/<int:season_no>'
METHOD = ['GET']

def get_hosts(tournament_slug: str, season_no: int):

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

        query = select(Hosts).where(Hosts.tournament_id == tournament_id)
        hosts_data = session.scalars(query).all()

    hosts = []
    for host_data in hosts_data:
        hosts.append(host_data.to_json())

    json_data = {
        'tournament_id': tournament_id,
        'hosts': hosts
    }

    response = make_response(jsonify(json_data), 200)
    return response

__callback__ = get_hosts