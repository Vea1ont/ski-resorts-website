from sqladmin import ModelView
from app.schemas.orm_resorts import Resort

class ResortAdmin(ModelView, model=Resort):
    column_list = [
        Resort.id,
        Resort.image,
        Resort.name,
        Resort.city,
        Resort.address,
        Resort.card_hero_info,
        Resort.length,
        Resort.count_trails,
        Resort.peak_height,
        Resort.beginners,
        Resort.medium,
        Resort.advanced,
        Resort.expert
    ]