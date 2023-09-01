from sqlalchemy import Column, BIGINT, SMALLINT, VARCHAR
from .base import BaseModel
from constants import USERNAME_MAX_LENGTH

class Hosts(BaseModel):
    __tablename__ = 'hosts'

    season_no = Column(SMALLINT, nullable = False)
    user_id = Column(BIGINT, nullable = False, primary_key = True)

    name = Column(VARCHAR(100), nullable = False)
    username = Column(VARCHAR(USERNAME_MAX_LENGTH), nullable = False)
    avatar_url = Column(VARCHAR(250), nullable = False)