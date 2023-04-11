from flask import jsonify, make_response

from routes import cloud_name
from utils import (
    get_image_from_cloudinary,
    send_404_json_response
)

from json import load
from traceback import print_exception
from os import listdir

def schedule(tournament_name: str):

    tournament_name = tournament_name.lower()
    if tournament_name not in listdir('data/'):
        return send_404_json_response(
            success = False,
            message = 'Not Found'
        )
    
    file_path = f'data/{tournament_name}/schedule.json'
    try:
        with open(file_path, encoding = 'utf-8') as file:
            data: dict = load(file)

    except Exception as e:
        print_exception(e, e, e.__traceback__)
        return send_404_json_response(
            success = False,
            message = 'An Unexpected Error Occurred',
            error = str(e)
        )
    
    cloudinary_path = f'hctournaments/{tournament_name}/schedule'
    cloudinary_image, _ = get_image_from_cloudinary(
        public_id = cloudinary_path, cloud_name = cloud_name
    )
    if cloudinary_image is None:
        cloudinary_image_url = ''
    else:
        print('Retrieved an existing image from cloudinary, sending in response')
        cloudinary_image_url = cloudinary_image.get('secure_url')

    json_body = {
        'success': True,
        'message': 'Response contains an Array of objects and an image url',
        'data': data,
        'cloudinary_url': cloudinary_image_url
    }
    response = make_response(jsonify(json_body), 200)
    return response