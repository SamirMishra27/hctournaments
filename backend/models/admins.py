from sqlalchemy import Column, BIGINT, JSON
from .base import BaseModel

class Admins(BaseModel):
    __tablename__ = 'admins'

    user_id = Column(BIGINT, nullable = False, primary_key = True)
    roles = Column(JSON, nullable = False)