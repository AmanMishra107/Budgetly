# Budgetly

[![Website](https://img.shields.io/badge/Live-Budgetly-7c3aed?logo=vercel&logoColor=white)](https://budgetly-puce.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-4b6ee0?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
![React](https://img.shields.io/badge/React-61dafb?logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38bdf8?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/FramerMotion-ed2590?logo=framer&logoColor=white)

> **Budgetly** is a modern, animated, AI-powered budgeting tool for individuals and families to manage expenses, visualize analytics, and achieve financial goals with a delightful user experience.

---

## 🎬 Demo

> Live: [https://budgetly-puce.vercel.app](https://budgetly-puce.vercel.app)

![Budgetly Hero Animation](https://user-images.githubusercontent.com/93142607/placeholder-hero.gif)
![Animated Charts](https://user-images.githubusercontent.com/93142607/placeholder-charts.gif)

---

## ✨ Features

- **Animated UI**: Eye-catching entrance, hover, and background animations using [Framer Motion](https://www.framer.com/motion/), gradient backgrounds, and smooth transitions.
- **Smart Analytics**: Visualize your income, expenses, and balance trends with interactive charts.
- **Category Management**: Organize expenses into custom categories.
- **Secure Authentication**: Login/Signup flows with animated transitions.
- **Bank-grade Security**: Indian banking integration and secure data handling.
- **Responsive Design**: Fully mobile-ready, delightful across devices.
- **Premium Dashboard**: Dynamic stats, real-time sync, deep insights, and more.

---

## 🏗️ Technologies Used

| Technology      | Purpose                                 |
|-----------------|-----------------------------------------|
| React           | Frontend UI                             |
| TypeScript      | Type Safety                             |
| TailwindCSS     | Modern Utility-First Styling            |
| Framer Motion   | Animations & Transitions                |
| Lucide Icons    | Scalable Icons                          |
| CSS Gradients   | Vibrant animated backgrounds            |
| Recharts        | Data Visualizations                     |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

```bash
git clone https://github.com/AmanMishra107/Budgetly.git
cd Budgetly
npm install
# or
yarn install
```

### Run Locally

```bash
npm start
# or
yarn start
```

### Configuration

- Copy `.env.example` to `.env` and customize as needed (API keys, secrets, etc).

---

## 🖌️ Animations & UI

Budgetly leverages Framer Motion for rich, interactive UI:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.8 }}
>
  {/* Animated Content */}
</motion.div>
```

- **Animated Gradient Backgrounds**:
  - Subtle floating and scaling gradients for hero/footer sections.
  - Example:
    ```tsx
    <motion.div
      className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    ```
- **Button & Icon Animations**:
  - CTA buttons scale and shift on hover/tap.
  - Feature icons float with color transitions.

- **Animated Charts**:
  - Income, expense, and balance visualizations animate in/out.
  - Gradients and tooltips enhance chart readability.

---

## 📊 Screenshots

> _Replace with your own GIFs/screenshots for best effect!_

![Budgetly Dashboard](https://user-images.githubusercontent.com/93142607/placeholder-dashboard.png)
![Animated Authentication](https://user-images.githubusercontent.com/93142607/placeholder-auth.gif)

---

## 🗂️ Project Structure

```
Budgetly/
├── src/
│   ├── components/
│   │   ├── budget/          # Analytics & charts
│   │   └── ui/              # Animated UI & layouts
│   ├── pages/               # Route-based pages (Index, Auth, etc.)
│   ├── App.css              # Global styles
│   └── index.css            # Custom variables & gradients
├── public/
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 🛠️ Customization

- **Tailwind Animations**: Easily add your own custom animations via `tailwind.config.ts`.
- **Theme Gradients**: Modify gradient variables in `src/index.css`.

---

## 🧑‍💻 Contributing

We welcome contributions!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📝 License

This project is **open source** and available under the MIT License.

---

## 📬 Contact

Made with ❤️ by [Aman Mishra](https://github.com/AmanMishra107)

- [Instagram](https://www.instagram.com/aman.mishra__107/)
- [LinkedIn](https://www.linkedin.com/in/amanmishra107/)
- [GitHub](https://github.com/AmanMishra107)

---

## 🙏 Credits

- [Framer Motion](https://www.framer.com/motion/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Recharts](https://recharts.org/)

---

_Enjoy managing your budget with beautiful, animated insights!_
