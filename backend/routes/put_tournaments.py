from flask import jsonify, make_response, current_app, request
from sqlalchemy import select, update

from custom_types import SessionMaker
from models import Hosts, Tournaments
from .post_tournaments import update_embed_images
from utils import send_404_json_response

__all__ = ['ROUTE', 'METHOD', '__callback__']

# Define route & method
ROUTE = '/tournaments/<string:tournament_slug>/<int:season_no>'
METHOD = ['PUT']

def put_tournaments(tournament_slug: str, season_no: int):

    # Setup session
    Session: SessionMaker = current_app.session

    request_body: dict = request.json
    if not request_body:
        return send_404_json_response(
            success = False,
            message = 'No body provided'
        )

    if 'tournament_id' not in request_body:
        return send_404_json_response(
            success = False,
            message = '`tournament_id` not provided'
        )
    tournament_id = request_body.get('tournament_id')

    with Session() as session:

        query = select(Tournaments).where(Tournaments.tournament_id == tournament_id)
        tournament_data = session.scalars(query).one()

        query = select(Hosts).where(Hosts.tournament_id == tournament_id)
        hosts_data = session.scalars(query).all()

        for key, value in request_body.items():
            if key == 'hosts' or key == 'embed_theme_link':
                continue

            setattr(tournament_data, key, value)

        if embed_theme_link := request_body.get('embed_theme_link'):
            if embed_theme_link != tournament_data.embed_theme_link:

                update_embed_images(
                    embed_theme_link,
                    tournament_data.tournament_name,
                    tournament_data.slug_name,
                    tournament_data.season_no
                )
                tournament_data.embed_theme_link = embed_theme_link
            # Please improve response time

        hosts_to_be_updated = []
        deleted_hosts_ids = [host_info['row_id'] for host_info in request_body['hosts']['deleted']]

        for host_info in request_body['hosts']['updated']:
            hosts_to_be_updated.append(host_info)

        if hosts_to_be_updated:
            session.execute(update(Hosts), hosts_to_be_updated)

        for host_info in request_body['hosts']['added']:

            new_host = Hosts.from_json(host_info)
            session.add(new_host)

        for host in hosts_data:
            if host.row_id in deleted_hosts_ids:
                session.delete(host)

        session.commit()

    response = make_response(jsonify({'success': True}), 204)
    return response

__callback__ = put_tournaments