# Deployment Guide for Event Hub

This guide outlines the steps to deploy the Event Hub application to a production environment.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- Nginx (for reverse proxy)
- PM2 (for process management)
- SSL certificate (for HTTPS)

## Server Setup

1. **Update the server:**

```bash
sudo apt update
sudo apt upgrade -y
