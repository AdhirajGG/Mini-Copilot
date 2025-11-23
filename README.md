Mini Code Copilot

 This is my submission for the Frontend Assignment. It's a responsive web app that mimics an AI code assistant. I had a lot of fun building this, especially trying to get the UI to look and feel like a real developer tool.

 My Thought Process & Architecture

Why Next.js?

I decided to use Next.js 14 (App Router) because I wanted a unified architecture. Since the assignment required both a UI and a mock backend, Next.js lets me handle both in the same repo without needing a separate Express server. It just keeps the deployment pipeline clean and simple.

Styling with Tailwind

I used Tailwind CSS because it speeds up development significantly. It allowed me to implement the dark/light mode logic and the responsive mobile drawer without wrestling with a ton of custom CSS files.

Data Persistence (LocalStorage vs. Database)

I noticed the requirements mentioned persisting history. I opted for localStorage instead of a full database for a few reasons:

It makes the app incredibly fast and lightweight.

It works offline.

It meets the core requirement without over-engineering the infrastructure for a take-home task.
(If this were a production app, I'd definitely swap this out for a proper Postgres setup!)

The "VS Code" Look

One specific thing I wanted to nail was the syntax highlighting. Instead of pulling in a heavy library like PrismJS (which can sometimes cause hydration issues in Next.js), I wrote a lightweight, custom component using Regex. It mimics the specific colors of the VS Code "Dark+" theme so the output feels familiar to developers.

 Features I Built

Core Stuff

[x] Code Generator: You pick a language, type a prompt, and get code back.

[x] Mock AI: I built a backend route that simulates "thinking" time (1s delay) before returning context-aware snippets.

[x] Responsive Design: It works on mobile! I added a collapsible drawer for smaller screens.

The "Extra Mile" (Bonus Features)

[x] Themes: A fully functional Dark/Light mode toggle that respects system preferences.

[x] Smart History:

You can Star/Favorite prompts you use often.

There's a Search bar to filter through old requests.

You can Delete specific items (with a nice undo-safety check).

[x] Editor Controls: I added a settings panel where you can adjust Font Size and Line Height—because accessibility matters.

[x] UX Polish:

Toast Notifications: Little popups when you copy code or delete things.

Confirmation Modals: Instead of the ugly browser alert(), I built a custom modal for deleting history.

Collapsible Panels: You can hide the history or output panels to focus purely on the prompt.

 What I'd Add If I Had More Time

There are definitely a few things I'd love to improve if I kept working on this:

Real AI: Right now it's a mock API. Connecting it to OpenAI or Gemini would be the obvious next step.

Streaming Text: You know how ChatGPT types out the answer? I'd love to implement Server-Sent Events (SSE) to get that same "streaming" effect.

Cloud Sync: Moving from LocalStorage to a database (like Supabase or Neon) so you don't lose your history if you switch browsers.

Better Syntax Highlighting: My Regex solution is fast, but for a real product, I'd integrate something robust like Shiki to handle edge cases in parsing.

 API Example

The mock backend lives at /api/generate. Here's what the payload looks like:

Request:

{
  "prompt": "Create a REST API in Go",
  "language": "go"
}


Response:

{
  "code": "package main\nimport \"fmt\"\n..."
}
