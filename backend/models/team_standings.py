from sqlalchemy import Column, BOOLEAN, CHAR, FLOAT, SMALLINT, TEXT
from .base import BaseModel
from constants import OBJECT_ID_LENGTH
from typing import Dict, Union

class TeamStandings(BaseModel):
    __tablename__ = 'team_standings'

    row_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False, primary_key = True, autoincrement = False, unique = True)
    tournament_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False)
    row_no = Column(SMALLINT, nullable = False)

    group_name = Column(TEXT, nullable = False)
    group_id = Column(TEXT, nullable = False)

    team_name = Column(TEXT, nullable = False)
    matches_played = Column(SMALLINT, nullable = False)
    matches_won = Column(SMALLINT, nullable = False)
    matches_lost = Column(SMALLINT, nullable = False)

    points_multiplier = Column(SMALLINT, nullable = False)
    points = Column(SMALLINT, nullable = False)

    runs_per_wicket_ratio = Column(FLOAT, nullable = True)
    priority = Column(SMALLINT, nullable = False)

    qualified = Column(BOOLEAN, nullable = True)

    @classmethod
    def from_json(self, json_data: Dict[str, Union[str, int, bool]]) -> 'TeamStandings':

        new_team_standing = TeamStandings(
            row_id = json_data['row_id'],
            tournament_id = json_data['tournament_id'],
            row_no = json_data['row_no'],
            group_name = json_data['group_name'],
            group_id = json_data['group_id'],
            team_name = json_data['team_name'],
            matches_played = json_data['matches_played'],
            matches_won = json_data['matches_won'],
            matches_lost = json_data['matches_lost'],
            points_multiplier = json_data['points_multiplier'],
            points = json_data['points'],
            runs_per_wicket_ratio = json_data.get('runs_per_wicket_ratio', 0),
            priority = json_data['priority'],
            qualified = json_data.get('qualified', False)
        )
        return new_team_standing
