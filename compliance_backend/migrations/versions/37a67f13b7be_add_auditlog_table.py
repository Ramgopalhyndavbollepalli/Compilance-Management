"""Add AuditLog table

Revision ID: 37a67f13b7be
Revises: e19639676850
Create Date: 2024-11-01 20:26:31.407864

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '37a67f13b7be'
down_revision = 'e19639676850'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('audit_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('user', sa.String(length=80), nullable=False),
    sa.Column('action', sa.String(length=120), nullable=False),
    sa.Column('details', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('audit_logs')
    # ### end Alembic commands ###
