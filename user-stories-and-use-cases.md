# Personalized Learning Platform  
**User Stories & Use Cases**

---

##  USER STORIES (Agile Format)

###  Authentication & Personalization

1. **User Sign-Up**  
   *As a new user, I want to create an account and select my courses, so that I get a personalized learning experience based on my semester subjects.*

2. **User Login**  
   *As a returning user, I want to log into my account, so that I can access my saved notes, progress, and enrolled courses.*

3. **Course Dashboard**  
   *As a user, I want to see a dashboard of my enrolled courses, so that I can access topics and materials relevant only to my subjects.*

---

###  Learning & Doubt Clarification

4. **Topic-Based Concept Learning**  
   *As a user, I want to browse and study course topics (e.g., Neural Networks under Machine Learning), so that I can learn in an organized, topic-wise structure.*

5. **Ask a Doubt**  
   *As a user, I want to type in what I don’t understand, so that the system can recommend a YouTube video or article that helps me learn the concept.*

---

###  Notes & Flashcards

6. **Take Notes**  
   *As a user, I want to take and save notes under a specific topic and course, so that I can revisit my learning later in an organized way.*

7. **View Notes**  
   *As a user, I want to view all my notes by course and topic, so that I don’t lose track of my past learnings.*

8. **Generate Flashcards**  
   *As a user, I want the system to generate flashcards for a topic, so that I can revise efficiently using spaced repetition.*

9. **Review Flashcards**  
   *As a user, I want to practice flashcards for a topic, so that I can retain core concepts over time.*

---

###  Practice & Assessment

10. **Take Quizzes**  
    *As a user, I want to take quizzes generated from a topic, so that I can test my understanding and track my progress.*

11. **See Quiz Explanations**  
    *As a user, I want to see explanations for quiz answers, so that I can learn from my mistakes.*

---

##  USE CASES (UML-style)

### Use Case: Register and Setup Account

- **Primary Actor**: New User
- **Preconditions**: User is not registered
- **Main Flow**:
  1. User visits sign-up page.
  2. User enters credentials and selects current semester courses.
  3. System creates account and initializes user profile.
  4. Dashboard is generated with selected courses.

---

### Use Case: Ask a Learning Doubt

- **Primary Actor**: Authenticated User
- **Preconditions**: User is logged in
- **Main Flow**:
  1. User types a doubt into the AI assistant (e.g., “I don’t understand gradient descent”).
  2. System uses an LLM to interpret the query.
  3. System fetches or generates 1 YouTube link and 1 article with explanations.
  4. System returns result with summary and links.

---

### Use Case: Take Notes for a Topic

- **Primary Actor**: Authenticated User
- **Preconditions**: User has enrolled in a course and opened a topic
- **Main Flow**:
  1. User opens the note editor for “Neural Networks”.
  2. User writes and saves notes.
  3. Notes are saved under course → topic in user’s storage.

---

### Use Case: Review Flashcards

- **Primary Actor**: Authenticated User
- **Preconditions**: Flashcards exist for a topic
- **Main Flow**:
  1. User selects a course → topic → "Flashcards".
  2. System displays one flashcard at a time (Q → Reveal A).
  3. User reviews and marks confidence (e.g., “Easy”, “Hard”).
  4. System schedules next review based on spaced repetition logic.

---
