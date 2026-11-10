from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import inspect

from app.core.config import settings
from app.database.session import Base, engine
from app.models import models as _models  # noqa: F401 - register all tables


def migrate_schema() -> None:
    """Apply schema-only migrations, safely recognizing an existing unversioned schema."""
    project_dir = Path(__file__).resolve().parents[2]
    config = Config(str(project_dir / "alembic.ini"))
    config.set_main_option("script_location", str(project_dir / "migrations"))
    config.set_main_option("sqlalchemy.url", settings.DATABASE_URL.replace("%", "%%"))

    existing_tables = set(inspect(engine).get_table_names())
    model_tables = set(Base.metadata.tables)

    if "alembic_version" not in existing_tables and existing_tables.intersection(model_tables):
        # Adopt the current schema as the initial baseline; create only missing tables.
        # Existing table data is untouched. Future revisions still run normally.
        Base.metadata.create_all(bind=engine)
        command.stamp(config, "0001_initial")

    command.upgrade(config, "head")
