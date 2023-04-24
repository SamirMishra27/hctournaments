from flask import jsonify, make_response

from routes import cloud_name
from utils import (
    cloudinary_upload, 
    compare_image_versions,
    get_image_from_cloudinary,
    send_404_json_response
)

from json import load
from traceback import print_exception
from os import listdir, path
from io import BytesIO

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

def generate_new_image(tournament_name, group_name, group_points_table):

    image = None
    white_color = (255, 255, 255)
    font_large = ImageFont.truetype('assets/CoreSansD65Heavy.otf', 56)
    font_small = ImageFont.truetype('assets/CoreSansD65Heavy.otf', 32)

    with Image.open(f'data/{tournament_name}/template.jpeg') as holder_image:
        image = holder_image.copy()
        image_draw = ImageDraw.Draw(image)

    group_name = group_name.replace('_', ' ').upper()
    image_draw.text(
        xy = (image.size[0] / 2, 150),
        text = 'POINTS TABLE - ' + group_name,
        fill = white_color,
        font = font_large,
        anchor = 'ma'
    )

    for coordinates, text, align in (
        ((300, 290), '\n\n'.join([ team['team_name'].upper() for team in group_points_table ]), 'right'),
        ((675, 290), '\n\n'.join([ str(team['matches_played']) for team in group_points_table ]), 'center'),
        ((850, 290), '\n\n'.join([ str(team['matches_won']) for team in group_points_table ]), 'center'),
        ((1025, 290), '\n\n'.join([ str(team['matches_lost']) for team in group_points_table ]), 'center'),
        ((1200, 290), '\n\n'.join([ str(team['points']) for team in group_points_table ]), 'center')
    ):
        image_draw.multiline_text(
            xy = coordinates,
            text = text,
            fill = white_color,
            font = font_small,
            anchor = 'ma',
            align = align,
            spacing = 4.0
        )
    
    buffer = BytesIO()
    image.save(buffer, format = 'jpeg')
    buffer.seek(0)

    image.close()
    return buffer

def groups(tournament_name: str, group_name: str):

    tournament_name = tournament_name.lower()
    group_name = group_name.lower()

    if tournament_name not in listdir('data/'):
        return send_404_json_response(
            success = False,
            message = 'Not Found'
        )
    
    file_path = f'data/{tournament_name}/groups.json'
    try:
        with open(file_path, encoding = 'utf-8') as file:
            data_last_edited = path.getmtime(file_path)
            data: dict = load(file)

    except Exception as e:
        print_exception(e, e, e.__traceback__)
        return send_404_json_response(
            success = False,
            message = 'An Unexpected Error Occurred',
            error = str(e)
        )
    
    if group_name not in data.keys():
        return send_404_json_response(
            success = False,
            message = 'Group not found in this tournament'
        )
    
    group_points_table = data[group_name]
    group_points_table = sorted(group_points_table, key = lambda x: x.get('points'), reverse = True)

    cloudinary_path = f'hctournaments/{tournament_name}/{group_name}'
    cloudinary_image, image_needs_update, log_msg = get_image_from_cloudinary(
        public_id = cloudinary_path,
        cloud_name = cloud_name,
        data_last_edited = data_last_edited
    )

    if image_needs_update or cloudinary_image is None:
        print(log_msg)
        # Image was either not found in storage
        # Or last image was created over a day ago
        image_buffer = generate_new_image(tournament_name, group_name, group_points_table)

        upload_response = cloudinary_upload(image_buffer, group_name, f'hctournaments/{tournament_name}')
        cloudinary_image_url = upload_response.get('secure_url')

        if cloudinary_image is not None:
            compare_image_versions(upload_response, cloudinary_image)

    else:
        print('Retrieved an existing image from cloudinary, sending in response')
        cloudinary_image_url = cloudinary_image.get('secure_url')

    json_body = {
        'success': True,
        'message': 'Response contains sorted Array of objects and an image url',
        'data': group_points_table,
        'cloudinary_url': cloudinary_image_url
    }
    response = make_response(jsonify(json_body), 200)
    return response
