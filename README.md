# BFHL — Data Classifier API

A REST API built for the Bajaj Finserv Health Labs coding challenge.

## What it does

Takes an array of mixed values and classifies them into even numbers, odd numbers, alphabets, and special characters. Also returns their sum and a concat string.

## Tech Stack

- Node.js
- Express.js
- Vanilla HTML/CSS/JS (Frontend)

## How to Run Locally

```bash
npm install
npm start
```

Open browser at `http://localhost:3000`

## API Usage

**POST** `/bfhl`

Request:
```json
{
  "data": ["a", "1", "334", "4", "R", "$"]
}
```

Response:
```json
{
  "is_success": true,
  "user_id": "harsh_singla_08072005",
  "email": "harsh0765.be23@chitkara.edu.in",
  "roll_number": "2310990765",
  "odd_numbers": ["1"],
  "even_numbers": ["334", "4"],
  "alphabets": ["A", "R"],
  "special_characters": ["$"],
  "sum": "339",
  "concat_string": "Ra"
}
```

**GET** `/bfhl` — returns operation code

## Deployed On

Vercel — [Live Link](https://your-vercel-url.vercel.app/bfhl)
