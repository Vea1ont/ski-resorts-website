from sqlalchemy import Column, Integer, String, Boolean
from app.db import Base

class Resort(Base):
    __tablename__ = "resorts_card"

    id = Column(Integer, primary_key=True)

    image = Column(String)
    name = Column(String)
    city = Column(String)

    address = Column(String)
    card_hero_info = Column(String)

    length = Column(Integer)

    count_trails = Column(Integer)
    peak_height = Column(Integer)

    beginners = Column(Boolean)
    medium = Column(Boolean)
    advanced = Column(Boolean)
    expert = Column(Boolean)