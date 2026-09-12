# Heibook — Digital Library Management System

A web-based library management system designed to simplify book catalog management, member management, borrowing, returns, and library operations through a centralized digital platform.

## Overview

Heibook is a library management web application developed to replace manual library processes with a structured digital system.

The application supports two main roles:

- **Admin / Librarian** — manages books, categories, members, borrowing transactions, returns, overdue books, reports, and library operations.
- **Member** — browses the book catalog, searches and filters books, views book details, borrows books, and manages borrowing history.

The project focuses on building a practical CRUD-based web application while implementing role-based workflows and real-world borrowing rules.

## Key Features

### Public

- Landing page
- Book catalog
- Search and filter books
- Book detail
- Member registration
- Login
- Forgot password

### Member

- Member dashboard
- Browse available books
- Borrow books
- View active loans
- View loan details
- Borrowing history
- Member profile
- Account settings

### Admin / Librarian

- Admin dashboard
- Book management
- Add and edit books
- Category management
- Member management
- Member detail
- Borrowing management
- Return management
- Overdue management
- Reports
- Admin settings

## Library Business Rules

The system implements several borrowing rules:

- A member can borrow a maximum of **3 active books**.
- Each borrowing transaction has a **7-day borrowing period**.
- A book can only be borrowed when its stock is available.
- A member cannot borrow the same book while they still have an active borrowing transaction for that book.
- Book stock decreases when a book is borrowed.
- Book stock increases when a book is returned.
- An unreturned book past its due date is classified as **overdue**.

## Tech Stack

### Frontend

- React.js
- JavaScript
- Vite
- Tailwind CSS
- HTML5
- CSS3

### Development Tools

- Git
- GitHub
- npm

## Project Structure

```text
src/
├── components/
│   ├── books/
│   ├── common/
│   ├── forms/
│   ├── images/
│   └── layout/
│
├── context/
│   └── LibraryContext.jsx
│
├── data/
│   ├── books.js
│   ├── borrowings.js
│   ├── categories.js
│   ├── members.js
│   ├── stats.js
│   └── users.js
│
├── layouts/
│   ├── AdminLayout.jsx
│   ├── MemberLayout.jsx
│   └── PublicLayout.jsx
│
├── pages/
│   ├── admin/
│   ├── member/
│   ├── public/
│   └── system/
│
├── App.jsx
├── index.css
└── main.jsx