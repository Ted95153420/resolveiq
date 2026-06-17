# ResolveIQ Frontend
The Deployed API is at https://resolveiq-t6iy.onrender.com/  
The Deployed UI is at https://resolveiq-ui.onrender.com  

## Getting up and running locally

Clone the repo to your local machine.   

GET SETUP THE QUICK WAY  
  
Install and Run Docker desktop locally. 
Only when docker desktop is up and running, run system-setup.bat from the root directory.    
You will need to run the producer manually whenever you wna tto create a new message. Instructions for starting producer
are listed below in the long setup.    

GET SET UP THE LONG WAY  
  
TO RUN THE API LOCALLY
change to the resolveiq/server directory   
make sure you have docker desktop running locally.   
run :  docker build -t resolveiq-api .   
run : docker run -p 4000:4000  --name resolveiq-api-container resolveiq-api   
that should run a local instance ot the api browse to it / play around http://localhost:4000/   
  
TO RUN THE UI LOCALLY  
navigate to resolveiq/client/userfrontend  
run : docker build -t resolveiq-ui .  
run : docker run -p 8080:80 --name resolveiq-ui-container resolveiq-ui  
once the UI container is running, it should he accessible on localhost:8080

TO RUN MESSAGING SYSTEM LOCALLY
Start up redpandadata (think simple local Kafka)  
Ensure Docker Desktop is running locally  
navigate to resolveiq/streaming  
type docker compose up -d  

Now start the consumer  
navigate to resolveiq/streaming/consumer  
ensure said folder contains a '.env' file, the contents of which need to be 'KAFKA_BROKER=localhost:9092'  
type 'npm start'  

Now start the producer ( the code that creates a user.created event)
navigate to resolveiq/streaming/producer  
ensure said folder contains a '.env' file, the contents of which need to be 'KAFKA_BROKER=localhost:9092'
type npm start  
the consumer should pick up this message and display it in the gitbash window it is running in.
  


> Investigation-first exception handling for missed loyalty earnings.

ResolveIQ is a workflow-driven review tool that helps loyalty support teams investigate missed-points cases, understand account status, authorize transaction reprocessing, and track cases through to resolution.

---

## Overview

ResolveIQ is designed for a loyalty environment where customers expect points to be earned automatically from qualifying purchases.

When that does not happen, support teams need more than a spreadsheet and an email trail. They need a structured way to see new issues early, investigate what happened, and take the correct next step without relying on fragile manual processes.

This frontend is the operational review experience for that workflow.

---

## The Problem

In many loyalty support environments, missed earnings are still handled through fragmented and manual processes.

A customer notices missing points and contacts support. A support representative investigates the issue, but recovery may depend on a systems analyst manually replaying transaction data through a dated file-share and Windows-service workflow.

That creates several problems:

- no shared investigation queue
- poor visibility into open issues
- resolution time is not tracked
- manual analyst intervention is required for routine recovery
- cases can be delayed, forgotten, or incorrectly marked as resolved
- support staff cannot confidently tell customers when they will see their points

ResolveIQ is intended to replace that brittle workflow with a more structured investigation experience.

---

## Why This Matters

The business value is not just technical cleanliness.

A better missed-points workflow can improve:

- customer trust
- support responsiveness
- operational visibility
- consistency of case handling
- confidence in the loyalty platform

ResolveIQ reduces customer-facing delays by giving loyalty teams a shared investigation queue, clearer case context, and a controlled path to reprocessing.

---

## Who This Is For

### Primary users
- Loyalty Support Representatives
- Loyalty Support Supervisors

### Main user goals
Support representatives need to:
- identify new missed-points cases quickly
- inspect account and transaction context
- determine whether the account is active
- authorize reprocessing when appropriate
- send a suitable response when recovery is not possible

Supervisors need to:
- monitor the number of open cases
- understand average time to resolution

---

## Version 1 Scope

Version 1 is intentionally focused.

### Included in v1
- missed loyalty earnings for existing customers
- queue-based investigation workflow
- customer account status checks
- account status history visibility
- controlled authorization of transaction reprocessing
- suggested response flow for inactive accounts
- case status and resolution tracking
- operational reporting focused on open cases and time to resolution

### Explicitly out of scope for v1
- duplicate transaction handling
- suspicious activity review
- delayed processing analytics
- broad fraud workflows
- team assignment / ownership management

The backend data model is intended to support future expansion beyond missed-earn scenarios.

---

## Core Workflow

ResolveIQ is designed to help the support team identify and act on missed-points issues before the customer has to repeatedly chase support.

### Happy path
1. A missed-earn exception appears in the review queue.
2. A support representative opens the case.
3. The representative reviews transaction details, customer details, account status, and account status history.
4. If the account is active and the case is valid, the representative authorizes reprocessing.
5. The transaction is reprocessed so the customer can see the original transaction context and associated earned points in the downstream loyalty experience.
6. If the account is inactive, the application suggests a response template and the representative decides how to proceed.
7. The case is tracked through to resolution.

---

## Key Features

- exception queue for missed-earn cases
- searchable investigation view
- transaction detail inspection
- customer and account status review
- account status history view
- reprocessing authorization flow
- suggested response template for inactive accounts
- case resolution tracking
- supervisor visibility into open cases and average time to resolution

---

## Tech Stack

- **React** for the frontend UI
- **TypeScript** for safer, more maintainable code
- **Vite** for a fast modern frontend build setup
- **Material UI (MUI)** for a polished enterprise-style component library
- **GraphQL** for flexible API access and efficient query design
- **Redux Toolkit** for shared frontend UI state
- **Docker** for consistent local execution and deployment readiness

---

## Architecture Notes

This project is being built as a frontend that connects to a GraphQL API.

### API-backed data
The backend is expected to provide:
- exception cases
- transaction details
- customer information
- account status
- account status history
- case resolution status
- timestamps and audit-related data

### Frontend state
The frontend is expected to manage:
- selected case
- filters
- search terms
- sorting
- pagination
- modal / drawer visibility
- temporary form state
- user feedback such as loading and success states

### Why GraphQL
GraphQL is a strong fit here because the investigation view may need multiple related pieces of data in a single workflow:
- case details
- transaction details
- customer details
- account status
- account history

It also aligns with the long-term goal of building a realistic portfolio application with a modern API design.

---

## Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Clone the repository

```bash
git clone <repo-url>
cd resolveiq-frontend
```

---

## Run with Docker

Build the Docker image:

```bash
docker build -t resolveiq-frontend .
```

Run the container:

```bash
docker run --rm -p 8080:80 resolveiq-frontend
```

Open the application in your browser:

```text
http://localhost:8080
```

---

## Future Enhancements

Potential future iterations may include:

- explicit case assignment
- duplicate transaction review
- suspicious activity review
- delayed-processing analysis
- richer supervisor analytics
- audit timeline improvements
- notification and escalation workflows

---

## Project Status

ResolveIQ is currently being developed as a portfolio project focused on demonstrating product thinking and modern frontend engineering in a realistic operational workflow.

The goal is not just to build a UI, but to model a believable internal tool that solves a real support problem.


