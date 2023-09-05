from sqlalchemy.orm import DeclarativeBase
from typing import Any, Dict, Union

class BaseModel(DeclarativeBase):

    def from_json(self, json_data: Dict[str, Any]) -> Any:
        raise NotImplementedError

    def to_json(self) -> Dict[str, Union[str, int]]:
        json_data = {}

        for key, value in vars(self).items():
            if not key.startswith('_'):
                json_data[key] = value

        return json_data
