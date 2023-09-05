from sqlalchemy import Column, BOOLEAN, CHAR, FLOAT, SMALLINT, VARCHAR
from .base import BaseModel
from constants import *
from typing import Dict, Union

class TeamStandings(BaseModel):
    __tablename__ = 'team_standings'

    row_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False, primary_key = True, autoincrement = False)
    tournament_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False)

    group_name = Column(VARCHAR(100), nullable = False)
    group_id = Column(VARCHAR(50), nullable = False)

    team_name = Column(VARCHAR(TEAM_NAME_MAX_LENGTH), nullable = False)
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
            row_id = ['row_id'],
            tournament_id = ['tournament_id'],
            group_name = ['group_name'],
            group_id = ['group_id'],
            team_name = ['team_name'],
            matches_played = ['matches_played'],
            matches_won = ['matches_won'],
            matches_lost = ['matches_lost'],
            points_multiplier = ['points_multiplier'],
            points = ['points'],
            runs_per_wicket_ratio = json_data.get('runs_per_wicket_ratio', 0),
            priority = json_data['priority'],
            qualified = json_data.get('qualified', False)
        )
        return new_team_standing
