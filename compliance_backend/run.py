# run.py
from app import create_app, db
from flask_migrate import Migrate

app = create_app()
migrate = Migrate(app, db)  # Ensure migrate is set up with the app and db

if __name__ == "__main__":
    app.run(debug=True)
