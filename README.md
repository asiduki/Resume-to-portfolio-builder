<div align="center">

# 🚀 AI Resume to Portfolio Builder

### Transform Your Resume into a Stunning Portfolio Website Using AI

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/NextAuth-000000?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
</p>

</div>

---

## 📖 Overview

**AI Resume to Portfolio Builder** is a full-stack web application that converts a user's resume into a beautiful, responsive portfolio website using AI.

Instead of manually creating a portfolio, users simply upload their resume, and the application automatically extracts relevant information, generates structured portfolio content, and publishes it with customizable templates.

---

# ✨ Features

### 🤖 AI Resume Parsing

- Upload PDF Resume
- AI-powered information extraction
- Generates structured portfolio content
- Editable generated data

---

### 👤 Authentication

- Secure Login
- User Registration
- Protected Dashboard
- Session Management with NextAuth

---

### 🎨 Portfolio Builder

- Dynamic Portfolio Generation
- Responsive Design
- Multiple Portfolio Templates
- Live Preview
- Public Portfolio URL

Example:

```text
https://your-domain.com/portfolio/username
```

---

### 📝 Portfolio Management

- Edit Personal Information
- Manage Skills
- Add/Edit Projects
- Experience Section
- Education Section
- Certifications
- Social Links

---

### 📷 Image Management

- Profile Image Upload
- Project Images
- Cloudinary Integration

---

### 🌐 Publishing

- Publish / Unpublish Portfolio
- Public Portfolio URL
- Share Portfolio

---

### 🎨 Template System

Choose between multiple portfolio designs including:

- Modern
- Developer
- Creative
- Minimal

---

### 📱 Responsive UI

- Desktop
- Tablet
- Mobile
- Glassmorphism Dashboard
- Smooth Animations

---

# 🛠 Tech Stack

### Frontend

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend

- Next.js API Routes
- MongoDB
- Mongoose
- NextAuth

### AI

- Claude AI (via Aerolink API)

### Storage

- Cloudinary

### Deployment

- Vercel

---

# 📂 Project Structure

```bash
app/
│
├── api/
├── dashboard/
├── portfolio/
├── login/
├── register/
│
components/
│
├── dashboard/
├── editor/
├── templates/
├── portfolio/
│
lib/
models/
hooks/
types/
public/
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/asiduki/Resume-to-portfolio-builder.git

cd Resume-to-Portfolio-Builder
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env.local` file.

```env
MONGODB_URI=

NEXTAUTH_SECRET=

NEXTAUTH_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

OPENROUTER_API_KEY=

OPENROUTER_MODEL=
```

---

## Run Development Server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 📸 Screenshots

> Add screenshots here

- Login Page
- Dashboard
- Resume Upload
- Portfolio Editor
- Templates
- Live Preview
- Public Portfolio

---

# ⚡ Workflow

```text
Register/Login
        │
        ▼
Upload Resume
        │
        ▼
AI Parses Resume
        │
        ▼
Portfolio Generated
        │
        ▼
Edit Portfolio
        │
        ▼
Choose Template
        │
        ▼
Preview
        │
        ▼
Publish
        │
        ▼
Public Portfolio
```

---

# 🔒 Security

- Protected Routes
- Authentication using NextAuth
- MongoDB Data Storage
- Secure API Routes
- User-specific Portfolio Access

---

# 📌 Future Enhancements

- Portfolio Analytics
- Resume PDF Generator
- Theme Customization
- Custom Domains
- Portfolio SEO Enhancements
- AI Content Improvement
- Drag & Drop Portfolio Editor
- Portfolio Version History

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Udit Jadon**

- GitHub: https://github.com/asiduki

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!

It motivates me to build more awesome open-source projects.

---

<div align="center">

### Built with ❤️ using Next.js, TypeScript, MongoDB & AI

⭐ Star this repository if you like it!

</div>