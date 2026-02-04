// exercise-logic.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const DEBUG_MODE = true; 

const supabaseUrl = 'https://ndjodjiuydlsysltawwu.supabase.co';
const supabaseKey = 'sb_publishable_MmpFp2Aymzj0-VorP1Sh6Q_68HA-PGZ'; 
const supabase = createClient(supabaseUrl, supabaseKey);

let isSubmitted = false;
let hasUsedDebug = false; 
let debugBuffer = "";

// Helper to show visual Toast messages
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.textContent = message;
    const bg = isError ? "#991b1b" : "#064e3b"; 
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

// Function to generate and show QR code pop-up
function showQRCode() {
    // Remove existing if any
    const existing = document.getElementById('qr-overlay');
    if (existing) existing.remove();

    // Create Overlay
    const overlay = document.createElement('div');
    overlay.id = 'qr-overlay';
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:10000; display:flex; justify-content:center; align-items:flex-start; padding-top:50px; cursor:pointer;";
    overlay.onclick = () => overlay.remove();

    // Create Container
    const container = document.createElement('div');
    container.style = "background:white; padding:20px; border-radius:15px; text-align:center; box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);";
    container.innerHTML = `<p style="margin-bottom:10px; color:#333; font-weight:bold; font-family:sans-serif;">Scan to Join</p><div id="qr-target"></div>`;
    
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Load QR library and generate
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
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

// Key Listeners
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
        showToast("✨ Answers filled (Submission Disabled)");
        debugBuffer = "";
    } else if (debugBuffer.endsWith('qqq')) {
        showQRCode();
        debugBuffer = "";
    }
    
    if (debugBuffer.length > 10) debugBuffer = debugBuffer.slice(-7);
});

// Helper to check every input on the page
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
    
    let filled = true;
    let correct = true;

    inputs.forEach(input => {
        const val = input.value.trim().toLowerCase().replace(/\s/g, '');
        const ans = input.getAttribute('data-answer').toLowerCase().replace(/\s/g, '');
        if (val === "") filled = false;
        if (val !== ans) correct = false;
    });

    if (!filled) {
        feedback.textContent = "⚠️ Please fill in all the blanks in this step.";
        feedback.className = "feedback text-orange-600";
        return;
    }

    if (correct) {
        feedback.textContent = "✔️ Nice!";
        feedback.className = "feedback text-emerald-600";
        
        if (idx === lastStepIdx) {
            if (validateAllAnswers()) {
                await handleFinalSubmission(idx, feedback);
            } else {
                alert("⚠️ You haven't finished the earlier steps correctly!");
                feedback.textContent = "❌ Please complete all previous steps first.";
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
        alert("Please use a valid school email (@...edu.hk).");
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
        finishBtn.disabled = false;
        finishBtn.textContent = "Reset Lesson";
        finishBtn.classList.add('!bg-gray-600'); 
        unlockNext(idx);
        showToast("✅ Submitted Successfully");
    }
}

window.unlockNext = function(current) {
    const next = document.getElementById(`step-${current + 1}`) || document.getElementById('success-screen');
    if (next) {
        next.classList.remove('hidden-step');
        setTimeout(() => next.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
};