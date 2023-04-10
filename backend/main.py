from flask import Flask
from flask_cors import CORS

from json import load
with open('config.json') as f:
    config = load(f)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

from routes import (
    tournaments,
    groups,
    playerstats,
    schedule
)

app.add_url_rule('/tournaments/<string:tournament_name>', view_func = tournaments)
app.add_url_rule('/groups/<string:tournament_name>/<string:group_name>', view_func = groups)
app.add_url_rule('/playerstats/<string:tournament_name>', view_func = playerstats)
app.add_url_rule('/schedule/<string:tournament_name>', view_func = schedule)

if __name__ == "__main__":
    app.logger.warning("Running flask server...")
    app.run(
        host = config.get('HOST', '0.0.0.0'),
        port = config.get('PORT', 3000),
        debug = False if config.get('STAGE') == 'PROD' else True,
        ssl_context = ('cert.pem', 'key.pem') if config.get('STAGE') == 'PROD' else None
    )