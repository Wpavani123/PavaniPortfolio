import pytest
from fastapi.testclient import TestClient
from main import app
from app.core.config import settings

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
    assert res.json()["status"] == "New"


def test_admin_auth_and_crud():
    # 1. Login
    login_res = client.post(
        "/api/auth/login",
        json={
            "username_or_email": settings.ADMIN_EMAIL,
            "password": settings.ADMIN_INITIAL_PASSWORD,
        },
    )
    assert login_res.status_code == 200
    token_data = login_res.json()
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Me
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == settings.ADMIN_EMAIL

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
