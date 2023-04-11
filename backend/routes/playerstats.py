from flask import jsonify, make_response
from cloudinary.exceptions import NotFound
import cloudinary.api

from routes import cloud_name
from utils import sort_multiple, cloudinary_upload, DAY

from os import listdir
from operator import itemgetter
from traceback import print_exception
from datetime import datetime
from io import BytesIO

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

    top_ten_batting_string = ''
    top_ten_bowling_string = ''

    for player in top_ten_batting:
        player_name = player['name'][:15]
        player_runs = player['runs']
        top_ten_batting_string += '{:^15} - {:^15}\n\n'.format(player_name, player_runs)

    for player in top_ten_bowling:
        player_name = player['name'][:15]
        player_runs = player['runs']
        top_ten_bowling_string += '{:^15} - {:^15}\n\n'.format(player_name, player_runs)

    image_draw.multiline_text(
        xy = (180, 220),
        text = top_ten_batting_string,
        fill = white_color,
        font = font_small,
    )
    image_draw.multiline_text(
        xy = (860, 220),
        text = top_ten_bowling_string,
        fill = white_color,
        font = font_small,
    )

    buffer = BytesIO()
    image.save(buffer, format = 'jpeg')
    buffer.seek(0)

    image.close()
    return buffer

def playerstats(tournament_name: str):

    tournament_name = tournament_name.lower()
    if tournament_name not in listdir('data/'):
        json_body = {
            'success': False,
            'message': 'Not Found'
        }
        response = make_response(jsonify(json_body), 404)
        return response
    
    file_path = f'data/{tournament_name}/stats.txt'
    try:
        with open(file_path, encoding = 'utf-8') as file:
            raw_data = file.read()

    except Exception as e:
        print_exception(e, e, e.__traceback__)
        json_body = {
            'success': False,
            'message': 'An Unexpected Error Occurred',
            'error': str(e)
        }
        response = make_response(jsonify(json_body), 404)
        return response

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
    )[0:11]
    top_ten_bowling = sort_multiple(
        stats_data,
        ( itemgetter('wickets'), True ),
        ( itemgetter('runs_given'), False ),
        ( itemgetter('balls_given'), False )
    )[0:11]

    cloudinary_path = f'hctournaments/{tournament_name}/playerstats'
    try:
        cloudinary_image = cloudinary.api.resource(public_id = cloudinary_path, cloud_name = cloud_name)
        
        image_creation_date = cloudinary_image.get('created_at')
        image_creation_date = datetime.strptime(image_creation_date, '%Y-%m-%dT%H:%M:%SZ')

        if (datetime.now() - image_creation_date).total_seconds() > DAY:
            print("image created a day ago")
            cloudinary_image = None

    except NotFound as e:
        print("image not found in cloudinary")
        cloudinary_image = None

    if cloudinary_image is None:
        # Image was either not found in storage
        # Or last image was created over a day ago
        image_buffer = generate_new_image(tournament_name, top_ten_batting, top_ten_bowling)

        upload_response = cloudinary_upload(image_buffer, 'playerstats', f'hctournaments/{tournament_name}')
        cloudinary_image_url = upload_response.get('secure_url')

    else:
        print("retrieved an existing image from cloudinary, sending in response")
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
