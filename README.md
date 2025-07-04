# Personalized Learning System

**Personalized Learning System (PLS)** is a modern, full-stack web application that empowers students and self-learners to accelerate their learning using personalized tools, progress tracking, quizzes, notes, flashcards, and AI-powered tutoring—all in one place.

---

##  Features

- **Courses:** Browse structured learning materials and dive into course sections.
- **Notes:** Create, organize, and review your own learning notes.
- **Quizzes:** Generate and take smart quizzes based on topics and skill level.
- **Flashcards:** Practice and reinforce knowledge using topic-based flashcards.
- **Progress Tracking:** Visualize your learning journey with charts and stats.
- **Personalized Recommendations:** Get suggestions for what to learn next.
- **AI Tutor:** Ask questions and get instant, helpful answers powered by AI.

---

##  Tech Stack

- **Frontend:** React, Recharts, modern CSS
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Authentication:** JWT-based login/register

---

##  Project Structure

```
/
├── backend/
│   ├── app/           # FastAPI application (routes, models, utils)
│   ├── tests/         # Pytest unit/integration tests
│   └── requirements.txt
├── frontend/
│   ├── src/           # React components, pages, and assets
│   └── package.json
└── README.md
```

---

##  Getting Started

### Prerequisites

- Node.js (v20 recommended)
- Python 3.11+
- MongoDB (local or remote)

### 1. Clone the Repository

```bash
git clone https://github.com/Nanji03/Personalized-Learning-Platform.git
cd Personalized-Learning-Platform
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Make sure MongoDB is running locally or update DB URI in backend config
uvicorn app.main:app --reload
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)

---

##  Running Tests

### Backend

```bash
cd backend
PYTHONPATH=. pytest
```

### Frontend

```bash
cd frontend
npm test
```

---


##  Contributing

Contributions are welcome!  
- Please open issues for bugs or feature requests.
- Fork the repo and submit a pull request for any improvements.

---


## 📫 Contact

For questions or feedback, open an issue or reach out to [Nanji03](https://github.com/Nanji03).

---
