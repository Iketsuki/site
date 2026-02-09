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

// --- UPDATED UTILITY: COPY CODE WITH MATH-MODE CHECK ---
window.copyCurrentCode = function() {
    // 1. EXIT if math-mode is active
    if (document.body.classList.contains('math-mode')) return;

    const visibleSteps = Array.from(document.querySelectorAll('.step-container:not(.hidden-step)'));
    let fullScript = "";

    visibleSteps.forEach(step => {
        const codeBlock = step.querySelector('.code-block');
        if (!codeBlock) return;

        const lines = codeBlock.querySelectorAll('div');
        let blockText = "";

        lines.forEach(line => {
            // 1. Handle Indentation by checking margin classes
            let indentation = "";
            if (line.classList.contains('ml-12')) indentation = "    ";
            if (line.classList.contains('ml-24')) indentation = "        ";
            if (line.classList.contains('ml-36')) indentation = "            ";

            // 2. Clone line to replace inputs without breaking UI
            const tempLine = line.cloneNode(true);
            const inputs = tempLine.querySelectorAll('.slot-input');
            
            inputs.forEach(input => {
                const realInput = document.querySelector(`[data-answer="${input.getAttribute('data-answer')}"]`);
                const val = realInput.value.trim();
                const replacement = (val === "") ? "#TODO" : val;
                input.replaceWith(replacement);
            });

            // 3. Prevent output-content from being copied as code 
            // OR format it as a comment if desired
            if (line.classList.contains('output-content')) {
                blockText += "# " + tempLine.textContent.trim() + "\n";
            } else {
                blockText += indentation + tempLine.textContent.trim() + "\n";
            }
        });

        fullScript += blockText + "\n";
    });

    navigator.clipboard.writeText(fullScript.trim()).then(() => {
        showToast("📋 Code copied with correct indentation!");
    });
};
// Helper to show visual Toast messages
function showToast(message, isError = false) {
    const existing = document.getElementById('debug-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'debug-toast';
    toast.textContent = message;
    const bg = isError ? "#b91c1c" : "#064e3b"; 
    toast.style = `position:fixed; bottom:20px; right:20px; background:${bg}; color:white; padding:12px 24px; border-radius:12px; z-index:9999; font-family:sans-serif; font-weight:bold; box-shadow:0 10px 15px -3px rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.2); animation: slideUp 0.3s ease-out;`;
    
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
function showQRCode() {
    const existing = document.getElementById('qr-overlay');
    if (existing) { existing.remove(); return; }

    const overlay = document.createElement('div');
    overlay.id = 'qr-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:10000; display:flex; justify-content:center; align-items:flex-start; padding-top:80px; cursor:pointer;";
    overlay.onclick = () => overlay.remove();

    const container = document.createElement('div');
    container.style = "background:white; padding:25px; border-radius:20px; text-align:center; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);";
    container.innerHTML = `<p style="margin-bottom:15px; color:#1a1a1a; font-size:1.2rem; font-weight:bold; font-family:sans-serif;">Scan to Open Lesson</p><div id="qr-target" style="display:flex; justify-content:center;"></div><p style="margin-top:15px; color:#666; font-size:0.8rem;">Click anywhere to close</p>`;
    
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
}

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

// Title Click Trigger
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header') || document.querySelector('h1');
    if (header) {
        header.style.cursor = "pointer";
        header.title = "Click to show QR Code";
        header.addEventListener('click', showQRCode);
    }
    
    // Add Copy Buttons to all step containers
    document.querySelectorAll('.step-container').forEach(step => {
        const btn = document.createElement('button');
        btn.textContent = "📋 Copy Code to Test";
        btn.className = "copy-btn";
        btn.style = "margin-top: 10px; font-size: 0.9rem !important; padding: 0.5rem 1rem !important; background: #334155; color: white;";
        btn.onclick = (e) => { e.preventDefault(); copyCurrentCode(); };
        step.appendChild(btn);
    });
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

// --- UPDATED VALIDATION (With Locking and Math Check) ---
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

    inputs.forEach(input => {
        // Standardize comparison: remove spaces and normalize quotes
        const val = input.value.trim().replace(/\s/g, '');
        const ans = input.getAttribute('data-answer').replace(/\s/g, '');
        
        if (val !== ans) {
            allInStepCorrect = false;
            // Force red border using !important logic
            input.style.setProperty('border-color', '#dc2626', 'important');
            input.style.backgroundColor = "#fef2f2"; // Light red background
        } else {
            // Success styling
            input.style.setProperty('border-color', '#059669', 'important');
            input.style.backgroundColor = "white";
            // LOCK THE INPUT so it cannot be modified again
            input.disabled = true; 
            input.style.cursor = "not-allowed";
        }
    });

    if (allInStepCorrect) {
        feedback.textContent = "✔️ Nice!";
        feedback.className = "feedback text-emerald-600";
        
        const remaining = getRemainingCount();
        if (remaining > 0) {
            showToast(`📝 ${remaining} boxes left to complete!`);
        }

        if (idx === lastStepIdx) {
            if (validateAllAnswers()) {
                await handleFinalSubmission(idx, feedback);
                // Only render the summary code block if NOT in math-mode
                if (!document.body.classList.contains('math-mode')) {
                    renderFullCodeBlock();
                }
            } else {
                alert("⚠️ Earlier steps are incomplete or wrong!");
                feedback.textContent = "❌ Check previous steps.";
            }
        } else {
            unlockNext(idx);
        }
    } else {
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
    details.style = "margin-top: 2rem; width: 100%; text-align: left;";
    
    const summary = document.createElement('summary');
    summary.textContent = "📂 View Full Completed Code";
    summary.style = "cursor:pointer; font-weight:bold; color:#059669; font-size:1.4rem; padding: 1rem; background: #ecfdf5; border-radius: 8px;";
    
    const codeContainer = document.createElement('pre');
    codeContainer.id = "full-code-display";

    let finalCode = "";
    document.querySelectorAll('.code-block').forEach(block => {
        const lines = block.querySelectorAll('div');
        lines.forEach(line => {
            let indentation = "";
            if (line.classList.contains('ml-12')) indentation = "    ";
            if (line.classList.contains('ml-24')) indentation = "        ";

            const tempLine = line.cloneNode(true);
            tempLine.querySelectorAll('.slot-input').forEach(input => {
                const realInput = document.querySelector(`[data-answer="${input.getAttribute('data-answer')}"]`);
                input.replaceWith(realInput.value);
            });

            // Handle output content specifically as comments
            if (line.classList.contains('output-content')) {
                finalCode += "# " + tempLine.textContent.trim() + "\n";
            } else {
                finalCode += indentation + tempLine.textContent.trim() + "\n";
            }
        });
        finalCode += "\n";
    });

    codeContainer.textContent = finalCode.trim();
    details.appendChild(summary);
    details.appendChild(codeContainer);
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
    finishBtn.disabled = true;
    finishBtn.textContent = "Saving...";

    const { error } = await supabase
        .from('anscol')
        .insert([{ mail: userEmail.toLowerCase().trim(), hw: document.title }]);

    if (error) {
        alert("Error: " + error.message);
        finishBtn.disabled = false;
        finishBtn.textContent = "Finish Lesson";
    } else {
        isSubmitted = true;
        finishBtn.textContent = "Reset Lesson";
        finishBtn.classList.replace('bg-emerald-800', 'bg-gray-600'); 
        finishBtn.disabled = false;
        unlockNext(idx);
        showToast("✅ Work Submitted Successfully");
    }
}

window.unlockNext = function(current) {
    const next = document.getElementById(`step-${current + 1}`) || document.getElementById('success-screen');
    if (next) {
        next.classList.remove('hidden-step');
        setTimeout(() => next.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
};

// --- Add this at the bottom of l.js ---

/**
 * Calculates width based on: ((chars * 5) + 10) * 4px
 * This version forces the style to overwrite inline HTML styles.
 */
// --- Update in l.js ---

/**
 * Calculates width based on the longest possible content.
 * For <input>: Uses data-answer.
 * For <select>: Finds the longest <option> text.
 */
function applyDynamicWidths() {
    const inputs = document.querySelectorAll('.slot-input');

    inputs.forEach(input => {
        let textToMeasure = "";

        if (input.tagName === 'SELECT') {
            // Logic for dropdowns: Find the longest option text
            let longestOption = "";
            Array.from(input.options).forEach(opt => {
                if (opt.text.length > longestOption.length) {
                    longestOption = opt.text;
                }
            });
            textToMeasure = longestOption;
        } else {
            // Logic for standard inputs: Use the data-answer attribute
            const rawAnswer = input.getAttribute('data-answer') || "";
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = rawAnswer;
            textToMeasure = tempDiv.textContent;
        }

        const charCount = textToMeasure.length;

        // Apply the Rule: ((chars * 5) + 10) * 4px
        // For selects, we add a small buffer (e.g., +2 chars) for the dropdown arrow
        const buffer = (input.tagName === 'SELECT') ? 12 : 8;
        const widthInPixels = (charCount * 5 + buffer) * 4;
        
        input.style.setProperty('width', `${widthInPixels}px`, 'important');
    });
}

// Run immediately and on DOMContentLoaded
applyDynamicWidths();
document.addEventListener('DOMContentLoaded', applyDynamicWidths);