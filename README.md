Recruitment Agency Management System (RAMS)
Software Requirements Specification (SRS) — Version 1.0
📌 Overview

The Recruitment Agency Management System (RAMS) is a centralized digital platform designed for licensed foreign employment agencies in Ethiopia. It manages the complete lifecycle of overseas recruitment—covering candidate onboarding, employer and agency management, job orders, visa workflows, document tracking, travel logistics, notifications, and compliance reporting.

This document summarizes the key requirements from the SRS and serves as a reference for developers, analysts, testers, and stakeholders.

🚀 Project Scope

RAMS supports the end-to-end recruitment workflow:

Candidate registration & profiling

Employer & agency management

Job order and demand handling

Visa and compliance document tracking

Travel and deployment logistics

Dashboards and analytics

Regulatory submissions

Optional self-service portal for candidates & employers

The system is web-based, mobile-responsive, and scalable for future expansion.

👥 Intended Users

System Administrators

Recruitment Officers

Document Controllers

Travel Logistics Officers

Finance Officers

Overseas Employers

Candidates (optional self-service)

🏗️ System Architecture & Environment

Frontend: Web UI (Chrome, Edge, Firefox)

Backend: Any modern framework (architecture-agnostic)

Database: SQL Server / PostgreSQL

Deployment: Cloud or on-premises

Integrations:

Ministry of Labour systems

SMS/Email gateways

Travel/visa verification APIs

🔧 Functional Requirements
1. Candidate Management

Register candidate info, skills, and preferred destination

Upload documents (passport, medical, police clearance, etc.)

Track candidate workflow:
Registered → Shortlisted → Selected → Visa Submitted → Deployed → Completed

Assign candidates to job orders

2. Agency & Employer Management

Register agency and employer profiles

Manage licenses, countries of operation, and verification

Search by name, license, or location

3. Job Order Management

Create job demand requests with job/title/salary/quota

Track fulfilment and assignment progress

Job order statuses:
Open → In Progress → Filled → Closed

4. Document & Visa Workflow

Track passport, visa, medical, police clearance, etc.

Manage visa stages per country

Auto alerts for status changes or expiry

Document approval workflows

5. Travel & Deployment Management

Flight booking & scheduling

Pre-departure checklists

Deployment confirmation on candidate arrival

6. Communication & Notifications

Automated SMS & email updates

Generate official PDFs (contracts, offer letters, etc.)

7. Reporting & Dashboards

Visa pipeline reports by country

Deployment tracking

Financial transactions

Export to PDF/Excel

🔌 External Interface Requirements

Multilingual UI (English, Amharic, Arabic)

Integration with SMTP, SMS gateways

Secure HTTPS communication

Support for mobile devices

🛠️ Additional Features

Role-based access control

Full audit logging

Bulk import/export (Excel/CSV)

Advanced search and filtering

🛡️ Non-Functional Requirements
Performance

Support 500 concurrent users

Dashboard loads under 3 seconds

Document upload acknowledgment < 2 seconds

Security

MFA for high-privilege roles

Encryption at rest and in transit

Principle of least privilege

Daily encrypted backups

Reliability & Availability

99% uptime

RPO: < 1 hour

RTO: < 4 hours

Usability

Simple workflows

Mobile-responsive

User-friendly after minimal training

Scalability

Horizontal scaling

Add new countries via configuration

Maintainability

Modular architecture

Version-controlled development

Built-in monitoring

Legal & Compliance

Ethiopian labor & data protection standards

Full audit trails

5-year document retention

📄 Document Structure

This README summarizes the SRS. The full SRS includes:

System context and user descriptions

Functional and non-functional requirements

External interfaces and integrations

Security, compliance, and maintenance standards

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/[your-repo]/RAMS.git
cd RAMS
```
