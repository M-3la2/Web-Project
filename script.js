const StorageManager = {
    getStudent() {
        const studentData = sessionStorage.getItem("student");
        return studentData ? JSON.parse(studentData) : null;
    },

    setStudent(student) {
        sessionStorage.setItem("student", JSON.stringify(student));
    },

    getAttendanceHistory() {
        const history = localStorage.getItem("attendance");
        return history ? JSON.parse(history) : [];
    },

    addAttendanceRecord(record) {
        const history = this.getAttendanceHistory();
        history.push(record);
        localStorage.setItem("attendance", JSON.stringify(history));
        return record;
    },

    clearAllData() {
        sessionStorage.removeItem("student");
        localStorage.removeItem("attendance");
    }
};

const Utils = {
    formatDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    },

    formatTime(date) {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleTimeString('en-US', options);
    },

    showMessage(elementId, message, type = 'success') {
        const messageEl = document.getElementById(elementId);
        if (!messageEl) return;
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
        if (type === 'success') {
            setTimeout(() => { messageEl.style.display = 'none'; }, 3000);
        }
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isStrongPassword(password) {
        return password.length >= 6;
    }
};

const RegistrationHandler = {
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

const CheckinHandler = {
    init() {
        const checkForm = document.getElementById("checkinForm");
        if (!checkForm) return;
        checkForm.addEventListener("submit", (e) => this.handleSubmit(e));
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

const HistoryHandler = {
    init() {
        const table = document.getElementById("historyTable");
        if (!table) return;
        this.populateTable();
        this.setupSearch();
        this.updateStats();
    },

    populateTable() {
        const table = document.getElementById("historyTable");
        const tbody = table.querySelector("tbody");
        const history = StorageManager.getAttendanceHistory();

        if (history.length === 0) {
            document.getElementById("noRecords").style.display = "block";
            return;
        }

        document.getElementById("noRecords").style.display = "none";
        tbody.innerHTML = "";

        history.forEach(record => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.time || "—"}</td>
                <td>${record.code}</td>
                <td>${record.courseName || "—"}</td>
                <td><span class="status-badge status-${record.status.toLowerCase()}">${record.status}</span></td>
            `;
            tbody.appendChild(row);
        });
    },

    setupSearch() {
        const searchInput = document.getElementById("searchInput");
        if (!searchInput) return;
        searchInput.addEventListener("input", (e) => this.filterTable(e.target.value));
    },

    filterTable(searchTerm) {
        const tbody = document.querySelector("#historyTable tbody");
        const rows = tbody.querySelectorAll("tr");
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? "" : "none";
        });
    },

    updateStats() {
        const history = StorageManager.getAttendanceHistory();
        const total = history.length;
        const present = history.filter(r => r.status === "Present").length;
        const absent = history.filter(r => r.status === "Absent").length;
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;

        document.getElementById("totalClasses").textContent = total;
        document.getElementById("presentCount").textContent = present;
        document.getElementById("absentCount").textContent = absent;
        document.getElementById("attendanceRate").textContent = rate + "%";
    }
};

const CalendarHandler = {
    currentDate: new Date(),

    init() {
        const calendarContainer = document.getElementById("calendarContainer");
        if (!calendarContainer) return;
        this.setupControls();
        this.renderCalendar();
    },

    setupControls() {
        const prevBtn = document.getElementById("prevMonth");
        const nextBtn = document.getElementById("nextMonth");
        if (prevBtn) prevBtn.addEventListener("click", () => this.previousMonth());
        if (nextBtn) nextBtn.addEventListener("click", () => this.nextMonth());
    },

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    },

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    },

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        document.getElementById("monthYear").textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const history = StorageManager.getAttendanceHistory();
        const attendanceDates = this.mapAttendanceDates(history);

        let html = "<div class='calendar-header'>";
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        dayNames.forEach(day => { html += `<div class="calendar-day-name">${day}</div>`; });
        html += "</div><div class='calendar-grid'>";

        for (let i = firstDay - 1; i >= 0; i--) {
            html += `<div class="calendar-day other-month">${daysInPrevMonth - i}</div>`;
        }

        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${month + 1}/${day}/${year}`;
            const status = attendanceDates[dateStr];
            let classes = "calendar-day";
            if (status) classes += ` ${status}`;
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                classes += " today";
            }
            html += `<div class="${classes}">${day}</div>`;
        }

        const totalCells = firstDay + daysInMonth;
        const remainingCells = 42 - totalCells;
        for (let i = 1; i <= remainingCells; i++) {
            html += `<div class="calendar-day other-month">${i}</div>`;
        }

        html += "</div>";
        document.getElementById("calendarContainer").innerHTML = html;
    },

    mapAttendanceDates(history) {
        const dateMap = {};
        history.forEach(record => {
            const [month, day, year] = record.date.split("/");
            const key = `${month}/${day}/${year}`;
            dateMap[key] = record.status.toLowerCase();
        });
        return dateMap;
    }
};

const ContactHandler = {
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

        const messageEl = document.querySelector("#contactMessage.message") || 
                         document.createElement("div");
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

document.addEventListener("DOMContentLoaded", () => {
    RegistrationHandler.init();
    CheckinHandler.init();
    HistoryHandler.init();
    CalendarHandler.init();
    ContactHandler.init();
});