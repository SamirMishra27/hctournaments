from flask import jsonify, make_response, current_app, request
from sqlalchemy import and_, select, update

from custom_types import SessionMaker
from models import Hosts, Tournaments

__all__ = ['ROUTE', 'METHOD', '__callback__']

# Define route & method
ROUTE = '/hosts/<string:tournament_slug>/<int:season_no>'
METHOD = ['PUT']

def put_hosts(tournament_slug: str, season_no: int):

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

        query = select(Hosts).where(Hosts.tournament_id == tournament_id)
        hosts_data = session.scalars(query).all()

        hosts_to_be_updated = []
        deleted_hosts_ids = [host_info['row_id'] for host_info in request_body['deleted']]

        for host_info in request_body['updated']:
            hosts_to_be_updated.append(host_info)

        if hosts_to_be_updated:
            session.execute(update(Hosts), hosts_to_be_updated)

        for host_info in request_body['added']:

            new_host = Hosts.from_json(host_info)
            session.add(new_host)

        for host in hosts_data:
            if host.row_id in deleted_hosts_ids:
                session.delete(host)

        session.commit()

    response = make_response(jsonify({'success': True}), 204)
    return response

__callback__ = put_hosts