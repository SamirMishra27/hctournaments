from functools import reduce

from flask import jsonify, make_response
from cloudinary.exceptions import NotFound
import cloudinary.uploader
import cloudinary.api

def sort_multiple(sequence, *sort_order):
    """Sort a sequence by multiple criteria.

    Accepts a sequence and 0 or more (key, reverse) tuples, where
    the key is a callable used to extract the value to sort on
    from the input sequence, and reverse is a boolean dictating if
    this value is sorted in ascending or descending order.

    """
    return reduce(
        lambda s, order: sorted(s, key=order[0], reverse=order[1]),
        reversed(sort_order),
        sequence
    )

def cloudinary_upload(image_buffer, public_id, save_path):
    """
    Helper function to upload a new generated image
    to cloudinary object storage.
    """
    response: dict = cloudinary.uploader.upload(
        file = image_buffer,
        use_filename = True ,
        public_id = public_id,
        unique_filename = False,
        overwrite = True,
        folder = save_path
    )
    return response

def get_image_from_cloudinary(public_id, cloud_name, data_last_edited):

    MAX_TIME_DIFF = 60 * 10
    cloudinary_image = None
    image_needs_update = False
    log_msg = ''

    try:
        cloudinary_image = cloudinary.api.resource(public_id = public_id, cloud_name = cloud_name)
        # The 'version' of an image is a UNIX timestamp indicating
        # The last time an image with same public_id was uploaded
        image_updated_at = int(cloudinary_image.get('version'))
        if data_last_edited is not None:
            if image_updated_at < data_last_edited and data_last_edited - image_updated_at > MAX_TIME_DIFF:
                log_msg = 'Data was most recently updated than image was. Creating a new image'
                image_needs_update = True

    except NotFound as e:
        log_msg = 'Image not found in cloudinary. Creating a new image'
        cloudinary_image = None

    return cloudinary_image, image_needs_update, log_msg

def compare_image_versions(upload_response, cloudinary_image):

    if upload_response.get('version') == cloudinary_image.get('version'):
        print(
            'New image\'s content are the same as of the older image. '
            'Cloudinary didn\'t update and kept the old image'
        )

def send_404_json_response(**kwargs):

    json_body = {}
    for key, value in kwargs.items():
        json_body.update({ str(key) : value })

    response = make_response(jsonify(json_body), 404)
    return response
