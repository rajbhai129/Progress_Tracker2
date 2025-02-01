# Study Progress Tracker

## Overview
The **Study Progress Tracker** is a web application designed to help users manage and track their study progress efficiently. Users can add subjects, chapters, and components like lecture study, practice, previous year questions (PYQs), and revision. The app calculates progress at the chapter, subject, and overall course levels based on customizable weightages.

## Features
- Add subjects and chapters
- Define study components with custom weightage
- Automatically calculate progress for:
  - Chapter level
  - Subject level
  - Overall course
- Mark study components as complete to update progress
- Fully customizable input fields and weightages

## Tech Stack
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Express.js, EJS for templating
- **Database:** PostgreSQL (or any SQL database)

## Installation
### Prerequisites
- Node.js installed
- PostgreSQL installed and configured

### Steps to Run Locally
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/Progress_Tracker.git
   cd study-progress-tracker
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory
   - Add the following:
     ```env
     DATABASE_URL=your_database_connection_string
     SECRET_KEY=your_secret_key
     ```
4. **Run the database migrations (if applicable):**
   ```sh
   npx prisma migrate dev
   ```
5. **Start the server:**
   ```sh
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser.

## Usage
1. **Add Subjects & Chapters** - Input subjects and break them into chapters.
2. **Define Components** - Assign study components (e.g., Lecture, Practice, PYQs, Revision) with specific weightages.
3. **Track Progress** - Mark components as complete, and the app automatically calculates progress.

## Future Enhancements
- User authentication
- Progress analytics and visualizations
- Mobile-friendly UI improvements

## License
This project is open-source under the [MIT License](LICENSE).

