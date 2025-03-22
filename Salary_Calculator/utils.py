from datetime import datetime


def calculate_daily_difference(entry):
    """Calculate the difference in work hours"""
    if entry.start_time and entry.end_time:
        # Total worked duration
        work_duration = datetime.combine(entry.date, entry.end_time) - datetime.combine(entry.date, entry.start_time)

        # Deduct lunch break if available
        if entry.lunch_start and entry.lunch_end:
            lunch_duration = datetime.combine(entry.date, entry.lunch_end) - datetime.combine(entry.date, entry.lunch_start)
            work_duration -= lunch_duration

        # Convert to seconds and compare with expected 8 hours
        total_seconds = work_duration.total_seconds() - EXPECTED_DAILY_SECONDS
        return format_difference(total_seconds)
    
    return "+0 hrs : 0 min"  # Default if no time is entered




def calculate_daily_difference1(entry):
    """Calculate the difference in work hours"""
    if entry.start_time and entry.end_time:
        # Total worked duration
        START_TIME = datetime.combine(entry.date, entry.start_time)
        END_TIME = datetime.combine(entry.date, entry.end_time)
        # print(START_TIME)
        # print(END_TIME)
        work_duration =  END_TIME- START_TIME
        print(work_duration)

        # Deduct lunch break if available
        if entry.lunch_start and entry.lunch_end:
            lunch_duration = datetime.combine(entry.date, entry.lunch_end) - datetime.combine(entry.date, entry.lunch_start)
            work_duration -= lunch_duration

        # Convert to seconds and compare with expected 8 hours
        total_seconds = work_duration.total_seconds() 
        
        return sec_to_hours(total_seconds)
    
    return 0  # Default if no time is entered





timingsR= 8 * 3600 - 1200
timings = 8 * 3600 

EXPECTED_DAILY_SECONDS = timingsR # 8 hours in seconds




def format_difference(total_seconds):
    """Format difference as +X hrs : Y min"""
    sign = "+" if total_seconds >= 0 else "-"
    total_seconds = abs(total_seconds)
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    return f"{sign}{int(hours)} hrs : {int(minutes)} min"


def sec_to_hours(seconds):
    hours = seconds / 3600
    return hours


import math

def round_custom(value):
    decimal_part = value - math.floor(value)
    if decimal_part > 0.6:
        return math.floor(value) + 1
    return math.floor(value)
