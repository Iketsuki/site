// exercise-logic.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://ndjodjiuydlsysltawwu.supabase.co';
const supabaseKey = 'sb_publishable_MmpFp2Aymzj0-VorP1Sh6Q_68HA-PGZ'; 
const supabase = createClient(supabaseUrl, supabaseKey);

let isSubmitted = false;

// Global functions must be attached to 'window' to be called by HTML onclick attributes
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
    const userEmail = prompt("Please enter your @carmelss.edu.hk email to submit:");
    
    if (!userEmail || !userEmail.toLowerCase().endsWith('@carmelss.edu.hk')) {
        alert("Valid @carmelss.edu.hk email is required.");
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
        finishBtn.classList.add('!bg-gray-600'); // Override Tailwind emerald classes
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
