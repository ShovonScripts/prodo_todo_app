# ProDo - Personal Task Management Dashboard

ProDo is a sleek, modern, and extremely fast task management web application built with React, Vite, and Supabase.

## Features
- **Modern Dark Interface:** A sleek aesthetic designed with precise Tailwind utility classes.
- **Instant Synchronization:** Todo lists sync in real-time across devices using Supabase's Realtime websockets.
- **Drag & Drop Order:** Adjust project priorities naturally using a high-performance `@dnd-kit` implementation.
- **Secure Authentication:** Complete email and password flow integrated securely via Supabase Auth, including styled confirmation states.
- **Comprehensive SEO:** Configured exactly to spec with detailed Open Graph, Title, and Descriptor metadata.
- **Legacy Import:** Automatically imports your existing un-synced localStorage tasks once you create an account!

## Technologies
- **Frontend Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **Backend as a Service:** Supabase (Postgres Database, Auth, Realtime)
- **Routing:** SPA routing capable via `.htaccess` on cPanel/Apache

## Getting Started

### Requirements
- Node.js (v16+)
- A [Supabase](https://supabase.com/) Project

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShovonScripts/prodo_todo_app.git
   cd prodo_todo_app
   ```

2. **Install necessary node modules**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in your root folder with your Supabase keys:
   ```ini
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Launch the Development Server**
   ```bash
   npm run dev
   ```

### Supabase Architecture

Run the following SQL setup exactly as shown in your Supabase SQL Editor to make the backend architecture function perfectly:

```sql
-- 1. Create the base table
CREATE TABLE public.todos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  text text NOT NULL,
  completed boolean DEFAULT false,
  priority integer DEFAULT 2,
  order_index integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Activate Row Level Security (RLS)
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 3. Safety Check Policies
CREATE POLICY "Users can view their own todos" ON public.todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own todos" ON public.todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own todos" ON public.todos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own todos" ON public.todos FOR DELETE USING (auth.uid() = user_id);

-- 4. Turn on WebSockets for App.jsx listeners
ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;
```

## Deployment Built for cPanel
If deploying to a standard web host like cPanel, we've provided a custom `.htaccess` architecture inside `/public/`.
Simply generate your build output:
```bash
npm run build
```
Upload the exact structure of your `/dist` folder to your Document Root, ensuring hidden files like `.htaccess` are successfully transmitted.

---
Crafted beautifully by **[ProDo](https://prodo.top)**
