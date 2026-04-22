import './src/globals.js';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './tree_script.js';
import './algorithm_data.js';
import './chatbot.js';
import './settings_manager.js';

/* extracted from bplus_tree.html */

        
        
        // --- Icons ---
        const IconWrapper = ({ children, size = 20, className="", ...props }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg>
        );
        const Play = (props) => <IconWrapper {...props}><polygon points="5 3 19 12 5 21 5 3"></polygon></IconWrapper>;
        const Pause = (props) => <IconWrapper {...props}><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></IconWrapper>;
        const SkipBack = (props) => <IconWrapper {...props}><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></IconWrapper>;
        const SkipForward = (props) => <IconWrapper {...props}><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></IconWrapper>;
        const Rewind = (props) => <IconWrapper {...props}><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></IconWrapper>;
        const FastForward = (props) => <IconWrapper {...props}><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon></IconWrapper>;
        const GripHorizontal = (props) => <IconWrapper {...props}><circle cx="12" cy="9" r="1"></circle><circle cx="19" cy="9" r="1"></circle><circle cx="5" cy="9" r="1"></circle><circle cx="12" cy="15" r="1"></circle><circle cx="19" cy="15" r="1"></circle><circle cx="5" cy="15" r="1"></circle></IconWrapper>;
        const Home = (props) => <IconWrapper {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></IconWrapper>;
        const Volume2 = (props) => <IconWrapper {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></IconWrapper>;
        const VolumeX = (props) => <IconWrapper {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></IconWrapper>;
        const ChevronUp = (props) => <IconWrapper {...props}><polyline points="18 15 12 9 6 15"></polyline></IconWrapper>;
        const ChevronDown = (props) => <IconWrapper {...props}><polyline points="6 9 12 15 18 9"></polyline></IconWrapper>;

        // Dynamic Max Keys Configuration (Order m)

        class BPlusNode {
            constructor(isLeaf = false) {
                this.isLeaf = isLeaf;
                this.keys = [];
                this.children = []; // Internal nodes: child pointers; Leaf nodes: actual data entries
                this.next = null; // Leaf level linked list
                this.id = Math.random().toString(36).substr(2, 9);
            }
        }

        function generateSimulation(initialKeys, opVals, maxKeys) {
            const history = [];
            let root = new BPlusNode(true);

            function cloneTree(node) {
                if (!node) return null;
                const newNode = new BPlusNode(node.isLeaf);
                newNode.keys = [...node.keys];
                newNode.id = node.id;
                newNode.children = node.children.map(cloneTree);
                newNode.next = node.next ? node.next.id : null; 
                return newNode;
            }

            function record(status, desc, speech, activeNodeId = null, line = 0) {
                history.push({ 
                    stepId: history.length, 
                    root: cloneTree(root), 
                    status, desc, speech, activeNodeId, line 
                });
            }

            function split(node, path, val, valIdx, total) {
                const midIdx = Math.floor(maxKeys / 2);
                const newNode = new BPlusNode(node.isLeaf);
                
                if (node.isLeaf) {
                    record('SPLIT', `(${valIdx}/${total}) Leaf full! Splitting node ${node.keys.join(', ')}`, TREE_SCRIPT.BPLUS.SPLIT_LEAF(), node.id, 3);
                    newNode.keys = node.keys.splice(midIdx);
                    newNode.next = node.next;
                    node.next = newNode;
                    
                    const promotedKey = newNode.keys[0];
                    if (node === root) {
                        const newRoot = new BPlusNode(false);
                        newRoot.keys = [promotedKey];
                        newRoot.children = [node, newNode];
                        root = newRoot;
                        record('NEW_ROOT', `(${valIdx}/${total}) Created new root with key ${promotedKey}`, TREE_SCRIPT.BPLUS.PROMOTE(promotedKey), root.id, 5);
                    } else {
                        const parent = path.pop();
                        const idx = parent.children.indexOf(node);
                        parent.keys.splice(idx, 0, promotedKey);
                        parent.children.splice(idx + 1, 0, newNode);
                        record('PROMOTED', `(${valIdx}/${total}) Promoted key ${promotedKey} to parent`, TREE_SCRIPT.BPLUS.PROMOTE(promotedKey), parent.id, 5);
                        if (parent.keys.length > maxKeys) split(parent, path, val, valIdx, total);
                    }
                } else {
                    record('SPLIT', `(${valIdx}/${total}) Internal node full! Splitting...`, TREE_SCRIPT.BPLUS.SPLIT_INTERNAL(), node.id, 6);
                    newNode.keys = node.keys.splice(midIdx + 1);
                    newNode.children = node.children.splice(midIdx + 1);
                    const promotedKey = node.keys.pop();

                    if (node === root) {
                        const newRoot = new BPlusNode(false);
                        newRoot.keys = [promotedKey];
                        newRoot.children = [node, newNode];
                        root = newRoot;
                        record('NEW_ROOT', `(${valIdx}/${total}) Created new root with key ${promotedKey}`, TREE_SCRIPT.BPLUS.PROMOTE(promotedKey), root.id, 7);
                    } else {
                        const parent = path.pop();
                        const idx = parent.children.indexOf(node);
                        parent.keys.splice(idx, 0, promotedKey);
                        parent.children.splice(idx + 1, 0, newNode);
                        record('PROMOTED', `(${valIdx}/${total}) Promoted key ${promotedKey} to parent`, TREE_SCRIPT.BPLUS.PROMOTE(promotedKey), parent.id, 7);
                        if (parent.keys.length > maxKeys) split(parent, path, val, valIdx, total);
                    }
                }
            }

            function insert(val, valIdx, total) {
                let curr = root;
                const path = [];
                record('TRAVERSING', `(${valIdx}/${total}) Searching for correct leaf to insert ${val}`, TREE_SCRIPT.BPLUS.INSERT(val), curr.id, 0);
                
                while (!curr.isLeaf) {
                    path.push(curr);
                    let i = 0;
                    while (i < curr.keys.length && val >= curr.keys[i]) i++;
                    curr = curr.children[i];
                    record('TRAVERSING', `(${valIdx}/${total}) Following pointer to node [${curr.keys.join(', ')}]`, null, curr.id, 0);
                }

                curr.keys.push(val);
                curr.keys.sort((a, b) => a - b);
                record('INSERTED', `(${valIdx}/${total}) Inserted ${val} into leaf`, TREE_SCRIPT.BPLUS.LEAF_REACHED(curr.keys), curr.id, 1);

                if (curr.keys.length > maxKeys) {
                    split(curr, path, val, valIdx, total);
                }
            }

            // Silent setup for initial data
            initialKeys.forEach(k => {
                let curr = root;
                const path = [];
                while (!curr.isLeaf) {
                    path.push(curr);
                    let i = 0;
                    while (i < curr.keys.length && k >= curr.keys[i]) i++;
                    curr = curr.children[i];
                }
                curr.keys.push(k);
                curr.keys.sort((a, b) => a - b);
                if (curr.keys.length > maxKeys) {
                    const midIdx = Math.floor(maxKeys / 2);
                    const newNode = new BPlusNode(curr.isLeaf);
                    newNode.keys = curr.keys.splice(midIdx);
                    if (curr === root) {
                        const nr = new BPlusNode(false);
                        nr.keys = [newNode.keys[0]];
                        nr.children = [curr, newNode];
                        root = nr;
                    } else {
                        const parent = path.pop();
                        const idx = parent.children.indexOf(curr);
                        parent.keys.splice(idx, 0, newNode.keys[0]);
                        parent.children.splice(idx + 1, 0, newNode);
                    }
                }
            });

            // Formal simulation steps
            opVals.forEach((v, idx) => {
                insert(v, idx + 1, opVals.length);
            });
            record('SUCCESS', `Successfully completed insertions`, TREE_SCRIPT.BPLUS.SUCCESS(), null, 2);

            return history;
        }

        const SLOT_WIDTH = 24;
        const KEY_WIDTH = 48;
        const NODE_HEIGHT = 64;

        const getSlotX = (node, slotIdx) => {
            const keysCount = node.keys.length;
            const totalWidth = (keysCount * KEY_WIDTH) + ((keysCount + 1) * SLOT_WIDTH);
            const leftEdge = -(totalWidth / 2);
            return leftEdge + (slotIdx * (SLOT_WIDTH + KEY_WIDTH)) + (SLOT_WIDTH / 2);
        };

        const NodeComponent = ({ node, x, y, activeNodeId }) => {
            const isActive = node.id === activeNodeId;
            const keysCount = node.keys.length;
            const totalWidth = (keysCount * KEY_WIDTH) + ((keysCount + 1) * SLOT_WIDTH);

            return (
                <div 
                    className={`absolute flex flex-col items-center glass rounded-2xl overflow-hidden transition-all duration-500 border-2 ${isActive ? 'node-active' : 'border-white/10'} ${node.isLeaf ? 'bg-emerald-500/10' : 'bg-slate-800/40'}`}
                    style={{ left: x - totalWidth / 2 - 10, top: y, width: totalWidth + 20, height: NODE_HEIGHT }}
                >
                    <div className="w-full bg-white/5 px-2 py-0.5 text-[8px] font-black text-slate-500 border-b border-white/5 flex justify-between uppercase tracking-widest">
                        <span>{node.isLeaf ? 'Leaf' : 'Internal'}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-between px-2 w-full">
                        {Array.from({ length: keysCount + 1 }).map((_, i) => (
                            <React.Fragment key={`slot-wrap-${i}`}>
                                <div className={`w-5 h-5 rounded-full border border-dashed flex items-center justify-center transition-colors ${!node.isLeaf ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-white/5'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${!node.isLeaf ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                                </div>
                                {i < keysCount && (
                                    <div className="flex-1 flex items-center justify-center font-black text-lg text-emerald-400 key-enter min-w-[40px]">
                                        {node.keys[i]}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            );
        };

        const App = () => {
            const { SettingsIcon, SettingsModal, AlgorithmPanel } = useMemo(() => window.initSettingsComponents(React), []);
            const [isSettingsOpen, setIsSettingsOpen] = useState(false);
            
            const [initialData, setInitialData] = useState([10, 20, 30, 40]);
            const [inputString, setInputString] = useState("25, 35");
            const [maxKeys, setMaxKeys] = useState(3);
            const opVals = useMemo(() => inputString.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)), [inputString]);

            const [currentStep, setCurrentStep] = useState(0);
            const [isPlaying, setIsPlaying] = useState(false);
            const [speedMultiplier, setSpeedMultiplier] = useState(1);
            const [zoom, setZoom] = useState(1);
            const [isMuted, setIsMuted] = useState(false);
            const [isMinimized, setIsMinimized] = useState(false);
            
            const [manualOffset, setManualOffset] = useState({ x: 0, y: 0 });
            const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 });
            const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
            const [isDraggingPanel, setIsDraggingPanel] = useState(false);
            const canvasDragStart = useRef({ x: 0, y: 0 });
            const panelDragStart = useRef({ x: 0, y: 0 });
            const isPlayingRef = useRef(false);
            isPlayingRef.current = isPlaying;

            const history = useMemo(() => generateSimulation(initialData, opVals, maxKeys), [initialData, opVals, maxKeys]);

            const nextStep = () => { setCurrentStep(prev => (prev < history.length - 1 ? prev + 1 : (setIsPlaying(false), prev))); };
            const prevStep = () => { setCurrentStep(prev => Math.max(0, prev - 1)); setIsPlaying(false); };

            const speak = (text) => {
                if (isMuted || !text) { 
                    const delay = (1000 / speedMultiplier);
                    setTimeout(() => { if(isPlayingRef.current) nextStep(); }, delay); 
                    return; 
                }
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.pitch = 1.0; utterance.rate = 1.0 * speedMultiplier;
                utterance.onend = () => { if(isPlayingRef.current) nextStep(); };
                window.speechSynthesis.speak(utterance);
            };

            useEffect(() => {
                if (isPlaying) speak(history[currentStep]?.speech);
                else window.speechSynthesis.cancel();
            }, [isPlaying, currentStep]);

            const state = history[currentStep] || { root: null };

            // Robust tree layout
            const computeLayout = (node, depth = 0, xStart = 0) => {
                if (!node) return { nodes: [], width: 0 };
                let currentX = xStart;
                const result = { nodes: [], width: 0 };
                const nodeWidth = (node.keys.length * KEY_WIDTH) + ((node.keys.length + 1) * SLOT_WIDTH) + 60;

                if (node.isLeaf) {
                    result.width = nodeWidth;
                    result.nodes.push({ node, x: xStart + nodeWidth / 2, y: depth * 180 + 100 });
                } else {
                    let totalWidth = 0;
                    node.children.forEach(child => {
                        const childLayout = computeLayout(child, depth + 1, currentX);
                        result.nodes.push(...childLayout.nodes);
                        currentX += childLayout.width + 60;
                        totalWidth += childLayout.width + 60;
                    });
                    totalWidth -= 60;
                    result.width = Math.max(totalWidth, nodeWidth);
                    result.nodes.push({ node, x: xStart + totalWidth / 2, y: depth * 180 + 100 });
                }
                return result;
            };

            const layoutData = useMemo(() => computeLayout(state.root), [state.root]);

            return (
                <div className="h-screen w-screen flex flex-col relative overflow-hidden bg-[#0f172a] text-white select-none" 
                    onMouseMove={(e) => { 
                        if(isDraggingPanel) setPanelOffset({x: e.clientX-panelDragStart.current.x, y: e.clientY-panelDragStart.current.y}); 
                        else if(isDraggingCanvas) setManualOffset({x: e.clientX-canvasDragStart.current.x, y: e.clientY-canvasDragStart.current.y}); 
                    }} 
                    onMouseUp={() => {setIsDraggingCanvas(false); setIsDraggingPanel(false);}}>
                    
                    {/* Top Navigation Bar */}
                    <div className="absolute top-0 left-0 right-0 z-[60] group/nav">
                        <div className="absolute top-0 left-0 w-full h-4 z-[70] peer"></div>
                        <div className="relative h-20 glass border-b border-white/5 flex items-center justify-between px-8 shadow-2xl transition-all duration-500 -translate-y-[85%] peer-hover:translate-y-0 group-hover/nav:translate-y-0 hover:translate-y-0 z-[60]">
                            <div className="flex items-center gap-6">
                                <a href="index.html" className="bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-white border border-white/5 shadow-inner">
                                    <Home size={22} />
                                </a>
                                <div className="flex flex-col">
                                    <h1 className="font-extrabold text-xl leading-tight tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">B+ Tree Visualizer</h1>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Balanced Database Structure</span>
                                        <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                                        <button onClick={() => setIsSettingsOpen(true)} className="text-[10px] text-emerald-400 hover:underline">SETTINGS</button>
                                    </div>
                                </div>
                            </div>

                             <div className="flex items-center gap-6">
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Max Keys</span>
                                    <input type="number" min="2" max="6" value={maxKeys} onChange={e => { setMaxKeys(Number(e.target.value)); setCurrentStep(0); setIsPlaying(false); }} 
                                        className="w-12 bg-transparent font-black text-lg outline-none text-emerald-400 text-right border-b border-white/10" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Keys to Insert</span>
                                    <input type="text" value={inputString} onChange={e => { setInputString(e.target.value); setCurrentStep(0); setIsPlaying(false); }} 
                                        className="w-32 bg-transparent font-black text-lg outline-none text-emerald-400 text-right border-b border-white/10" placeholder="25, 35..." />
                                </div>
                                <button onClick={() => { setCurrentStep(0); setIsPlaying(true); }} 
                                    className="bg-emerald-600 hover:bg-emerald-500 w-12 h-12 rounded-2xl transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center group active:scale-95">
                                    <Play fill="white" size={24} className="group-hover:scale-110 transition-transform"/>
                                </button>
                            </div>
                        </div>
                    </div>

                    <AlgorithmPanel algoKey="BPLUS" currentLine={state.line} />
                    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

                    <div className="flex-1 relative infinite-bg overflow-hidden cursor-grab active:cursor-grabbing" 
                        onWheel={(e) => setZoom(z => Math.min(Math.max(0.2, z-e.deltaY*0.001), 2.5))} 
                        onMouseDown={(e) => {
                            if(!e.target.closest('.control-panel-wrapper') && !e.target.closest('.fixed')) {
                                setIsDraggingCanvas(true); 
                                canvasDragStart.current={x: e.clientX-manualOffset.x, y: e.clientY-manualOffset.y};
                            }
                        }}>
                        
                        <div className={`absolute left-1/2 top-1/4 ${isDraggingCanvas ? '' : 'camera-layer'}`} 
                            style={{ transform: `translate(calc(-50% + ${manualOffset.x}px), ${manualOffset.y}px) scale(${zoom})` }}>
                            
                             <svg className="absolute top-0 left-0 w-[5000px] h-[5000px] overflow-visible pointer-events-none">
                                {layoutData.nodes.map(item => {
                                    if (item.node.isLeaf) return null;
                                    return item.node.children.map((child, idx) => {
                                        const childItem = layoutData.nodes.find(n => n.node.id === child.id);
                                        if (!childItem) return null;
                                        const startX = item.x + getSlotX(item.node, idx);
                                        return (
                                            <g key={`${item.node.id}-${child.id}`}>
                                                <line 
                                                    x1={startX} y1={item.y + 40} 
                                                    x2={childItem.x} y2={childItem.y} 
                                                    stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round"
                                                />
                                                <line 
                                                    x1={startX} y1={item.y + 40} 
                                                    x2={childItem.x} y2={childItem.y} 
                                                    stroke={state.activeNodeId === child.id ? '#3b82f6' : 'rgba(255,255,255,0.2)'} 
                                                    strokeWidth="2" strokeLinecap="round" className="transition-all duration-500"
                                                />
                                            </g>
                                        );
                                    });
                                })}
                            </svg>

                            {layoutData.nodes.map(item => (
                                <NodeComponent key={item.node.id} node={item.node} x={item.x} y={item.y} activeNodeId={state.activeNodeId} />
                            ))}
                        </div>
                    </div>

                    {/* Playback Controls Panel */}
                    <div className="absolute bottom-10 left-1/2 w-full max-w-4xl px-4 z-50 control-panel-wrapper" 
                        style={{ transform: `translate(calc(-50% + ${panelOffset.x}px), ${panelOffset.y}px)` }}>
                        
                        <div className={`glass rounded-[2rem] shadow-2xl flex flex-col relative overflow-hidden transition-all duration-300 ${isMinimized ? 'w-fit mx-auto px-6 py-4' : 'px-8 pb-6 pt-2'}`}>
                            {/* Drag Handle */}
                            <div className="w-full h-8 cursor-grab flex justify-center items-center mb-1 group" 
                                onMouseDown={(e) => {e.preventDefault(); setIsDraggingPanel(true); panelDragStart.current={x:e.clientX-panelOffset.x, y:e.clientY-panelOffset.y}; e.stopPropagation();}}>
                                <div className="w-16 h-1.5 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors"></div>
                            </div>

                            <button onClick={() => setIsMinimized(!isMinimized)} 
                                className="absolute top-4 right-6 p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                {isMinimized ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                            </button>

                            {!isMinimized && (
                                <div className="flex flex-col gap-6">
                                    <div className="relative w-full h-2 bg-slate-950/50 rounded-full overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-300" 
                                            style={{ width: `${(currentStep / (history.length-1 || 1)) * 100}%` }}></div>
                                        <input type="range" min="0" max={history.length - 1} value={currentStep} 
                                            onChange={(e) => { setIsPlaying(false); setCurrentStep(Number(e.target.value)); }} 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col w-[35%]">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black text-emerald-500 tracking-[0.2em] uppercase">Step {currentStep + 1}</span>
                                                <span className="text-[10px] text-slate-600 font-bold tracking-widest">/ {history.length}</span>
                                            </div>
                                            <span className="text-base font-bold text-white line-clamp-1">{state?.desc}</span>
                                        </div>

                                        <div className="flex items-center justify-center gap-4 w-[30%]">
                                            <button onClick={prevStep} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-all active:scale-95"><Rewind size={24}/></button>
                                            <button onClick={() => setIsPlaying(!isPlaying)} 
                                                className={`w-16 h-16 flex items-center justify-center rounded-3xl shadow-2xl transform transition-all active:scale-90 border border-white/10 ${isPlaying ? 'bg-amber-500' : 'bg-emerald-600'}`}>
                                                {isPlaying ? <Pause fill="white" size={28} /> : <Play fill="white" size={28} className="ml-1.5"/>}
                                            </button>
                                            <button onClick={nextStep} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-all active:scale-95"><FastForward size={24}/></button>
                                        </div>

                                        <div className="flex items-center justify-end gap-6 w-[35%]">
                                            <div className="flex flex-col gap-2 items-end w-32">
                                                <div className="flex justify-between w-full">
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Velocity</span>
                                                    <span className="text-[10px] font-bold text-emerald-400 font-mono">{speedMultiplier.toFixed(1)}x</span>
                                                </div>
                                                <input type="range" min="0.5" max="3" step="0.1" value={speedMultiplier} 
                                                    onChange={(e) => setSpeedMultiplier(Number(e.target.value))} 
                                                    className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500" />
                                            </div>
                                            <button onClick={() => setIsMuted(!isMuted)} 
                                                className={`p-3 rounded-2xl transition-all shadow-lg ${isMuted ? 'text-rose-400 bg-rose-400/5' : 'text-emerald-400 bg-emerald-400/5'}`}>
                                                {isMuted ? <VolumeX size={22}/> : <Volume2 size={22}/>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {isMinimized && (
                                <div className="flex items-center justify-center gap-6">
                                    <button onClick={prevStep} className="p-2 hover:bg-white/5 rounded-xl text-slate-300 transition-all"><Rewind size={22}/></button>
                                    <button onClick={() => setIsPlaying(!isPlaying)} 
                                        className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl transform transition-all active:scale-90 border border-white/10 ${isPlaying ? 'bg-amber-500' : 'bg-emerald-600'}`}>
                                        {isPlaying ? <Pause fill="white" size={24} /> : <Play fill="white" size={24} className="ml-1"/>}
                                    </button>
                                    <button onClick={nextStep} className="p-2 hover:bg-white/5 rounded-xl text-slate-300 transition-all"><FastForward size={22}/></button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        };
        createRoot(document.getElementById('root')).render(<App />);
    
