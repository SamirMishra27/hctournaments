from sqlalchemy import Column, CHAR, SMALLINT, TIMESTAMP, VARCHAR
from .base import BaseModel
from constants import *

class Tournaments(BaseModel):
    __tablename__ = 'tournaments'

    tournament_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False, primary_key = True, autoincrement = False)
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