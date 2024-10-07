
from django import template

register = template.Library()

@register.filter
def capitalize_first(value):
    """Capitalize the first letter and make the rest lowercase."""
    if not isinstance(value, str):
        return value
    return value.capitalize()