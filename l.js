// exercise-logic.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 1. CONFIGURATION
const DEBUG_MODE = true; 
const supabaseUrl = 'https://ndjodjiuydlsysltawwu.supabase.co';
const supabaseKey = 'sb_publishable_MmpFp2Aymzj0-VorP1Sh6Q_68HA-PGZ'; 
const supabase = createClient(supabaseUrl, supabaseKey);

let isSubmitted = false;
let hasUsedDebug = false; 
let debugBuffer = "";

// --- UPDATED UTILITY: GET PROCESSED LINE ---

// --- FIXED GET LINE TEXT ---
function getLineText(line, currentStepElement) {
    if (line.tagName === 'DETAILS' || line.classList.contains('output-wrapper')) return "";

    let indentation = "";
    const marginClass = Array.from(line.classList).find(cls => cls.startsWith('ml-'));
    if (marginClass) {
        const marginValue = parseInt(marginClass.split('-')[1]);
        const levels = Math.floor(marginValue / 12);
        indentation = " ".repeat(levels * 4); 
    }

    const tempLine = line.cloneNode(true);
    const inputs = tempLine.querySelectorAll('.slot-input');
    
    inputs.forEach(input => {
        const dataAns = input.getAttribute('data-answer');
        // FIX: Search for the input value specifically within the current step container
        const realInput = currentStepElement.querySelector(`[data-answer='${dataAns}']`) || 
                          document.querySelector(`[data-answer='${dataAns}']`);
        
        const val = realInput ? realInput.value.trim() : "";
        input.replaceWith(val === "" ? "#TODO" : val);
    });

    let content = tempLine.textContent.trim();
    if (!content) return "";

    if (line.classList.contains('output-content')) {
        return "# " + content;
    }
    return indentation + content;
}

// --- FIXED COPY CODE ---
window.copyCurrentCode = function() {
    if (document.body.classList.contains('math-mode')) return;

    const visibleSteps = Array.from(document.querySelectorAll('.step-container:not(.hidden-step)'));
    let fullScript = "";

    visibleSteps.forEach(step => {
        const codeBlock = step.querySelector('.code-block');
        if (!codeBlock) return;

        // Only get direct child divs
        const lines = codeBlock.querySelectorAll(':scope > div');
        lines.forEach(line => {
            // Pass the current 'step' element so getLineText knows where to look for inputs
            const processed = getLineText(line, step);
            if (processed) fullScript += processed + "\n";
        });
        fullScript += "\n"; 
    });

    if (fullScript.trim().length > 0) {
        navigator.clipboard.writeText(fullScript.trim()).then(() => {
            showToast("📋 Code copied with indentation!");
        });
    } else {
        showToast("❌ No code found to copy", true);
    }
};
// --- UI HELPERS ---
function showToast(message, isError = false) {
    const existing = document.getElementById('debug-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'debug-toast';
    toast.textContent = message;
    const bg = isError ? "#b91c1c" : "#064e3b"; 
    toast.style = `position:fixed; bottom:20px; right:20px; background:${bg}; color:white; padding:12px 24px; border-radius:12px; z-index:9999; font-family:sans-serif; font-weight:bold; box-shadow:0 10px 15px -3px rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.2);`;

    if (!document.getElementById('toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.innerHTML = "@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }";
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.5s";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// QR Code Logic
window.showQRCode = function() {
    const existing = document.getElementById('qr-overlay');
    if (existing) { existing.remove(); return; }

    const overlay = document.createElement('div');
    overlay.id = 'qr-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:10000; display:flex; justify-content:center; align-items:flex-start; padding-top:80px; cursor:pointer;";
    overlay.onclick = () => overlay.remove();

    const container = document.createElement('div');
    container.style = "background:white; padding:25px; border-radius:20px; text-align:center;";
    container.innerHTML = `<p style="margin-bottom:15px; color:#000; font-weight:bold;">Scan to Open Lesson</p><div id="qr-target"></div>`;
    
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    if (typeof QRCode === "undefined") {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
        script.onload = () => generateQR();
        document.head.appendChild(script);
    } else {
        generateQR();
    }

    function generateQR() {
        new QRCode(document.getElementById("qr-target"), {
            text: window.location.href,
            width: 400,
            height: 400,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
};

// 2. LISTENERS (Keys & Title Click)
window.addEventListener('keydown', (e) => {
    debugBuffer += e.key.toLowerCase();
    if (debugBuffer.endsWith('aaa') && DEBUG_MODE) {
        document.querySelectorAll('.step-container').forEach(s => s.classList.remove('hidden-step'));
        showToast("🔓 All steps unlocked");
        debugBuffer = "";
    } else if (debugBuffer.endsWith('sss') && DEBUG_MODE) {
        hasUsedDebug = true; 
        document.querySelectorAll('.step-container').forEach(s => s.classList.remove('hidden-step'));
        document.querySelectorAll('.slot-input').forEach(i => {
            const ans = i.getAttribute('data-answer');
            if (ans) {
                i.value = ans;
                i.disabled = true; // Lock on debug
            }
        });
        showToast("✨ Answers filled (Submission Disabled)", true);
        debugBuffer = "";
    } else if (debugBuffer.endsWith('qqq')) {
        showQRCode();
        debugBuffer = "";
    }
    if (debugBuffer.length > 10) debugBuffer = debugBuffer.slice(-7);
});



// 3. VALIDATION & PROGRESS
function getRemainingCount() {
    const allInputs = document.querySelectorAll('.slot-input');
    let count = 0;
    allInputs.forEach(input => {
        const val = input.value.trim().toLowerCase().replace(/\s/g, '');
        const ans = input.getAttribute('data-answer').toLowerCase().replace(/\s/g, '');
        if (val !== ans) count++;
    });
    return count;
}

function validateAllAnswers() {
    const allInputs = document.querySelectorAll('.slot-input');
    let allValid = true;
    allInputs.forEach(input => {
        const val = input.value.trim().toLowerCase().replace(/\s/g, '');
        const ans = input.getAttribute('data-answer').toLowerCase().replace(/\s/g, '');
        if (val === "" || val !== ans) {
            allValid = false;
            input.style.borderColor = "#dc2626"; 
        } else {
            input.style.borderColor = "#059669"; 
        }
    });
    return allValid;
}

// --- VALIDATION LOGIC ---
window.checkStep = async function(idx) {
    const allSteps = document.querySelectorAll('section.step-container');
    const lastStepIdx = allSteps.length - 1;

    if (idx === lastStepIdx && isSubmitted) {
        location.reload();
        return;
    }

    const step = document.getElementById(`step-${idx}`);
    const inputs = step.querySelectorAll('.slot-input');
    const feedback = document.getElementById(`feedback-${idx}`);
    
    let allInStepCorrect = true;

    if (inputs.length > 0) {
        inputs.forEach(input => {
            const val = input.value.trim().replace(/\s/g, '');
            const ans = input.getAttribute('data-answer').replace(/\s/g, '');
            
            if (val === ans) {
                input.style.setProperty('border-color', '#059669', 'important');
                input.style.backgroundColor = "white";
                input.disabled = true; // LOCK INPUT
                input.style.cursor = "not-allowed";
            } else {
                allInStepCorrect = false;
                input.style.setProperty('border-color', '#dc2626', 'important');
                input.style.backgroundColor = "#fef2f2"; 
            }
        });
    }

    if (allInStepCorrect) {
        if (feedback) {
            feedback.textContent = "✔️ Nice!";
            feedback.className = "feedback text-emerald-600";
            
            const remaining = getRemainingCount();
            if (remaining > 0) {
                showToast(`📝 ${remaining} boxes left to complete!`);
            }
        }
        
        const lastStepIdx = document.querySelectorAll('section.step-container').length - 1;
        if (idx === lastStepIdx) {
            // Check if all previous steps are actually finished
            const incomplete = Array.from(document.querySelectorAll('.slot-input')).some(i => !i.disabled);
            if (!incomplete) {
                await handleFinalSubmission(idx, feedback);
                if (!document.body.classList.contains('math-mode')) renderFullCodeBlock();
            } else {
                alert("⚠️ Earlier steps are incomplete or wrong!");
                feedback.textContent = "❌ Check previous steps.";
            }
        } else {
            unlockNext(idx);
        }
    } else if (feedback) {
        feedback.textContent = "❌ Try again";
        feedback.className = "feedback text-red-600";
        // Optional: shake the feedback text
        feedback.style.animation = 'none';
        feedback.offsetHeight; // trigger reflow
        feedback.style.animation = 'shake 0.4s';
    }
};


// --- FINAL SUMMARY RENDERING ---
function renderFullCodeBlock() {
    // 2. Double check math-mode before rendering
    if (document.body.classList.contains('math-mode')) return;

    const successScreen = document.getElementById('success-screen');
    if (!successScreen || document.getElementById('full-code-details')) return;

    const details = document.createElement('details');
    details.id = "full-code-details";
    details.innerHTML = `<summary style="cursor:pointer; font-weight:bold; color:#059669; padding:1rem; background:#ecfdf5; border-radius:12px; border:1px solid #059669; list-style:none; text-align:left;">📂 View Full Completed Code</summary>`;
    
    const pre = document.createElement('pre');
    pre.id = "full-code-display"; 

    let finalCode = "";
    document.querySelectorAll('.code-block').forEach(block => {
        block.querySelectorAll(':scope > div, :scope > span').forEach(line => {
            const text = getLineText(line);
            if (text) finalCode += text + "\n";
        });
        finalCode += "\n";
    });

    pre.textContent = finalCode.trim();
    details.appendChild(pre);
    successScreen.appendChild(details);
}
// Ensure checkStep calls renderFullCodeBlock on completion

async function handleFinalSubmission(idx, feedbackElement) {
    if (hasUsedDebug) {
        alert("Submission Disabled: Auto-fill was used.");
        return;
    }

    const userEmail = prompt("Please enter your email (@...edu.hk) to submit:");
    if (!userEmail || !userEmail.includes('@') || !userEmail.toLowerCase().endsWith('edu.hk')) {
        alert("Use a valid school email (@ and edu.hk).");
        return;
    }

    const finishBtn = document.querySelector(`#step-${idx} button`);
    const { error } = await supabase.from('anscol').insert([{ mail: userEmail.toLowerCase().trim(), hw: document.title }]);

    if (!error) {
        isSubmitted = true;
        finishBtn.textContent = "Reset Lesson";
        showToast("✅ Work Submitted");
        unlockNext(idx);
    }
}

window.unlockNext = function(current) {
    const next = document.getElementById(`step-${current + 1}`) || document.getElementById('success-screen');
    if (next) {
        next.classList.remove('hidden-step');
        next.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// --- Add this at the bottom of l.js ---

/**
 * Calculates width based on: ((chars * 5) + 10) * 4px
 * This version forces the style to overwrite inline HTML styles.
 */
// --- Update in l.js ---

// --- INITIALIZATION ---
function applyDynamicWidths() {
    const inputs = document.querySelectorAll('.slot-input');
    inputs.forEach(input => {
        const textToMeasure = input.tagName === 'SELECT' ? 
            Array.from(input.options).reduce((a, b) => a.length > b.text.length ? a : b.text, "") : 
            (input.getAttribute('data-answer') || "");
        
        const buffer = (input.tagName === 'SELECT') ? 12 : 8;
        const widthInPixels = (textToMeasure.length * 5 + buffer) * 4;
        input.style.setProperty('width', `${widthInPixels}px`, 'important');
    });
}
// Run immediately and on DOMContentLoaded
applyDynamicWidths();


document.addEventListener('DOMContentLoaded', () => {
    // 1. Header QR Trigger
    const header = document.querySelector('header') || document.querySelector('h1');
    if (header) {
        header.style.cursor = "pointer";
        header.addEventListener('click', window.showQRCode);
    }
    
    // 2. Add Copy Buttons to steps with code blocks (Avoid duplicates)
    if (!document.body.classList.contains('math-mode')) {
        document.querySelectorAll('.step-container').forEach(step => {
            if (!step.querySelector('.copy-btn') && step.querySelector('.code-block')) { 
                const btn = document.createElement('button');
                btn.textContent = "📋 Copy Code to Test";
                btn.className = "copy-btn";
                btn.style = "margin-top: 1rem; font-size: 0.9rem !important; padding: 0.5rem 1rem !important; background: #334155; color: white; border-radius: 99px; cursor: pointer;";
                btn.onclick = (e) => { e.preventDefault(); window.copyCurrentCode(); };
                step.appendChild(btn);
            }
        });
    }
    
    applyDynamicWidths();
});