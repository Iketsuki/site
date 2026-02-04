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
            width: 256,
            height: 256,
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
            if (ans) i.value = ans;
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
    
    let correct = true;
    inputs.forEach(input => {
        const val = input.value.trim().replace(/\s/g, '');
        const ans = input.getAttribute('data-answer').replace(/\s/g, '');
        if (val !== ans) correct = false;
    });

    if (correct) {
        feedback.textContent = "✔️ Nice!";
        feedback.className = "feedback text-emerald-600";
        
        const remaining = getRemainingCount();
        if (remaining > 0) {
            showToast(`📝 ${remaining} boxes left to complete!`);
        }

        if (idx === lastStepIdx) {
            if (validateAllAnswers()) await handleFinalSubmission(idx, feedback);
            else {
                alert("⚠️ Earlier steps are incomplete or wrong!");
                feedback.textContent = "❌ Check previous steps.";
            }
        } else {
            unlockNext(idx);
        }
    } else {
        feedback.textContent = "❌ Try again";
        feedback.className = "feedback text-red-600";
    }
};

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
function applyDynamicWidths() {
    const inputs = document.querySelectorAll('.slot-input');
    
    inputs.forEach(input => {
        const answer = input.getAttribute('data-answer') || "";
        // Clean the answer in case of HTML entities like &quot;
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = answer;
        const cleanAnswer = tempDiv.textContent; 

        const charCount = cleanAnswer.length;
        
        // Your Rule: 5 units per char, +5 front, +5 back (total 10 units)
        // 1 unit = 4px (Tailwind scale)
        const widthInPixels = (charCount * 5 + 6) * 4;
        
        // Overwrite the inline style attribute directly
        input.style.setProperty('width', `${widthInPixels}px`, 'important');
    });
}

// Run immediately and on DOMContentLoaded to catch all states
applyDynamicWidths();
document.addEventListener('DOMContentLoaded', applyDynamicWidths);