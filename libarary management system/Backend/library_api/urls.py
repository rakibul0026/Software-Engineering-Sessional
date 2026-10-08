from django.urls import path

from . import views

urlpatterns = [
    path("", views.api_root, name="api-root"),
    path("health/", views.health, name="health"),
    path("contact-messages/", views.contact_messages_collection, name="contact-messages"),
    path("books/", views.books_collection, name="books-collection"),
    path("books/<int:book_id>/", views.book_detail, name="book-detail"),
    path("books/<int:book_id>/issue/", views.issue_book, name="book-issue"),
    path("books/<int:book_id>/return/", views.return_book, name="book-return"),
    path("auth/signup/", views.signup_view, name="signup"),
    path("auth/login/", views.login_view, name="login"),
    path("auth/firebase-login/", views.firebase_login_view, name="firebase-login"),
    path("auth/logout/", views.logout_view, name="logout"),
    path("auth/me/", views.me_view, name="me"),
    path("seed/", views.seed_view, name="seed"),
]
