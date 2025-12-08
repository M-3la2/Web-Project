import { StorageManager } from './storage.js';
import { Utils } from './utils.js';

export const CheckinHandler = {
    init() {
        const checkForm = document.getElementById("checkinForm");
        if (!checkForm) return;
        checkForm.addEventListener("submit", (e) => this.handleSubmit(e));
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    },

    updateDateTime() {
        const now = new Date();
        const dateElement = document.getElementById("currentDate");
        const timeElement = document.getElementById("currentTime");
        
        if (dateElement) {
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
        }
        
        if (timeElement) {
            timeElement.textContent = Utils.formatTime(now);
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        const classCode = document.getElementById("classCode").value.trim();
        const securityQuestion = document.getElementById("securityQuestion").value.trim();

        if (!classCode) {
            Utils.showMessage("checkinMessage", "✗ Please enter a class code", "error");
            return;
        }

        const record = {
            date: new Date().toLocaleDateString(),
            time: Utils.formatTime(new Date()),
            code: classCode,
            courseName: this.getCourseName(classCode),
            status: "Present",
            timestamp: new Date().toISOString(),
            securityAnswer: securityQuestion || null
        };

        StorageManager.addAttendanceRecord(record);
        Utils.showMessage("checkinMessage", "✓ Check-in successful! Your attendance has been recorded.", "success");
        document.getElementById("checkinForm").reset();
    },

    getCourseName(classCode) {
        const courseMap = {
            "CS101": "Introduction to Computer Science",
            "CS102": "Data Structures",
            "CS201": "Algorithms",
            "MATH101": "Calculus I",
            "MATH102": "Linear Algebra"
        };
        return courseMap[classCode] || "Course Name";
    }
};
