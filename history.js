import { StorageManager } from './storage.js';
import { Utils } from './utils.js';

export const HistoryHandler = {
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
            const noRec = document.getElementById("noRecords");
            if (noRec) noRec.style.display = "block";
            return;
        }

        const noRec = document.getElementById("noRecords");
        if (noRec) noRec.style.display = "none";
        tbody.innerHTML = "";

        history.forEach((record, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.time || "—"}</td>
                <td>${record.code}</td>
                <td><span class="status-badge status-${record.status.toLowerCase()}">${record.status}</span></td>
                <td><button class="btn-delete" data-index="${index}" aria-label="Delete record">Delete</button></td>
            `;
            tbody.appendChild(row);
            row.querySelector(".btn-delete").addEventListener("click", (e) => this.deleteRecord(e, index));
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

        const totalEl = document.getElementById("totalClasses");
        if (totalEl) totalEl.textContent = total;
        const presentEl = document.getElementById("presentCount");
        if (presentEl) presentEl.textContent = present;
        const absentEl = document.getElementById("absentCount");
        if (absentEl) absentEl.textContent = absent;
        const rateEl = document.getElementById("attendanceRate");
        if (rateEl) rateEl.textContent = rate + "%";
    },

    deleteRecord(e, index) {
        if (confirm("Are you sure you want to delete this record?")) {
            let history = StorageManager.getAttendanceHistory();
            history.splice(index, 1);
            localStorage.setItem("attendance", JSON.stringify(history));
            this.populateTable();
            this.updateStats();
        }
    }
};
