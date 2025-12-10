import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Monitor, 
  LayoutGrid, 
  ArrowDownUp, 
  Save, 
  Upload, 
  GripVertical, 
  Trash2, 
  RefreshCw,
  UserPlus,
  Grid3X3,
  Layers,
  FileText,
  Printer,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide
} from 'lucide-react';

// --- Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, variant = "primary", className = "", ...props }) => {
  const baseStyle = "px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300",
    outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
    success: "bg-green-600 text-white hover:bg-green-700",
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Main Application ---

export default function SeatingPlanner() {
  // --- State ---
  
  // Grid Configuration
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(6);
  const [clusterSize, setClusterSize] = useState(2); // How many cols stick together
  
  // Data
  const [students, setStudents] = useState([]); // Array of { id, name, tier }
  const [placements, setPlacements] = useState({}); // Map: "r-c" -> studentId
  
  // UI State
  const [viewMode, setViewMode] = useState('teacher'); // 'teacher', 'student', 'tent'
  const [inputText, setInputText] = useState("");
  const [importTier, setImportTier] = useState(1); // Default tier for new imports
  const [draggedItem, setDraggedItem] = useState(null); // { type: 'placed' | 'list', id: string, source: string | null }
  
  // Delete Confirmation State
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const clearTimerRef = useRef(null);

  // Ref for the grid container to capture image
  const gridRef = useRef(null);

  // --- Effects ---

  // Load html2canvas for image export
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // --- Helpers ---

  // Generate a unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Parse bulk text input
  const handleBulkImport = () => {
    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    const newStudents = lines.map(name => ({
      id: generateId(),
      name: name.trim(),
      tier: importTier // Use selected import tier
    }));
    
    setStudents(prev => [...prev, ...newStudents]);
    setInputText("");
  };

  // Auto Fill: Front First
  const autoFillFront = () => {
    const newPlacements = {};
    const unseated = students.filter(s => !Object.values(placements).includes(s.id));
    const seated = students.filter(s => Object.values(placements).includes(s.id));
    
    let currentStudentIdx = 0;
    const allStudentsToSeat = [...seated, ...unseated]; 

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (currentStudentIdx < allStudentsToSeat.length) {
          newPlacements[`${r}-${c}`] = allStudentsToSeat[currentStudentIdx].id;
          currentStudentIdx++;
        }
      }
    }
    setPlacements(newPlacements);
  };

  // Smart Fill: Grouping/Mixing Tiers
  const smartFill = (strategy, direction = 'asc') => {
    // Strategies: 'pairs' (High-Low), 'checkered', 'rows'
    let arranged = [];
    
    if (strategy === 'high-low') {
      const tier1 = students.filter(s => s.tier === 1);
      const tier2 = students.filter(s => s.tier === 2);
      const tier3 = students.filter(s => s.tier === 3);
      
      const maxLen = Math.max(tier1.length, tier3.length);
      for(let i=0; i<maxLen; i++) {
        if(tier1[i]) arranged.push(tier1[i]);
        if(tier3[i]) arranged.push(tier3[i]);
      }
      arranged = [...arranged, ...tier2];
    } else if (strategy === 'seq') {
       arranged = [...students].sort((a, b) => {
         return direction === 'asc' ? a.tier - b.tier : b.tier - a.tier;
       });
    } else {
      arranged = students;
    }

    const newPlacements = {};
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (idx < arranged.length) {
          newPlacements[`${r}-${c}`] = arranged[idx].id;
          idx++;
        }
      }
    }
    setPlacements(newPlacements);
  };

  // Clear Board (remove placements only)
  const clearBoard = () => setPlacements({});

  // Reset All (clear students and placements)
  const handleResetAllClick = () => {
    if (confirmClearAll) {
      setStudents([]);
      setPlacements({});
      setConfirmClearAll(false);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    } else {
      setConfirmClearAll(true);
      clearTimerRef.current = setTimeout(() => setConfirmClearAll(false), 3000);
    }
  };

  const deleteStudent = (studentId) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    const newPlacements = { ...placements };
    const seatId = Object.keys(newPlacements).find(k => newPlacements[k] === studentId);
    if (seatId) {
      delete newPlacements[seatId];
      setPlacements(newPlacements);
    }
  };

  // --- Drag & Drop Logic ---

  const handleDragStart = (e, type, id, source) => {
    setDraggedItem({ type, id, source });
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetLocation) => { // targetLocation is "list" or "r-c"
    e.preventDefault();
    const draggedId = draggedItem.id;
    
    if (!draggedId) return;

    const newPlacements = { ...placements };
    
    // Remove from old location if it was on board
    const oldKey = Object.keys(newPlacements).find(key => newPlacements[key] === draggedId);
    if (oldKey) {
      delete newPlacements[oldKey];
    }

    // If dropping onto a seat
    if (targetLocation !== 'list') {
      // Check if seat is occupied
      if (newPlacements[targetLocation]) {
        // Swap logic
        const displacedStudentId = newPlacements[targetLocation];
        // If the dragged item came from a seat (oldKey), put the displaced student there
        if (oldKey) {
          newPlacements[oldKey] = displacedStudentId;
        } else {
          // If dragged from list, the displaced student goes to list (which means just removing from placement)
        }
      }
      newPlacements[targetLocation] = draggedId;
    }

    setPlacements(newPlacements);
    setDraggedItem(null);
  };

  // --- Import / Export ---

  const exportData = () => {
    const data = {
      config: { rows, cols, clusterSize },
      students,
      placements
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seating-plan.json';
    a.click();
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if(data.config) {
          setRows(data.config.rows);
          setCols(data.config.cols);
          setClusterSize(data.config.clusterSize);
        }
        if(data.students) setStudents(data.students);
        if(data.placements) setPlacements(data.placements);
      } catch (err) {
        // Simple error handling
        console.error("Invalid file");
      }
    };
    reader.readAsText(file);
  };

  const exportString = () => {
    const list = students.map(s => s.name).join('\n');
    
    // Fallback copy method
    const textArea = document.createElement("textarea");
    textArea.value = list;
    
    // Ensure textarea is not visible but part of DOM
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  };

  // Print / PDF Functionality
  const handlePrint = () => {
    window.print();
  };

  // Export as Image (PNG)
  const handleExportImage = async () => {
    if (typeof window.html2canvas === 'undefined') {
      alert("Image generation library is still loading, please try again in a moment.");
      return;
    }
    
    if (gridRef.current) {
      try {
        const canvas = await window.html2canvas(gridRef.current, {
            scale: 2, // Higher resolution
            backgroundColor: "#f1f5f9" // Match bg-slate-100
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = 'seating-plan.png';
        link.href = image;
        link.click();
      } catch (e) {
        console.error("Image export failed", e);
        alert("Failed to generate image.");
      }
    }
  };

  // --- Rendering Helpers ---

  // Identify unseated students
  const unseatedStudents = students.filter(s => !Object.values(placements).includes(s.id));

  // Determine row order based on view
  const displayRows = Array.from({ length: rows }, (_, i) => i);
  if (viewMode === 'teacher') {
    displayRows.reverse();
  }

  const getTierColor = (tier) => {
    switch(tier) {
      case 1: return "bg-green-50 border-green-200 text-green-800";
      case 2: return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case 3: return "bg-red-50 border-red-200 text-red-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  // Dynamic font size calculator
  const getFontSizeClass = (text, isTentView = false) => {
    const len = text.length;
    // Tent view logic
    if (isTentView) {
        if (len > 25) return "text-[10px]";
        if (len > 15) return "text-xs";
        if (len > 10) return "text-sm";
        return "text-base";
    }
    // Standard view logic
    if (len > 25) return "text-[9px] leading-tight";
    if (len > 20) return "text-[10px] leading-tight";
    if (len > 12) return "text-xs leading-tight";
    if (len > 8) return "text-sm";
    return "text-base";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-slate-800">
      
      {/* Print Styles */}
      <style>
        {`
          @media print {
            @page { size: landscape; margin: 0.5cm; }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .print-container { 
                border: none !important; 
                box-shadow: none !important; 
                width: 100% !important; 
                margin: 0 !important; 
                padding: 0 !important; 
                overflow: visible !important;
                background: white !important;
            }
            /* Force background colors to print */
            * { -webkit-print-color-adjust: exact !important;   print-color-adjust: exact !important; }
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Controls */}
        <header className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <LayoutGrid className="w-6 h-6 text-blue-600" />
              Classroom Seating Planner
            </h1>
            <p className="text-slate-500 text-sm">Drag students, configure grid, and switch views.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('teacher')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${viewMode === 'teacher' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Monitor className="w-4 h-4" /> Teacher
              </button>
              <button 
                onClick={() => setViewMode('student')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${viewMode === 'student' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Users className="w-4 h-4" /> Student
              </button>
              <button 
                onClick={() => setViewMode('tent')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${viewMode === 'tent' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <ArrowDownUp className="w-4 h-4" /> Tent Cards
              </button>
            </div>
            
            <div className="flex gap-2 border-l pl-2">
                <Button variant="outline" onClick={handleExportImage} title="Download Image (PNG)">
                    <ImageIcon className="w-4 h-4" /> Image
                </Button>
                <Button variant="outline" onClick={handlePrint} title="Print / Save PDF">
                    <Printer className="w-4 h-4" /> Print/PDF
                </Button>
            </div>

            <Button variant="outline" onClick={exportData} title="Save Project JSON">
              <Save className="w-4 h-4" />
            </Button>
            <label className="cursor-pointer">
              <input type="file" accept=".json" onChange={importData} className="hidden" />
              <div className="px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
                <Upload className="w-4 h-4" />
              </div>
            </label>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT COLUMN: Controls & Roster */}
          <div className="no-print space-y-6 lg:col-span-1">
            
            {/* Grid Settings */}
            <Card className="p-4 space-y-4">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" /> Layout Settings
              </h2>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-slate-500 mb-1">Rows</label>
                  <input type="number" value={rows} onChange={e => setRows(Number(e.target.value))} className="border rounded p-1 text-sm" min="1" max="20" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-slate-500 mb-1">Cols</label>
                  <input type="number" value={cols} onChange={e => setCols(Number(e.target.value))} className="border rounded p-1 text-sm" min="1" max="20" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-slate-500 mb-1">Group By</label>
                  <input type="number" value={clusterSize} onChange={e => setClusterSize(Number(e.target.value))} className="border rounded p-1 text-sm" min="1" />
                </div>
              </div>
            </Card>

            {/* Student Input */}
            <Card className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Add Students
                </h2>
                <button onClick={exportString} className="text-xs text-blue-600 hover:underline">Copy List</button>
              </div>
              
              {/* Tier Selection for Import */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-xs text-slate-600 whitespace-nowrap">Import as:</span>
                <select 
                  className="text-xs border rounded p-1 flex-1 outline-none"
                  value={importTier}
                  onChange={(e) => setImportTier(Number(e.target.value))}
                >
                  <option value={1}>Tier 1 (Green)</option>
                  <option value={2}>Tier 2 (Yellow)</option>
                  <option value={3}>Tier 3 (Red)</option>
                </select>
              </div>

              <textarea 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Paste names here...&#10;One per line"
                className="w-full border rounded-md p-2 text-sm h-32 resize-y focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <Button onClick={handleBulkImport} className="w-full justify-center">
                Import List
              </Button>
            </Card>

            {/* Unseated / Staging Area */}
            <Card className="p-4 flex flex-col h-[500px]">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Roster ({unseatedStudents.length})
                </h2>
                {/* Delete ALL Button with Custom Confirmation */}
                <button 
                  onClick={handleResetAllClick} 
                  title="Delete ALL students"
                  className={`p-1.5 rounded transition-all flex items-center gap-1 text-xs ${confirmClearAll ? 'bg-red-600 text-white w-24 justify-center' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                >
                  {confirmClearAll ? (
                    <>Confirm?</>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              <div 
                className="flex-1 overflow-y-auto space-y-2 border-t pt-2"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'list')}
              >
                {unseatedStudents.length === 0 && (
                  <p className="text-center text-slate-400 text-sm mt-10">All students seated</p>
                )}
                {unseatedStudents.map(student => (
                  <div
                    key={student.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'student', student.id, 'list')}
                    className={`p-2 rounded border cursor-move flex justify-between items-center shadow-sm select-none hover:shadow-md transition-shadow group ${getTierColor(student.tier)}`}
                  >
                    <span className="font-medium text-sm truncate flex-1">{student.name}</span>
                    <div className="flex items-center gap-1">
                      <select 
                        value={student.tier}
                        onChange={(e) => {
                          const newS = students.map(s => s.id === student.id ? {...s, tier: Number(e.target.value)} : s);
                          setStudents(newS);
                        }}
                        className="text-[10px] bg-white/50 rounded border-0 w-8 text-center cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="1">T1</option>
                        <option value="2">T2</option>
                        <option value="3">T3</option>
                      </select>
                      {/* Individual Delete Button */}
                      <button 
                         onClick={(e) => { e.stopPropagation(); deleteStudent(student.id); }}
                         className="p-1 hover:bg-red-200 text-red-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                         title="Delete student"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <GripVertical className="w-4 h-4 opacity-50" />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Smart Fill</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" onClick={autoFillFront} className="text-xs justify-center col-span-2">
                    Simple Fill (Row by Row)
                  </Button>
                  
                  <Button variant="secondary" onClick={() => smartFill('seq', 'asc')} className="text-xs justify-center flex items-center gap-1 px-1">
                    <ArrowDownWideNarrow className="w-3 h-3" /> T1→T3
                  </Button>
                  <Button variant="secondary" onClick={() => smartFill('seq', 'desc')} className="text-xs justify-center flex items-center gap-1 px-1">
                    <ArrowUpNarrowWide className="w-3 h-3" /> T3→T1
                  </Button>
                  
                  <Button variant="secondary" onClick={() => smartFill('high-low')} className="text-xs justify-center col-span-2">
                    Mix Tiers (T1 & T3 Pair)
                  </Button>
                  
                  <Button variant="danger" onClick={clearBoard} className="text-xs justify-center col-span-2">
                    Clear Board Only
                  </Button>
                </div>
              </div>
            </Card>

          </div>

          {/* RIGHT COLUMN: The Classroom Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {/* Scrollable Container */}
                <div className="overflow-auto max-h-[85vh] p-6 bg-slate-100 print-container" ref={gridRef}>
                
                  {/* Blackboard Indicator */}
                  <div className={`w-full max-w-3xl mx-auto h-8 bg-slate-800 rounded-sm mb-8 flex items-center justify-center text-slate-300 text-xs font-mono shadow-lg transition-all ${viewMode === 'teacher' ? 'order-last mt-8' : 'order-first mb-8'}`}>
                    BLACKBOARD / FRONT
                  </div>

                  {/* Grid Container */}
                  <div className="flex flex-col gap-4 min-w-fit items-center mx-auto">
                    {displayRows.map((rowIndex) => (
                      <div key={rowIndex} className="flex justify-center">
                        {Array.from({ length: cols }, (_, colIndex) => {
                          const seatId = `${rowIndex}-${colIndex}`;
                          const studentId = placements[seatId];
                          const student = students.find(s => s.id === studentId);
                          const isGap = (colIndex + 1) % clusterSize === 0 && colIndex !== cols - 1;

                          return (
                            <div key={colIndex} className="flex">
                              <div
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, seatId)}
                                className={`
                                  relative group
                                  w-28 h-20 md:w-32 md:h-24 lg:w-40 lg:h-28
                                  border-2 border-dashed rounded-lg m-1
                                  transition-all duration-200
                                  ${student ? 'border-solid border-slate-300 bg-white shadow-sm' : 'border-slate-300 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-300'}
                                `}
                              >
                                {student && (
                                  <div
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, 'student', student.id, seatId)}
                                    className={`w-full h-full cursor-grab active:cursor-grabbing p-2 flex flex-col justify-center items-center relative ${getTierColor(student.tier).replace('bg-', 'bg-opacity-20 ')} rounded-md`}
                                  >
                                    {viewMode === 'tent' ? (
                                      // TENT CARD VIEW
                                      <>
                                        <div className="w-full h-1/2 flex items-center justify-center border-b border-dashed border-gray-300 rotate-180 opacity-60">
                                          <span className={`${getFontSizeClass(student.name, true)} font-bold text-center leading-tight break-words px-1`}>{student.name}</span>
                                        </div>
                                        <div className="w-full h-1/2 flex items-center justify-center">
                                          <span className={`${getFontSizeClass(student.name, true)} font-bold text-center leading-tight break-words px-1`}>{student.name}</span>
                                        </div>
                                      </>
                                    ) : (
                                      // STANDARD VIEW
                                      <>
                                        <span className={`${getFontSizeClass(student.name, false)} font-bold text-center text-slate-800 line-clamp-3 px-1 break-words w-full`}>
                                          {student.name}
                                        </span>
                                        
                                        {/* Hover controls */}
                                        <div className="no-print absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                          <button 
                                            onClick={() => {
                                              const newP = {...placements};
                                              delete newP[seatId];
                                              setPlacements(newP);
                                            }}
                                            className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>

                                        {/* Tier Indicator Dot */}
                                        <div className={`absolute bottom-1 left-1 w-2 h-2 rounded-full ${
                                          student.tier === 1 ? 'bg-green-500' : 
                                          student.tier === 2 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`} title={`Tier ${student.tier}`}></div>
                                      </>
                                    )}
                                  </div>
                                )}
                                
                                {!student && (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-medium uppercase tracking-widest pointer-events-none">
                                    Empty
                                  </div>
                                )}
                              </div>
                              
                              {/* Aisle Gap */}
                              {isGap && <div className="w-8 md:w-16 lg:w-24 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        </div>
        
        {/* Instructions Footer */}
        <div className="no-print text-center text-slate-400 text-xs pb-8">
          <p>Tip: Define "Clusters" to create aisles. Drag names from the list to seats, or drag between seats to swap.</p>
        </div>
      </div>
    </div>
  );
}
