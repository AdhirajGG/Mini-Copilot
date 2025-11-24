'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, Copy, Check, History, Trash2, Moon, Sun, 
  Terminal, Cpu, Search, Menu, X, Sparkles, Star, 
  Settings, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
  Trash, AlertTriangle, Info
} from 'lucide-react';

import { THEME } from '../lib/colors'; 
import CodeViewer from '../lib/code-viewer';

interface HistoryItem {
  id: number;
  prompt: string;
  language: string;
  code: string;
  timestamp: string;
  isStarred?: boolean;
}

type LanguageOption = 'python' | 'javascript' | 'cpp' | 'java' | 'csharp' | 'go' | 'rust';

interface ConfirmationState {
  isOpen: boolean;
  type: 'single' | 'all' | null;
  id: number | null;
}


interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'info';
}

export default function MiniCodeCopilot() {

  const [prompt, setPrompt] = useState<string>('');
  const [language, setLanguage] = useState<LanguageOption>('python');
  const [responseCode, setResponseCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(true);
  const [isOutputOpen, setIsOutputOpen] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

 
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(14);
  const [lineHeight, setLineHeight] = useState<number>(1.5);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  const [confirmation, setConfirmation] = useState<ConfirmationState>({ isOpen: false, type: null, id: null });
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  const colors = darkMode ? THEME.dark : THEME.light;


  useEffect(() => {
    const saved = localStorage.getItem('copilot-history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('copilot-history', JSON.stringify(history));
  }, [history]);


  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };


  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!isOutputOpen) setIsOutputOpen(true);
    setLoading(true);
    setResponseCode('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });
      const data = await res.json();
      
      if (data.code) {
        setResponseCode(data.code);
        const newItem: HistoryItem = {
          id: Date.now(),
          prompt: prompt,
          language: language,
          code: data.code,
          timestamp: new Date().toLocaleString(),
          isStarred: false
        };
        setHistory(prev => [newItem, ...prev]);
      }
    } catch (error) {
      setResponseCode("// Error generating code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("Code copied to clipboard!");
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setLanguage(item.language as LanguageOption);
    setResponseCode(item.code);
    setIsOutputOpen(true);
    if (window.innerWidth < 768) setMobileMenuOpen(false);
  };

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setHistory(prev => prev.map(item => item.id === id ? { ...item, isStarred: !item.isStarred } : item));
  };


  const confirmDeleteSingle = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setConfirmation({ isOpen: true, type: 'single', id });
  };


  const confirmClearAll = () => {
    setConfirmation({ isOpen: true, type: 'all', id: null });
  };


  const executeDelete = () => {
    if (confirmation.type === 'single' && confirmation.id) {
      setHistory(prev => prev.filter(item => item.id !== confirmation.id));
      showToast("History item deleted.");
    } else if (confirmation.type === 'all') {
      setHistory([]);
      showToast("All history cleared.");
    }
    setConfirmation({ isOpen: false, type: null, id: null });
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = showFavoritesOnly ? item.isStarred : true;
    return matchesSearch && matchesFav;
  });

  return (
    <div className={`h-screen flex flex-col font-sans transition-colors duration-300 overflow-hidden ${colors.bg.main} ${colors.text.primary}`}>
      
   
      


      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-40 md:hidden backdrop-blur-sm transition-opacity ${colors.bg.overlay}`} onClick={() => setMobileMenuOpen(false)} />
      )}

   
      {confirmation.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`absolute inset-0 backdrop-blur-sm ${colors.bg.overlay}`} onClick={() => setConfirmation({ isOpen: false, type: null, id: null })} />
          <div className={`relative w-full max-w-sm p-6 rounded-2xl shadow-2xl transform transition-all scale-100 ${colors.bg.modal} ${colors.border.base} border`}>
            <div className="flex flex-col items-center text-center gap-4">
              <div className={`p-3 rounded-full bg-red-100 text-red-600`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Are you sure?</h3>
                <p className={`text-sm ${colors.text.secondary}`}>
                  {confirmation.type === 'all' 
                    ? "This will permanently delete all your prompt history. This action cannot be undone." 
                    : "Do you really want to delete this from your history?"}
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button 
                  onClick={() => setConfirmation({ isOpen: false, type: null, id: null })}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${colors.interactive.secondaryBtn} bg-transparent border border-transparent`}
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-transform active:scale-95 ${colors.interactive.dangerBtn}`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

   
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[70] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}>
            {toast.type === 'success' ? <Check className="w-4 h-4 text-green-500" /> : <Info className="w-4 h-4 text-blue-500" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

     
      <header className={`flex-none flex items-center justify-between px-4 md:px-6 py-3 border-b z-30 ${colors.bg.header} ${colors.border.base}`}>
        <div className="flex items-center gap-4">
          {!isHistoryOpen && (
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className={`hidden md:flex p-2 rounded-lg transition-colors ${colors.interactive.secondaryBtn}`}
              title="Open Sidebar"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${colors.interactive.iconBox}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight hidden sm:block">Mini Copilot</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 relative">
          {/* NEW: Open Output button (appears when output is collapsed) */}
          {!isOutputOpen && (
            <button 
              onClick={() => setIsOutputOpen(true)}
              className={`p-2 rounded-lg transition-all ${colors.interactive.secondaryBtn}`}
              title="Open Output"
            >
              <PanelRightOpen className="w-5 h-5" />
            </button>
          )}

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-all duration-200 ${showSettings ? 'bg-indigo-100 text-indigo-600' : colors.interactive.secondaryBtn}`}
            title="Editor Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {showSettings && (
            <div className={`absolute top-12 right-0 w-72 p-5 rounded-xl shadow-2xl border z-50 animate-in fade-in slide-in-from-top-2 ${colors.bg.popover} ${colors.border.base}`}>
              <h3 className={`text-xs font-bold mb-4 uppercase tracking-wider ${colors.text.secondary}`}>Editor Settings</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-medium">Font Size</span>
                    <span className="text-xs opacity-60">{fontSize}px</span>
                  </div>
                  <input type="range" min="12" max="32" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-medium">Line Height</span>
                    <span className="text-xs opacity-60">{lineHeight}</span>
                  </div>
                  <input type="range" min="1.0" max="2.5" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="w-full accent-indigo-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200/10 text-[10px] text-center opacity-50">Changes apply to output only</div>
            </div>
          )}

          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg transition-all duration-200 ${colors.interactive.secondaryBtn}`}>
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden p-2 rounded-lg transition-colors ${colors.interactive.secondaryBtn}`}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>


      <div className="flex-1 flex overflow-hidden">
        
 
        <aside className={`${isHistoryOpen ? 'w-72 border-r' : 'w-0 border-none'} ${mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 w-72 border-r' : 'relative'} flex flex-col flex-none transition-all duration-300 ease-in-out overflow-hidden ${colors.bg.sidebar} ${colors.border.base}`}>
          <div className="p-4 space-y-4 min-w-[288px]">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsHistoryOpen(false)}
                  className={`p-1.5 rounded-md transition-colors ${colors.interactive.secondaryBtn}`}
                  title="Close Sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
                <h2 className={`text-xs font-bold uppercase tracking-wider ${colors.text.secondary}`}>History</h2>
              </div>
              
              <div className="flex gap-1">
                <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={`p-1.5 rounded-md transition-colors ${showFavoritesOnly ? 'text-yellow-500 bg-yellow-500/10' : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'}`} title="Show Favorites Only">
                  <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-yellow-500' : ''}`} />
                </button>
                {history.length > 0 && (
                  <button onClick={confirmClearAll} className="text-red-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors" title="Clear All History">
                    <Trash className="w-4 h-4" /> 
                  </button>
                )}
              </div>
            </div>
            
            <div className="relative group">
              <Search className={`w-4 h-4 absolute left-3 top-3 ${colors.text.tertiary}`} />
              <input type="text" placeholder="Search prompts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 ${colors.bg.input} ${colors.border.input} ${colors.text.primary}`} />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2 scrollbar-hide min-w-[288px]">
            {filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center px-4">
                <History className={`w-8 h-8 mb-2 ${colors.text.tertiary}`} />
                <p className={`text-sm ${colors.text.tertiary}`}>{showFavoritesOnly ? 'No favorites found' : 'No history yet'}</p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div key={item.id} onClick={() => loadHistoryItem(item)} className={`p-3.5 rounded-xl cursor-pointer text-sm border border-transparent transition-all duration-200 group relative overflow-hidden ${colors.interactive.listItemHover}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${colors.status.languageTag}`}>{item.language}</span>
                    <div className="flex gap-1">
                      <button onClick={(e) => toggleFavorite(e, item.id)} className={`hover:bg-black/5 p-1 rounded-full transition-colors ${item.isStarred ? 'text-yellow-500' : 'text-zinc-300 opacity-0 group-hover:opacity-100'}`}>
                        <Star className={`w-3.5 h-3.5 ${item.isStarred ? 'fill-yellow-500' : ''}`} />
                      </button>
                      <button onClick={(e) => confirmDeleteSingle(e, item.id)} className={`p-1 rounded-full transition-colors ${colors.interactive.deleteBtn} opacity-0 group-hover:opacity-100`} title="Delete Item">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className={`truncate font-medium ${colors.text.primary}`}>{item.prompt}</p>
                  <span className={`text-[10px] block mt-1 ${colors.text.tertiary}`}>{item.timestamp.split(',')[0]}</span>
                </div>
              ))
            )}
          </div>
        </aside>

 
        <main className="flex-1 flex min-w-0 relative">
          
        
          <div className={`flex-1 flex flex-col min-w-0 ${colors.bg.main}`}>
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 pt-4">
                <div className="space-y-1">
                  <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${colors.text.primary}`}>Generate Code</h2>
                  <p className={colors.text.secondary}>Describe your logic, select a language, and let AI write the code.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className={`text-xs font-semibold uppercase tracking-wider ml-1 ${colors.text.secondary}`}>Language</label>
                    <div className="relative">
                      <select value={language} onChange={(e) => setLanguage(e.target.value as LanguageOption)} className={`w-full appearance-none p-4 rounded-xl border outline-none transition-all cursor-pointer ${colors.bg.input} ${colors.border.input} ${colors.text.primary}`}>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="csharp">C#</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-xs font-semibold uppercase tracking-wider ml-1 ${colors.text.secondary}`}>Your Prompt</label>
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Create a class named Person with a constructor..." className={`w-full p-4 h-40 md:h-48 rounded-xl border resize-none outline-none transition-all text-base leading-relaxed ${colors.bg.input} ${colors.border.input} ${colors.text.primary} ${colors.text.placeholder}`} />
                  </div>

                  <button onClick={handleGenerate} disabled={loading || !prompt} className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] ${loading ? colors.interactive.primaryBtnLoading : colors.interactive.primaryBtn}`}>
                    {loading ? (
                      <><div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /><span>Thinking...</span></>
                    ) : (
                      <><Send className="w-5 h-5" /><span>Generate Code</span></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

      
          <div className={`${isOutputOpen ? 'flex-1 border-l' : 'w-0 border-none opacity-0'} flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${colors.border.base} ${colors.bg.main}`}>
            
           
            <div className={`flex-none px-6 py-4 border-b flex justify-between items-center min-w-[300px] ${colors.border.base} ${colors.bg.card}`}>
              <div className="flex items-center gap-2">
                <Terminal className={`w-5 h-5 ${colors.text.accent}`} />
                <span className={`font-semibold text-sm ${colors.text.primary}`}>Generated Output</span>
              </div>
              <div className="flex gap-2">
                {responseCode && (
                  <button onClick={handleCopy} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copied ? colors.status.success : colors.interactive.copyBtn}`}>
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'COPIED' : 'COPY'}
                  </button>
                )}
                <button onClick={() => setIsOutputOpen(false)} className={`p-1.5 rounded-lg transition-colors ${colors.interactive.secondaryBtn}`} title="Collapse Output">
                  <PanelRightClose className="w-4 h-4" />
                </button>
              </div>
            </div>

          
            <div className={`flex-1 overflow-hidden p-4 md:p-6 min-w-[300px] ${darkMode ? 'bg-zinc-950/30' : 'bg-zinc-50/50'}`}>
              {responseCode ? (
                <div className="flex flex-col h-full w-full relative group animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl rounded-xl overflow-hidden bg-[#1e1e1e] border border-[#2b2b2b]">
                  
               
                  <div className="flex-none px-4 py-3 flex items-center justify-between select-none bg-[#1e1e1e] border-b border-[#2b2b2b] z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56cc]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2ecc]" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93fcc]" />
                    </div>
                    <span className="text-xs font-mono text-[#9ca3af] opacity-80">
                      script.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : language === 'csharp' ? 'cs' : language === 'go' ? 'go' : 'rs'}
                    </span>
                    <div className="w-10" /> 
                  </div>
                  

                  <div className="flex-1 overflow-auto p-6">
                    <CodeViewer code={responseCode} language={language} fontSize={fontSize} lineHeight={lineHeight} />
                  </div>

                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60 space-y-4">
                  <div className={`p-6 rounded-3xl ${darkMode ? 'bg-zinc-800' : 'bg-gray-200/50'}`}>
                    <Cpu className={`w-12 h-12 ${colors.text.tertiary}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${colors.text.primary}`}>Ready to Create</h3>
                    <p className={`text-sm mt-1 max-w-xs mx-auto ${colors.text.secondary}`}>Select a language and type a prompt to see the magic happen.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
