from django.apps import AppConfig


class SettingsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app_settings'
    verbose_name = 'Settings Management'

    def ready(self):
        import app_settings.signals  # noqa
