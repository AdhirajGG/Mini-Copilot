export const THEME = {
  // LIGHT MODE
  light: {
    bg: {
      main: 'bg-zinc-50',         
      header: 'bg-white/80',       
      sidebar: 'bg-white',         
      card: 'bg-white',           
      input: 'bg-white',           
      codeWindowHeader: 'bg-zinc-100',
      codeWindowBody: 'bg-white',
      overlay: 'bg-black/20',    
      popover: 'bg-white',
      modal: 'bg-white',
    },
    text: {
      primary: 'text-zinc-900',
      secondary: 'text-zinc-500',
      tertiary: 'text-zinc-400',
      accent: 'text-indigo-600',
      code: 'text-zinc-800',
      placeholder: 'placeholder-zinc-400',
    },
    border: {
      base: 'border-zinc-200',
      highlight: 'border-indigo-100',
      input: 'border-zinc-200',
    },
    interactive: {
      primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30',
      primaryBtnLoading: 'bg-indigo-100 text-indigo-400 cursor-wait',
      secondaryBtn: 'hover:bg-zinc-100 text-zinc-500 hover:text-indigo-600',
      iconBox: 'bg-indigo-50 text-indigo-600',
      listItemHover: 'hover:bg-indigo-50/50 hover:border-indigo-200',
      copyBtn: 'bg-white text-zinc-600 border border-zinc-200 hover:border-indigo-300 hover:text-indigo-600',
      deleteBtn: 'hover:bg-red-100 text-zinc-400 hover:text-red-500',
      dangerBtn: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30',
    },
    status: {
      success: 'bg-green-500 text-white',
      languageTag: 'bg-white text-indigo-600 border border-indigo-100',
    }
  },

  // DARK MODE
  dark: {
    bg: {
      main: 'bg-zinc-950',
      header: 'bg-zinc-950/80',
      sidebar: 'bg-zinc-900',
      card: 'bg-zinc-900',
      input: 'bg-zinc-900',
      codeWindowHeader: 'bg-[#252526]', 
      codeWindowBody: 'bg-[#1e1e1e]',   
      overlay: 'bg-black/50',
      popover: 'bg-zinc-800',
      modal: 'bg-zinc-900',
    },
    text: {
      primary: 'text-zinc-100',
      secondary: 'text-zinc-400',
      tertiary: 'text-zinc-600',
      accent: 'text-indigo-400',
      code: 'text-blue-100',
      placeholder: 'placeholder-zinc-600',
    },
    border: {
      base: 'border-zinc-800',
      highlight: 'border-zinc-700',
      input: 'border-zinc-800',
    },
    interactive: {
      primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20',
      primaryBtnLoading: 'bg-indigo-500/10 text-indigo-400 cursor-wait',
      secondaryBtn: 'hover:bg-zinc-800 text-zinc-400 hover:text-yellow-400',
      iconBox: 'bg-indigo-500/10 text-indigo-400',
      listItemHover: 'hover:bg-zinc-800/50 hover:border-zinc-700',
      copyBtn: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-transparent',
      deleteBtn: 'hover:bg-red-900/30 text-zinc-600 hover:text-red-400',
      dangerBtn: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20',
    },
    status: {
      success: 'bg-green-600 text-white',
      languageTag: 'bg-zinc-800 text-zinc-400 border-transparent',
    }
  }
};