from sqlalchemy import Column, BIGINT, JSON
from .base import BaseModel
from typing import Dict, Union

from json import loads
from typing import Dict, Union

class Admins(BaseModel):
    __tablename__ = 'admins'

    user_id = Column(BIGINT, nullable = False, primary_key = True)
    roles = Column(JSON, nullable = False)

    @classmethod
    def from_json(self, json_data: Dict[str, Union[str, int]]) -> 'Admins':

        new_admin = Admins(
            user_id = json_data['user_id'],
            roles = loads(json_data['roles'])
        )
        return new_admin
