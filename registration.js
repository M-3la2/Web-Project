import { StorageManager } from './storage.js';
import { Utils } from './utils.js';

export const RegistrationHandler = {
    init() {
        const regForm = document.getElementById("registerForm");
        if (!regForm) return;
        regForm.addEventListener("submit", (e) => this.handleSubmit(e));
    },

    async handleSubmit(e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const studentID = document.getElementById("studentID").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password") ? document.getElementById("password").value : "";
        const confirmPassword = document.getElementById("confirmPassword") ? document.getElementById("confirmPassword").value : "";

        if (!this.validateForm(name, studentID, email, password, confirmPassword)) return;

        const passwordHash = await this.hashPassword(password);

        const user = { name, studentID, email, passwordHash, registeredAt: new Date().toISOString() };
        StorageManager.setStudent(user);
        Utils.showMessage("regMessage", "✓ Sign in successful! Redirecting to check-in...", "success");
        setTimeout(() => { window.location.href = "checkin.html"; }, 1500);
    },

    validateForm(name, studentID, email, password, confirmPassword) {
        if (!name || !studentID || !email || !password || !confirmPassword) {
            Utils.showMessage("regMessage", "✗ All fields are required", "error");
            return false;
        }
        if (!Utils.isValidEmail(email)) {
            Utils.showMessage("regMessage", "✗ Invalid email format", "error");
            return false;
        }
        if (password.length < 8) {
            Utils.showMessage("regMessage", "✗ Password must be at least 8 characters", "error");
            return false;
        }
        if (password !== confirmPassword) {
            Utils.showMessage("regMessage", "✗ Passwords do not match", "error");
            return false;
        }
        return true;
    },

    async hashPassword(password) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        } catch (err) {
            return '';
        }
    }
};
