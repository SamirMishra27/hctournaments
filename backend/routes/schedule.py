from flask import jsonify, make_response

from routes import cloud_name
from utils import (
    get_image_from_cloudinary,
    send_404_json_response
)

from traceback import print_exception
from os import listdir

def schedule(tournament_name: str):

    tournament_name = tournament_name.lower()
    if tournament_name not in listdir('data/'):
        return send_404_json_response(
            success = False,
            message = 'Not Found'
        )

    file_path = f'data/{tournament_name}/schedule.txt'
    try:
        with open(file_path, encoding = 'utf-8') as file:
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

    schedule_data = []
    for row in raw_data:
        row_split = row.split('|')
        match_done = True if row_split[1].upper() == 'TRUE' else False
        
        schedule_data.append({
            'MatchNo': int(row_split[0]),
            'MatchStatus': match_done,
            'TeamAName': row_split[2],
            'TeamARuns': row_split[3],
            'TeamAOvers': row_split[4],
            'TeamAWickets': row_split[5],
            'TeamBName': row_split[6],
            'TeamBRuns': row_split[7],
            'TeamBOvers': row_split[8],
            'TeamBWickets': row_split[9]
        })
    schedule_data.sort(key = lambda match: match.get('MatchNo'))

    cloudinary_path = f'hctournaments/{tournament_name}/schedule'
    cloudinary_image, _, _ = get_image_from_cloudinary(
        public_id = cloudinary_path,
        cloud_name = cloud_name,
        data_last_edited = None
    )
    if cloudinary_image is None:
        cloudinary_image_url = ''
    else:
        print('Retrieved an existing image from cloudinary, sending in response')
        cloudinary_image_url = cloudinary_image.get('secure_url')

    json_body = {
        'success': True,
        'message': 'Response contains an Array of objects and an image url',
        'data': schedule_data,
        'cloudinary_url': cloudinary_image_url
    }
    response = make_response(jsonify(json_body), 200)
    return response