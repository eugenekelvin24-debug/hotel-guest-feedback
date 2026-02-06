// Theme Toggle
const themeBtn = document.getElementById("theme-toggle");
const metaTheme = document.getElementById("meta-theme");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    metaTheme.setAttribute("content", "#050507");
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    metaTheme.setAttribute("content", isDark ? "#050507" : "#FDFBF0");
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Check-in/Check-out Date Validation
const checkIn = document.getElementById('check_in_date');
const checkOut = document.getElementById('check_out_date');

checkIn.addEventListener('change', () => {
    if (checkIn.value) {
        let date = new Date(checkIn.value);
        date.setDate(date.getDate() + 1);
        checkOut.min = date.toISOString().split("T")[0];
    } else {
        checkOut.removeAttribute('min');
    }
});

// Form Submission with Formspree and Thank You Message
const form = document.querySelector('form');
const submitBtn = document.querySelector('.submit-btn');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Send to Formspree via AJAX
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Show thank you message
            const thankYouMsg = document.createElement('div');
            thankYouMsg.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--main-bg);
                border: 2px solid var(--accent);
                border-radius: 16px;
                padding: 40px 30px;
                text-align: center;
                z-index: 1000;
                box-shadow: 0 24px 60px rgba(0,0,0,0.3);
                max-width: 90%;
                width: 400px;
            `;
            
            thankYouMsg.innerHTML = `
                <h2 style="color: var(--accent); margin: 0 0 15px 0; font-size: 1.8rem;">Thank You!</h2>
                <p style="color: var(--text-main); margin: 0 0 20px 0; font-size: 1.05rem;">
                    We appreciate your feedback. Your response helps us improve your next stay.
                </p>
                <button onclick="closeModal()" 
                        style="
                            padding: 12px 28px;
                            background: var(--accent);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 1rem;
                            font-weight: 600;
                            cursor: pointer;
                        ">
                    Close
                </button>
            `;
            
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.4);
                z-index: 999;
            `;
            overlay.onclick = () => {
                overlay.remove();
                thankYouMsg.remove();
            };
            
            document.body.appendChild(overlay);
            document.body.appendChild(thankYouMsg);
            
            // Reset form and button
            form.reset();
            submitBtn.textContent = 'Submit Feedback';
            submitBtn.disabled = false;
        } else {
            alert('Error submitting feedback. Please try again.');
            submitBtn.textContent = 'Submit Feedback';
            submitBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting feedback. Please try again.');
        submitBtn.textContent = 'Submit Feedback';
        submitBtn.disabled = false;
    });
});

// Helper function to close modal
function closeModal() {
    const modal = document.querySelector('[style*="position: fixed"][style*="top: 50%"]');
    const overlay = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
    if (overlay) overlay.remove();
}
