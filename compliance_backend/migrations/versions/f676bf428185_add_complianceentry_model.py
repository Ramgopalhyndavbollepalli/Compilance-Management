"""Add ComplianceEntry model

Revision ID: f676bf428185
Revises: b2c75acfe551
Create Date: 2024-11-08 18:26:49.564564

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f676bf428185'
down_revision = 'b2c75acfe551'
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
