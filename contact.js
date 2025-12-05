import { Utils } from './utils.js';

export const ContactHandler = {
    init() {
        const contactForm = document.getElementById("contactForm");
        if (!contactForm) return;
        contactForm.addEventListener("submit", (e) => this.handleSubmit(e));
    },

    handleSubmit(e) {
        e.preventDefault();
        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const subject = document.getElementById("contactSubject").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        if (!this.validateForm(name, email, subject, message)) return;

        const messageEl = document.querySelector("#contactMessage.message") || document.createElement("div");
        if (!document.querySelector("#contactMessage.message")) {
            messageEl.id = "contactMessage";
            messageEl.className = "message";
            document.getElementById("contactForm").parentElement.appendChild(messageEl);
        }

        messageEl.textContent = "✓ Thank you for your message. We'll get back to you soon!";
        messageEl.className = "message success";
        messageEl.style.display = "block";
        document.getElementById("contactForm").reset();
    },

    validateForm(name, email, subject, message) {
        if (!name || !email || !subject || !message) {
            alert("✗ All fields are required");
            return false;
        }
        if (!Utils.isValidEmail(email)) {
            alert("✗ Invalid email format");
            return false;
        }
        return true;
    }
};
