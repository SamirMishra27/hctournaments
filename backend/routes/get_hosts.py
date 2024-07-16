from flask import jsonify, make_response, current_app
from sqlalchemy import and_, select

from custom_types import SessionMaker
from models import Hosts, Tournaments
from utils import no_tournament_found

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
            return no_tournament_found(tournament_slug, season_no)

        query = select(Hosts).where(Hosts.tournament_id == tournament_id).order_by(Hosts.row_no)
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