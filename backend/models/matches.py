from sqlalchemy import Column, CHAR, FLOAT, SMALLINT, TEXT
from .base import BaseModel
from constants import OBJECT_ID_LENGTH
from typing import Dict, Union

class Matches(BaseModel):
    __tablename__ = 'matches'

    match_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False, primary_key = True, autoincrement = False, unique = True)
    tournament_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False)
    row_no = Column(SMALLINT, nullable = False)

    title = Column(TEXT, nullable = False)
    description = Column(TEXT, nullable = True)
    status = Column(TEXT, nullable = False)

    team_a_name = Column(TEXT, nullable = False)
    team_a_runs = Column(SMALLINT, nullable = True)
    team_a_overs = Column(FLOAT, nullable = True)
    team_a_wickets = Column(SMALLINT, nullable = True)

    team_b_name = Column(TEXT, nullable = False)
    team_b_runs = Column(SMALLINT, nullable = True)
    team_b_overs = Column(FLOAT, nullable = True)
    team_b_wickets = Column(SMALLINT, nullable = True)

    winner_name = Column(TEXT, nullable = True)

    @classmethod
    def from_json(cls, json_data: Dict[str, Union[str, int]]) -> 'Matches':

        new_match = Matches(
            match_id = json_data['match_id'],
            tournament_id = json_data['tournament_id'],
            row_no = json_data['row_no'],
            title = json_data['title'],
            description = json_data.get('description'),
            status = json_data['status'],
            team_a_name = json_data['team_a_name'],
            team_a_runs = json_data.get('team_a_runs'),
            team_a_overs = json_data.get('team_a_overs'),
            team_a_wickets = json_data.get('team_a_wickets'),
            team_b_name = json_data['team_b_name'],
            team_b_runs = json_data.get('team_b_runs'),
            team_b_overs = json_data.get('team_b_overs'),
            team_b_wickets = json_data.get('team_b_wickets'),
            winner_name = json_data.get('winner_name')
        )
        return new_match
