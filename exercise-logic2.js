// exercise-logic.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 1. DEBUG TOGGLE (Set to false for students)
const DEBUG_MODE = false; 

const supabaseUrl = 'https://ndjodjiuydlsysltawwu.supabase.co';
const supabaseKey = 'sb_publishable_MmpFp2Aymzj0-VorP1Sh6Q_68HA-PGZ'; 
const supabase = createClient(supabaseUrl, supabaseKey);

let isSubmitted = false;
let debugBuffer = "";

// Function to show visual feedback for debug actions
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style = "position:fixed; bottom:20px; right:20px; background:#064e3b; color:white; padding:10px 20px; border-radius:8px; z-index:9999; font-family:sans-serif; box-shadow:0 4px 12px rgba(0,0,0,0.2);";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// 2. Debug Key Listener
window.addEventListener('keydown', (e) => {
    if (!DEBUG_MODE) return;

    debugBuffer += e.key.toLowerCase();
    if (debugBuffer.endsWith('aaa')) {
        document.querySelectorAll('.step-container').forEach(s => s.classList.remove('hidden-step'));
        showToast("🔓 All steps unlocked (Debug)");
    } else if (debugBuffer.endsWith('sss')) {
        document.querySelectorAll('.step-container').forEach(s => s.classList.remove('hidden-step'));
        document.querySelectorAll('.slot-input').forEach(i => {
            const ans = i.getAttribute('data-answer');
            if (ans) i.value = ans;
        });
        showToast("✨ Answers filled (Debug)");
    }
    if (debugBuffer.length > 10) debugBuffer = debugBuffer.slice(-10);
});

// Main Step Logic
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
        feedback.textContent = "⚠️ Please fill in all the blanks.";
        feedback.className = "feedback text-orange-600";
        return;
    }

    if (correct) {
        feedback.textContent = "✔️ Nice!";
        feedback.className = "feedback text-emerald-600";
        if (idx === lastStepIdx) await handleFinalSubmission(idx, feedback);
        else unlockNext(idx);
    } else {
        feedback.textContent = "❌ Try again";
        feedback.className = "feedback text-red-600";
    }
};

async function handleFinalSubmission(idx, feedbackElement) {
    const userEmail = prompt("Please enter your @<school>.edu.hk email to submit:");
    if (!userEmail || !userEmail.toLowerCase().endsWith('@<school>.edu.hk')) {
        alert("Valid @<school>.edu.hk email is required.");
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
    }
}

window.unlockNext = function(current) {
    const next = document.getElementById(`step-${current + 1}`) || document.getElementById('success-screen');
    if (next) {
        next.classList.remove('hidden-step');
        setTimeout(() => next.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
};
