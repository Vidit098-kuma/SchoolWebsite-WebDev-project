const users = [
    { id: "f001", name: "Dr. Kavita Rao", role: "faculty", password: "faculty123", subject: "Mathematics" },
    { id: "f002", name: "Prof. Arjun Mehta", role: "faculty", password: "faculty123", subject: "Physics" },
    { id: "s001", name: "Aayush Sharma", role: "student", password: "student123", className: "10 A" },
    { id: "s002", name: "Riya Singh", role: "student", password: "student123", className: "10 B" }
];

function setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

function getCurrentUser() {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function clearCurrentUser() {
    localStorage.removeItem("currentUser");
}

function requireRole(role) {
    const user = getCurrentUser();
    if (!user || user.role !== role) {
        window.location.href = "login.html";
        return null;
    }
    return user;
}

function logout() {
    clearCurrentUser();
    window.location.href = "login.html";
}

function initLoginPage() {
    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("loginError");
    const roleSelect = document.getElementById("role");
    const idInput = document.getElementById("userId");
    const passwordInput = document.getElementById("password");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const role = roleSelect.value.trim();
        const id = idInput.value.trim();
        const password = passwordInput.value.trim();
        const user = users.find(u => u.id === id && u.role === role && u.password === password);
        if (!user) {
            errorBox.textContent = "Invalid credentials. Try again using demo users like f001 or s001.";
            return;
        }
        errorBox.textContent = "";
        setCurrentUser(user);
        if (user.role === "faculty") {
            window.location.href = "faculty.html";
        } else {
            window.location.href = "student.html";
        }
    });
}

function initFacultyDashboard() {
    const user = requireRole("faculty");
    if (!user) return;

    const userName = document.getElementById("userName");
    const userRole = document.getElementById("userRole");
    const logoutBtn = document.getElementById("logoutBtn");
    const sectionTitle = document.getElementById("facultySectionTitle");
    const newAnnouncementInput = document.getElementById("newAnnouncement");
    const addAnnouncementBtn = document.getElementById("addAnnouncementBtn");
    const announcementsList = document.getElementById("announcementsList");
    const timetableBody = document.getElementById("timetableBody");

    if (userName) userName.textContent = user.name;
    if (userRole) userRole.textContent = "Faculty • " + (user.subject || "Teacher");
    if (sectionTitle) sectionTitle.textContent = "Today • " + user.subject + " classes";

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    const timetable = [
        { time: "08:00 - 08:45", className: "10 A", room: "201", topic: "Algebra: Linear equations" },
        { time: "09:00 - 09:45", className: "10 B", room: "204", topic: "Algebra: Word problems" },
        { time: "11:00 - 11:45", className: "9 C", room: "105", topic: "Revision: Quadratic equations" }
    ];

    if (timetableBody) {
        timetableBody.innerHTML = "";
        timetable.forEach(slot => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${slot.time}</td>
                <td>${slot.className}</td>
                <td>${slot.room}</td>
                <td>${slot.topic}</td>
                <td><span class="chip chip-green">On time</span></td>
            `;
            timetableBody.appendChild(tr);
        });
    }

    if (addAnnouncementBtn && newAnnouncementInput && announcementsList) {
        addAnnouncementBtn.addEventListener("click", function () {
            const text = newAnnouncementInput.value.trim();
            if (!text) return;
            const li = document.createElement("li");
            li.innerHTML = `<strong>New</strong> – ${text}<br><span>Posted just now</span>`;
            announcementsList.prepend(li);
            newAnnouncementInput.value = "";
        });
    }
}

function initStudentDashboard() {
    const user = requireRole("student");
    if (!user) return;

    const userName = document.getElementById("userName");
    const userRole = document.getElementById("userRole");
    const logoutBtn = document.getElementById("logoutBtn");
    const attendanceChip = document.getElementById("attendanceChip");
    const markPresentBtn = document.getElementById("markPresentBtn");
    const assignmentsBody = document.getElementById("assignmentsBody");
    const upcomingList = document.getElementById("upcomingList");

    if (userName) userName.textContent = user.name;
    if (userRole) userRole.textContent = "Student • Class " + (user.className || "");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    let attendance = parseInt(localStorage.getItem("attendancePercent") || "82", 10);
    function renderAttendance() {
        if (!attendanceChip) return;
        attendanceChip.textContent = attendance + "% this month";
        if (attendance >= 90) {
            attendanceChip.className = "chip chip-green";
        } else if (attendance >= 80) {
            attendanceChip.className = "chip chip-amber";
        } else {
            attendanceChip.className = "chip";
        }
    }
    renderAttendance();

    if (markPresentBtn) {
        markPresentBtn.addEventListener("click", function () {
            if (attendance < 100) attendance += 1;
            localStorage.setItem("attendancePercent", attendance.toString());
            renderAttendance();
        });
    }

    const assignments = [
        { subject: "Mathematics", title: "Algebra practice set", due: "2 Dec", status: "Pending" },
        { subject: "Science", title: "Lab report: Electricity", due: "4 Dec", status: "Pending" },
        { subject: "English", title: "Essay: My role model", due: "5 Dec", status: "Submitted" }
    ];

    if (assignmentsBody) {
        assignmentsBody.innerHTML = "";
        assignments.forEach(item => {
            const tr = document.createElement("tr");
            const statusClass = item.status === "Submitted" ? "chip chip-green" : "chip chip-amber";
            tr.innerHTML = `
                <td>${item.subject}</td>
                <td>${item.title}</td>
                <td>${item.due}</td>
                <td><span class="${statusClass}">${item.status}</span></td>
            `;
            assignmentsBody.appendChild(tr);
        });
    }

    const upcoming = [
        { title: "Unit Test: Mathematics", time: "3 Dec • 08:00 AM" },
        { title: "Science Practical", time: "6 Dec • 10:30 AM" },
        { title: "Parent Teacher Meeting", time: "10 Dec • 09:00 AM" }
    ];

    if (upcomingList) {
        upcomingList.innerHTML = "";
        upcoming.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${item.title}</strong><br><span>${item.time}</span>`;
            upcomingList.appendChild(li);
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.dataset.page;
    if (page === "login") {
        initLoginPage();
    } else if (page === "faculty") {
        initFacultyDashboard();
    } else if (page === "student") {
        initStudentDashboard();
    }
});
