# 🖼️ Post Analyzer (Gemini 3 Pro)

A powerful AI-powered social media post analyzer that reverse-engineers high-performing content.
Built with **Next.js 14**, **Gemini 3 Pro**, and **Vercel Postgres**.

## 🚀 Key Features

### 🧠 Advanced AI Analysis

- **Reverse-Engineered Prompt**: Generates a 10/10 accurate prompt to recreate the image.
- **Strategic Compliance**: Evaluates posts against "Ultimate LinkedIn Guidelines" (Hook, Value, Authenticity).
- **Pixel-Perfect Precision**: Analyzes vertical rhythm, aspect ratios (4:5/1:1), and text density.
- **Spatial Intelligence**: Detects exact X/Y coordinates, layering, and z-index.
- **Type & Category Detection**: Automatically classifies content (e.g., Carousel/Educational).

### 📱 Android Friendly (PWA)

- **Installable**: "Add to Home Screen" support with robust PWA manifest.
- **Mobile First**: Fully responsive dashboard with touch-optimized controls.
- **Fixed Navigation**: Reliable "Hamburger" menu and sidebar for mobile users.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI Model**: Google Gemini 3 Pro (`@google/genai`)
- **Database**: Vercel Postgres
- **Auth**: NextAuth.js v5 (Google OAuth)
- **Styling**: Tailwind CSS + Glassmorphism

## 📦 Getting Started

1. **Clone the repo**:

    ```bash
    git clone https://github.com/tahirwebtacloud/Image-Prompt-Reversal-Engine.git
    cd Post Analyzer
    ```

2. **Install dependencies**:

    ```bash
    npm install
    # or
    pnpm install
    ```

3. **Set up environment**:
    Create `.env.local` with keys for `GOOGLE_GENERATIVE_AI_API_KEY`, `POSTGRES_URL`, `NEXTAUTH_SECRET`, etc.

4. **Run locally**:

    ```bash
    npm run dev
    ```

## 📱 Mobile PWA Setup

1. Deploy to Vercel (https` required).
2. Open on Chrome (Android).
3. Tap **⋮** > **Add to Home Screen**.

## 📄 License

MIT
