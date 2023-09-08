from sqlalchemy.orm import Session, sessionmaker
from typing import Callable, List, TypeVar

TYPE = TypeVar('TYPE')

class RouteInfo:
    ROUTE: str
    METHOD: List[str]
    __callback__: Callable

SessionMaker = sessionmaker[Session]