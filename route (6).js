@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { box-sizing: border-box; }
  html { -webkit-font-smoothing: antialiased; }
  body { background: #f5f7f6; color: #111827; font-family: 'Inter', system-ui, sans-serif; }
  input, select, textarea, button { font-family: inherit; }
}

@layer components {
  /* ── Inputs ─────────────────────────────────────────────────────────── */
  .input {
    @apply w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white
           text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
           transition-shadow;
  }
  .input-error { @apply border-red-400 focus:ring-red-400; }

  /* ── Buttons ─────────────────────────────────────────────────────────── */
  .btn {
    @apply inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
           text-sm font-medium transition-all duration-150 focus:outline-none
           focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .btn-primary {
    @apply btn bg-primary-600 text-white hover:bg-primary-700
           focus:ring-primary-500 active:scale-[0.98];
  }
  .btn-secondary {
    @apply btn bg-white text-gray-700 border border-gray-200
           hover:bg-gray-50 focus:ring-gray-300 active:scale-[0.98];
  }
  .btn-ghost {
    @apply btn bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300;
  }
  .btn-danger {
    @apply btn bg-red-50 text-red-600 border border-red-200
           hover:bg-red-100 focus:ring-red-400;
  }
  .btn-sm { @apply px-3 py-1.5 text-xs; }
  .btn-lg { @apply px-6 py-3 text-base; }

  /* ── Cards ───────────────────────────────────────────────────────────── */
  .card {
    @apply bg-white border border-gray-200 rounded-xl shadow-sm;
  }
  .card-hover {
    @apply card transition-shadow hover:shadow-md hover:-translate-y-0.5 cursor-pointer;
  }

  /* ── Labels ──────────────────────────────────────────────────────────── */
  .label {
    @apply block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5;
  }

  /* ── Badges ──────────────────────────────────────────────────────────── */
  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }
  .badge-green  { @apply badge bg-primary-50 text-primary-700; }
  .badge-gray   { @apply badge bg-gray-100 text-gray-600; }
  .badge-amber  { @apply badge bg-amber-50 text-amber-700; }
  .badge-blue   { @apply badge bg-blue-50 text-blue-700; }

  /* ── Form sections ───────────────────────────────────────────────────── */
  .field { @apply flex flex-col gap-1; }

  /* ── Empty state ─────────────────────────────────────────────────────── */
  .empty-state {
    @apply flex flex-col items-center justify-center py-16 text-center text-gray-400;
  }
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

/* Smooth scroll */
* { scroll-behavior: smooth; }
