// exercise-logic.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 1. DEBUG TOGGLE
const DEBUG_MODE = true; 

const supabaseUrl = 'https://ndjodjiuydlsysltawwu.supabase.co';
const supabaseKey = 'sb_publishable_MmpFp2Aymzj0-VorP1Sh6Q_68HA-PGZ'; 
const supabase = createClient(supabaseUrl, supabaseKey);

let isSubmitted = false;
let debugBuffer = "";

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style = "position:fixed; bottom:20px; right:20px; background:#064e3b; color:white; padding:12px 24px; border-radius:12px; z-index:9999; font-family:sans-serif; font-weight:bold; box-shadow:0 10px 15px -3px rgba(0,0,0,0.3); border: 2px solid #059669;";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// 2. Debug Key Listener
window.addEventListener('keydown', (e) => {
    if (!DEBUG_MODE) return;

    debugBuffer += e.key.toLowerCase();
    
    if (debugBuffer.endsWith('aaa')) {
        document.querySelectorAll('.step-container').forEach(s => s.classList.remove('hidden-step'));
        showToast("🔓 All steps unlocked");
        debugBuffer = ""; 
    } else if (debugBuffer.endsWith('sss')) {
        // Show all steps
        document.querySelectorAll('.step-container').forEach(s => s.classList.remove('hidden-step'));
        // Fill all inputs with data-answer
        document.querySelectorAll('.slot-input').forEach(i => {
            const ans = i.getAttribute('data-answer');
            if (ans) i.value = ans;
        });
        showToast("✨ Answers filled. Click Finish to submit.");
        debugBuffer = "";
    }

    if (debugBuffer.length > 10) debugBuffer = debugBuffer.slice(-5);
});

window.checkStep = async function(idx) {
    const allSteps = document.querySelectorAll('section.step-container');
    const lastStepIdx = allSteps.length - 1;

    // Reset logic
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
        feedback.textContent = "⚠️ Please fill in all the blanks.";
        feedback.className = "feedback text-orange-600";
        return;
    }

    if (correct) {
        feedback.textContent = "✔️ Nice!";
        feedback.className = "feedback text-emerald-600";
        
        // Final Step: Always trigger prompt even if filled via 'sss'
        if (idx === lastStepIdx) {
            await handleFinalSubmission(idx, feedback);
        } else {
            unlockNext(idx);
        }
    } else {
        feedback.textContent = "❌ Try again";
        feedback.className = "feedback text-red-600";
    }
};

async function handleFinalSubmission(idx, feedbackElement) {
    const userEmail = prompt("Please enter your email (xxx@...edu.hk) to submit:");
    
    // Strict Check for @ and edu.hk
    if (!userEmail || !userEmail.includes('@') || !userEmail.toLowerCase().endsWith('edu.hk')) {
        alert("Invalid email. Must contain @ and end with edu.hk");
        feedbackElement.textContent = "❌ Invalid email format.";
        return;
    }

    const finishBtn = document.querySelector(`#step-${idx} button`);
    finishBtn.disabled = true;
    finishBtn.textContent = "Saving...";

    const { error } = await supabase
        .from('anscol')
        .insert([{ 
            mail: userEmail.toLowerCase().trim(), 
            hw: document.title 
        }]);

    if (error) {
        alert("Error: " + error.message);
        finishBtn.disabled = false;
        finishBtn.textContent = "Finish Lesson";
    } else {
        isSubmitted = true;
        finishBtn.disabled = false;
        finishBtn.textContent = "Reset Lesson";
        // Use a standard style change to ensure visibility
        finishBtn.style.backgroundColor = "#4b5563"; 
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
