import os

class Config:
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://admin:ABCabc12345*@compliance-db-cluster-instance-1.c54wmay6kgmd.us-east-1.rds.amazonaws.com/compliance"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "fd44d1a0d24b1aede134c3ecf2096498")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "2644ccdbf0de695762f2d947536e33a4")
