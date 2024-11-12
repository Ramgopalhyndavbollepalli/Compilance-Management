"""empty message

Revision ID: 897ea4651afc
Revises: 0eb58dc8b9e4
Create Date: 2024-11-05 10:20:25.551699

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '897ea4651afc'
down_revision = '0eb58dc8b9e4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_foreign_key(None, 'notifications', 'users', ['user_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'notifications', type_='foreignkey')
    # ### end Alembic commands ###
