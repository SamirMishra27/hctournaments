from sqlalchemy import Column, TEXT, JSON
from .base import BaseModel
from typing import Dict, Union

from json import dumps
from typing import Dict, Union

class Admins(BaseModel):
    __tablename__ = 'admins'

    user_id = Column(TEXT, nullable = False, primary_key = True, unique = True)
    roles = Column(JSON, nullable = False)

    @classmethod
    def from_json(self, json_data: Dict[str, Union[str, int]]) -> 'Admins':

        new_admin = Admins(
            user_id = json_data['user_id'],
            roles = dumps(json_data['roles'])
        )
        return new_admin
