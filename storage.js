export const StorageManager = {
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
