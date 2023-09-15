from flask import jsonify, make_response, request, current_app
from sqlalchemy import and_, select

from custom_types import SessionMaker
from models import Tournaments

from utils import (
    font_of_size,
    cloudinary_upload,
    send_404_json_response
)

from io import BytesIO
from requests import get
from PIL import Image, ImageDraw

__all__ = ['ROUTE', 'METHOD', '__callback__']

# Define route & method
ROUTE = '/tournaments/<string:tournament_slug>/<int:season_no>'
METHOD = ['POST']

def generate_new_image(image_link, primary_text, secondary_text) -> BytesIO:

    # Step 1 Get image data from url
    response = get(image_link)
    response.raise_for_status()

    # Step 2 Construct image in PIL
    image = Image.open(BytesIO(response.content))
    if image.width != 1280 or image.height != 720:
        image = image.resize(size = (1280, 720), box = (0, 0, 1280, 720))
    image_draw = ImageDraw.Draw(image)

    # Step 3 Write necessary text
    for xy, text, align, font_size in [
        [(90, 90), primary_text, 'center', font_of_size(64)],
        [(90, 200), secondary_text, 'center', font_of_size(40)]
    ]:
        image_draw.text(xy = xy, text = text, align = align, font = font_size)

    # Step 4 Convert new image to buffer and return it
    image_buffer = BytesIO()

    image.save(image_buffer, 'jpeg')
    image.close()

    image_buffer.seek(0)
    return image_buffer

def update_embed_images(theme_image_link, tourney_name, slug_name, season_no) -> str:

    # This is the theme background, it has no text
    base_path = f'hctournaments/{slug_name}/s{season_no}'
    cloudinary_upload(theme_image_link, 'theme', base_path)

    # This will have the tournament's name and season
    # Stored with tournament metadata
    image_buffer = generate_new_image(theme_image_link, tourney_name, f'SEASON {season_no}')
    upload_response = cloudinary_upload(image_buffer, 'info', base_path)
    embed_theme_link = upload_response.get('secure_url')

    # This one is for matches page
    image_buffer = generate_new_image(theme_image_link, tourney_name, 'SCHEDULE & RESULTS')
    cloudinary_upload(image_buffer, 'matches', base_path)

    return embed_theme_link

def post_tournaments(tournament_slug: str, season_no: int):

    # Setup session
    Session: SessionMaker = current_app.session

    request_body: dict = request.json
    if not request_body:
        return send_404_json_response(
            success = False,
            message = 'No body provided'
        )

    missing_keys = []
    for key in ('tournament_id', 'tournament_name', 'slug_name', 'season_no', 'start_date', 'end_date', 'stage'):
        if key not in request_body:
            missing_keys.append(key)

    if missing_keys:
        return send_404_json_response(
            success = False,
            message = 'Missing the following important parameters: {}'.format(', '.join(missing_keys))
        )

    slug_name = request_body.get('slug_name')
    season_no = request_body.get('season_no')
    theme_image_link = request_body.get('embed_theme_link')

    query = select(Tournaments).where(and_(
        Tournaments.slug_name == slug_name,
        Tournaments.season_no == season_no
    ))
    with Session() as session:

        data = session.scalars(query).all()
        if data:
            return send_404_json_response(
                success = False,
                message = 'Tournament entity with the same `slug_name` and `season_no` already exists'
            )

        # Create new tournament row
        new_tournament = Tournaments.from_json(request_body)

        # Create embed images in cloudinary and get the link for 'info'
        new_tournament.embed_theme_link = update_embed_images(
            theme_image_link,
            new_tournament.tournament_name,
            slug_name,
            season_no
        )

        # Create entry in the database
        session.add(new_tournament)
        session.commit()

    json_body = request_body
    json_body['success'] = True
    json_body['embed_theme_link'] = new_tournament.embed_theme_link

    response = make_response(jsonify(json_body), 201)
    return response

__callback__ = post_tournaments