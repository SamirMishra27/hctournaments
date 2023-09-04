from sqlalchemy import Column, BOOLEAN, CHAR, FLOAT, SMALLINT, VARCHAR
from .base import BaseModel
from constants import *

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