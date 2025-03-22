from django.db import models
import datetime

class Tailor(models.Model):
    name = models.CharField(max_length=100)
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Week(models.Model):
    week_number = models.IntegerField()
    year = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()

    class Meta:
        unique_together = ("week_number", "year")

    def __str__(self):
        return f"Week {self.week_number}, {self.year} ({self.start_date} - {self.end_date})"

class TimeTable(models.Model):
    DAYS_OF_WEEK = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
    ]
    tailor = models.ForeignKey(Tailor, on_delete=models.CASCADE, related_name="timetables")
    week = models.ForeignKey(Week, on_delete=models.CASCADE, related_name="timetables", blank=True, null=True)
    date = models.DateField()
    day = models.CharField(max_length=20, editable=True, choices=DAYS_OF_WEEK,)  # Auto-set from date
    year = models.IntegerField(editable=True)  # Auto-fetch, no manual input
    start_time = models.TimeField(null=True, blank=True)  # Can be empty
    end_time = models.TimeField(null=True, blank=True)  # Can be empty
    lunch_start = models.TimeField(null=True, blank=True)  # Can be empty
    lunch_end = models.TimeField(null=True, blank=True)  # Can be empty

    def save(self, *args, **kwargs):
        if self.date:
            if self.date.weekday() == 6:  # Prevent Sundays
                raise ValueError("Sundays are not allowed!")
            
            self.day = self.date.strftime("%A")  # Auto-fetch day
            self.year = self.date.year  # Auto-fetch year
            
            # Prevent editing past week data
            today = datetime.date.today()
            week_start = self.date - datetime.timedelta(days=self.date.weekday())  # Monday of that week
            week_end = week_start + datetime.timedelta(days=6)  # Sunday of that week

            if week_end < today:  # If the week is already over
                raise ValueError("You cannot edit data from past weeks!")
            
             # Auto-fetch correct Week entry
            try:
                self.week = Week.objects.get(start_date__lte=self.date, end_date__gte=self.date)
            except Week.DoesNotExist:
                raise ValueError("No matching week found for this date!")

        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.tailor.name} - {self.date} (Week {self.week.week_number} of {self.year})"
