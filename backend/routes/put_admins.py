from flask import jsonify, make_response, current_app, request
from sqlalchemy import select, update

from custom_types import SessionMaker
from models import Admins

from json import dumps

__all__ = ['ROUTE', 'METHOD', '__callback__']

# Define route & method
ROUTE = '/admins'
METHOD = ['PUT']

def put_admins():

    # Setup session
    Session: SessionMaker = current_app.session

    client_data: dict = request.json
    deleted_admin_ids = [admin_info['user_id'] for admin_info in client_data['deleted']]

    with Session() as session:
        admins_data = session.scalars(select(Admins)).all()

        rows_to_be_updated = []
        for admin_info in client_data['updated']:
            rows_to_be_updated.append({
                'user_id' : admin_info['user_id'],
                'roles' : dumps(admin_info['roles'])
            })

        if rows_to_be_updated:
            session.execute(update(Admins), rows_to_be_updated)

        for admin_info in client_data['added']:
            session.add(Admins.from_json(admin_info))

        for admin in admins_data:
            if admin.user_id in deleted_admin_ids:
                session.delete(admin)

        session.commit()

    response = make_response(jsonify({'message' : 'success'}), 204)
    return response

__callback__ = put_admins