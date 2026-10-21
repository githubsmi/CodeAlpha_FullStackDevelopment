# Veloura — Django E-commerce Website

Veloura is an e-commerce website I built using Django, SQLite, HTML, CSS, and JavaScript.

The website includes user authentication, product browsing, searching and filtering, product detail pages, a shopping cart, and a checkout/order process. Products and orders can also be managed through the Django admin panel.

## Technologies Used

* Django
* SQLite
* HTML templates
* CSS
* Vanilla JavaScript
* Django authentication
* Django sessions for the shopping cart

## Main Features

* User registration and login
* Product listing
* Product search and filtering
* Product detail pages
* Session-based shopping cart
* Checkout and order processing
* Django admin for managing products and orders

## How to Run the Project

First, create and activate a virtual environment.

### Windows

python -m venv .venv
.venv\Scripts\activate

### macOS/Linux

python -m venv .venv
source .venv/bin/activate

Then install the required packages:

pip install -r requirements.txt

Run the database migrations:

python manage.py migrate

The project includes a command for adding the store's initial data:


python manage.py seed_store

Create an admin account:

python manage.py createsuperuser

Finally, start the Django development server:

python manage.py runserver

Open the website in your browser:

http://127.0.0.1:8000/

The Django admin panel is available at:

http://127.0.0.1:8000/admin/

## Notes

* Product images use remote `image_url` values, so a separate media setup is not needed for this project.
* Customers need to be logged in to place orders.
* The checkout currently uses a simple order-processing flow. There is no real payment gateway connected.
* Before deploying the project, make sure to change `SECRET_KEY`, set `DEBUG` appropriately, and configure `ALLOWED_HOSTS`.

## Project Purpose

This project was made to practice building an e-commerce website with Django and to work with features such as authentication, product management, shopping carts, checkout, and Django's admin panel.
