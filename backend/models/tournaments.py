from sqlalchemy import Column, BOOLEAN, CHAR, SMALLINT, TIMESTAMP, TEXT
from .base import BaseModel
from constants import OBJECT_ID_LENGTH
from typing import Dict, Union

class Tournaments(BaseModel):
    __tablename__ = 'tournaments'

    tournament_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False, primary_key = True, autoincrement = False, unique = True)
    tournament_name = Column(TEXT, nullable = False)

    created_at = Column(TIMESTAMP, nullable = False)
    published = Column(BOOLEAN, nullable = False)

    slug_name = Column(TEXT, nullable = False)
    season_no = Column(SMALLINT, nullable = False)

    start_date = Column(TIMESTAMP, nullable = False)
    end_date = Column(TIMESTAMP, nullable = False)
    stage = Column(TEXT, nullable = False)

    participants = Column(SMALLINT, nullable = True)
    total_teams = Column(SMALLINT, nullable = True)

    total_matches = Column(SMALLINT, nullable = True)
    matches_done = Column(SMALLINT, nullable = True)

    server_link = Column(TEXT, nullable = True)
    banner_link = Column(TEXT, nullable = True)

    embed_theme_link = Column(TEXT, nullable = True)
    champions_team = Column(TEXT, nullable = True)

    @classmethod
    def from_json(cls, json_data: Dict[str, Union[str, int]]) -> 'Tournaments':

        new_tournament = Tournaments(
            tournament_id = json_data['tournament_id'],
            tournament_name = json_data['tournament_name'],

            created_at = json_data['created_at'],
            published = json_data['published'],

            slug_name = json_data['slug_name'],
            season_no = json_data['season_no'],

            start_date = json_data['start_date'],
            end_date = json_data['end_date'],
            stage = json_data['stage'],

            participants = json_data.get('participants', 0),
            total_teams = json_data.get('total_teams', 0),

            total_matches = json_data.get('total_matches', 0),
            matches_done = json_data.get('matches_done', 0),

            server_link = json_data.get('server_link', ''),
            banner_link = json_data.get('banner_link', ''),
            embed_theme_link = json_data.get('embed_theme_link', ''),

            champions_team = json_data.get('champions_team', '')
        )
        return new_tournament
