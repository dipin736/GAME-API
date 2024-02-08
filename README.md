# Game Store

Game Store is a full-stack web application built with Django and React.js, allowing users to browse, purchase, and review games. It provides authentication and authorization features for user registration, login, and logout. Users can add games to their shopping cart, view their order history, and submit reviews for games.

## Technologies Used

### Backend (Django)

- **Django:** High-level Python web framework for backend development.
- **Django REST Framework (DRF):** Toolkit for building Web APIs in Django.
- **JWT (JSON Web Tokens):** Token-based authentication mechanism.
- **MySQL:** Relational database management system for storing user data, game information, and orders
- **Django ORM:** Object-Relational Mapping for interacting with the database.
- **Corsheaders:** Django app for handling Cross-Origin Resource Sharing (CORS).


### Frontend (React.js)

- **React.js:** JavaScript library for building user interfaces.
- **React Router:** Declarative routing for React applications.
- **Chakra UI:** Component library for styling and UI components.
- **React Icons:** Library for adding icons to React projects.
- **Axios:** Promise-based HTTP client for making requests to the backend API.
- **React Toastify:** Library for displaying toast notifications.

## Features

- User authentication: Register, login, and logout functionalities.
- Game browsing: Browse games with details such as title, description, and price.
- Shopping cart: Add games to the cart and proceed to checkout.
- Order history: View past orders with details of purchased games.
- Review system: Submit reviews with ratings for games.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/dipin-736/game-store.git
cd myproject

Set up the backend:
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Set up the frontend:
cd game
npm install
npm run dev
