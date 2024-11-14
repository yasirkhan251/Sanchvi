from Cart.models import Order 
def generate_invoice_number():
    prefix = "SAN"
    
    # Fetch the last order that has a valid invoice number
    last_order = Order.objects.exclude(invoice__isnull=True).exclude(invoice__exact='').order_by('-invoice').first()

    if last_order and last_order.invoice.startswith(prefix):
        # Extract the numeric part from the last invoice number
        last_number = int(last_order.invoice[len(prefix):])
        new_number = last_number + 1
    else:
        # Start from 1 if no previous invoice exists
        new_number = 1

    # Format the new invoice number with leading zeros (e.g., SAN00001)
    new_invoice_number = f"{prefix}{new_number:05d}"
    return new_invoice_number
