from sqlalchemy import Column, CHAR, BIGINT, VARCHAR
from .base import BaseModel
from constants import USERNAME_MAX_LENGTH, OBJECT_ID_LENGTH

class Hosts(BaseModel):
    __tablename__ = 'hosts'

    row_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False, primary_key = True, autoincrement = False)
    tournament_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False, autoincrement = False)
    user_id = Column(BIGINT, nullable = False)

    name = Column(VARCHAR(100), nullable = False)
    username = Column(VARCHAR(USERNAME_MAX_LENGTH), nullable = False)
    avatar_url = Column(VARCHAR(250), nullable = False)