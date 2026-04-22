// ─────────────────────────────────────────────────────────────
//  AlgoViz Universal Algorithm Assistant Chatbot
//  Self-initializing · No JSX · React.createElement only
//  Uses window.__ALGO_CONTEXT for live state + DOM observation
// ─────────────────────────────────────────────────────────────
(function () {
    'use strict';

    const STORAGE_KEY = 'algoviz_chatbot_v1';
    const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
    const GROQ_MODEL = 'llama-3.3-70b-versatile';

    const LANGUAGES = [
        'English', 'Bengali (Bangla)', 'Spanish', 'French', 'German',
        'Arabic', 'Hindi', 'Chinese (Simplified)', 'Japanese', 'Portuguese',
        'Russian', 'Korean', 'Turkish', 'Italian', 'Dutch', 'Polish',
        'Swedish', 'Indonesian', 'Thai', 'Vietnamese'
    ];

    const SUGGESTIONS = [
        'What is happening at this step?',
        'Explain the time complexity.',
        'What does the highlighted pseudocode line do?',
        'Why was this algorithm invented?',
        'Compare this to a similar algorithm.',
        'What happens in the next step?',
        'When should I use this algorithm?'
    ];

    // ── Title → ALGORITHM_PSEUDOCODE key mapping ──────────────
    const TITLE_MAP = {
        'bubble': 'BUBBLE_SORT', 'selection sort': 'SELECTION_SORT',
        'insertion': 'INSERTION_SORT', 'merge sort': 'MERGE_SORT',
        'quick': 'QUICK_SORT', 'heap sort': 'HEAP_SORT',
        'shell': 'SHELL_SORT', 'radix': 'RADIX_SORT',
        'counting': 'COUNTING_SORT', 'bucket': 'BUCKET_SORT',
        'comb': 'COMB_SORT', 'cycle': 'CYCLE_SORT',
        'bfs': 'BFS', 'breadth': 'BFS',
        'dfs': 'DFS', 'depth': 'DFS',
        'dijkstra': 'DIJKSTRA', 'bellman': 'BELLMAN_FORD',
        'kruskal': 'KRUSKAL', 'prim': 'PRIM',
        'a-star': 'ASTAR', 'a*': 'ASTAR',
        'topological': 'TOPOLOGICAL', 'floyd': 'FLOYD_WARSHALL',
        'bipartite': 'BIPARTITE', 'page rank': 'PAGERANK',
        'graph color': 'GRAPH_COLORING', 'map color': 'MAP_COLORING',
        'fibonacci': 'FIBONACCI', 'factorial': 'FACTORIAL',
        'hanoi': 'HANOI', 'n-queens': 'NQUEENS', 'nqueens': 'NQUEENS',
        'sudoku': 'SUDOKU', 'knapsack': 'KNAPSACK',
        'permutation': 'PERMUTATIONS', 'infix': 'INFIX',
        'prefix': 'PREFIX', 'postfix': 'POSTFIX',
        'minimax': 'MINIMAX', 'graham': 'GRAHAM_SCAN',
        'jarvis': 'JARVIS_MARCH', 'turing': 'TURING_MACHINE',
        'signal': 'SIGNAL_1D', 'convolution': 'SIGNAL_1D',
        'neural': 'NEURAL_NETWORK', 'k-means': 'KMEANS', 'kmeans': 'KMEANS',
        'genetic': 'GENETIC', 'annealing': 'SIMULATED_ANNEALING',
        'binary search tree': 'BST', 'avl': 'AVL',
        'huffman': 'HUFFMAN', 'hashing': 'HASHING',
        'binary search': 'BINARY_SEARCH', 'greedy': 'GREEDY',
        'b+ tree': 'BPLUS_TREE', 'b tree': 'BTREE',
        'heapify': 'HEAPIFY', 'heap': 'HEAP_SORT',
    };

    // ── Helpers ───────────────────────────────────────────────
    function getSettings() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
        catch { return {}; }
    }
    function saveSettings(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

    function detectAlgoKey() {
        if (window.__ALGO_CONTEXT?.algoKey) return window.__ALGO_CONTEXT.algoKey;
        const title = document.title.toLowerCase();
        for (const [kw, key] of Object.entries(TITLE_MAP)) {
            if (title.includes(kw)) return key;
        }
        // fallback: try direct match against ALGORITHM_PSEUDOCODE keys
        if (window.ALGORITHM_PSEUDOCODE) {
            for (const key of Object.keys(window.ALGORITHM_PSEUDOCODE)) {
                if (title.includes(key.toLowerCase().replace(/_/g, ' '))) return key;
            }
        }
        return null;
    }

    function buildSystemPrompt(language) {
        const algoKey = detectAlgoKey();
        const pseudo = algoKey && window.ALGORITHM_PSEUDOCODE
            ? window.ALGORITHM_PSEUDOCODE[algoKey] : null;
        const ctx = window.__ALGO_CONTEXT || {};

        let prompt = `You are an expert, friendly algorithm tutor embedded inside "AlgoViz" — an interactive step-by-step algorithm visualizer.
Your goal: help the user deeply understand the algorithm being visualized RIGHT NOW.
Page: ${document.title}
Algorithm: ${algoKey ? algoKey.replace(/_/g, ' ') : document.title}`;

        if (pseudo?.length) {
            prompt += `\n\nPseudocode:\n${pseudo.map(l => '  ' + l).join('\n')}`;
        }

        if (ctx.state) {
            const s = ctx.state;
            prompt += `\n\nCurrent Simulation State:\n  • Step #${s.stepId ?? '?'}  |  Status: ${s.status ?? '?'}\n  • Description: "${s.desc ?? ''}"`;
            if (s.algoLine && pseudo?.[s.algoLine - 1]) {
                prompt += `\n  • Executing pseudocode line ${s.algoLine}: "${pseudo[s.algoLine - 1]}"`;
            }
        } else if (ctx.desc) {
            prompt += `\n\nCurrent Step: "${ctx.desc}"`;
        }

        prompt += '\n\nStyle: Be concise (2-4 sentences), approachable, and educational. Use simple analogies. Avoid walls of text.';
        const lang = language && language !== 'English' ? language : null;
        if (lang) prompt += `\n\n🌐 CRITICAL: You MUST respond entirely in ${lang}. Translate everything including technical terms as naturally as possible.`;

        return prompt;
    }

    async function callGroq(apiKey, conversationMsgs, language) {
        const sys = buildSystemPrompt(language);
        const res = await fetch(GROQ_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [{ role: 'system', content: sys }, ...conversationMsgs.slice(-14)],
                max_tokens: 600,
                temperature: 0.7
            })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error?.message || `HTTP ${res.status} — Check your API key`);
        }
        const data = await res.json();
        return data.choices?.[0]?.message?.content ?? '(no response)';
    }

    // ── DOM Observer (passive live state) ────────────────────
    function startDOMObserver() {
        const poll = () => {
            // Read current step description from the most common selector patterns
            const descEl = document.querySelector('.text-emerald-300.truncate')
                || document.querySelector('.text-indigo-300.truncate')
                || document.querySelector('.text-blue-300.truncate')
                || document.querySelector('[class*="emerald-300"][class*="truncate"]')
                || document.querySelector('[class*="indigo-300"][class*="truncate"]');
            if (descEl?.textContent) {
                window.__ALGO_CONTEXT = window.__ALGO_CONTEXT || {};
                window.__ALGO_CONTEXT.desc = descEl.textContent.trim();
            }
        };
        setInterval(poll, 500);
    }

    // ── CSS Injection ─────────────────────────────────────────
    function injectCSS() {
        const css = document.createElement('style');
        css.id = '_acb_styles';
        css.textContent = `
        #_acb_mount { font-family: 'Inter', system-ui, sans-serif; }
        #_acb_mount * { box-sizing: border-box; }

        ._acb_fab {
            position: fixed; bottom: 24px; right: 24px; z-index: 99998;
            width: 56px; height: 56px; border-radius: 50%;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            box-shadow: 0 8px 32px rgba(99,102,241,0.55), 0 0 0 2px rgba(99,102,241,0.15);
            border: none; cursor: pointer; color: white;
            display: flex; align-items: center; justify-content: center;
            transition: transform 0.25s cubic-bezier(0.4,0,0.2,1),
                        box-shadow 0.25s ease;
        }
        ._acb_fab:hover {
            transform: scale(1.1) translateY(-2px);
            box-shadow: 0 14px 40px rgba(99,102,241,0.65);
        }
        ._acb_fab_badge {
            position: absolute; top: -3px; right: -3px;
            width: 17px; height: 17px; border-radius: 50%;
            background: #10b981; border: 2px solid #0f172a;
            font-size: 9px; font-weight: 700; color: white;
            display: flex; align-items: center; justify-content: center;
            animation: _acb_pulse 2s ease-in-out infinite;
        }
        @keyframes _acb_pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }

        ._acb_win {
            position: fixed; bottom: 92px; right: 24px; z-index: 99999;
            width: 390px; max-height: 600px;
            background: rgba(6, 11, 28, 0.97);
            backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(99,102,241,0.28);
            border-radius: 22px;
            box-shadow: 0 30px 80px rgba(0,0,0,0.7),
                        0 0 0 1px rgba(99,102,241,0.08),
                        inset 0 1px 0 rgba(255,255,255,0.05);
            display: flex; flex-direction: column; overflow: hidden;
            animation: _acb_slideup 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes _acb_slideup {
            from { opacity:0; transform: translateY(16px) scale(0.96); }
            to   { opacity:1; transform: translateY(0) scale(1); }
        }

        ._acb_header {
            padding: 15px 18px 13px;
            background: linear-gradient(135deg, rgba(79,70,229,0.14) 0%, rgba(124,58,237,0.08) 100%);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            flex-shrink: 0;
        }
        ._acb_header_row { display: flex; align-items: center; justify-content: space-between; }
        ._acb_avatar {
            width: 34px; height: 34px; border-radius: 50%;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            display: flex; align-items: center; justify-content: center;
            font-size: 17px; box-shadow: 0 4px 12px rgba(99,102,241,0.4);
            flex-shrink: 0;
        }
        ._acb_header_btn {
            background: rgba(255,255,255,0.06); border: none; color: #94a3b8;
            border-radius: 8px; padding: 6px 9px; cursor: pointer; font-size: 12px;
            transition: all 0.2s; line-height: 1;
        }
        ._acb_header_btn:hover { background: rgba(255,255,255,0.12); color: white; }

        ._acb_ctx_bar {
            margin: 8px 14px 0;
            padding: 5px 10px;
            background: rgba(99,102,241,0.07);
            border: 1px solid rgba(99,102,241,0.15);
            border-radius: 7px;
            font-size: 10px; color: #818cf8; font-family: monospace;
            display: flex; align-items: center; gap: 5px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        ._acb_msgs {
            flex: 1; overflow-y: auto; padding: 14px 14px 8px;
            display: flex; flex-direction: column; gap: 10px;
            scrollbar-width: thin; scrollbar-color: #2d3748 transparent;
        }
        ._acb_msgs::-webkit-scrollbar { width: 4px; }
        ._acb_msgs::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 2px; }

        ._acb_msg_user {
            background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
            color: rgba(255,255,255,0.95); border-radius: 16px 16px 4px 16px;
            padding: 10px 14px; font-size: 13px; line-height: 1.6;
            align-self: flex-end; max-width: 88%;
            box-shadow: 0 4px 14px rgba(79,70,229,0.35);
            animation: _acb_msgfade 0.2s ease;
        }
        ._acb_msg_ai {
            background: rgba(30,41,64,0.85);
            color: #cbd5e1; border-radius: 16px 16px 16px 4px;
            padding: 10px 14px; font-size: 13px; line-height: 1.65;
            align-self: flex-start; max-width: 92%;
            border: 1px solid rgba(255,255,255,0.07);
            animation: _acb_msgfade 0.2s ease;
        }
        @keyframes _acb_msgfade {
            from { opacity:0; transform: translateY(6px); }
            to   { opacity:1; transform: translateY(0); }
        }

        ._acb_typing {
            display: flex; align-items: center; gap: 5px;
            padding: 12px 16px; background: rgba(30,41,64,0.85);
            border-radius: 16px 16px 16px 4px; align-self: flex-start;
            border: 1px solid rgba(255,255,255,0.07);
            animation: _acb_msgfade 0.2s ease;
        }
        ._acb_dot {
            width: 7px; height: 7px; border-radius: 50%; background: #6366f1;
            animation: _acb_dotbounce 1.4s ease-in-out infinite;
        }
        ._acb_dot:nth-child(2) { animation-delay: 0.18s; background: #8b5cf6; }
        ._acb_dot:nth-child(3) { animation-delay: 0.36s; background: #a78bfa; }
        @keyframes _acb_dotbounce {
            0%,60%,100% { transform: translateY(0); opacity: 0.5; }
            30%         { transform: translateY(-5px); opacity: 1; }
        }

        ._acb_chips {
            padding: 0 14px 8px; display: flex; gap: 6px;
            flex-wrap: wrap; flex-shrink: 0;
        }
        ._acb_chip {
            background: rgba(79,70,229,0.1); border: 1px solid rgba(99,102,241,0.22);
            color: #a5b4fc; border-radius: 20px; padding: 5px 11px;
            font-size: 11px; cursor: pointer; white-space: nowrap;
            transition: all 0.18s; user-select: none; line-height: 1.4;
        }
        ._acb_chip:hover { background: rgba(79,70,229,0.25); color: #c4b5fd; transform: translateY(-1px); }

        ._acb_input_area {
            padding: 10px 14px 14px;
            border-top: 1px solid rgba(255,255,255,0.06);
            background: rgba(6,11,28,0.6);
            flex-shrink: 0;
        }
        ._acb_no_key {
            text-align: center; color: #64748b; font-size: 11.5px;
            margin-bottom: 8px; padding: 7px 12px;
            background: rgba(99,102,241,0.05);
            border: 1px dashed rgba(99,102,241,0.2); border-radius: 9px;
        }
        ._acb_input_row { display: flex; gap: 8px; align-items: flex-end; }
        ._acb_textarea {
            flex: 1; background: rgba(30,41,64,0.7);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px; padding: 9px 13px;
            color: white; font-size: 13px; font-family: inherit;
            resize: none; overflow: hidden; line-height: 1.5;
            transition: border-color 0.2s;
        }
        ._acb_textarea:focus { border-color: rgba(99,102,241,0.5); outline: none; }
        ._acb_textarea::placeholder { color: #3d4f70; }
        ._acb_textarea:disabled { opacity: 0.4; cursor: not-allowed; }
        ._acb_send {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white; border: none; border-radius: 11px;
            padding: 9px 15px; font-size: 18px; font-weight: 700;
            cursor: pointer; transition: all 0.2s; line-height: 1;
            box-shadow: 0 4px 14px rgba(99,102,241,0.35);
            flex-shrink: 0;
        }
        ._acb_send:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.5); }
        ._acb_send:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

        ._acb_err {
            font-size: 11px; color: #f87171; text-align: center;
            padding: 6px 10px; margin: 0 0 6px;
            background: rgba(248,113,113,0.07); border: 1px solid rgba(248,113,113,0.18);
            border-radius: 8px;
        }

        /* Settings Panel */
        ._acb_settings {
            position: absolute; inset: 0; z-index: 10;
            background: rgba(6, 11, 28, 0.99);
            border-radius: 22px; overflow-y: auto;
            scrollbar-width: thin; scrollbar-color: #2d3748 transparent;
            animation: _acb_slideup 0.22s ease;
        }
        ._acb_settings::-webkit-scrollbar { width: 4px; }
        ._acb_settings::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 2px; }
        ._acb_settings_inner { padding: 22px 20px; display: flex; flex-direction: column; gap: 20px; min-height: 100%; }
        ._acb_label { color: #94a3b8; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 7px; display: block; }
        ._acb_field {
            width: 100%; background: rgba(30,41,64,0.8);
            border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
            padding: 10px 13px; color: white; font-size: 13px;
            font-family: inherit; transition: border-color 0.2s;
        }
        ._acb_field:focus { border-color: rgba(99,102,241,0.5); outline: none; }
        ._acb_field option { background: #1e293b; color: white; }
        ._acb_save_btn {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white; border: none; border-radius: 13px;
            padding: 13px; font-size: 14px; font-weight: 700;
            cursor: pointer; width: 100%;
            box-shadow: 0 6px 20px rgba(99,102,241,0.4);
            transition: all 0.2s; margin-top: auto;
        }
        ._acb_save_btn:hover { transform: translateY(-1px); box-shadow: 0 8px 26px rgba(99,102,241,0.55); }
        ._acb_helper_text { font-size: 11px; color: #475569; margin-top: 5px; }
        ._acb_helper_text a { color: #818cf8; text-decoration: none; }
        ._acb_helper_text a:hover { text-decoration: underline; }
        `;
        document.head.appendChild(css);
    }

    // ── React Component ───────────────────────────────────────
    function mountChatbot() {
        const { React, ReactDOM } = window;
        if (!React || !ReactDOM) return;
        const { useState, useEffect, useRef, useCallback } = React;
        const h = React.createElement;

        function format(text) {
            // Simple bold formatter: **text** → <strong>
            return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return h('strong', { key: i }, part.slice(2, -2));
                }
                return part;
            });
        }

        function ChatBot() {
            const saved = getSettings();
            const [isOpen, setIsOpen] = useState(false);
            const [showSettings, setShowSettings] = useState(false);
            const [apiKey, setApiKey] = useState(saved.apiKey || '');
            const [language, setLanguage] = useState(saved.language || 'English');
            const [apiKeyDraft, setApiKeyDraft] = useState(saved.apiKey || '');
            const [languageDraft, setLanguageDraft] = useState(saved.language || 'English');
            const [messages, setMessages] = useState([{
                role: 'assistant',
                content: '👋 Hello! I\'m your **AlgoViz assistant**. Ask me anything about the current algorithm, step, or pseudocode — I\'m here to help you understand!'
            }]);
            const [input, setInput] = useState('');
            const [isLoading, setIsLoading] = useState(false);
            const [error, setError] = useState('');
            const [unread, setUnread] = useState(0);
            const scrollRef = useRef(null);
            const textareaRef = useRef(null);

            useEffect(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }, [messages, isLoading]);

            useEffect(() => {
                if (isOpen) { setUnread(0); }
                if (isOpen && !showSettings && textareaRef.current) {
                    setTimeout(() => textareaRef.current?.focus(), 100);
                }
            }, [isOpen, showSettings]);

            const openSettings = useCallback(() => {
                setApiKeyDraft(apiKey);
                setLanguageDraft(language);
                setShowSettings(true);
                setError('');
            }, [apiKey, language]);

            const saveSettings_ = useCallback(() => {
                setApiKey(apiKeyDraft);
                setLanguage(languageDraft);
                saveSettings({ apiKey: apiKeyDraft, language: languageDraft });
                setShowSettings(false);
                setError('');
                if (textareaRef.current) setTimeout(() => textareaRef.current?.focus(), 100);
            }, [apiKeyDraft, languageDraft]);

            const send = useCallback(async (text) => {
                const msg = (text !== undefined ? text : input).trim();
                if (!msg || isLoading) return;
                if (!apiKey) { openSettings(); return; }

                setInput('');
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                }
                const userMsg = { role: 'user', content: msg };
                setMessages(prev => [...prev, userMsg]);
                setIsLoading(true);
                setError('');

                try {
                    const history = messages.filter(m => m.role !== 'system').concat(userMsg);
                    const reply = await callGroq(apiKey, history, language);
                    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
                    if (!isOpen) setUnread(n => n + 1);
                } catch (e) {
                    setError('⚠️ ' + e.message);
                } finally {
                    setIsLoading(false);
                }
            }, [input, isLoading, apiKey, language, messages, isOpen, openSettings]);

            const handleKey = useCallback((e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
            }, [send]);

            const handleTextareaInput = (e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 90) + 'px';
            };

            const ctx = window.__ALGO_CONTEXT || {};
            const algoKey = detectAlgoKey();
            const hasKey = !!apiKey;
            const showCtxBar = !!(ctx.state?.desc || ctx.desc);
            const ctxText = ctx.state?.desc || ctx.desc || '';
            const showChips = messages.length <= 2;

            // ── Settings Panel ──────────────────────────────
            const settingsPanel = showSettings && h('div', { className: '_acb_settings' },
                h('div', { className: '_acb_settings_inner' },
                    // Header
                    h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
                        h('div', null,
                            h('div', { style: { color: 'white', fontWeight: '800', fontSize: '17px', letterSpacing: '-0.02em' } }, '⚙️ Assistant Settings'),
                            h('div', { style: { color: '#64748b', fontSize: '12px', marginTop: '3px' } }, 'Configure AI backend & language')
                        ),
                        h('button', { className: '_acb_header_btn', onClick: () => { setShowSettings(false); setError(''); } }, '✕')
                    ),

                    // Divider
                    h('div', { style: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '-4px 0' } }),

                    // API Key
                    h('div', null,
                        h('label', { className: '_acb_label' }, '🔑 Groq API Key'),
                        h('input', {
                            type: 'password',
                            className: '_acb_field',
                            placeholder: 'gsk_xxxxxxxxxxxxxxxxxxxx',
                            value: apiKeyDraft,
                            onChange: e => setApiKeyDraft(e.target.value),
                            autoComplete: 'off'
                        }),
                        h('p', { className: '_acb_helper_text' },
                            'Free at ',
                            h('a', { href: 'https://console.groq.com', target: '_blank', rel: 'noreferrer' }, 'console.groq.com'),
                            ' · Uses ',
                            h('strong', { style: { color: '#818cf8' } }, 'Llama 3.3 70B'),
                            ' · Never stored on any server'
                        )
                    ),

                    // Language
                    h('div', null,
                        h('label', { className: '_acb_label' }, '🌐 Response Language'),
                        h('select', {
                            className: '_acb_field',
                            value: languageDraft,
                            onChange: e => setLanguageDraft(e.target.value)
                        }, LANGUAGES.map(lang => h('option', { key: lang, value: lang }, lang)))
                    ),

                    // Error
                    error && h('div', { className: '_acb_err' }, error),

                    // Save
                    h('button', {
                        className: '_acb_save_btn',
                        onClick: saveSettings_,
                        disabled: !apiKeyDraft.trim()
                    }, '💾 Save & Start Chatting')
                )
            );

            // ── Chat Window ─────────────────────────────────
            const chatWindow = isOpen && h('div', { className: '_acb_win' },
                settingsPanel,

                // Header
                h('div', { className: '_acb_header' },
                    h('div', { className: '_acb_header_row' },
                        h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
                            h('div', { className: '_acb_avatar' }, '🤖'),
                            h('div', null,
                                h('div', { style: { color: 'white', fontWeight: '700', fontSize: '14px', letterSpacing: '-0.01em' } }, 'Algorithm Assistant'),
                                h('div', { style: { color: '#6366f1', fontSize: '10.5px', fontWeight: '600', marginTop: '1px' } },
                                    algoKey
                                        ? '📚 ' + algoKey.replace(/_/g, ' ')
                                        : '📚 Ready to help'
                                )
                            )
                        ),
                        h('div', { style: { display: 'flex', gap: '6px', alignItems: 'center' } },
                            h('button', { className: '_acb_header_btn', onClick: openSettings, title: 'Settings' }, '⚙️'),
                            h('button', { className: '_acb_header_btn', onClick: () => setIsOpen(false), title: 'Close' }, '✕')
                        )
                    ),
                    // API key hint
                    !hasKey && !showSettings && h('div', {
                        style: {
                            marginTop: '8px', padding: '6px 10px',
                            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                            borderRadius: '8px', fontSize: '11px', color: '#fbbf24', cursor: 'pointer'
                        },
                        onClick: openSettings
                    }, '⚡ Click here to add your Groq API key and enable chat →')
                ),

                // Context bar (live step)
                showCtxBar && h('div', { className: '_acb_ctx_bar' },
                    h('span', { style: { color: '#6366f1', fontWeight: 'bold' } }, '●'),
                    h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
                        'Live: ' + (ctxText.length > 60 ? ctxText.slice(0, 58) + '…' : ctxText)
                    )
                ),

                // Messages
                h('div', { ref: scrollRef, className: '_acb_msgs' },
                    ...messages.map((m, i) =>
                        h('div', { key: i, className: m.role === 'user' ? '_acb_msg_user' : '_acb_msg_ai' },
                            ...format(m.content).map((part, j) =>
                                typeof part === 'string'
                                    ? h('span', { key: j }, part)
                                    : part
                            )
                        )
                    ),
                    isLoading && h('div', { className: '_acb_typing' },
                        h('div', { className: '_acb_dot' }),
                        h('div', { className: '_acb_dot' }),
                        h('div', { className: '_acb_dot' })
                    )
                ),

                // Quick chips
                showChips && h('div', { className: '_acb_chips' },
                    SUGGESTIONS.slice(0, 4).map((s, i) =>
                        h('button', { key: i, className: '_acb_chip', onClick: () => send(s) }, s)
                    )
                ),

                // Input Area
                h('div', { className: '_acb_input_area' },
                    error && h('div', { className: '_acb_err' }, error),
                    h('div', { className: '_acb_input_row' },
                        h('textarea', {
                            ref: textareaRef,
                            className: '_acb_textarea',
                            placeholder: hasKey ? 'Ask anything about this algorithm… (Enter to send)' : 'Add your Groq API key in ⚙️ Settings',
                            value: input,
                            onInput: handleTextareaInput,
                            onChange: e => setInput(e.target.value),
                            onKeyDown: handleKey,
                            disabled: !hasKey || isLoading,
                            rows: 1
                        }),
                        h('button', {
                            className: '_acb_send',
                            onClick: () => send(),
                            disabled: !hasKey || isLoading || !input.trim(),
                            title: 'Send (Enter)'
                        }, isLoading ? '…' : '↑')
                    )
                )
            );

            // ── FAB Button ──────────────────────────────────
            const fab = h('button', {
                className: '_acb_fab',
                title: 'Algorithm Assistant',
                onClick: () => setIsOpen(o => !o),
                'aria-label': 'Open Algorithm Assistant'
            },
                isOpen
                    ? h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
                        h('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
                        h('line', { x1: 6, y1: 6, x2: 18, y2: 18 })
                    )
                    : h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
                        h('path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' })
                    ),
                unread > 0 && !isOpen && h('div', { className: '_acb_fab_badge' }, unread > 9 ? '9+' : unread)
            );

            return h('div', { id: '_acb_root' }, chatWindow, fab);
        }

        const mount = document.createElement('div');
        mount.id = '_acb_mount';
        document.body.appendChild(mount);
        ReactDOM.createRoot(mount).render(h(ChatBot));
    }

    // ── Bootstrap ─────────────────────────────────────────────
    let tries = 0;
    function tryMount() {
        if (window.React && window.ReactDOM) {
            injectCSS();
            startDOMObserver();
            // Wait a tick for Babel to finish processing all page JSX
            setTimeout(mountChatbot, 900);
        } else if (++tries < 80) {
            setTimeout(tryMount, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryMount);
    } else {
        tryMount();
    }

})();
