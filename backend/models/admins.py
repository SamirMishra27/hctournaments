from sqlalchemy import Column, TEXT, JSON, SMALLINT
from .base import BaseModel
from typing import Dict, Union

from json import dumps
from typing import Dict, Union

class Admins(BaseModel):
    __tablename__ = 'admins'

    user_id = Column(TEXT, nullable = False, primary_key = True, unique = True)
    row_no = Column(SMALLINT, nullable = False)

    name = Column(TEXT, nullable = False)
    roles = Column(JSON, nullable = False)

    @classmethod
    def from_json(self, json_data: Dict[str, Union[str, int]]) -> 'Admins':

        new_admin = Admins(
            user_id = json_data['user_id'],
            row_no = json_data['row_no'],
            name = json_data['name'],
            roles = dumps(json_data['roles'])
        )
        return new_admin
