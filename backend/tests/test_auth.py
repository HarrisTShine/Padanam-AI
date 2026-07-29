import pytest
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token


def test_password_hashing():
    raw_password = "supersecretpassword123"
    hashed = get_password_hash(raw_password)
    
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("wrongpassword", hashed) is False


def test_jwt_token_generation_and_decoding():
    user_id = 42
    role = "student"
    token = create_access_token(subject=user_id, role=role)
    
    payload = decode_token(token)
    assert payload["sub"] == "42"
    assert payload["role"] == "student"
    assert payload["type"] == "access"
