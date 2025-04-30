from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from django.utils import timezone
from datetime import timedelta
from users.models import CustomUser

def delete_old_guests():
    cutoff = timezone.now() - timedelta(days=3)
    expired = CustomUser.objects.filter(is_guest=True, created_at__lt=cutoff)
    count = expired.count()
    expired.delete()
    print(f"[APS] Deleted {count} guest users")

scheduler = BackgroundScheduler()
scheduler.add_jobstore(DjangoJobStore(), "default")
scheduler.add_job(
    delete_old_guests,
    "cron",
    hour=2, minute=0,
    name="delete_expired_guest_accounts",
    jobstore="default",
)
scheduler.start()
