from flask import jsonify, make_response, current_app, request
from sqlalchemy import and_, select, update

from custom_types import SessionMaker
from models import PlayerStats, Tournaments
from utils import (
    font_of_size,
    cloudinary_upload,
    get_image_from_cloudinary,
    send_404_json_response,
    sort_multiple,
    cloud_name,
)

from io import BytesIO
from requests import get
from operator import attrgetter
from typing import Sequence
from PIL import Image, ImageDraw

__all__ = ['ROUTE', 'METHOD', '__callback__']

# Define route & method
ROUTE = '/playerstats/<string:tournament_slug>/<int:season_no>'
METHOD = ['PUT']

def generate_new_image(image_link, tourney_name, player_stats_data: Sequence[PlayerStats]) -> BytesIO:

    # Step 1 Get image data from url
    response = get(image_link)
    response.raise_for_status()

    # Step 2 Construct image in PIL
    image = Image.open(BytesIO(response.content))
    if image.width != 1280 or image.height != 720:
        image = image.resize(size = (1280, 720), box = (0, 0, 1280, 720))
    image_draw = ImageDraw.Draw(image)

    # Step 3 get top ten batters & bowlers
    top_ten_batters = sort_multiple(
        player_stats_data,
        ( attrgetter('runs'), True ),
        ( attrgetter('balls'), False )
    )[0:10]
    top_ten_bowlers = sort_multiple(
        player_stats_data,
        ( attrgetter('wickets'), True ),
        ( attrgetter('runs_given'), False ),
        ( attrgetter('balls_given'), False )
    )[0:10]

    # Step 4 Write necessary text
    length = len(top_ten_batters)
    y_coord = 180
    font = font_of_size(28)

    for i in range(length):

        image_draw.multiline_text(xy = (95, y_coord), text = str(top_ten_batters[i].player_name), align = 'center', font = font)

        image_draw.multiline_text(xy = (465, y_coord), text = str(top_ten_batters[i].runs), align = 'center', font = font)

        image_draw.multiline_text(xy = (780, y_coord), text = str(top_ten_bowlers[i].player_name), align = 'center', font = font)

        image_draw.multiline_text(xy = (1140, y_coord), text = str(top_ten_bowlers[i].wickets), align = 'center', font = font)

        y_coord += 50

    for coordinate, text, font_size in [
        [(90, 40), tourney_name, 60],
        [(1040, 55), 'STATS', 48],
        [(95, 140), 'Orange Cap', 20],
        [(465, 140), 'Runs', 20],
        [(780, 140), 'Purple Cap', 20],
        [(1125, 140), 'Wickets', 20]
    ]:
        image_draw.multiline_text(xy = coordinate, text = text, align = 'center', font = font_of_size(font_size))

    # Step 5 Convert new image to buffer and return it
    image_buffer = BytesIO()

    image.save(image_buffer, 'jpeg')
    image.close()

    image_buffer.seek(0)
    return image_buffer

def put_playerstats(tournament_slug: str, season_no: int):

    # Setup session
    Session: SessionMaker = current_app.session

    request_body: dict = request.json
    with Session() as session:

        # Get tournament id, name and embed link
        query = select(
            Tournaments.tournament_id,
            Tournaments.slug_name,
            Tournaments.tournament_name,
            Tournaments.embed_theme_link
        ).where(and_(
            Tournaments.slug_name == tournament_slug.lower(),
            Tournaments.season_no == season_no
        ))
        tournament_id, slug_name, tournament_name, embed_image_link = session.execute(query).one()

        theme_image, _, _ = get_image_from_cloudinary(
            public_id = f'hctournaments/{slug_name}/s{season_no}/theme',
            cloud_name = cloud_name,
            data_last_edited = None
        )
        theme_image_link = theme_image.get('secure_url')

        query = select(PlayerStats).where(PlayerStats.tournament_id == tournament_id)
        player_stats_data = session.scalars(query).all()

        players_to_be_updated = []
        deleted_stats_ids = [player_info['row_id'] for player_info in request_body['deleted']]

        for player_info in request_body['updated']:
            players_to_be_updated.append(player_info)

        if players_to_be_updated:
            session.execute(update(PlayerStats), players_to_be_updated)

        for player_info in request_body['added']:

            new_player = PlayerStats.from_json(player_info)
            session.add(new_player)

        for player_data in player_stats_data:
            if player_data.row_id in deleted_stats_ids:
                session.delete(player_data)

        session.commit()

        player_stats_data = session.scalars(query).all()
        image_buffer = generate_new_image(theme_image_link, tournament_name, player_stats_data)

        image_path = f'hctournaments/{tournament_slug}/s{season_no}'
        cloudinary_upload(image_buffer, 'playerstats', image_path)

    response = make_response(jsonify({'success': True}), 204)
    return response

__callback__ = put_playerstats