# Collateral Tracker

A web application for tracking collateral items with historical data.

## Features

- Create and update collateral items (name, value, appraisal date)
- Search for existing collateral items by name
- View historical changes to collateral items
- Store data in MongoDB

## Technology Stack

- **Backend**: Spring Boot Java REST server with MongoDB connectivity
- **Frontend**: React with TypeScript, Tailwind CSS, and shadcn/ui components

## Project Structure

- `/backend` - Spring Boot Java backend
- `/frontend` - React TypeScript frontend

## Setup Instructions

### Backend

1. Ensure MongoDB is running locally on port 27017
2. Navigate to the backend directory
3. Run `mvn spring-boot:run` to start the backend server

### Frontend

1. Navigate to the frontend directory
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server

## API Endpoints

- `GET /api/collateral` - Get all collateral items
- `GET /api/collateral/{id}` - Get collateral item by ID
- `GET /api/collateral/search?name={name}` - Search collateral item by name
- `POST /api/collateral` - Create new collateral item
- `PUT /api/collateral/{id}` - Update existing collateral item
- `GET /api/collateral/{id}/history` - Get history of changes for a collateral item
