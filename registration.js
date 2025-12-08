import { StorageManager } from './storage.js';
import { Utils } from './utils.js';

export const RegistrationHandler = {
    init() {
        const regForm = document.getElementById("registerForm");
        if (!regForm) return;
        regForm.addEventListener("submit", (e) => this.handleSubmit(e));
    },

    handleSubmit(e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const studentID = document.getElementById("studentID").value.trim();
        const email = document.getElementById("email").value.trim();

        if (!this.validateForm(name, studentID, email)) return;

        const user = { name, studentID, email, registeredAt: new Date().toISOString() };
        StorageManager.setStudent(user);
        Utils.showMessage("regMessage", "✓ Sign in successful! Redirecting to check-in...", "success");
        setTimeout(() => { window.location.href = "checkin.html"; }, 1500);
    },

    validateForm(name, studentID, email) {
        if (!name || !studentID || !email) {
            Utils.showMessage("regMessage", "✗ All fields are required", "error");
            return false;
        }
        if (!Utils.isValidEmail(email)) {
            Utils.showMessage("regMessage", "✗ Invalid email format", "error");
            return false;
        }
        return true;
    }
};
