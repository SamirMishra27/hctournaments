from flask import jsonify, make_response, current_app, request
from sqlalchemy import and_, select, update
from cloudinary import uploader

from custom_types import SessionMaker
from models import TeamStandings, Tournaments
from utils import (
    font_of_size,
    cloudinary_upload,
    get_image_from_cloudinary,
    no_tournament_found,
    cloud_name
)

from io import BytesIO
from requests import get
from typing import Sequence
from PIL import Image, ImageDraw
from threading import Event, Thread

__all__ = ['ROUTE', 'METHOD', '__callback__']

# Define route & method
ROUTE = '/groups/<string:tournament_slug>/<int:season_no>'
METHOD = ['PUT']

def generate_new_image(image_link, tourney_name, groups: Sequence[TeamStandings]) -> BytesIO:

    # Step 1 Get image data from url
    response = get(image_link)
    response.raise_for_status()

    # Step 2 Construct image in PIL
    image = Image.open(BytesIO(response.content))
    if image.width != 1280 or image.height != 720:
        image = image.resize(size = (1280, 720), box = (0, 0, 1280, 720))
    image_draw = ImageDraw.Draw(image)

    # Step 3 Write necessary text
    length = len(groups)
    y_coord = 180
    font = font_of_size(28)

    groups = sorted(groups, key = lambda team: team.points, reverse = True)
    for team_standing in groups:

        image_draw.multiline_text(xy = (95, y_coord), text = str(team_standing.team_name), align = 'center', font = font)

        image_draw.multiline_text(xy = (780, y_coord), text = str(team_standing.matches_played), align = 'center', font = font)

        image_draw.multiline_text(xy = (910, y_coord), text = str(team_standing.matches_won), align = 'center', font = font)

        image_draw.multiline_text(xy = (1030, y_coord), text = str(team_standing.matches_lost), align = 'center', font = font)

        image_draw.multiline_text(xy = (1150, y_coord), text = str(team_standing.points), align = 'center', font = font)

        y_coord += 500 / length

    for coordinates, text, font_size, anchor in [
        [(90, 40), tourney_name, 60, None],
        [(1180, 53), groups[0].group_name, 48, 'ra']
    ]:
        image_draw.multiline_text(xy = coordinates, text = text, align = 'center', font = font_of_size(font_size), anchor = anchor)

    # Step 4 Convert new image to buffer and return it
    image_buffer = BytesIO()

    image.save(image_buffer, 'jpeg')
    image.close()

    image_buffer.seek(0)
    return image_buffer

def update_group_images(
    distinct_group_ids_after: Sequence[str],
    team_standings_data: Sequence[TeamStandings],
    theme_image_link: str,
    tournament_name: str,
    base_image_path: str
):
    for group_id in distinct_group_ids_after:
        group_team_standings = [standing for standing in team_standings_data if standing.group_id == group_id]

        image_buffer = generate_new_image(theme_image_link, tournament_name, group_team_standings)
        cloudinary_upload(image_buffer, group_id, base_image_path)

def remove_deleted_group_images(removed_group_ids: Sequence[str], base_image_path: str):
    for group_id in removed_group_ids:
        image_path = f'{base_image_path}/{group_id}'
        uploader.destroy(public_id = image_path)

def put_groups(tournament_slug: str, season_no: int):

    # Setup session
    Session: SessionMaker = current_app.session

    request_body: dict = request.json
    with Session() as session:

        query = select(Tournaments).where(and_(
            Tournaments.slug_name == tournament_slug.lower(),
            Tournaments.season_no == season_no
        ))

        tournament = session.execute(query).one_or_none()
        if not tournament:
            return no_tournament_found(tournament_slug, season_no)

        tour: Tournaments = tournament[0]
        theme_image, _, _ = get_image_from_cloudinary(
            public_id = f'hctournaments/{tour.slug_name}/s{season_no}/theme',
            cloud_name = cloud_name,
            data_last_edited = None
        )
        theme_image_link = theme_image.get('secure_url')

        query = select(TeamStandings).where(TeamStandings.tournament_id == tour.tournament_id)
        team_standings_data = session.scalars(query).all()

        distinct_group_ids_before = set([standing.group_id for standing in team_standings_data])

        standings_to_be_updated = []
        deleted_standing_ids = [standing['row_id'] for standing in request_body['deleted']]

        for standing_info in request_body['updated']:
            standings_to_be_updated.append(standing_info)

        if standings_to_be_updated:
            session.execute(update(TeamStandings), standings_to_be_updated)

        for standing_info in request_body['added']:

            new_standing = TeamStandings.from_json(standing_info)
            session.add(new_standing)

        for standing_data in team_standings_data:
            if standing_data.row_id in deleted_standing_ids:
                session.delete(standing_data)

        session.commit()

        team_standings_data = session.scalars(query).all()
        base_image_path = f'hctournaments/{tournament_slug}/s{season_no}/groups'

        distinct_group_ids_after = set([standing.group_id for standing in team_standings_data])
        removed_group_ids = distinct_group_ids_before - distinct_group_ids_after

        # Run in background
        thread_event = Event()
        thread_event.set()

        t1 = Thread(target = remove_deleted_group_images, args = (removed_group_ids, base_image_path))
        t1.start()
        t2 = Thread(target = update_group_images, args = (
            distinct_group_ids_after,
            team_standings_data,
            theme_image_link,
            tour.tournament_name,
            base_image_path
        ))
        t2.start()

    response = make_response(jsonify({'success': True}), 204)
    return response

__callback__ = put_groups