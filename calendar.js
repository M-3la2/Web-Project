import { StorageManager } from './storage.js';

export const CalendarHandler = {
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
        const monthYearEl = document.getElementById("monthYear");
        if (monthYearEl) monthYearEl.textContent = `${monthNames[month]} ${year}`;

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
        const container = document.getElementById("calendarContainer");
        if (container) container.innerHTML = html;
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
