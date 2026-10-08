from __future__ import annotations

import json
import os

try:
    import firebase_admin
    from firebase_admin import auth, credentials
except Exception:  # pragma: no cover - handled at runtime
    firebase_admin = None
    auth = None
    credentials = None


def _get_service_account_credential():
    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "").strip()
    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON", "").strip()

    if service_account_path:
        return credentials.Certificate(service_account_path)

    if service_account_json:
        try:
            payload = json.loads(service_account_json)
        except json.JSONDecodeError as exc:
            raise RuntimeError("Invalid FIREBASE_SERVICE_ACCOUNT_JSON") from exc
        return credentials.Certificate(payload)

    return None


def _ensure_firebase_app_initialized() -> bool:
    if firebase_admin is None:
        return False

    if firebase_admin._apps:  # pylint: disable=protected-access
        return True

    cert = _get_service_account_credential()
    if cert is None:
        return False

    firebase_admin.initialize_app(cert)
    return True


def firebase_ready() -> bool:
    return _ensure_firebase_app_initialized()


def verify_firebase_id_token(id_token: str) -> dict[str, object]:
    if not id_token:
        raise ValueError("idToken is required")

    if not _ensure_firebase_app_initialized():
        raise RuntimeError(
            "Firebase is not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON."
        )

    return auth.verify_id_token(id_token)
