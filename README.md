
# KPI Mapping Application

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. In a separate terminal, start the backend server:
   ```bash
   node server.js
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/incentives
PORT=5000
```

Replace the MongoDB URI with your own if you're using a cloud instance.

## Features

- KPI Mapping management
- Schema Administration
- Excel file upload for data extraction
