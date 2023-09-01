from sqlalchemy import Column, CHAR, FLOAT, SMALLINT, VARCHAR
from .base import BaseModel
from constants import *

class Matches(BaseModel):
    __tablename__ = 'matches'

    match_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False, primary_key = True, autoincrement = False)
    season_no = Column(SMALLINT, nullable = False)

    title = Column(VARCHAR(250), nullable = True)
    description = Column(VARCHAR(500), nullable = False)
    status = Column(VARCHAR(ENUM_MAX_LENGTH), nullable = False)

    team_a_name = Column(VARCHAR(TEAM_NAME_MAX_LENGTH), nullable = False)
    team_a_runs = Column(SMALLINT, nullable = True)
    team_a_overs = Column(FLOAT, nullable = True)
    team_a_wickets = Column(SMALLINT, nullable = True)

    team_b_name = Column(VARCHAR(TEAM_NAME_MAX_LENGTH), nullable = False)
    team_b_runs = Column(SMALLINT, nullable = True)
    team_b_overs = Column(FLOAT, nullable = True)
    team_b_wickets = Column(SMALLINT, nullable = True)

    winner_name = Column(VARCHAR(TEAM_NAME_MAX_LENGTH), nullable = True)