from sqlalchemy import Column, CHAR, SMALLINT, TIMESTAMP, VARCHAR
from .base import BaseModel
from constants import *
from typing import Dict, Union

class Tournaments(BaseModel):
    __tablename__ = 'tournaments'

    tournament_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False, primary_key = True, autoincrement = False, unique = True)
    tournament_name = Column(VARCHAR(100), nullable = False)

    slug_name = Column(VARCHAR(50), nullable = False)
    season_no = Column(SMALLINT, nullable = False)

    start_date = Column(TIMESTAMP, nullable = False)
    end_date = Column(TIMESTAMP, nullable = False)
    stage = Column(VARCHAR(ENUM_MAX_LENGTH), nullable = False)

    participants = Column(SMALLINT, nullable = True)
    total_teams = Column(SMALLINT, nullable = True)

    total_matches = Column(SMALLINT, nullable = True)
    matches_done = Column(SMALLINT, nullable = True)

    server_link = Column(VARCHAR(250), nullable = True)
    banner_link = Column(VARCHAR(250), nullable = True)
    embed_theme_link = Column(VARCHAR(250), nullable = True)

    champions_team = Column(VARCHAR(TEAM_NAME_MAX_LENGTH), nullable = True)

    @classmethod
    def from_json(cls, json_data: Dict[str, Union[str, int]]) -> 'Tournaments':

        new_tournament = Tournaments(
            tournament_id = json_data['tournament_id'],
            tournament_name = json_data['tournament_name'],

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
