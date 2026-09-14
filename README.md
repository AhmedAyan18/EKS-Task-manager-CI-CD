# EKS Full-Stack Task Manager

A complete DevOps project using:

- React
- Vite
- Node.js
- Express
- Docker
- Docker Compose
- Amazon ECR
- Amazon EKS
- Kubernetes
- EC2 worker nodes
- GitHub Actions
- CI/CD

## Application features

The application allows users to:

- Create tasks
- View tasks
- Complete tasks
- Mark tasks pending
- Delete tasks
- View task statistics

## Database

This project intentionally does NOT use a database.

Tasks are stored in backend memory.

Therefore:

- Restarting a backend pod removes its tasks.
- Two backend replicas do not share the same task data.
- This is intentional for Kubernetes/DevOps learning.

A production version could use MongoDB Atlas, Amazon RDS, DynamoDB, etc.

## Local deployment