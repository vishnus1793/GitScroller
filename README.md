# RepoReel 🎬

**Discover amazing repositories with ease!**

RepoReel is a modern, responsive web application that helps developers discover trending GitHub repositories. With powerful search capabilities, filtering options, and an infinite scroll feed, finding your next favorite project has never been easier.

## ✨ Features

- **🔍 Smart Search**: Search repositories by name, description, or topics
- **🎯 Advanced Filtering**: Filter by programming language and sort by stars, forks, or recency
- **📱 Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile
- **🌙 Dark Mode**: Toggle between light and dark themes
- **♾️ Infinite Scroll**: Seamlessly load more repositories as you scroll
- **⭐ Repository Cards**: Rich cards showing stars, forks, language, and description
- **🚀 Fast Performance**: Optimized with caching and efficient API calls


## How can I edit this code?

There are several ways of editing your application.


**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/vishnus1793/GitScroller.git

# Step 2: Navigate to the project directory.
cd GitScroller

# Step 3: Install the necessary dependencies.
npm install 

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠️ Technologies Used

This project is built with modern web technologies:

- **⚡ Vite** - Lightning fast build tool and dev server
- **📘 TypeScript** - Type-safe JavaScript for better development experience
- **⚛️ React** - Modern UI library with hooks and functional components
- **🎨 Tailwind CSS** - Utility-first CSS framework for rapid styling
- **🧩 shadcn/ui** - Beautiful, accessible UI components
- **🔄 TanStack Query** - Powerful data fetching and caching
- **🧭 React Router** - Client-side routing
- **🎯 Lucide React** - Beautiful, customizable icons

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager


## 📖 Usage

### Search Repositories
- Use the search bar to find repositories by name, description, or topics
- Press Enter or click the Search button to execute your search
- Clear your search with the X button to return to trending repos

### Filter & Sort
- **Language Filter**: Choose from popular programming languages or select "All Languages"
- **Sort Options**: Sort by Most Stars, Most Forks, Recently Updated, or Newest

### Browse & Discover
- Scroll through the infinite feed of repositories
- Click on repository cards to visit them on GitHub
- Toggle dark mode with the moon/sun icon in the header

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── FilterBar.tsx   # Search and filter controls
│   ├── RepoCard.tsx    # Repository display card
│   └── ...
├── pages/              # Page components
├── utils/              # Utility functions and API calls
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

## 🎨 Features in Detail

### Smart Search
- **Real-time search** through GitHub's repository database
- **Intelligent filtering** with minimum star thresholds
- **Combined search** - works alongside language and sort filters
- **Instant results** with optimized API calls and caching

### Advanced Filtering
- **11 Popular Languages**: JavaScript, TypeScript, Python, Java, Go, Rust, C++, Swift, Kotlin, PHP
- **4 Sort Options**: Most Stars, Most Forks, Recently Updated, Newest
- **Visual Filter Tags**: See active filters at a glance

### Modern UI/UX
- **Responsive Design**: Seamless experience across all devices
- **Dark/Light Mode**: System preference detection with manual toggle
- **Smooth Animations**: Polished transitions and hover effects
- **Accessibility**: Keyboard navigation and screen reader support

## 🔧 API Integration

RepoReel integrates with the GitHub Search API to provide:
- **Rate Limiting**: Smart caching to respect API limits
- **Error Handling**: Graceful fallbacks and user feedback
- **Performance**: Optimized queries with pagination
- **Real-time Data**: Fresh repository information


### Manual Deployment
The app can be deployed to any static hosting service:
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **GitHub API** for providing repository data
- **shadcn/ui** for beautiful UI components
- **Lucide** for the icon set
- **Tailwind CSS** for the styling system

---

**Built with ❤️ for the developer community**
