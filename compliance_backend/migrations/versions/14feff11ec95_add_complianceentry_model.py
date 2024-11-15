"""Add ComplianceEntry model

Revision ID: 14feff11ec95
Revises: 2347e24b04e5
Create Date: 2024-11-01 22:30:16.458696

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '14feff11ec95'
down_revision = '2347e24b04e5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('compliance_entries',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('user', sa.String(length=80), nullable=True),
    sa.Column('details', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('compliance_entries')
    # ### end Alembic commands ###
