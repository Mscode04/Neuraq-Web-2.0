import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDETyG9fp2FPE4dUXunj4EKFu0xEP6gZLg",
    authDomain: "certificate-2f7e1.firebaseapp.com",
    projectId: "certificate-2f7e1",
    storageBucket: "certificate-2f7e1.appspot.com",
    messagingSenderId: "181216167634",
    appId: "1:181216167634:web:0574a6211da045a216cf0b",
    measurementId: "G-GTTX917L86"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const passcode = "8089124307";

// Check login state on page load
window.onload = function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
        // Hide login page and show admin panel
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("adminContainer").style.display = "block";
        loadCertificates();
    }
};

function login() {
    const enteredPasscode = document.getElementById("passcodeInput").value;
    if (enteredPasscode === passcode) {
        // Save login state in local storage
        localStorage.setItem("isLoggedIn", "true");

        // Hide login page and show admin panel
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("adminContainer").style.display = "block";
        loadCertificates();
    } else {
        alert("Incorrect Passcode");
    }
}

function logout() {
    // Clear login state from local storage
    localStorage.removeItem("isLoggedIn");

    // Hide admin panel and show login page
    document.getElementById("adminContainer").style.display = "none";
    document.getElementById("loginContainer").style.display = "flex";
}
async function loadCertificates() {
    const querySnapshot = await getDocs(collection(db, "certificates"));
    const certificatesBody = document.getElementById("certificatesBody");
    certificatesBody.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        certificatesBody.innerHTML += `
            <tr>
                <td>${data.name}</td>
                <td>${data.address}</td>
                <td>${data['certificate-id']}</td>
                <td>${data.date_of_issued}</td>
                <td>${data.dob}</td>
                <td>${data.purpose}</td>
                <td>${data.type}</td>
                <td class="action-buttons">
                    <button class="btn btn-warning btn-sm" onclick="openEditModal('${doc.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCertificate('${doc.id}')">Delete</button>
                </td>
            </tr>`;
    });
}

async function searchCertificates() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const querySnapshot = await getDocs(collection(db, "certificates"));
    const certificatesBody = document.getElementById("certificatesBody");
    certificatesBody.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name.toLowerCase().includes(searchTerm) || data['certificate-id'].toLowerCase().includes(searchTerm)) {
            certificatesBody.innerHTML += `
                <tr>
                    <td>${data.name}</td>
                    <td>${data.address}</td>
                    <td>${data['certificate-id']}</td>
                    <td>${data.date_of_issued}</td>
                    <td>${data.dob}</td>
                    <td>${data.purpose}</td>
                    <td>${data.type}</td>
                    <td class="action-buttons">
                        <button class="btn btn-warning btn-sm" onclick="openEditModal('${doc.id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCertificate('${doc.id}')">Delete</button>
                    </td>
                </tr>`;
        }
    });
}

function openAddModal() {
    document.getElementById("addModal").style.display = "flex";
}

function closeAddModal() {
    document.getElementById("addModal").style.display = "none";
}

async function addCertificate() {
    const name = document.getElementById("addName").value;
    const address = document.getElementById("addAddress").value;
    const certId = document.getElementById("addCertId").value;
    const dateIssued = document.getElementById("addDateIssued").value;
    const dob = document.getElementById("addDob").value;
    const purpose = document.getElementById("addPurpose").value;
    const type = document.getElementById("addType").value;

    if (!name || !address || !certId || !dateIssued || !dob || !purpose || !type) {
        alert("Please fill all fields");
        return;
    }

    await addDoc(collection(db, "certificates"), {
        name,
        address,
        'certificate-id': certId,
        date_of_issued: dateIssued,
        dob,
        purpose,
        type
    });

    closeAddModal();
    loadCertificates();
}

async function deleteCertificate(id) {
    if (confirm("Are you sure you want to delete this certificate?")) {
        await deleteDoc(doc(db, "certificates", id));
        loadCertificates();
    }
}

window.login = login;
window.searchCertificates = searchCertificates;
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.addCertificate = addCertificate;
window.deleteCertificate = deleteCertificate;
window.logout = logout;