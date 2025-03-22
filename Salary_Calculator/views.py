from django.shortcuts import render, get_object_or_404, redirect
from django.utils.timezone import now
from django.contrib import messages
from .models import TimeTable, Tailor, Week
from .utils import *
from datetime import datetime, timedelta

def manager_dashboard(request):
    total_tailors = Tailor.objects.count()
    tailors = Tailor.objects.all()
    return render(request, "tailors/manager_dashboard.html", {
        "total_tailors": total_tailors,
        "tailors": tailors
    })

def manager_dashboard_admin(request):
    total_tailors = Tailor.objects.count()
    tailors = Tailor.objects.all()
    return render(request, "tailors/manager_dashboard_admin.html", {
        "total_tailors": total_tailors,
        "tailors": tailors
    })



def tailor_detail(request, tailor_id):
    if request.method == "POST":
        new_tailor_id = request.POST.get("tailor_id")
        if new_tailor_id:
            return redirect("tailor_detail", tailor_id=new_tailor_id)
    tailor = get_object_or_404(Tailor, id=tailor_id)
    weeks = Week.objects.all().order_by("start_date")
    tailors = Tailor.objects.all()
    current_week = Week.objects.filter(start_date__lte=datetime.now().date(), end_date__gte=datetime.now().date()).first()
    
    selected_week_id = request.GET.get("week_id", current_week.id if current_week else None)
    selected_week = get_object_or_404(Week, id=selected_week_id) if selected_week_id else None
    timetables = TimeTable.objects.filter(tailor=tailor, week=selected_week) if selected_week else TimeTable.objects.filter(tailor=tailor)

    # Add calculated difference for each entry
    for entry in timetables:
        entry.difference = calculate_daily_difference(entry)

    return render(request, "tailors/tailor_detail.html", {
        "tailor": tailor,
        "tailors": tailors,
        "weeks": weeks,
        "selected_week": selected_week,
        "current_week": current_week,
        "timetables": timetables
    })


def add_time_entry(request, tailor_id):
    tailor = get_object_or_404(Tailor, id=tailor_id)
    current_week = Week.objects.filter(start_date__lte=now().date(), end_date__gte=now().date()).first()
    
    if not current_week:
        messages.error(request, "No active week found.")
        return redirect("tailor_detail", tailor_id=tailor.id)
    
    existing_entry = TimeTable.objects.filter(tailor=tailor, date=now().date()).first()
    if existing_entry:
        messages.warning(request, "An entry for today already exists.")
        return redirect("tailor_detail", tailor_id=tailor.id)
    
    TimeTable.objects.create(
        tailor=tailor,
        date=now().date(),
        week=current_week,
        day=now().strftime("%A"),
        year=now().year
    )
    
    messages.success(request, "New entry added successfully.")
    return redirect("tailor_detail", tailor_id=tailor.id)


def edit_time_entry(request, entry_id):
    entry = get_object_or_404(TimeTable, id=entry_id)

    if request.method == "POST":
        entry.start_time = request.POST.get("start_time") or entry.start_time
        entry.lunch_start = request.POST.get("lunch_start") or entry.lunch_start
        entry.lunch_end = request.POST.get("lunch_end") or entry.lunch_end
        entry.end_time = request.POST.get("end_time") or entry.end_time
        
        entry.save()
        messages.success(request, "Time entry updated successfully.")
        return redirect("tailor_detail", tailor_id=entry.tailor.id)

    return render(request, "tailors/edit_time_entry.html", {"entry": entry})






def tailor_salary(request, tailor_id):
    if request.method == "POST":
        new_tailor_id = request.POST.get("tailor_id")
        if new_tailor_id:
            return redirect("tailor_salary", tailor_id=new_tailor_id)
    tailor = get_object_or_404(Tailor, id=tailor_id)
    weeks = Week.objects.all().order_by("start_date")
    tailors = Tailor.objects.all()
    current_week = Week.objects.filter(start_date__lte=datetime.now().date(), end_date__gte=datetime.now().date()).first()
    
    selected_week_id = request.GET.get("week_id", current_week.id if current_week else None)
    selected_week = get_object_or_404(Week, id=selected_week_id) if selected_week_id else None
    timetables = TimeTable.objects.filter(tailor=tailor, week=selected_week) if selected_week else TimeTable.objects.filter(tailor=tailor)

    # Add calculated difference for each entry
    set_add = 0 
    for entry in timetables:
        # print(set_add)
        set_add += calculate_daily_difference1(entry)
        
        entry.difference = calculate_daily_difference(entry)
        

    
    tailor_base_salary = tailor.base_salary
    # print(tailor_base_salary)
    Weekly_hour = ((EXPECTED_DAILY_SECONDS*6)/(3600))
    # Weekly_hour = 48

    net_earned =  (float(tailor_base_salary) / Weekly_hour ) * set_add
    # print(Weekly_hour)
    print(net_earned)

    return render(request, "tailors/tailor_salary.html", {
        "tailor": tailor,
        "tailors": tailors,
        "weeks": weeks,
        "selected_week": selected_week,
        "current_week": current_week,
        "timetables": timetables,
        'net_earned': round_custom(net_earned),
    })