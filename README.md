<h1 align="center">🛍️ Sanchvi Studio</h1>

<p align="center">
  <strong>A full-featured Django e-commerce platform for fashion & apparel shopping</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white">
  <img src="https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django&logoColor=white">
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/Bootstrap-UI-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">
  <img src="https://img.shields.io/badge/PayPal-Payments-00457C?style=for-the-badge&logo=paypal&logoColor=white">
  <img src="https://img.shields.io/badge/PhonePe-UPI-5F259F?style=for-the-badge">
</p>

---

<h2>🎯 What This Project Offers</h2>

<p>
<strong>Sanchvi Studio</strong> is a Django-powered e-commerce platform designed
for selling fashion and apparel products online.
</p>

<p>
The project provides the complete shopping workflow from
<strong>product discovery → product customization → cart → shipping →
payment → order confirmation → order history</strong>.
</p>

<p>
It also contains an administration system for managing products, categories,
orders, users and other operational data.
</p>

---

<h2>✨ Highlighted Features</h2>

<table>
<tr>

<td width="33%" align="center" valign="top">

<h3>🛍️ Online Store</h3>

<p>
Browse categories, products, product details and featured collections.
</p>

</td>

<td width="33%" align="center" valign="top">

<h3>👕 Product Variants</h3>

<p>
Support for age/size-based pricing, color selections and multiple product images.
</p>

</td>

<td width="33%" align="center" valign="top">

<h3>🛒 Shopping Cart</h3>

<p>
Add products, select size/color, change quantity and review totals.
</p>

</td>

</tr>

<tr>

<td align="center" valign="top">

<h3>💳 Online Payments</h3>

<p>
Payment workflows for PayPal and PhonePe/UPI are integrated into checkout.
</p>

</td>

<td align="center" valign="top">

<h3>📦 Order Management</h3>

<p>
Create orders, track order states, generate invoices and view order history.
</p>

</td>

<td align="center" valign="top">

<h3>🚚 Shipping</h3>

<p>
Country/state selection and shipping-rate calculation are incorporated into checkout.
</p>

</td>

</tr>

<tr>

<td align="center" valign="top">

<h3>🔐 Authentication</h3>

<p>
Custom Django user model with signup, login and account management.
</p>

</td>

<td align="center" valign="top">

<h3>👑 Admin Dashboard</h3>

<p>
Dedicated administration interfaces for managing the store and operational data.
</p>

</td>

<td align="center" valign="top">

<h3>📨 Customer Communication</h3>

<p>
Contact forms, feedback and order-related email functionality.
</p>

</td>

</tr>
</table>

---

<h2>🧠 How It Works</h2>

```text
                    🌐 Sanchvi Store
                           │
                           ▼
                 ┌───────────────────┐
                 │ Product Discovery  │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Product Details   │
                 │ Size / Color      │
                 │ Price / Images    │
                 └─────────┬─────────┘
                           │
                           ▼
                    🛒 Shopping Cart
                           │
                           ▼
                 ┌───────────────────┐
                 │     Checkout      │
                 │ Address / Shipping│
                 └─────────┬─────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
           💳 PhonePe             💳 PayPal
                │                     │
                └──────────┬──────────┘
                           ▼
                    ✅ Payment Success
                           │
                           ▼
                    📦 Order Created
                           │
                           ▼
                🧾 Invoice / Confirmation
                           │
                           ▼
                    📋 My Orders
```

---

<h2>🏗️ Application Architecture</h2>

<table>
<tr>
<th>Application</th>
<th>Responsibility</th>
</tr>

<tr>
<td><code>Accounts</code></td>
<td>Authentication, custom user model, signup, login, profile and user activity.</td>
</tr>

<tr>
<td><code>Products</code></td>
<td>Categories, products, prices, colors, images, search and product pages.</td>
</tr>

<tr>
<td><code>Cart</code></td>
<td>Shopping cart, shipping addresses, shipping rates, checkout calculations and order creation.</td>
</tr>

<tr>
<td><code>Payments</code></td>
<td>Payment processing and payment-success/failure workflows.</td>
</tr>

<tr>
<td><code>Admin</code></td>
<td>Store administration and management interfaces.</td>
</tr>

<tr>
<td><code>Message</code></td>
<td>Customer communication, feedback and email-related functionality.</td>
</tr>

<tr>
<td><code>Salary_Calculator</code></td>
<td>Additional salary/time-calculation functionality included in the project.</td>
</tr>
</table>

---

<h2>🛠️ Software & Technologies Used</h2>

<table>
<tr>
<th>Technology</th>
<th>Purpose</th>
</tr>

<tr>
<td>🐍 Python</td>
<td>Primary programming language</td>
</tr>

<tr>
<td>🌐 Django</td>
<td>Backend framework and application architecture</td>
</tr>

<tr>
<td>🗄️ SQLite</td>
<td>Default development database</td>
</tr>

<tr>
<td>🎨 HTML5</td>
<td>Server-rendered web interface</td>
</tr>

<tr>
<td>🎨 CSS3</td>
<td>Custom styling and responsive presentation</td>
</tr>

<tr>
<td>⚡ JavaScript</td>
<td>Interactive product, cart and checkout functionality</td>
</tr>

<tr>
<td>🅱️ Bootstrap</td>
<td>UI components and responsive layouts used across parts of the frontend</td>
</tr>

<tr>
<td>🖼️ Pillow</td>
<td>Image processing and media handling</td>
</tr>

<tr>
<td>💳 PayPal SDK / IPN</td>
<td>PayPal payment integration</td>
</tr>

<tr>
<td>📱 PhonePe</td>
<td>UPI payment integration</td>
</tr>

<tr>
<td>📧 SMTP / Gmail</td>
<td>Email delivery for application workflows</td>
</tr>

<tr>
<td>🌍 Exchange Rate API</td>
<td>Currency conversion used in payment/shipping-related calculations</td>
</tr>
</table>

---

<h2>💻 System Requirements</h2>

<ul>
<li>Windows, Linux or macOS</li>
<li>Python 3.x</li>
<li>pip</li>
<li>Git</li>
<li>Modern web browser</li>
<li>Internet connection for external payment/email/API integrations</li>
<li>Sufficient disk space for product images and uploaded media</li>
</ul>

---

<h2>📦 Installation & Setup</h2>

<h3>1️⃣ Clone the Repository</h3>

```bash
git clone https://github.com/yasirkhan251/Sanchvi.git
cd Sanchvi
```

<h3>2️⃣ Create a Virtual Environment</h3>

```bash
python -m venv venv
```

<p><strong>Windows:</strong></p>

```bash
venv\Scripts\activate
```

<p><strong>Linux / macOS:</strong></p>

```bash
source venv/bin/activate
```

<h3>3️⃣ Install Project Dependencies</h3>

<p>
The repository currently does not contain a root <code>requirements.txt</code>,
so dependencies should be installed based on the imported project libraries.
</p>

```bash
pip install django pillow requests mutagen paypal
```

<p>
Depending on the exact PayPal package version and other installed modules,
you may need to install the corresponding Django/PayPal integration package
used by the project.
</p>

---

<h2>🗄️ Database Setup</h2>

<p>
Sanchvi currently uses SQLite as its default database configuration.
</p>

```bash
python manage.py makemigrations
python manage.py migrate
```

<p>
Create an administrative account when required:
</p>

```bash
python manage.py createsuperuser
```

---

<h2>⚙️ Configuration</h2>

<p>
The main configuration file is:
</p>

```text
Sanchvi/settings.py
```

<p>
Important configuration areas include:
</p>

<ul>
<li>🔐 Django secret key</li>
<li>🌐 Allowed hosts</li>
<li>🗄️ Database settings</li>
<li>📁 Static files</li>
<li>🖼️ Media files</li>
<li>📧 SMTP email configuration</li>
<li>💳 PayPal configuration</li>
<li>📱 PhonePe configuration</li>
</ul>

---

<h2>🔐 Authentication System</h2>

<p>
Sanchvi uses a custom Django user model:
</p>

```python
AUTH_USER_MODEL = 'Accounts.MyUser'
```

<p>
The user model contains store-specific account information including:
</p>

<ul>
<li>👤 Username</li>
<li>📧 Email</li>
<li>📱 Phone number</li>
<li>🆔 Generated server ID</li>
<li>👑 User/admin role flags</li>
<li>🖼️ Profile image</li>
<li>📅 Date joined</li>
</ul>

<h3>Authentication Flow</h3>

```text
New Customer
     │
     ▼
   Signup
     │
     ▼
Account Created
     │
     ▼
   Login
     │
     ▼
Browse Store
```

---

<h2>🛍️ Product Management</h2>

<p>
Products are organized into categories and support multiple product attributes.
</p>

<h3>📂 Categories</h3>

<p>
Categories include a name, description/detail, image and active/inactive state.
</p>

<h3>👕 Products</h3>

<p>
Each product supports:
</p>

<ul>
<li>Product image</li>
<li>Unique product code</li>
<li>Name</li>
<li>Description</li>
<li>Category</li>
<li>Active/inactive state</li>
</ul>

<h3>📏 Size-Based Pricing</h3>

<p>
The project includes age-based size options ranging from infant sizes through
children's and teenager sizes.
</p>

Examples:

```text
0-6 months
6-12 months
1-2 years
2-3 years
...
13-14 years
14-15 years
15+ years
```

<h3>🎨 Color Variants</h3>

<p>
Products can also contain associated color options.
</p>

<h3>🖼️ Multiple Product Images</h3>

<p>
Products can have additional gallery images through the product-image model.
</p>

---

<h2>🔎 Product Discovery & Search</h2>

<p>
The storefront provides multiple ways to discover products.
</p>

<ul>
<li>📂 Browse by category</li>
<li>🔍 Search by product name</li>
<li>↕️ Sort products by price</li>
<li>🖼️ Product image galleries</li>
<li>📄 Dedicated product-detail pages</li>
</ul>

<p>
The category listing supports price ordering such as:
</p>

```text
Low → High
High → Low
Default
```

---

<h2>🛒 Shopping Cart</h2>

<p>
The cart system stores customer-selected products together with their chosen
size, color, quantity and applicable pricing.
</p>

<h3>Cart Data</h3>

<table>
<tr>
<th>Field</th>
<th>Purpose</th>
</tr>

<tr>
<td>Product</td>
<td>Selected product</td>
</tr>

<tr>
<td>Size</td>
<td>Selected size/age group</td>
</tr>

<tr>
<td>Color</td>
<td>Selected color</td>
</tr>

<tr>
<td>Quantity</td>
<td>Requested quantity</td>
</tr>

<tr>
<td>Price</td>
<td>Applicable product price</td>
</tr>

<tr>
<td>Box Size</td>
<td>Shipping/package size information</td>
</tr>
</table>

---

<h2>🚚 Shipping & Checkout</h2>

<p>
Checkout collects shipping information and calculates applicable shipping
charges.
</p>

<p>
The application has support for:
</p>

<ul>
<li>🌍 Country selection</li>
<li>🗺️ State selection</li>
<li>🏙️ City / area information</li>
<li>📮 ZIP/postal code</li>
<li>📦 Shipping box size</li>
<li>💰 Country-specific shipping rates</li>
<li>🧮 Total-price calculation</li>
</ul>

<p>
The checkout flow also supports promotional-code UI and a WhatsApp contact
option for shipping-price discussions.
</p>

---

<h2>💳 Payment Integration</h2>

<h3>🟣 PayPal</h3>

<p>
PayPal integration is included through the Django PayPal/IPN integration.
</p>

<p>
Successful PayPal transactions create a paid order containing:
</p>

<ul>
<li>Customer</li>
<li>Shipping address</li>
<li>Order items</li>
<li>Total amount</li>
<li>Shipping amount</li>
<li>Payment mode</li>
<li>Invoice number</li>
<li>Delivery status</li>
</ul>

<h3>🟪 PhonePe / UPI</h3>

<p>
PhonePe integration is also present for UPI-based checkout.
</p>

<p>
The checkout interface can invoke PhonePe's payment flow and the backend
contains payment-status handling logic.
</p>

---

<h2>📦 Order Management</h2>

<p>
Orders contain detailed purchase and delivery information.
</p>

<h3>🧾 Order Data</h3>

<ul>
<li>Unique order ID</li>
<li>Invoice number</li>
<li>Customer</li>
<li>Shipping address</li>
<li>Total amount</li>
<li>Shipping amount</li>
<li>GST field</li>
<li>Payment mode</li>
<li>Payment status</li>
<li>Delivery status</li>
<li>Creation timestamp</li>
<li>Update timestamp</li>
</ul>

<h3>🚚 Delivery Status Flow</h3>

```text
Order Placed
     ↓
Order Packed
     ↓
Order Shipped
     ↓
Received in City
     ↓
Out for Delivery
     ↓
Delivered
```

<h3>💳 Payment Status</h3>

```text
Pending
Paid
Failed
Cancelled
```

---

<h2>🧾 Invoice & Order Confirmation</h2>

<p>
After successful payment, the system creates the order and provides an order
confirmation/invoice page.
</p>

<p>
Customers can also access their previous purchases through the
<strong>My Orders</strong> interface.
</p>

---

<h2>👑 Administration</h2>

<p>
The project contains a dedicated <strong>Admin</strong> application and
administrative frontend.
</p>

<h3>Administrative Areas</h3>

<ul>
<li>📊 Admin dashboard</li>
<li>👥 User management</li>
<li>📦 Product management</li>
<li>📂 Category management</li>
<li>🛒 Order management</li>
<li>💬 Feedback management</li>
<li>⚙️ Store settings</li>
</ul>

<p>
Product administration also supports creating products with multiple images
and multiple size/price combinations.
</p>

---

<h2>📈 User & Store Activity</h2>

<p>
The project contains a <code>UserVisit</code> model that records application
visit information such as:
</p>

<ul>
<li>👤 User</li>
<li>🌐 IP address</li>
<li>🖥️ User agent</li>
<li>🔗 Requested path</li>
<li>🕒 Timestamp</li>
</ul>

<p>
This provides the foundation for monitoring user activity and store usage.
</p>

---

<h2>📨 Contact & Messaging</h2>

<p>
The platform provides customer-contact and feedback functionality.
</p>

<p>
Customers can submit information such as:
</p>

<ul>
<li>First name</li>
<li>Last name</li>
<li>Email</li>
<li>Mobile number</li>
<li>Message</li>
</ul>

<p>
The project also contains email templates for purchase/order-related
communication.
</p>

---

<h2>🧮 Additional Module — Salary Calculator</h2>

<p>
Alongside the storefront, this repository contains a
<strong>Salary_Calculator</strong> application accessible through:
</p>

```text
/time/
```

<p>
This makes the repository broader than a traditional storefront and demonstrates
additional Django application development beyond the e-commerce workflow.
</p>

---

<h2>📁 Project Structure</h2>

```text
Sanchvi/
│
├── Accounts/
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│
├── Products/
│   ├── models.py
│   ├── views.py
│   ├── forms.py
│   ├── urls.py
│   └── migrations/
│
├── Cart/
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│
├── Payments/
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
│
├── Admin/
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── management tools
│
├── Message/
│   ├── models.py
│   ├── views.py
│   └── urls.py
│
├── Salary_Calculator/
│   └── salary/time utilities
│
├── Sanchvi/
│   ├── settings.py
│   ├── urls.py
│   ├── views.py
│   ├── utils.py
│   ├── wsgi.py
│   └── asgi.py
│
├── templates/
│   ├── auth/
│   ├── product/
│   ├── cart/
│   ├── orders/
│   ├── payments/
│   ├── profile/
│   ├── contact/
│   ├── admindata/
│   └── ...
│
├── static/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── videos/
│
├── media/
│
├── manage.py
└── db.sqlite3
```

---

<h2>🎨 Frontend Experience</h2>

<p>
The storefront includes a visually driven landing page with promotional
videos, category cards and product-focused sections.
</p>

<p align="center">
  <img src="docs/images/homepage.png" width="900" alt="Sanchvi Studio Homepage">
</p>

<p align="center">
  <em>🏠 Sanchvi Studio storefront</em>
</p>

---

<h2>📸 Screenshots</h2>

<p>
Recommended screenshots for the repository README:
</p>

```text
docs/
└── images/
    ├── homepage.png
    ├── categories.png
    ├── product-list.png
    ├── product-detail.png
    ├── cart.png
    ├── checkout.png
    ├── payment.png
    ├── order-confirmation.png
    ├── my-orders.png
    ├── profile.png
    └── admin-dashboard.png
```

<p align="center">
  <img src="docs/images/product-detail.png" width="850" alt="Sanchvi Product Detail">
</p>

<p align="center">
  <em>👕 Product detail and customization interface</em>
</p>

<p align="center">
  <img src="docs/images/checkout.png" width="850" alt="Sanchvi Checkout">
</p>

<p align="center">
  <em>🛒 Checkout and payment selection</em>
</p>

<p align="center">
  <img src="docs/images/admin-dashboard.png" width="850" alt="Sanchvi Admin Dashboard">
</p>

<p align="center">
  <em>👑 Store administration</em>
</p>

---

<h2>🎞️ GIF Demonstrations</h2>

<p>
GIFs are useful for showing complete shopping flows directly inside GitHub.
</p>

<p align="center">
  <img src="docs/demo/product-shopping.gif" width="900" alt="Sanchvi Product Shopping Demo">
</p>

<p align="center">
  <img src="docs/demo/checkout-payment.gif" width="900" alt="Sanchvi Checkout Demo">
</p>

<p align="center">
  <img src="docs/demo/admin-management.gif" width="900" alt="Sanchvi Admin Demo">
</p>

---

<h2>🎥 Video Demonstration</h2>

<p>
For a complete walkthrough, use a clickable thumbnail that points to a
YouTube or other hosted video.
</p>

<p align="center">
  <a href="YOUR-YOUTUBE-VIDEO-LINK">
    <img src="docs/images/video-thumbnail.png" width="900" alt="Sanchvi Studio Video Demonstration">
  </a>
</p>

<p align="center">
  ▶️ <strong>Watch the Sanchvi Studio complete walkthrough</strong>
</p>

---

<h2>⚠️ Limitations & Development Notes</h2>

<ul>
<li>The repository does not currently provide a root <code>requirements.txt</code>.</li>
<li>SQLite is configured as the active default database.</li>
<li>Some payment configuration is environment-specific and requires valid merchant credentials.</li>
<li>External integrations such as email, PayPal, PhonePe and exchange-rate services require valid credentials/configuration.</li>
<li>The project contains a large amount of generated/cache content such as <code>__pycache__</code>, which should ideally not be committed.</li>
<li>The project is substantially larger than a minimal Django store and would benefit from further modular cleanup and dependency management before production deployment.</li>
</ul>

---

<h2>🔐 Security Warning</h2>

<p>
<strong>Do not deploy the current configuration directly to production.</strong>
</p>

<p>
The inspected repository contains sensitive configuration values in
<code>Sanchvi/settings.py</code>, including a Django secret key, SMTP credentials
and payment-related credentials.
</p>

<p>
These should be rotated and moved to environment variables or a secure secret
manager.
</p>

<p>Recommended configuration style:</p>

```python
import os

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")

EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")

PAYPAL_RECEIVER_EMAIL = os.environ.get("PAYPAL_RECEIVER_EMAIL")

PHONEPE_MERCHANT_ID = os.environ.get("PHONEPE_MERCHANT_ID")
PHONEPE_SALT_KEY = os.environ.get("PHONEPE_SALT_KEY")
PHONEPE_SALT_INDEX = os.environ.get("PHONEPE_SALT_INDEX")
```

<p>
Any credentials that have already been committed to a public repository should
be considered exposed and rotated.
</p>

---

<h2>🔮 Future Improvements / Roadmap</h2>

<table>
<tr>
<td>📦 Dependency Management</td>
<td>Add a maintained requirements.txt or pyproject.toml.</td>
</tr>

<tr>
<td>🐘 PostgreSQL</td>
<td>Move from SQLite to a production database.</td>
</tr>

<tr>
<td>☁️ Cloud Media Storage</td>
<td>Move product/media assets to object storage such as S3-compatible storage.</td>
</tr>

<tr>
<td>🔐 Environment Configuration</td>
<td>Move all secrets and payment credentials to environment variables.</td>
</tr>

<tr>
<td>📱 Mobile Optimization</td>
<td>Further refine responsive shopping and checkout experiences.</td>
</tr>

<tr>
<td>📊 Analytics</td>
<td>Add product, customer, conversion and sales analytics.</td>
</tr>

<tr>
<td>🚚 Advanced Delivery Tracking</td>
<td>Integrate external courier/shipping providers and real-time tracking.</td>
</tr>

<tr>
<td>🧾 Automated Invoicing</td>
<td>Improve invoice generation and downloadable billing documents.</td>
</tr>

<tr>
<td>🧠 Recommendation Engine</td>
<td>Add personalized product recommendations.</td>
</tr>

<tr>
<td>⚡ Caching & Performance</td>
<td>Improve product/search performance and introduce production caching.</td>
</tr>
</table>

---

<h2>▶️ Running the Project</h2>

```bash
python manage.py runserver
```

<p>
Then open:
</p>

```text
http://127.0.0.1:8000/
```

<p>
The project also exposes dedicated routes for areas such as:
</p>

<table>
<tr>
<th>Route</th>
<th>Purpose</th>
</tr>

<tr>
<td><code>/home/</code></td>
<td>Store homepage</td>
</tr>

<tr>
<td><code>/auth/</code></td>
<td>Authentication</td>
</tr>

<tr>
<td><code>/in/</code></td>
<td>Products and storefront functionality</td>
</tr>

<tr>
<td><code>/cart/</code></td>
<td>Shopping cart and checkout</td>
</tr>

<tr>
<td><code>/payment/</code></td>
<td>Payment workflows</td>
</tr>

<tr>
<td><code>/admin/</code></td>
<td>Custom administration area</td>
</tr>

<tr>
<td><code>/admin_dev/</code></td>
<td>Django admin interface</td>
</tr>

<tr>
<td><code>/MSG/</code></td>
<td>Messaging/contact features</td>
</tr>

<tr>
<td><code>/time/</code></td>
<td>Salary calculator module</td>
</tr>
</table>

---

<h2>👨‍💻 Author</h2>

<p align="center">

<strong>Yasir Khan</strong><br>
Full Stack Developer • Django Developer • E-commerce Developer

<br><br>

<a href="https://github.com/yasirkhan251">
  <img src="https://img.shields.io/badge/GitHub-yasirkhan251-181717?style=for-the-badge&logo=github">
</a>

<a href="https://yasirkhan.in">
  <img src="https://img.shields.io/badge/Portfolio-yasirkhan.in-0A66C2?style=for-the-badge">
</a>

</p>

---

<h2>📜 License</h2>

<p>
Add the project's chosen license file before distributing the application for
external use.
</p>

---

<p align="center">
  <strong>🛍️ Sanchvi Studio — A complete Django-powered shopping experience from product discovery to payment and delivery.</strong>
</p>
