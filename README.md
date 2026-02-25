# Hacker News 🚀

A modern, high-performance Hacker News client built with React, Vite, and Framer Motion. Featuring a sleek glassmorphism UI, smooth animations, and an intuitive split-view reader.

🔗 **[Live Demo](https://1u-w-u1.github.io/hacker-news/)**

---

## ✨ Features

### 📰 Home Page
- **Top Stories Feed**: Real-time updates from the official Hacker News API
- **Story Rankings**: Numbered list showing story position
- **Story Metadata**: Points, author, comment count, and source domain for each story
- **Pagination**: Navigate through all top stories with Previous/Next controls
- **Staggered Animations**: Smooth fade-in animations as stories load

### 📖 Story Detail Page
- **Split-View Layout**: Article content on the left, comments on the right
- **Embedded Article Viewer**: View linked articles directly in an iframe without leaving the app
- **Text Post Support**: Native rendering for Ask HN, Show HN, and other text-based posts
- **Resizable Panels**: Draggable splitter to adjust the article/comments ratio
- **Back Navigation**: Quick return to the home page

### 💬 Comments System
- **Threaded Comments**: Nested comment threads with visual depth indicators
- **Color-Coded Nesting**: Different colors for each nesting level (orange, purple, blue, green, red)
- **Collapsible Threads**: Expand/collapse comment threads to focus on specific discussions
- **Reply Counts**: Shows number of replies for each parent comment
- **External Links**: Links in comments open in new tabs automatically

### 🎨 UI/UX
- **Glassmorphism Design**: Frosted glass effect with backdrop blur
- **Dark Theme**: Easy on the eyes for extended reading
- **Responsive Layout**: Works beautifully on desktop and mobile
- **Smooth Animations**: Framer Motion powered transitions throughout
- **Loading States**: Elegant spinners while content loads
- **Hover Effects**: Interactive feedback on clickable elements

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [React 18](https://reactjs.org/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Language** | TypeScript |
| **Styling** | Vanilla CSS with Glassmorphism |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Routing** | [React Router v6](https://reactrouter.com/) |
| **API** | [Hacker News API](https://github.com/HackerNews/API) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone ...
   cd hacker-news
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build and deploy to GitHub Pages |

---

## 📁 Project Structure

```
src/
├── components/
│   └── Navbar.tsx       # Navigation bar with logo
├── pages/
│   ├── Home.tsx         # Story list with pagination
│   └── Detail.tsx       # Split-view article reader
├── App.tsx              # Router configuration
├── App.css              # Component styles
└── index.css            # Global styles & design tokens
```

---

## 📄 License

MIT
