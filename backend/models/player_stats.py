from sqlalchemy import Column, CHAR, BIGINT, SMALLINT, VARCHAR
from .base import BaseModel
from constants import USERNAME_MAX_LENGTH, OBJECT_ID_LENGTH

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