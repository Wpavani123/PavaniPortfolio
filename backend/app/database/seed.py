from datetime import date, datetime
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import get_password_hash
from app.database.session import SessionLocal, engine, Base
from app.models.models import (
    User, Profile, SocialLink, Skill, SkillProgress, Project, ProjectImage,
    Certification, Experience, Education, Achievement, LeetCodeProfile,
    YouTubeChannel, GitHubProfile, CustomSection, SiteSetting, ResumeFile
)


def seed_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Admin User
        admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin_user:
            admin_user = User(
                email=settings.ADMIN_EMAIL,
                username=settings.ADMIN_USERNAME,
                hashed_password=get_password_hash(settings.ADMIN_INITIAL_PASSWORD),
                role="admin",
                is_active=True,
            )
            db.add(admin_user)
            print(f"Created admin user: {settings.ADMIN_EMAIL}")

        # 2. Candidate Profile
        profile = db.query(Profile).first()
        if not profile:
            profile = Profile(
                full_name="Nimmana Pavani",
                professional_title="AWS Certified Cloud & DevOps Engineer",
                headline="AWS | Cloud | DevOps | Python | AI Enthusiast",
                phone="+91-8121082482",
                email="pavaninimmana10@gmail.com",
                location="Andhra Pradesh, India",
                short_bio="Cloud-focused Computer Science graduate with hands-on experience in AWS, Linux, Python and DevOps technologies, building secure, scalable and cloud-based solutions.",
                long_bio="Computer Science Engineering graduate specializing in Cloud Architecture and DevOps automation. AWS Certified Solutions Architect - Associate and Cloud Practitioner with hands-on expertise in deploying resilient infrastructure using EC2, VPC, IAM, S3, CloudWatch, and Linux system administration. Adept in Python scripting, CI/CD pipeline automation, and cloud cost governance.",
                profile_image=None,
                resume_url="/api/uploads/resumes/Nimmana_Pavani_Resume.pdf",
            )
            db.add(profile)
            print("Created candidate profile")

        # 3. Site Settings
        settings_record = db.query(SiteSetting).first()
        if not settings_record:
            settings_record = SiteSetting(
                site_title="Nimmana Pavani | AWS Certified Cloud & DevOps Engineer",
                meta_description="Personal portfolio and career management platform of Nimmana Pavani - AWS Certified Solutions Architect, DevOps enthusiast, and Python developer.",
                keywords="Nimmana Pavani, AWS, Cloud Engineer, DevOps, Python, Linux, CI/CD, Terraform, Solutions Architect, Docker",
                hero_subheadline="AWS | Cloud | DevOps | Python | AI Enthusiast",
                hero_tagline="Cloud-focused Computer Science graduate with hands-on experience in AWS, Linux, Python and DevOps technologies, building secure, scalable and cloud-based solutions.",
                allow_contact_form=True,
                theme_default="dark",
            )
            db.add(settings_record)

        # 4. Social Links
        if db.query(SocialLink).count() == 0:
            socials = [
                SocialLink(
                    platform="LinkedIn",
                    username="pavani-nimmana-67b989283",
                    url="https://www.linkedin.com/in/pavani-nimmana-67b989283",
                    icon="Linkedin",
                    display_order=1,
                    is_visible=True,
                ),
                SocialLink(
                    platform="GitHub",
                    username="Wpavani123",
                    url="https://github.com/Wpavani123",
                    icon="Github",
                    display_order=2,
                    is_visible=True,
                ),
                SocialLink(
                    platform="Email",
                    username="pavaninimmana10@gmail.com",
                    url="mailto:pavaninimmana10@gmail.com",
                    icon="Mail",
                    display_order=3,
                    is_visible=True,
                ),
                SocialLink(
                    platform="Phone",
                    username="+91-8121082482",
                    url="tel:+918121082482",
                    icon="Phone",
                    display_order=4,
                    is_visible=True,
                ),
            ]
            db.add_all(socials)
            print("Seeded social links")

        # 5. Skills
        if db.query(Skill).count() == 0:
            skills_data = [
                # Cloud
                Skill(name="AWS", category="Cloud", level="Advanced", years_experience=1.5, description="Core AWS compute, networking, security, storage, and monitoring services.", icon="Cloud", display_order=1, is_featured=True),
                Skill(name="EC2", category="Cloud", level="Advanced", years_experience=1.5, description="Elastic Compute Cloud instances, sizing, key pairs, and user data bootstrap.", icon="Server", display_order=2, is_featured=True),
                Skill(name="S3", category="Cloud", level="Intermediate", years_experience=1.0, description="Simple Storage Service, bucket policies, lifecycle management, and versioning.", icon="HardDrive", display_order=3, is_featured=False),
                Skill(name="IAM", category="Cloud", level="Advanced", years_experience=1.5, description="Identity & Access Management, least-privilege policies, roles, and groups.", icon="ShieldCheck", display_order=4, is_featured=True),
                Skill(name="VPC", category="Cloud", level="Intermediate", years_experience=1.0, description="Virtual Private Cloud design, IP CIDR allocation, peering, and gateways.", icon="Network", display_order=5, is_featured=True),
                Skill(name="Subnets", category="Cloud", level="Intermediate", years_experience=1.0, description="Public and private subnets segregation across availability zones.", icon="Grid", display_order=6, is_featured=False),
                Skill(name="Route Tables", category="Cloud", level="Intermediate", years_experience=1.0, description="Routing tables, local routing, and Internet Gateway associations.", icon="GitBranch", display_order=7, is_featured=False),
                Skill(name="Security Groups", category="Cloud", level="Advanced", years_experience=1.5, description="Stateful virtual firewalls for ingress/egress port filtering.", icon="Lock", display_order=8, is_featured=False),
                Skill(name="CloudWatch", category="Cloud", level="Intermediate", years_experience=1.0, description="Alarms, metrics dashboards, log groups, and synthetic monitoring.", icon="Activity", display_order=9, is_featured=False),
                Skill(name="Lambda", category="Cloud", level="Beginner", years_experience=0.5, description="Serverless compute for event-driven microservices and automation functions.", icon="Zap", display_order=10, is_featured=False),
                Skill(name="RDS", category="Cloud", level="Beginner", years_experience=0.5, description="Managed relational database service with automated backups and Multi-AZ replication.", icon="Database", display_order=11, is_featured=False),
                Skill(name="CloudFormation", category="Cloud", level="Beginner", years_experience=0.5, description="AWS native Infrastructure as Code for templated, version-controlled resource provisioning.", icon="FileCode", display_order=12, is_featured=False),
                Skill(name="ELB / ALB", category="Cloud", level="Intermediate", years_experience=1.0, description="Elastic and Application Load Balancers for high-availability traffic distribution.", icon="Shuffle", display_order=13, is_featured=False),
                Skill(name="Auto Scaling", category="Cloud", level="Beginner", years_experience=0.5, description="Dynamic EC2 instance scaling based on demand metrics and health checks.", icon="TrendingUp", display_order=14, is_featured=False),
                Skill(name="Route 53", category="Cloud", level="Beginner", years_experience=0.5, description="Scalable DNS web service for domain registration and routing policies.", icon="Globe", display_order=15, is_featured=False),
                Skill(name="SNS / SQS", category="Cloud", level="Beginner", years_experience=0.5, description="Messaging and notification services for decoupled, event-driven architectures.", icon="Bell", display_order=16, is_featured=False),
                
                # DevOps
                Skill(name="Linux", category="DevOps", level="Advanced", years_experience=2.0, description="Amazon Linux / Ubuntu system admin, permissions, CLI, systemd, and cron.", icon="Terminal", display_order=1, is_featured=True),
                Skill(name="Git", category="DevOps", level="Intermediate", years_experience=2.0, description="Version control, branching workflows, merges, rebasing, and commits.", icon="GitPullRequest", display_order=2, is_featured=False),
                Skill(name="GitHub", category="DevOps", level="Intermediate", years_experience=2.0, description="Repository management, PR reviews, issues, and collaboration.", icon="Github", display_order=3, is_featured=False),
                Skill(name="CI/CD", category="DevOps", level="Intermediate", years_experience=1.0, description="Automated continuous integration and deployment pipelines.", icon="Cpu", display_order=4, is_featured=True),
                Skill(name="Terraform", category="DevOps", level="Beginner", years_experience=0.5, description="Infrastructure as Code for automated cloud resource provisioning.", icon="Layers", display_order=5, is_featured=False),
                Skill(name="Jenkins", category="DevOps", level="Beginner", years_experience=0.5, description="Pipeline jobs, automated test execution, and build triggers.", icon="Tool", display_order=6, is_featured=False),
                Skill(name="Docker", category="DevOps", level="Beginner", years_experience=0.5, description="Containerization, Dockerfiles, and container image lifecycle.", icon="Box", display_order=7, is_featured=False),
                Skill(name="Maven", category="DevOps", level="Beginner", years_experience=0.5, description="Java build automation, dependency management, and packaging.", icon="Package", display_order=8, is_featured=False),
                Skill(name="Kubernetes", category="DevOps", level="Beginner", years_experience=0.5, description="Container orchestration, pods, deployments, services, and ingress controllers.", icon="Container", display_order=9, is_featured=False),
                Skill(name="Ansible", category="DevOps", level="Beginner", years_experience=0.5, description="Agentless configuration management and automated server provisioning playbooks.", icon="Settings", display_order=10, is_featured=False),
                Skill(name="Prometheus", category="DevOps", level="Beginner", years_experience=0.3, description="Open-source monitoring and alerting toolkit for cloud-native infrastructure.", icon="Activity", display_order=11, is_featured=False),
                Skill(name="Grafana", category="DevOps", level="Beginner", years_experience=0.3, description="Visualization dashboards for infrastructure metrics and performance monitoring.", icon="PieChart", display_order=12, is_featured=False),
                Skill(name="Nagios", category="DevOps", level="Beginner", years_experience=0.3, description="Enterprise infrastructure monitoring for servers, switches, and application health.", icon="Monitor", display_order=13, is_featured=False),

                # Programming
                Skill(name="Python", category="Programming", level="Intermediate", years_experience=2.0, description="Data structures, scripting, cloud automation, and API development.", icon="Code", display_order=1, is_featured=True),
                Skill(name="Shell Scripting", category="Programming", level="Intermediate", years_experience=1.0, description="Bash scripts for system maintenance, log parsing, and task automation.", icon="Command", display_order=2, is_featured=False),

                # Data / BI
                Skill(name="Tableau", category="Data / BI", level="Intermediate", years_experience=1.0, description="Visual analytics, dashboard creation, and data storytelling.", icon="BarChart2", display_order=1, is_featured=False),
                Skill(name="Excel", category="Data / BI", level="Intermediate", years_experience=2.0, description="Formulas, Pivot tables, VLOOKUP/XLOOKUP, and data summaries.", icon="FileSpreadsheet", display_order=2, is_featured=False),

                # Database
                Skill(name="SQL", category="Database", level="Intermediate", years_experience=1.5, description="Complex joins, subqueries, aggregations, window functions, and query optimization.", icon="Database", display_order=1, is_featured=True),
                Skill(name="MySQL", category="Database", level="Intermediate", years_experience=1.0, description="Relational database design, normalization, indexing, triggers, and stored procedures.", icon="Database", display_order=2, is_featured=False),
            ]
            db.add_all(skills_data)
            db.commit()
            print("Seeded skills")

        # 6. Daily Skill Progress
        if db.query(SkillProgress).count() == 0:
            py_skill = db.query(Skill).filter(Skill.name == "Python").first()
            tf_skill = db.query(Skill).filter(Skill.name == "Terraform").first()
            aws_skill = db.query(Skill).filter(Skill.name == "AWS").first()
            devops_skill = db.query(Skill).filter(Skill.name == "CI/CD").first()

            progress_logs = []
            if py_skill:
                progress_logs.append(
                    SkillProgress(
                        skill_id=py_skill.id,
                        progress_date=date.today(),
                        status="Practicing DSA",
                        progress_percentage=65,
                        learning_note="Practicing arrays, strings, hash tables, and two-pointer algorithmic patterns for competitive problem solving.",
                        resources="LeetCode Top Interview 150, Python Documentation",
                    )
                )
            if tf_skill:
                progress_logs.append(
                    SkillProgress(
                        skill_id=tf_skill.id,
                        progress_date=date.today(),
                        status="Learning",
                        progress_percentage=50,
                        learning_note="Writing reusable Terraform HCL modules for deploying VPCs with public/private subnets and internet gateways.",
                        resources="HashiCorp Terraform Associate Tutorials",
                    )
                )
            if aws_skill:
                progress_logs.append(
                    SkillProgress(
                        skill_id=aws_skill.id,
                        progress_date=date.today(),
                        status="Advanced",
                        progress_percentage=85,
                        learning_note="Architected secure multi-tier web application infrastructure with strict IAM security boundaries and CloudWatch metrics.",
                        resources="AWS Skill Builder & Documentation",
                    )
                )
            if devops_skill:
                progress_logs.append(
                    SkillProgress(
                        skill_id=devops_skill.id,
                        progress_date=date.today(),
                        status="Practicing",
                        progress_percentage=55,
                        learning_note="Designing GitHub Actions workflows for automated linting, test validation, and container builds.",
                        resources="GitHub Actions Documentation",
                    )
                )
            db.add_all(progress_logs)
            db.commit()
            print("Seeded daily skill progress")

        # 7. Projects
        if db.query(Project).count() == 0:
            proj = Project(
                title="AWS Cloud Web Server Deployment & Monitoring",
                slug="aws-cloud-web-server",
                short_description="Architected and deployed a highly resilient Apache Web Server on Amazon Linux EC2 inside a custom VPC with CloudWatch metrics and cost guardrails.",
                full_description="""### Project Overview
Designed, provisioned, and secured a cloud-hosted web server infrastructure on Amazon Web Services (AWS) using industry best practices.

### Key Implementation Details
- **Networking Architecture**: Engineered a custom Virtual Private Cloud (VPC) with a dedicated public subnet, internet gateway (IGW), and custom route tables.
- **Compute Provisioning**: Launched and configured an Amazon Linux EC2 instance hosting an Apache HTTP Server.
- **Security & Access Control**: Implemented stateful Security Groups enforcing minimal open ingress ports (HTTP Port 80 and SSH Port 22 with key-pair authentication). Assigned IAM roles adhering to least-privilege principles.
- **Observability & Monitoring**: Configured AWS CloudWatch metric alarms monitoring CPU utilization, disk I/O, and instance status checks.
- **Cost Optimization**: Monitored operational metrics to strictly operate within AWS Free Tier limits, preventing unexpected charges.""",
                category="Cloud / DevOps",
                technologies=["AWS EC2", "IAM", "VPC", "Public Subnet", "Security Groups", "Route Tables", "Internet Gateway", "CloudWatch", "Linux", "Apache"],
                github_url="https://github.com/Wpavani123",
                live_url=None,
                demo_url=None,
                image="/uploads/projects/aws-cloud-web-server.png",
                featured=True,
                status="Completed",
                start_date=date(2024, 6, 1),
                end_date=date(2024, 8, 30),
                display_order=1,
            )
            proj2 = Project(
                title="Automated CI/CD Pipeline with Jenkins & Docker",
                slug="cicd-jenkins-docker-pipeline",
                short_description="Built an end-to-end CI/CD pipeline using Jenkins, Docker, and GitHub for automated build, test, and deployment of containerized applications.",
                full_description="""### Project Overview
Designed and implemented a fully automated Continuous Integration / Continuous Deployment pipeline to streamline the software delivery lifecycle.

### Key Implementation Details
- **Pipeline Orchestration**: Configured Jenkins declarative pipelines with multi-stage workflows — Code Checkout, Build, Unit Test, Docker Image Build, and Deployment.
- **Containerization**: Created optimized Dockerfiles for application packaging, implemented multi-stage builds for reduced image sizes.
- **Version Control Integration**: Set up GitHub webhook triggers for automatic pipeline execution on every push and pull request.
- **Artifact Management**: Implemented Docker image tagging and registry push for version-controlled deployments.
- **Monitoring & Notifications**: Integrated build status notifications and deployment health checks.""",
                category="DevOps",
                technologies=["Jenkins", "Docker", "GitHub", "Linux", "Shell Scripting", "Git", "CI/CD", "Maven"],
                github_url="https://github.com/Wpavani123",
                live_url=None,
                demo_url=None,
                image=None,
                featured=True,
                status="Completed",
                start_date=date(2024, 9, 1),
                end_date=date(2024, 11, 30),
                display_order=2,
            )

            proj3 = Project(
                title="Secure Multi-Tier VPC Architecture on AWS",
                slug="secure-multi-tier-vpc",
                short_description="Designed a production-grade multi-tier VPC with public/private subnet segregation, NAT gateways, and defense-in-depth security controls.",
                full_description="""### Project Overview
Architected a secure, scalable multi-tier network infrastructure on AWS following the AWS Well-Architected Framework best practices.

### Key Implementation Details
- **Network Design**: Created a custom VPC with public and private subnets across multiple Availability Zones for high availability.
- **Security Layers**: Implemented defense-in-depth with Security Groups (stateful), Network ACLs (stateless), and IAM least-privilege policies.
- **Connectivity**: Configured Internet Gateway for public-facing resources, NAT Gateway for private subnet outbound access, and VPC peering for cross-VPC communication.
- **Routing Architecture**: Designed custom route tables for public subnet internet routing and private subnet NAT routing.
- **Compliance**: Enforced encryption in transit and at rest, enabled VPC Flow Logs for network traffic auditing.""",
                category="Cloud / AWS",
                technologies=["AWS VPC", "Subnets", "Security Groups", "NACLs", "NAT Gateway", "Internet Gateway", "IAM", "Route Tables", "VPC Flow Logs"],
                github_url="https://github.com/Wpavani123",
                live_url=None,
                demo_url=None,
                image=None,
                featured=True,
                status="Completed",
                start_date=date(2024, 4, 1),
                end_date=date(2024, 6, 15),
                display_order=3,
            )

            proj4 = Project(
                title="Python Cloud Automation & Resource Audit Toolkit",
                slug="python-cloud-automation",
                short_description="Developed Python scripts for automating AWS resource audits, S3 bucket cleanup, unused resource detection, and cost monitoring reports.",
                full_description="""### Project Overview
Built a comprehensive Python-based automation toolkit for AWS cloud resource management and cost optimization.

### Key Implementation Details
- **Resource Auditing**: Automated scripts using Boto3 SDK to audit EC2 instances, S3 buckets, IAM users/roles, and security group configurations.
- **Cost Optimization**: Built cost analysis scripts to identify underutilized resources, unattached EBS volumes, and idle Elastic IPs.
- **S3 Lifecycle Management**: Automated S3 bucket cleanup scripts with lifecycle policy enforcement and versioning audits.
- **Reporting**: Generated comprehensive HTML/CSV audit reports with compliance scoring and remediation recommendations.
- **Scheduling**: Integrated with cron jobs and AWS Lambda for periodic automated execution.""",
                category="Cloud / Python",
                technologies=["Python", "Boto3", "AWS SDK", "EC2", "S3", "IAM", "Lambda", "Shell Scripting", "Cron"],
                github_url="https://github.com/Wpavani123",
                live_url=None,
                demo_url=None,
                image=None,
                featured=True,
                status="In Progress",
                start_date=date(2024, 10, 1),
                end_date=None,
                display_order=4,
            )

            db.add_all([proj, proj2, proj3, proj4])
            db.commit()
            print("Seeded resume projects")

        # 8. Certifications
        if db.query(Certification).count() == 0:
            certs = [
                Certification(
                    name="AWS Certified Solutions Architect - Associate",
                    issuer="Amazon Web Services",
                    issue_date=date(2024, 7, 15),
                    credential_id="AWS-SAA-VERIFIED",
                    credential_url="https://aws.amazon.com/certification/",
                    description="Validates comprehensive knowledge in architecting secure, resilient, high-performing, and cost-optimized AWS architectures.",
                    display_order=1,
                    featured=True,
                ),
                Certification(
                    name="AWS Certified Cloud Practitioner",
                    issuer="Amazon Web Services",
                    issue_date=date(2024, 3, 10),
                    credential_id="AWS-CCP-VERIFIED",
                    credential_url="https://aws.amazon.com/certification/",
                    description="Validates overall understanding of AWS Cloud platform fundamentals, security compliance, billing, and core services.",
                    display_order=2,
                    featured=True,
                ),
                Certification(
                    name="Infosys Python Programming Certification",
                    issuer="Infosys Springboard",
                    issue_date=date(2023, 11, 20),
                    credential_id="INFOSYS-PY-2023",
                    description="Comprehensive validation in Python programming, object-oriented concepts, data structures, and algorithmic logic.",
                    display_order=3,
                    featured=True,
                ),
                Certification(
                    name="Oracle Cloud Infrastructure (OCI) AI Foundations Certified Associate",
                    issuer="Oracle",
                    issue_date=date(2024, 5, 12),
                    credential_id="OCI-AI-2024",
                    description="Foundational knowledge in Artificial Intelligence, Machine Learning, Deep Learning, and GenAI concepts on cloud infrastructure.",
                    display_order=4,
                    featured=True,
                ),
                Certification(
                    name="Introduction to Cloud Computing",
                    issuer="Coursera",
                    issue_date=date(2023, 8, 15),
                    credential_id="COURSERA-CLOUD-2023",
                    description="Explores cloud computing deployment models (IaaS, PaaS, SaaS), cloud storage, virtualization, and networking.",
                    display_order=5,
                    featured=False,
                ),
            ]
            db.add_all(certs)
            print("Seeded certifications")

        # 9. Experience / Career Simulations
        if db.query(Experience).count() == 0:
            exps = [
                Experience(
                    company="AWS re/Start Program",
                    role="AWS Cloud & DevOps Graduate",
                    type="Career Program",
                    location="India",
                    start_date=date(2024, 1, 1),
                    end_date=date(2024, 5, 30),
                    description="Underwent rigorous, hands-on cloud development training covering Linux administration, AWS core infrastructure (EC2, S3, IAM, VPC, CloudWatch), network security, and Python automation. Collaborated in simulated enterprise migration scenarios.",
                    technologies=["AWS", "Linux", "Python", "Networking", "IAM", "VPC", "CloudWatch"],
                    display_order=1,
                ),
                Experience(
                    company="Deloitte",
                    role="Data Analytics Job Simulation",
                    type="Virtual Experience Program",
                    location="Forage",
                    start_date=date(2023, 9, 1),
                    end_date=date(2023, 10, 15),
                    description="Completed simulated corporate data analytics tasks: inspected and cleaned large operational datasets, created dynamic dashboards using Tableau and Excel, and synthesized analytical insights for business stakeholders.",
                    technologies=["Data Analytics", "Excel", "Tableau", "Data Modeling"],
                    display_order=2,
                ),
            ]
            db.add_all(exps)
            print("Seeded experience")

        # 10. Education
        if db.query(Education).count() == 0:
            edus = [
                Education(
                    degree="B.Tech in Computer Science Engineering",
                    institution="Dr. B.R. Ambedkar University",
                    location="Srikakulam, Andhra Pradesh",
                    start_year="2021",
                    end_year="2025",
                    grade="First Class",
                    description="Core coursework in Operating Systems, Computer Networks, Database Management Systems, Cloud Computing, Object-Oriented Programming, and Software Engineering.",
                    display_order=1,
                ),
                Education(
                    degree="Intermediate — MPC (Mathematics, Physics, Chemistry)",
                    institution="Government Junior College",
                    location="Pathapatnam, Andhra Pradesh",
                    start_year="2019",
                    end_year="2021",
                    grade="Distinction",
                    description="Pre-university academic foundation in advanced mathematics and physical sciences.",
                    display_order=2,
                ),
                Education(
                    degree="Secondary School Certificate (SSC)",
                    institution="ZP High School",
                    location="Korasavada, Andhra Pradesh",
                    start_year="2018",
                    end_year="2019",
                    grade="High School Diploma",
                    description="Secondary education with excellence in sciences and mathematics.",
                    display_order=3,
                ),
            ]
            db.add_all(edus)
            print("Seeded education")

        # 11. Achievements
        if db.query(Achievement).count() == 0:
            achieves = [
                Achievement(
                    title="AWS Hackathons & Community Day Participation",
                    organization="AWS Community",
                    date=date(2024, 8, 10),
                    description="Engaged in cloud engineering hackathons, ideating and prototyping cost-efficient serverless architectures.",
                    display_order=1,
                ),
                Achievement(
                    title="AgentCon 2025 Delegate",
                    organization="AgentCon",
                    date=date(2025, 2, 14),
                    description="Attended cutting-edge technical summit on Autonomous AI Agents, LLM infrastructure, and multi-agent systems.",
                    display_order=2,
                ),
                Achievement(
                    title="Lyzr AI Hyderabad Event at Microsoft Office",
                    organization="Lyzr AI / Microsoft",
                    date=date(2024, 11, 16),
                    description="Participated in enterprise GenAI workshops focusing on agent frameworks and cloud scalability at Microsoft Hyderabad Campus.",
                    display_order=3,
                ),
                Achievement(
                    title="Amazon AI Online Sessions",
                    organization="Amazon Web Services",
                    date=date(2024, 9, 25),
                    description="Completed specialized technical sessions exploring AWS generative AI tools, Amazon Bedrock, and SageMaker pipelines.",
                    display_order=4,
                ),
                Achievement(
                    title="NSS Programs & National Integration Camps",
                    organization="National Service Scheme (NSS)",
                    date=date(2023, 6, 20),
                    description="Represented university at national youth integration camps, organizing community outreach, rural health awareness, and digital literacy initiatives.",
                    display_order=5,
                ),
            ]
            db.add_all(achieves)
            print("Seeded achievements")

        # 12. LeetCode Profile
        if not db.query(LeetCodeProfile).first():
            leetcode = LeetCodeProfile(
                username="pavani_nimmana",
                profile_url="https://leetcode.com/",
                total_solved=0,
                easy=0,
                medium=0,
                hard=0,
                ranking=0,
                streak=0,
                journey_status="LeetCode Journey Coming Soon",
            )
            db.add(leetcode)
            print("Seeded LeetCode placeholder")

        # 13. YouTube Channel
        if not db.query(YouTubeChannel).first():
            youtube = YouTubeChannel(
                channel_name="Nimmana Pavani Tech",
                channel_url="https://youtube.com/",
                subscriber_count=0,
                description="YouTube Content Coming Soon - Cloud, DevOps and Tech Tutorials",
            )
            db.add(youtube)
            print("Seeded YouTube placeholder")

        # 14. GitHub Profile
        if not db.query(GitHubProfile).first():
            github = GitHubProfile(
                username="Wpavani123",
                profile_url="https://github.com/Wpavani123",
                bio="AWS Certified Cloud/DevOps Enthusiast building scalable cloud infrastructure.",
                public_repos=8,
                followers=1,
                following=2,
                pinned_repos=[
                    {
                        "name": "aws-cloud-web-server",
                        "description": "Automated deployment of an Apache Web Server on AWS EC2 inside a custom VPC with CloudWatch metrics.",
                        "language": "HCL / Shell",
                        "stars": 0,
                        "forks": 0,
                        "url": "https://github.com/Wpavani123",
                    },
                    {
                        "name": "python-cloud-automation",
                        "description": "Python automation scripts for AWS resource audits, S3 bucket cleanups, and cost monitoring.",
                        "language": "Python",
                        "stars": 0,
                        "forks": 0,
                        "url": "https://github.com/Wpavani123",
                    },
                ]
            )
            db.add(github)
            print("Seeded GitHub profile")

        # 15. Custom Section
        if db.query(CustomSection).count() == 0:
            custom_sec = CustomSection(
                title="Cloud & AI Innovation Roadmap",
                slug="cloud-ai-roadmap",
                description="Upcoming technical goals and specialized engineering domains Pavani is mastering.",
                icon="Compass",
                section_type="cards",
                display_order=1,
                is_visible=True,
                content=[
                    {
                        "title": "Production Kubernetes & EKS",
                        "badge": "Upcoming Milestone",
                        "description": "Container orchestration, ingress controllers, Helm charts, and resilient microservices deployment on AWS EKS.",
                        "status": "In Progress"
                    },
                    {
                        "title": "Infrastructure as Code (Terraform)",
                        "badge": "Hands-on Practice",
                        "description": "Modularized cloud provisioning, state locking with DynamoDB, and automated CI/CD pipeline deployments.",
                        "status": "Learning"
                    },
                    {
                        "title": "Enterprise Cloud Security & IAM",
                        "badge": "Continuous Deep-Dive",
                        "description": "Zero-trust architecture, VPC endpoint security, KMS encryption keys, and AWS GuardDuty threat monitoring.",
                        "status": "Active"
                    }
                ]
            )
            db.add(custom_sec)
            print("Seeded initial custom section")

        # 16. Resume Record
        if db.query(ResumeFile).count() == 0:
            resume = ResumeFile(
                file_name="Nimmana_Pavani_Resume.pdf",
                file_url="/api/uploads/resumes/Nimmana_Pavani_Resume.pdf",
                file_size=1024 * 185,
                is_active=True,
            )
            db.add(resume)
            print("Seeded resume record")

        db.commit()
        print("Database successfully seeded with genuine resume data!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_db()
