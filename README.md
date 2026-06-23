<div align="center">
  <br />
  <h1>Bindr: Your Local Book Exchange</h1>
  <p>
    <strong>Connect with local readers, share your library, and discover new stories — all from a clean, beautifully animated interface.</strong>
  </p>
  <p>
    <a href="https://nextjs.org/">
      <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    </a>
    <a href="https://expressjs.com/">
      <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    </a>
    <a href="https://www.postgresql.org/">
      <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    </a>
  </p>
</div>

---

## 📖 Overview

**Bindr** is a community-driven book exchange platform designed to help you lend, borrow, and track books with people in your area. By allowing users to upload their personal libraries and instantly discover books available nearby, Bindr turns solitary reading into a shared local experience. Built with a beautiful, modern aesthetic featuring smooth page-flipping animations, Bindr makes managing your reading journey a delight.

## ✨ Features

- **🏠 Smart Dashboard**: A personalized command center showing your reading statistics, recent requests, and quick actions to manage your library.
- **📚 Personal Library**: A beautifully styled collection of the books you own. Add new books by instantly fetching covers and details via Open Library / Google Books APIs.
- **🤝 Book Exchanges**: A robust system to handle incoming and outgoing book requests. Accept or reject requests, and mark books as returned to close the loop.
- **💬 Messaging & Notifications**: Real-time request tracking and communication to coordinate book hand-offs with other local readers.
- **📈 Reading Analytics**: Detailed tracking of your reading history, including "Books Shared" and "Books Borrowed" to highlight your community impact.
- **🔐 Secure Authentication**: Robust login and profile persistence powered by JWT and PostgreSQL.
- **🎨 Premium UI/UX**: A thoughtfully crafted interface featuring warm, inviting palettes, glassmorphism, and delightful micro-animations like the signature 6-second book-flipping loader.

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: Custom CSS Keyframes & Framer Motion (for smooth transitions)

### Backend
- **Framework**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **External APIs**: Google Books API & Open Library API (for fetching book metadata)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **Database Connection**: `pg` (node-postgres)

### Database
- **Database**: PostgreSQL
- **Schema**: Fully relational database handling users, books, and exchange requests.

## 🚀 Getting Started

Follow these steps to set up both the backend and frontend locally.

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher) running locally or via a cloud provider

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/vanshikapringle/bindr.git
    cd bindr
    ```

2.  **Backend Setup**
    Navigate to the backend directory and install dependencies:
    ```bash
    cd backend
    npm install
    ```
    Set up your PostgreSQL database and execute the schema files (or let the auto-migration scripts run). 
    Configure your environment variables in `.env`:
    ```env
    DB_USER=postgres
    DB_PASSWORD=your_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=book_exchange
    JWT_SECRET=your_jwt_secret
    ```
    Run the Express server:
    ```bash
    node server.js
    ```
    The API will be running on `http://localhost:5000`.

3.  **Frontend Setup**
    Navigate to the frontend directory and install dependencies:
    ```bash
    cd ../bindr-web
    npm install
    ```
    Run the Next.js development server:
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` to view the application in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <sub>Built by Vanshika Pringle 📚</sub>
</div>
