from django.apps import AppConfig
from django.db import connection, OperationalError, ProgrammingError

class SchedulerConfig(AppConfig):
    name = "scheduler"

    def ready(self):
        try:
            table_names = connection.introspection.table_names()
        except (OperationalError, ProgrammingError):
            return

        if "django_apscheduler_djangojob" in table_names:
            from . import jobs  #
        else:
            print("[APS] skipping scheduler startup; django_apscheduler tables missing")
