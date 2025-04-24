import uuid
from django.db import models
from django.utils import timezone
from users.models import CustomUser

class Category(models.Model):
    TYPE_CHOICES = [('income', 'Income'), ('expense', 'Expense')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    icon = models.CharField(max_length=100, blank=True, null=True)
    color = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        unique_together = ('user', 'name', 'type')

    def __str__(self):
        return f"{self.name} ({self.type})"

    def clean(self):
        self.name = self.name.strip().title()

class Transaction(models.Model):
    RECURRENCE_CHOICES = [('none', 'None'), ('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly')]
    TYPE_CHOICES = [('income', 'Income'), ('expense', 'Expense')]

    CATEGORY_CHOICES = [
        #Expenses
        ("Food", "Food"),
        ("Transport", "Transport"),
        ("Utilities", "Utilities"),
        ("Shopping", "Shopping"),
        ("Entertainment", "Entertainment"),
        ("Healthcare", "Healthcare"),
        
        #Incomes
        ("Salary", "Salary"),
        ("Freelance", "Freelance"),
        ("Investments", "Investments"),
        ("Consulting", "Consulting"),
        ("Online Sales", "Online Sales"),
        ("Gifts", "Gifts"),


    ]

    CATEGORY_COLORS = {
    #Expenses
    "Food": "#FF6384",
    "Transport": "#36A2EB",
    "Utilities": "#FFCE56",
    "Shopping": "#4BC0C0",
    "Entertainment": "#9966FF",
    "Healthcare": "#FF9F40",

    # Incomes
    "Salary": "#00C49F",
    "Freelance": "#FF4444",
    "Investments": "#8BC34A",
    "Consulting": "#4CAF50",
    "Online Sales": "#2196F3",
    "Gifts": "#9C27B0",
    }

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='transactions')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="EUR")
    converted_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    date = models.DateTimeField(default=timezone.now)
    description = models.TextField(blank=True, null=True)
    recurrence = models.CharField(max_length=10, choices=RECURRENCE_CHOICES, default='none')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='expense')

    def __str__(self):
        return f"{self.amount} - {self.category}"

    def get_category_color(self):
        return self.CATEGORY_COLORS.get(self.category, "#000000") 


class Budget(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='budgets')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='budgets')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.category.name} Budget"


class Report(models.Model):
    TYPE_CHOICES = [('pie', 'Pie'), ('bar', 'Bar'), ('line', 'Line')]
    PERIOD_CHOICES = [('weekly', 'Weekly'), ('monthly', 'Monthly'), ('yearly', 'Yearly')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reports')
    report_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    time_period = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    favorite = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.report_type} report - {self.time_period}"


class ExchangeRate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    base_currency = models.CharField(max_length=10)
    target_currency = models.CharField(max_length=10)
    rate = models.DecimalField(max_digits=10, decimal_places=4)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.base_currency} → {self.target_currency}: {self.rate}"
