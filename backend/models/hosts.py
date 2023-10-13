from sqlalchemy import Column, CHAR, BIGINT, SMALLINT, TEXT
from .base import BaseModel
from constants import OBJECT_ID_LENGTH
from typing import Dict, Union

class Hosts(BaseModel):
    __tablename__ = 'hosts'

    row_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False, primary_key = True, autoincrement = False, unique = True)
    tournament_id = Column(CHAR(OBJECT_ID_LENGTH), nullable = False, autoincrement = False)
    row_no = Column(SMALLINT, nullable = False)

    user_id = Column(BIGINT, nullable = False)
    name = Column(TEXT, nullable = False)
    username = Column(TEXT, nullable = False)
    avatar_url = Column(TEXT, nullable = False)

    @classmethod
    def from_json(cls, json_data: Dict[str, Union[str, int]]) -> 'Hosts':

        new_host = cls(
            row_id = json_data['row_id'],
            tournament_id = json_data['tournament_id'],
            row_no = json_data['row_no'],
            user_id = json_data.get('user_id'),
            name = json_data.get('name'),
            username = json_data.get('username'),
            avatar_url = json_data.get('avatar_url')
        )
        return new_host
