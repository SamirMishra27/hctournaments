from flask import jsonify, make_response

from routes import cloud_name
from utils import (
    cloudinary_upload,
    compare_image_versions, 
    get_image_from_cloudinary, 
    send_404_json_response,
    sort_multiple
)

from os import listdir, path
from operator import itemgetter
from traceback import print_exception
from io import BytesIO
from textwrap import shorten

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont

def generate_new_image(name, top_ten_batting, top_ten_bowling):

    image = None
    white_color = (255, 255, 255)
    font_large = ImageFont.truetype('assets/CoreSansD65Heavy.otf', 64)
    font_small = ImageFont.truetype('assets/CoreSansD65Heavy.otf', 28)

    with Image.open(f'data/{name}/template.jpeg') as holder_image:
        image = holder_image.copy()
        image_draw = ImageDraw.Draw(image)

    image_draw.text(xy = (350, 120), text = 'Orange Cap', fill = white_color, font = font_large, anchor = 'ma')
    image_draw.text(xy = (1050, 120), text = 'Purple Cap', fill = white_color, font = font_large, anchor = 'ma')

    def short(text):
        return shorten(text, width = 20, placeholder = '...')

    image_draw.multiline_text(
        xy = (120, 220),
        text = 'Player\n\n' + '\n\n'.join([
            short(player['name']) for player in top_ten_batting
        ]),
        fill = white_color,
        font = font_small,
    )
    image_draw.multiline_text(
        xy = (520, 220),
        text = 'Runs\n\n' + '\n\n'.join([
            str(player['runs']) for player in top_ten_batting
        ]),
        fill = white_color,
        font = font_small,
        align = 'center'
    )
    image_draw.multiline_text(
        xy = (830, 220),
        text = 'Player\n\n' + '\n\n'.join([
            short(player['name']) for player in top_ten_bowling
        ]),
        fill = white_color,
        font = font_small,
    )
    image_draw.multiline_text(
        xy = (1230, 220),
        text = 'Wickets\n\n' + '\n\n'.join([
            str(player['wickets']) for player in top_ten_bowling
        ]),
        fill = white_color,
        font = font_small,
        align = 'center'
    )

    buffer = BytesIO()
    image.save(buffer, format = 'jpeg')
    buffer.seek(0)

    image.close()
    return buffer

def playerstats(tournament_name: str):

    tournament_name = tournament_name.lower()
    if tournament_name not in listdir('data/'):
        return send_404_json_response(
            success = False,
            message = 'Not Found'
        )
    
    file_path = f'data/{tournament_name}/stats.txt'
    try:
        with open(file_path, encoding = 'utf-8') as file:
            data_last_edited = path.getmtime(file_path)
            raw_data = file.read()

    except Exception as e:
        print_exception(e, e, e.__traceback__)
        return send_404_json_response(
            success = False,
            message = 'An Unexpected Error Occurred',
            error = str(e)
        )

    raw_data = raw_data.split('\n')
    raw_data.remove(raw_data[0])

    stats_data = []
    for row in raw_data:
        row_split = row.split('|')[1 : -1]
        # Because first and last occurrences
        # Are just empty strings '' so trim it

        stats_data.append({
            'name': str(row_split[0]).strip(),
            'id': int(row_split[1]),
            'runs': int(row_split[2]),
            'balls': int(row_split[3]),
            'runs_given': int(row_split[4]),
            'balls_given': int(row_split[5]),
            'wickets': int(row_split[6])
        })

    top_ten_batting = sort_multiple(
        stats_data,
        ( itemgetter('runs'), True ),
        ( itemgetter('balls'), False )
    )[0:10]
    top_ten_bowling = sort_multiple(
        stats_data,
        ( itemgetter('wickets'), True ),
        ( itemgetter('runs_given'), False ),
        ( itemgetter('balls_given'), False )
    )[0:10]

    cloudinary_path = f'hctournaments/{tournament_name}/playerstats'
    cloudinary_image, image_needs_update, log_msg = get_image_from_cloudinary(
        public_id = cloudinary_path,
        cloud_name = cloud_name,
        data_last_edited = data_last_edited
    )

    if image_needs_update or cloudinary_image is None:
        print(log_msg)
        # Image was either not found in storage
        # Or last image was created over a day ago
        image_buffer = generate_new_image(tournament_name, top_ten_batting, top_ten_bowling)

        upload_response = cloudinary_upload(image_buffer, 'playerstats', f'hctournaments/{tournament_name}')
        cloudinary_image_url = upload_response.get('secure_url')

        if cloudinary_image is not None:
            compare_image_versions(upload_response, cloudinary_image)

    else:
        print('Retrieved an existing image from cloudinary, sending in response')
        cloudinary_image_url = cloudinary_image.get('secure_url')

    json_body = {
        'success': True,
        'message': 'Response contains unsorted & sorted Array of objects and an image url',
        'full_data': stats_data,
        'top_ten_batting': top_ten_batting,
        'top_ten_bowling': top_ten_bowling,
        'cloudinary_url': cloudinary_image_url
    }
    response = make_response(jsonify(json_body), 200)
    return response
