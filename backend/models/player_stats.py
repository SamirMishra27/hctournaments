from sqlalchemy import Column, CHAR, BIGINT, SMALLINT, VARCHAR
from .base import BaseModel
from constants import USERNAME_MAX_LENGTH, OBJECT_ID_LENGTH
from typing import Dict, Union

class PlayerStats(BaseModel):
    __tablename__ = 'player_stats'

    row_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False, primary_key = True, autoincrement = False)
    tournament_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False)

    user_id = Column(BIGINT, nullable = False, primary_key = True)
    player_name = Column(VARCHAR(USERNAME_MAX_LENGTH), nullable = False)

    runs = Column(SMALLINT, nullable = False)
    balls = Column(SMALLINT, nullable = False)

    runs_given = Column(SMALLINT, nullable = False)
    balls_given = Column(SMALLINT, nullable = False)

    wickets = Column(SMALLINT, nullable = False)

    @classmethod
    def from_json(self, json_data: Dict[str, Union[str, int]]) -> 'PlayerStats':

        new_player_stats = PlayerStats(
            row_id = json_data['row_id'],
            tournament_id = json_data['tournament_id'],
            user_id = json_data['user_id'],
            player_name = json_data['player_name'],
            runs = json_data['runs'],
            balls = json_data['balls'],
            runs_given = json_data['runs_given'],
            balls_given = json_data['balls_given'],
            wickets = json_data['wickets']
        )
        return new_player_stats
