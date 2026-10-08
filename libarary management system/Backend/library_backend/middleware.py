from __future__ import annotations

from django.conf import settings
from django.http import HttpResponse


class CORSMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":
            response = HttpResponse(status=204)
        else:
            response = self.get_response(request)

        origin = request.headers.get("Origin")
        allowed_origins = {
            settings.FRONTEND_ORIGIN,
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        }

        if settings.DEBUG or origin in allowed_origins:
            response["Access-Control-Allow-Origin"] = origin or settings.FRONTEND_ORIGIN
            response["Access-Control-Allow-Credentials"] = "true"
            response["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken, X-Requested-With"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            response["Vary"] = "Origin"

        return response
