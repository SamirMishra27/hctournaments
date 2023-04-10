import cloudinary
from json import load

with open('config.json') as file:
    config = load(file)
    cloud_name = config['CLOUDINARY_CLOUD_NAME']

cloudinary.config(
    cloud_name = config['CLOUDINARY_CLOUD_NAME'],
    api_key = config['CLOUDINARY_API_KEY'],
    api_secret = config['CLOUDINARY_API_SECRET'],
    secure = True
)

from .tournaments import tournaments
from .groups import groups
from .playerstats import playerstats
from .schedule import schedule