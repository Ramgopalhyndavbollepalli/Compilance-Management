
# Compliance Management Dashboard Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Installation and Setup](#installation-and-setup)
4. [User Guide](#user-guide)
5. [Feature Walkthrough](#feature-walkthrough)
6. [System Architecture](#system-architecture)
7. [Troubleshooting and FAQ](#troubleshooting-and-faq)

---

## Project Overview

The **Compliance Management Dashboard** is a cloud-based application that simplifies the management of compliance policies, audit logging, user management, and reporting for organizations. Designed to ensure seamless compliance management, the dashboard offers real-time monitoring and detailed insights to assist in meeting organizational and regulatory compliance requirements.

### Key Features
- **Compliance Policy Management**: Create, edit, and enforce compliance policies across resources.
- **User Management**: Manage different user roles and permissions for enhanced security.
- **Notifications**: Get alerts for policy violations, user actions, and other critical events.
- **Audit Logging**: Track actions and policy compliance for transparency and record-keeping.
- **Reporting**: Generate detailed compliance and activity reports.

### User Roles
The dashboard supports three types of users, each with different levels of access:
1. **Admin User**: Full access, including policy management, audit logs, and report generation.
2. **Editor**: Manages user accounts and permissions, configures notifications.
3. **Viewer**: Read-only access to compliance status and notifications.

---

## Technologies Used

### Frontend
- **React** with CSS and Bootstrap or Material-UI

### Backend
- **Flask** with SQLAlchemy ORM

### Cloud Services
- **AWS**: EC2, Aurora Serverless or DynamoDB, Lambda, CloudWatch, Config, IAM, Security Hub

### DevOps
- **CI/CD**: GitHub Actions
- **Infrastructure as Code**: CloudFormation or Terraform

### Documentation
- **Markdown** for detailed documentation

---

## Installation and Setup

### Prerequisites
- **Node.js** and **npm** for frontend setup
- **AWS Account** with configured IAM roles and permissions
- **GitHub Account** with access to repository secrets for deployment

### Steps

1. **Clone Repository**:
   ```bash
   git clone https://github.com/ramgopalhyndavbollepalli/Compliance-Management-Dashboard.git
   cd Compliance-Management-Dashboard
   ```

2. **Setup Environment**:
   - Add environment variables for AWS and other secrets.
   - For EC2 deployment, configure `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `SSH_PRIVATE_KEY`, `EC2_HOST`, `EC2_USER`, and `EC2_APP_DIR` in GitHub repository secrets.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Deployment**:
   - GitHub Actions CI/CD pipeline is set to deploy changes on each push to the `main` branch. Refer to the `.github/workflows/deploy-to-ec2.yml` for workflow details.
   - The pipeline automates code deployment, server restart, and logging setup.

5. **Configure AWS Services**:
   - Ensure **AWS Config** and **Security Hub** are integrated and monitoring for compliance.
   - Configure **CloudWatch Logs** for capturing application and server logs.

---

## User Guide

### Basic Navigation
1. **Login**: Each user needs valid credentials. Different users will have different access levels.
2. **Dashboard**: The main page provides a summary of compliance metrics, recent activities, and alerts.

### User Tasks
- **Compliance Officers**: Can create policies, view logs, and access detailed reports.
- **Administrators**: Manage users and notifications, configuring access and permissions as needed.
- **Standard Users**: Have read-only access to view compliance statuses and notifications.

### Notifications Management
- Users will receive alerts on the **Notifications Page** for important events, including:
  - Non-compliance incidents
  - User actions
  - Policy updates

### Accessing Audit Logs
- Go to the **Audit Logs Page** to view a history of actions taken within the system. This is essential for tracking compliance and troubleshooting user actions.

---

## Feature Walkthrough

### Dashboard Page
- **Description**: Displays overall compliance metrics, active alerts, and summaries.
- **Widgets**: Graphs and tables show compliance status across resources and policies.

### Resource Details Page
- **Purpose**: Provides specific information about resources, their compliance status, and associated policies.
- **Content**: Includes images, descriptions, and documents related to each resource.

### Compliance Policy Management Page
- **Functionality**: Create, modify, and delete compliance policies.
- **Policy Management**:
  1. Click on "Add Policy."
  2. Provide the necessary details, including policy name, description, and conditions.
  3. Save changes to activate the policy.

### User Management Page
- **Roles and Permissions**: Define user roles (Compliance Officer, Administrator, Standard User) with access levels.
- **Adding Users**: Admins can add users, assign roles, and manage permissions from this page.

### Notifications Page
- **Alerts**: Users receive notifications for compliance issues, user actions, and other events.
- **Managing Alerts**: Users can view, filter, and dismiss notifications as needed.

### Audit Logs Page
- **Description**: Comprehensive log of all actions within the system.
- **Usage**: Logs can be filtered and exported for analysis.

### Compliance Reporting Page
- **Purpose**: Generate reports on compliance levels and resource activities.
- **Report Types**: Summaries, detailed reports, and exportable formats are available.

### Settings Page
- **Configuration Options**: Customize notifications, themes, language, and account preferences.

---

## System Architecture

1. **Frontend**: Built with React and styled using CSS with Bootstrap/Material-UI for a responsive, user-friendly interface.
2. **Backend**: Flask backend handles API requests and interacts with AWS for data storage and compliance checks.
3. **Database**: AWS Aurora Serverless or DynamoDB for storing user and compliance data.
4. **AWS Integration**:
   - **Lambda** functions automate compliance checks and policy updates.
   - **CloudWatch** for logging, **Config** for tracking resources, and **Security Hub** for continuous monitoring.

---

## Troubleshooting and FAQ

### Common Issues
- **Deployment Failures**: Ensure GitHub Secrets are correctly configured and IAM permissions are set up.
- **Permission Denied on EC2**: Verify that your SSH keys are correctly formatted and that EC2 security groups allow SSH access.
- **Notifications Not Displaying**: Confirm that policies and rules are configured in AWS Config and Security Hub.

### Frequently Asked Questions

1. **How do I add a new policy?**
   - Go to the **Compliance Policy Management Page** and click "Add Policy."

2. **What permissions do Standard Users have?**
   - Standard Users have read-only access to view compliance status and alerts but cannot modify policies or settings.

3. **How are audit logs maintained?**
   - Logs are automatically recorded and can be viewed in the **Audit Logs Page**.

---


### Sample Markdown Section for Compliance Policy Management

```markdown
# Compliance Policy Management

The Compliance Policy Management page allows authorized users to create, edit, and manage compliance policies that ensure organizational standards are met.

## Key Features
- **Add New Policy**: Define compliance conditions for monitoring.
- **Edit Policy**: Update existing policies and adjust conditions.
- **Delete Policy**: Remove outdated or redundant policies.

## Creating a New Policy
1. Navigate to the **Compliance Policy Management** page.
2. Click "Add Policy."
3. Fill in the following details:
   - **Policy Name**: Unique identifier for the policy.
   - **Conditions**: Define conditions to monitor and enforce compliance.
4. Save the policy.

