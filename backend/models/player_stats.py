from sqlalchemy import Column, CHAR, BIGINT, SMALLINT, TEXT
from .base import BaseModel
from constants import OBJECT_ID_LENGTH
from typing import Dict, Union

class PlayerStats(BaseModel):
    __tablename__ = 'player_stats'

    row_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False, primary_key = True, autoincrement = False, unique = True)
    tournament_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False)
    row_no = Column(SMALLINT, nullable = False)

    user_id = Column(BIGINT, nullable = False)
    player_name = Column(TEXT, nullable = False)

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
            row_no = json_data['row_no'],
            user_id = json_data['user_id'],
            player_name = json_data['player_name'],
            runs = json_data['runs'],
            balls = json_data['balls'],
            runs_given = json_data['runs_given'],
            balls_given = json_data['balls_given'],
            wickets = json_data['wickets']
        )
        return new_player_stats
