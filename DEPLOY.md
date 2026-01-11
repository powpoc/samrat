# How to Deploy SAMRAT Website

Your website is built with React and Vite. You can deploy it easily to various hosting providers. **Vercel** is highly recommended for the best performance and ease of use.

## Option 1: Deploy to Vercel (Recommended)

1.  **Create a GitHub Repository**:
    *   Initialize a git repo if you haven't: `git init`, `git add .`, `git commit -m "Initial commit"`.
    *   Push your code to a new repository on GitHub.

2.  **Sign up/Login to Vercel**:
    *   Go to [vercel.com](https://vercel.com).
    *   Login with GitHub.

3.  **Import Project**:
    *   Click "Add New..." > "Project".
    *   Select your `SAMRAT-WEBSITE` repository.
    *   Vercel will detect `Vite` automatically.
    *   Click **Deploy**.

4.  **Done!**: Vercel will give you a live URL (e.g., `samrat-website.vercel.app`).

## Option 2: Deploy to Netlify

1.  **Drag and Drop**:
    *   Run `npm run build` in your project folder.
    *   This creates a `dist` folder.
    *   Go to [app.netlify.com/drop](https://app.netlify.com/drop).
    *   Drag and drop the `dist` folder onto the page.

## Option 3: Manual Static Hosting

1.  Run `npm run build`.
2.  The `dist` folder contains your static website.
3.  Upload the contents of `dist` to any static hosting service (GitHub Pages, Firebase Hosting, standard web hosting).

---
**Note:** Since this app uses `localStorage` for data persistence (Products, Categories, Settings), the data is stored in the **user's browser**.
*   If you deploy, **YOU (the admin)** must visit the deployed Admin panel first to re-add your products and settings, or they will be empty for new visitors.
*   For a real e-commerce store, consider connecting a backend database (like Firebase or Supabase) so data is shared across all users.
