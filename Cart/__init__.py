
# @login_required
# def checkout(req):
#     user = req.user
#     cart = Cart.objects.filter(user=user)
#     country = 7
#     shippingrates = ShippingRate.objects.get(country = country)
#     # print(shippingrates.extra_large , shippingrates.large)
    
    
#     for x in cart:
#         products = Product.objects.filter(id = x.productid)
        

#         for y in products:
#             productprice = Productprice.objects.filter(product = y.id , size =x.size)
#             for z in productprice:
#                 print(z.size , ' and ', z.shipping_box)
                
             
            

#     # shippingRate = ShippingRate.objects.all()


   
#     # Calculate total amount in INR
#     total_amount_inr = sum(float(item.price) * item.qty for item in cart)
    

#     # Your API key for the ExchangeRatesAPI
#     # api_key = 'cur_live_bprsosYyOxTW4Tmt7gTzTibq9nogJDWsJszpMh1s'
#     # # api_key = 'cur_live_BdxPwNtyLndkPKvdvAJFAy6cGhYqq6aRhiswS5nP'
#     # # api_key = 'cur_live_oJu1Q26kMbWuWqjVvUsY8lRank8tom04Ich1lDAg'
#     # # api_key = 'cur_live_Qn0EcKkoABzXKAz8Alv9pYq8KAzfF9FCgdJZZT3k'

#     #     # Fetch real-time conversion rate from INR to USD
#     # try:
#     #         # Correct CurrencyAPI URL
#     #         response = requests.get(f'https://api.currencyapi.com/v3/latest?apikey={api_key}&currencies=USD&base_currency=INR')
#     #         data = response.json()
#     #         if response.status_code == 200 and 'data' in data:
#     #             # Get conversion rate from INR to USD
#     #             inr_to_usd_rate = data['data']['USD']['value']
#     #             total_amount_usd = total_amount_inr * inr_to_usd_rate
#     #         else:
#     #             # Handle the case where the API request was not successful
#     #             print('Error fetching conversion rate:', data.get('error', 'Unknown error'))
#     #             total_amount_usd = total_amount_inr  # Fallback to INR amount if API fails
#     # except Exception as e:
#     #         # Handle any exceptions that occur during the API request
#     #         print('Exception during API request:', e)
#     #         total_amount_usd = total_amount_inr * 0.01157  # Fallback to INR amount
#     api_key = 'e953cda389263846602cea63'

#     # Fetch real-time conversion rate from INR to USD
#     try:
#         # Correct CurrencyAPI URL
#         response = requests.get(f'https://v6.exchangerate-api.com/v6/{api_key}/latest/INR')
#         data = response.json()
#         if response.status_code == 200 and 'conversion_rates' in data:
#             # Get conversion rate from INR to USD
#             inr_to_usd_rate = data['conversion_rates']['USD']
#             total_amount_usd = total_amount_inr * inr_to_usd_rate
#         else:
#             # Handle the case where the API request was not successful
#             print('Error fetching conversion rate:', data.get('error', 'Unknown error'))
#             total_amount_usd = total_amount_inr  # Fallback to INR amount if API fails
#     except Exception as e:
#         # Handle any exceptions that occur during the API request
#         print('Exception during API request:', e)
#         total_amount_usd = total_amount_inr * 0.01198 # Fallback to INR amount
    

#     if req.method == "POST":
#         # Capture shipping address details
#         name = req.POST['name']
#         phone = req.POST['phone']
#         address1 = req.POST['address1']
#         address2 = req.POST['address2']
#         country_id = req.POST['country']
#         state_id = req.POST['state']
#         city = req.POST['city']
#         zipcode = req.POST['zipcode']

#         country_fetch = Country.objects.get(id = country_id)
#         country = country_fetch.name
#         state_fetch = State.objects.get(id=state_id)
#         state = state_fetch.name

#         # Create a new shipping address
#         shipping_address = Shipping_address.objects.create(
#             name=name,
#             phone=phone,
#             address1=address1,
#             address2=address2,
#             country=country,
#             state =state,
#             city=city,
#             zipcode = zipcode,
#         )
#         shipping_address.save()
        
#         print('i am in payment mode')
#         payment_method = req.POST.get('paymentMethod')

#         if payment_method == 'paypal':
#             # Setup PayPal payment with USD
#             paypal_dict = {
#                 'business': settings.PAYPAL_RECEIVER_EMAIL,
#                 'amount': f"{total_amount_usd:.2f}",  # Convert amount to 2 decimal places
#                 'item_name': f'Order from {user.username}',
#                 'invoice': str(uuid.uuid4()),
#                 'currency_code': 'USD',     
#                 'notify_url': req.build_absolute_uri(reverse('paypal-ipn')),
#                 'return_url': req.build_absolute_uri(reverse('handle_payment_success', kwargs={'address_id': shipping_address.id})),
#                 'cancel_return': req.build_absolute_uri(reverse('checkout')),
#             }
#             form = PayPalPaymentsForm(initial=paypal_dict)
#             context = {
#                 'order': None,
#                 'shipping_address': shipping_address,
#                 'paypal_form': form
#             }
#             return render(req, 'payments/paypal_payment.html', context)

#         elif payment_method == 'phonepe':
#             # PhonePe integration
#             orderID = "pp-" + str(uuid.uuid4())
#             merchantTransactionID = "MT" + str(uuid.uuid4())

#             # Prepare the payload for PhonePe
#             # payload = {
#             #     "merchantId": settings.PHONEPE_MERCHANT_ID,
#             #     "merchantTransactionId": merchantTransactionID,
#             #     "merchantUserId": str(user.id),
#             #     "amount": int(total_amount_inr * 100),  # INR to paise conversion (multiply by 100)
#             #     "redirectUrl": req.build_absolute_uri(reverse('handle_payment_success_phonepe', kwargs={'address_id': shipping_address.id})),
#             #     "redirectMode": "REDIRECT",  # or "POST"
#             #     "callbackUrl": req.build_absolute_uri(reverse('payment_fail')),
#             #     "mobileNumber": phone,
#             #     "paymentInstrument": {
#             #         "type": "PAY_PAGE"
#             #     }
#             # }
#             payload = {
#         "merchantId": settings.PHONEPE_MERCHANT_ID,
#         "merchantTransactionId": merchantTransactionID,
#         "merchantUserId": str(user.id),
#         "amount": int(total_amount_inr * 100),  # INR to paise conversion (multiply by 100)
#         "redirectUrl": req.build_absolute_uri(reverse('handle_payment_success_phonepe', kwargs={'address_id': shipping_address.id})),
#         "cancelUrl": req.build_absolute_uri(reverse('payment_fail')),  # Redirect to Payment Failed page if canceled
#         "redirectMode": "REDIRECT",  # or "POST"
#         "callbackUrl": req.build_absolute_uri(reverse('phonepe_callback')),
#         "mobileNumber": phone,
#         "paymentInstrument": {
#             "type": "PAY_PAGE"
#         }
#     }

#             # Convert payload to base64
#             payload_json = json.dumps(payload)
#             base64_request = base64.b64encode(payload_json.encode()).decode()

#             # Generate the X-VERIFY header
#             endpoint = "/pg/v1/pay"  # API endpoint for payment
#             combined_string = base64_request + endpoint + settings.PHONEPE_SALT_KEY
#             finalXHeader = hashlib.sha256(combined_string.encode()).hexdigest() + "###" + settings.PHONEPE_SALT_INDEX

#             # Prepare the headers
#             headers = {
#                 "Content-Type": "application/json",
#                 "X-VERIFY": finalXHeader
#             }

#             # Prepare the request body
#             req_body = {"request": base64_request}

#             # Send the POST request to the PhonePe sandbox URL
#             response = requests.post(settings.PHONEPE_PAYMENT_URL, headers=headers, json=req_body)

#             # Handle the response
#             if response.status_code == 200:
#                 res_data = response.json()
#                 if res_data.get('success'):
#                     # Extract the payment redirect URL
#                     payment_url = res_data["data"]["instrumentResponse"]["redirectInfo"]["url"]
#                     return redirect(payment_url)
#                 else:
#                     # Handle error returned in the response
#                     print("PhonePe payment initiation failed:", res_data.get("message"))
#                     return redirect(reverse('payment_fail'))
#                     # return JsonResponse({"error": res_data.get("message")}, status=400)
#             else:
#                 # Handle HTTP errors
#                 # print("PhonePe payment initiation failed with HTTP status:", response.status_code)    
#                 # print("Response text:", response.text)
#                 # return JsonResponse({"error": "PhonePe payment initiation failed."}, status=500)
#                  return redirect(reverse('payment_fail'))   


#     # Initial rendering to capture shipping details
#     phonepe_url = "https://phonepe.com/payment-page-url" 

#     countries = Country.objects.all()
    


#     queryser = {'item': cart, 'total_amount': total_amount_inr,'phonepe_url': phonepe_url, 'allcat':cat, 'countries':countries}

    
    
#     return render(req, 'cart/checkout.html', queryser)


