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
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!this.validateForm(name, studentID, email, password, confirmPassword)) return;

        const user = { name, studentID, email, registeredAt: new Date().toISOString() };
        StorageManager.setStudent(user);
        Utils.showMessage("regMessage", "✓ Registration successful! Redirecting...", "success");
        setTimeout(() => { window.location.href = "index.html"; }, 2000);
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
        if (!Utils.isStrongPassword(password)) {
            Utils.showMessage("regMessage", "✗ Password must be at least 6 characters", "error");
            return false;
        }
        if (password !== confirmPassword) {
            Utils.showMessage("regMessage", "✗ Passwords do not match", "error");
            return false;
        }
        return true;
    }
};
