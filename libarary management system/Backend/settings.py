import os

from dotenv import load_dotenv


load_dotenv()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'library_db',
        'USER': 'postgres',
        'PASSWORD': 'rakib@123',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

CLOUDINARY_URL = os.getenv('CLOUDINARY_URL', '')