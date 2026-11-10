import pytest
from datetime import datetime, timedelta, timezone
from fastapi.testclient import TestClient
from fastapi.routing import APIRoute
from jose import jwt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from app.core.config import settings
from app.api.deps import get_current_active_admin
from app.database.bootstrap import ensure_initial_records
from app.database.session import Base, SessionLocal
from app.models.models import ContactMessage, Profile, SiteSetting, User

client = TestClient(app)


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"


def test_public_profile():
    res = client.get("/api/profile")
    assert res.status_code == 200
    data = res.json()
    assert data["full_name"] == "Nimmana Pavani"
    assert "pavaninimmana10@gmail.com" in data["email"]


def test_public_skills():
    res = client.get("/api/skills")
    assert res.status_code == 200
    skills = res.json()
    assert len(skills) > 0
    names = [s["name"] for s in skills]
    assert "AWS" in names
    assert "Linux" in names
    assert "Python" in names


def test_public_projects():
    res = client.get("/api/projects")
    assert res.status_code == 200
    projects = res.json()
    assert len(projects) > 0
    assert projects[0]["slug"] == "aws-cloud-web-server"


def test_project_detail_by_slug():
    res = client.get("/api/projects/aws-cloud-web-server")
    assert res.status_code == 200
    project = res.json()
    assert project["title"] == "AWS Cloud Web Server Deployment & Monitoring"
    assert "AWS EC2" in project["technologies"]


def test_public_certifications():
    res = client.get("/api/certifications")
    assert res.status_code == 200
    certs = res.json()
    assert len(certs) >= 4
    names = [c["name"] for c in certs]
    assert any("Solutions Architect" in n for n in names)


def test_public_skill_progress():
    res = client.get("/api/skills/progress/all")
    assert res.status_code == 200
    logs = res.json()
    assert len(logs) > 0


def test_contact_submission():
    payload = {
        "name": "Recruiter Tester",
        "email": "recruiter@example.com",
        "subject": "Cloud Engineer Role Interview",
        "message": "Hello Nimmana Pavani, we are impressed by your AWS & DevOps profile and would like to discuss opportunities."
    }
    res = client.post("/api/contact", json=payload)
    assert res.status_code == 201
    try:
        assert res.json()["status"] == "New"
    finally:
        db = SessionLocal()
        try:
            db.query(ContactMessage).filter(ContactMessage.id == res.json()["id"]).delete()
            db.commit()
        finally:
            db.close()


def test_admin_auth_and_crud(monkeypatch):
    monkeypatch.setattr(settings, "ADMIN_NAME", "test-admin-name")

    # 1. Login
    login_res = client.post(
        "/api/auth/login",
        json={"admin_name": "test-admin-name"},
    )
    assert login_res.status_code == 200
    token_data = login_res.json()
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Me
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["role"] == "admin"

    # 3. Admin Stats
    stats_res = client.get("/api/admin/stats", headers=headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_projects"] >= 1
    assert stats["total_skills"] >= 10

    # 4. Create Skill via Admin
    new_skill = {
        "name": "Kubernetes",
        "category": "DevOps",
        "level": "Intermediate",
        "years_experience": 0.5,
        "description": "Container orchestration and pod networking",
        "icon": "Box",
        "display_order": 99,
        "is_featured": False
    }
    create_skill_res = client.post("/api/skills", json=new_skill, headers=headers)
    assert create_skill_res.status_code == 201
    created_id = create_skill_res.json()["id"]

    # 5. Add Daily Learning Progress for this skill
    prog_payload = {
        "progress_date": "2026-10-03",
        "status": "Practicing",
        "progress_percentage": 40,
        "learning_note": "Deploying multi-pod deployments and cluster IP services.",
        "resources": "Kubernetes Docs"
    }
    prog_res = client.post(f"/api/skills/{created_id}/progress", json=prog_payload, headers=headers)
    assert prog_res.status_code == 201

    # 6. Delete created skill
    del_res = client.delete(f"/api/skills/{created_id}", headers=headers)
    assert del_res.status_code == 204

    # 7. Create and Delete Custom Section
    custom_sec = {
        "title": "Speaking Engagements",
        "slug": "speaking-engagements",
        "description": "Tech conference talks and cloud presentations",
        "icon": "Mic",
        "section_type": "cards",
        "display_order": 10,
        "is_visible": True,
        "content": [{"title": "AWS Community Day", "date": "2025"}]
    }
    create_sec_res = client.post("/api/custom-sections", json=custom_sec, headers=headers)
    assert create_sec_res.status_code == 201
    sec_id = create_sec_res.json()["id"]

    del_sec_res = client.delete(f"/api/custom-sections/{sec_id}", headers=headers)
    assert del_sec_res.status_code == 204


def test_admin_login_requires_only_admin_name(monkeypatch):
    monkeypatch.setattr(settings, "ADMIN_NAME", "test-admin-name")

    accepted = client.post("/api/auth/login", json={"admin_name": "test-admin-name"})
    assert accepted.status_code == 200
    assert "test-admin-name" not in accepted.text

    rejected = client.post("/api/auth/login", json={"admin_name": "wrong-name"})
    assert rejected.status_code == 401

    legacy_fields = client.post(
        "/api/auth/login",
        json={"admin_name": "test-admin-name", "password": "not-accepted"},
    )
    assert legacy_fields.status_code == 422


def test_all_admin_write_routes_require_admin_auth():
    public_write_routes = {("/api/auth/login", "POST"), ("/api/contact", "POST")}
    write_methods = {"POST", "PUT", "PATCH", "DELETE"}

    for route in app.routes:
        if not isinstance(route, APIRoute):
            continue
        for method in route.methods & write_methods:
            if (route.path, method) in public_write_routes:
                continue
            assert any(
                dependency.call is get_current_active_admin
                for dependency in route.dependant.dependencies
            ), f"{method} {route.path} is missing admin authorization"


def test_public_portfolio_read_remains_unauthenticated():
    assert client.get("/api/profile").status_code == 200
    assert client.get("/api/projects").status_code == 200


def test_admin_read_routes_require_admin_auth():
    private_routes = [
        "/api/admin/stats",
        "/api/auth/me",
        "/api/contact/messages",
        "/api/custom-sections/all",
        "/api/resume/history",
        "/api/social-links/all",
    ]
    for path in private_routes:
        assert client.get(path).status_code == 401, f"GET {path} should require authentication"


def test_legacy_admin_tokens_are_rejected():
    token = jwt.encode(
        {
            "sub": "legacy-token-subject",
            "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
        },
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    response = client.get(
        "/api/admin/stats",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 401


def test_admin_login_is_disabled_without_backend_configuration(monkeypatch):
    monkeypatch.setattr(settings, "ADMIN_NAME", None)
    response = client.post("/api/auth/login", json={"admin_name": "test-admin-name"})
    assert response.status_code == 401


def test_initial_records_are_created_only_when_missing(monkeypatch):
    monkeypatch.setattr(settings, "ADMIN_NAME", "test-admin-name")
    monkeypatch.setattr(settings, "ADMIN_EMAIL", "bootstrap-test@example.invalid")
    monkeypatch.setattr(settings, "ADMIN_USERNAME", "bootstrap-test-admin")

    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    test_session = sessionmaker(bind=engine)()
    try:
        ensure_initial_records(test_session)
        profile = test_session.query(Profile).one()
        profile.full_name = "Existing Portfolio Owner"
        test_session.commit()

        ensure_initial_records(test_session)

        assert test_session.query(Profile).count() == 1
        assert test_session.query(Profile).one().full_name == "Existing Portfolio Owner"
        assert test_session.query(SiteSetting).count() == 1
        assert test_session.query(User).filter(User.role == "admin").count() == 1
    finally:
        test_session.close()
        engine.dispose()
