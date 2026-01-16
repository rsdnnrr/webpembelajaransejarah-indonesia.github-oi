/* ===========================
   LOGIN & REGISTER (LOCAL)
=========================== */
const authScreen = document.getElementById("auth-screen");
const app = document.getElementById("app");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");

showRegister.onclick = () => {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
};

showLogin.onclick = () => {
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
};

// REGISTER
document.getElementById("btn-register").onclick = () => {
    let email = document.getElementById("reg-email").value;
    let pass = document.getElementById("reg-pass").value;
    let pass2 = document.getElementById("reg-pass2").value;

    if (!email.includes("@gmail.com")) return alert("Masukkan Gmail yang valid.");
    if (pass !== pass2) return alert("Password tidak sama!");

    localStorage.setItem("user", JSON.stringify({ email, pass }));
    alert("Akun berhasil dibuat!");
    authScreen.classList.add("hidden");
    app.classList.remove("hidden");
};

// LOGIN
document.getElementById("btn-login").onclick = () => {
    let email = document.getElementById("login-email").value;
    let pass = document.getElementById("login-pass").value;

    let user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Akun belum dibuat!");

    if (email === user.email && pass === user.pass) {
        authScreen.classList.add("hidden");
        app.classList.remove("hidden");
    } else {
        alert("Email atau password salah.");
    }
};

// LOGOUT
document.getElementById("btn-logout").onclick = () => {
    app.classList.add("hidden");
    authScreen.classList.remove("hidden");
};


/* ===========================
   NAVIGASI HALAMAN
=========================== */
const pages = document.querySelectorAll(".page");

window.goTo = function (pageID) {
    pages.forEach(p => p.classList.add("hidden"));
    document.getElementById(pageID).classList.remove("hidden");
    window.scrollTo(0, 0);
};

// Navbar button
document.querySelectorAll("[data-show]").forEach(btn => {
    btn.addEventListener("click", () => {
        goTo(btn.dataset.show);
    });
});



/* ===========================
   ABSENSI KELAS
=========================== */

const siswa = {
  10: ["Andi", "Budi", "Citra", "Dewi", "Eka", "Farhan", "Ghina", "Hafiz", "Ivan", "Jihan"],
  11: ["Kamil", "Lutfi", "Mira", "Nadia", "Omar", "Putri", "Qori", "Rafi", "Salsa", "Tegar"],
  12: ["Ulfa", "Vito", "Wulan", "Xavier", "Yuni", "Zidan", "Arsy", "Bagas", "Chika", "Dimas"]
};

const absenLoad = document.getElementById("absen-load");
const absenKelas = document.getElementById("absen-kelas");
const absenTanggal = document.getElementById("absen-tanggal");
const absenArea = document.getElementById("absen-area");

const absenSave = document.getElementById("absen-save");
const absenReset = document.getElementById("absen-reset");
const absenResult = document.getElementById("absen-result");

// ---------------- LOAD SISWA -----------------
absenLoad.onclick = () => {
  if (!absenTanggal.value) {
    alert("Pilih tanggal dulu!");
    return;
  }

  loadAbsensi(absenKelas.value, absenTanggal.value);
};

function loadAbsensi(kelas, tanggal) {
  absenArea.innerHTML = "";

  let list = siswa[kelas];

  let table = document.createElement("div");
  table.className = "absen-table";

  list.forEach((nama, i) => {
    let row = document.createElement("div");
    row.className = "absen-row";

    row.innerHTML = `
      <div>${i + 1}. ${nama}</div>
      <div class="absen-status">
        <select id="absen-${i}">
          <option value="Hadir">Hadir</option>
          <option value="Izin">Izin</option>
          <option value="Sakit">Sakit</option>
          <option value="Alfa">Alfa</option>
        </select>
      </div>
    `;

    table.appendChild(row);
  });

  absenArea.appendChild(table);

  // cek apakah ada data lama?
  loadSavedAbsensi(kelas, tanggal);
}

// ---------------- SIMPAN ABSENSI -----------------
absenSave.onclick = () => {
  const kelas = absenKelas.value;
  const tanggal = absenTanggal.value;

  if (!tanggal) {
    alert("Pilih tanggal dulu!");
    return;
  }

  let data = [];
  siswa[kelas].forEach((nama, i) => {
    let status = document.getElementById(`absen-${i}`).value;
    data.push({ nama, status });
  });

  // simpan ke localStorage
  localStorage.setItem(`absen-${kelas}-${tanggal}`, JSON.stringify(data));

  absenResult.style.display = "block";
  absenResult.innerHTML = "<strong>Absensi berhasil disimpan!</strong>";
};

// ---------------- LOAD DATA ABSENSI YANG SUDAH DISIMPAN -----------------
function loadSavedAbsensi(kelas, tanggal) {
  let saved = localStorage.getItem(`absen-${kelas}-${tanggal}`);
  if (!saved) return;

  let data = JSON.parse(saved);

  data.forEach((d, i) => {
    let select = document.getElementById(`absen-${i}`);
    if (select) select.value = d.status;
  });

  absenResult.style.display = "block";
  absenResult.innerHTML = "<strong>Data absensi ditemukan dan dimuat!</strong>";
}

// ---------------- RESET -----------------
absenReset.onclick = () => {
  absenArea.innerHTML = "";
  absenResult.style.display = "none";
};


/* ===========================
   MATERI KELAS
=========================== */
const materiList = {
    10: [
        "Konsep Ruang dan Waktu Sejarah",
        "Sumber dan Kajian dalam Ilmu Sejarah",
        "Hidup Pada Masa Praaksara",
        "Peradaban Awal Dunia",
        "Kerajaan Hindu-Buddha",
        "Kerajaan Islam Nusantara",
        "Kolonialisme dan Imperialisme"
    ],
    11: [
        "Pergerakan Nasional",
        "Kebangkitan Nasional",
        "Perumusan Dasar Negara",
        "Proklamasi Kemerdekaan",
        "Perjuangan Mempertahankan Kemerdekaan"
    ],
    12: [
        "Demokrasi Liberal",
        "Demokrasi Terpimpin",
        "Orde Baru",
        "Reformasi 1998",
        "Dinamika Indonesia Era Modern"
    ]
};

const materiContainer = document.getElementById("materi-content");
const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
    tab.onclick = () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        loadMateri(tab.dataset.class);
    };
});

function loadMateri(kelas) {
    materiContainer.innerHTML = "";
    materiList[kelas].forEach((judul, index) => {
        let card = document.createElement("div");
        card.className = "materi-card";
        card.innerHTML = `<h4>${judul}</h4>`;

        card.onclick = () => {
            window.open(materiLink[kelas][index], "_blank");
        };

        materiContainer.appendChild(card);
    });
}
loadMateri(10);


const materiLink = {
  10: [
    "https://drive.google.com/drive/folders/1XqL6vmJhqKrM-H7L3HfleoSx_IuN4fcx?usp=drive_link",
    "https://drive.google.com/drive/folders/1XqL6vmJhqKrM-H7L3HfleoSx_IuN4fcx?usp=drive_link",
    "https://drive.google.com/drive/folders/1XqL6vmJhqKrM-H7L3HfleoSx_IuN4fcx?usp=drive_link",
    "https://drive.google.com/drive/folders/1XqL6vmJhqKrM-H7L3HfleoSx_IuN4fcx?usp=drive_link",
    "https://drive.google.com/drive/folders/1XqL6vmJhqKrM-H7L3HfleoSx_IuN4fcx?usp=drive_link",
    "https://drive.google.com/drive/folders/1XqL6vmJhqKrM-H7L3HfleoSx_IuN4fcx?usp=drive_link",
    "https://drive.google.com/drive/folders/1XqL6vmJhqKrM-H7L3HfleoSx_IuN4fcx?usp=drive_link",
  ],
  11: [
    "https://drive.google.com/drive/folders/1QteyS4eFrpOcG_j5cU8Z_K91bGvA2tAp?usp=drive_link",
    "https://drive.google.com/drive/folders/1QteyS4eFrpOcG_j5cU8Z_K91bGvA2tAp?usp=drive_link",
    "https://drive.google.com/drive/folders/1QteyS4eFrpOcG_j5cU8Z_K91bGvA2tAp?usp=drive_link",
    "https://drive.google.com/drive/folders/1QteyS4eFrpOcG_j5cU8Z_K91bGvA2tAp?usp=drive_link",
    "https://drive.google.com/drive/folders/1QteyS4eFrpOcG_j5cU8Z_K91bGvA2tAp?usp=drive_link"
  ],
  12: [
    "https://drive.google.com/drive/folders/1CYRGeB9O13zNjqy-MFGwcdxp23u6cnHh",
    "https://drive.google.com/drive/folders/1CYRGeB9O13zNjqy-MFGwcdxp23u6cnHh",
    "https://drive.google.com/drive/folders/1CYRGeB9O13zNjqy-MFGwcdxp23u6cnHh",
    "https://drive.google.com/drive/folders/1CYRGeB9O13zNjqy-MFGwcdxp23u6cnHh",
    "https://drive.google.com/drive/folders/1CYRGeB9O13zNjqy-MFGwcdxp23u6cnHh"
  ]
};

function openPembelajaranVideo() {
    window.open("https://youtu.be/VIDEO_KAMU", "_blank");
}



/* ===========================
   KUIS PER KELAS
=========================== */
const soal = {
    10: [
        { q:"Apa yang dimaksud sejarah?", a:"Ilmu yang mempelajari peristiwa masa lalu", o:["Ramalan masa depan","Ilmu tentang cuaca","Ilmu politik"] },
        { q:"Zaman praaksara disebut juga zaman…", a:"Belum mengenal tulisan", o:["Zaman batu","Zaman kerajaan","Zaman modern"] },
        { q:"Kerajaan Hindu tertua di Indonesia?", a:"Kutai", o:["Majapahit","Tarumanegara","Sriwijaya"] },
        { q:"Sumber sejarah berupa peninggalan fisik disebut…", a:"Artefak", o:["Fakta","Narasi","Testimoni"] },
        { q:"Kerajaan Islam pertama di Nusantara?", a:"Samudra Pasai", o:["Demak","Mataram","Aceh"] },
        { q:"Kolonialisme bertujuan untuk…", a:"Menguasai wilayah", o:["Membantu ekonomi","Memberi kemerdekaan","Membantu budaya"] },
        { q:"Imperialisme modern muncul pada abad…", a:"19", o:["16","12","21"] },
        { q:"Candi Borobudur dibangun oleh?", a:"Dinasti Syailendra", o:["Majapahit","Singasari","Sriwijaya"] },
        { q:"Kerajaan Majapahit mencapai puncak kejayaan saat dipimpin…", a:"Hayam Wuruk", o:["Gajah Mada","Raden Wijaya","Kertanegara"] },
        { q:"Sumpah Palapa diucapkan oleh…", a:"Gajah Mada", o:["Hayam Wuruk","Diponegoro","Patih Raga"] }
    ],
    11: [
        { q:"Organisasi modern pertama?", a:"Budi Utomo", o:["PETA","VOC","MGMP"] },
        { q:"Tokoh Sumpah Pemuda?", a:"Wage Rudolf Supratman", o:["Soekarno","Hatta","Tan Malaka"] },
        { q:"PPKI dibentuk pada tahun?", a:"1945", o:["1940","1930","1950"] },
        { q:"Naskah proklamasi diketik oleh?", a:"Sayuti Melik", o:["Latief Hendraningrat","BM Diah","Wikana"] },
        { q:"Tokoh pembacaan proklamasi?", a:"Ir. Soekarno", o:["Moh. Hatta","Sjahrir","Ahmad Soebardjo"] },
        { q:"VOC dibubarkan tahun?", a:"1799", o:["1800","1700","1850"] },
        { q:"Tokoh perlawanan Diponegoro adalah…", a:"Pangeran Diponegoro", o:["Sisingamangaraja","Sultan Agung","Sultan Baabullah"] },
        { q:"Kerja paksa zaman Jepang disebut…", a:"Romusha", o:["Heiho","Kaigun","Kenpeitai"] },
        { q:"Tanggal Sumpah Pemuda?", a:"28 Oktober 1928", o:["17 Agustus","20 Mei","1 Juni"] },
        { q:"Kongres Pemuda II digelar di kota…", a:"Jakarta", o:["Bandung","Surabaya","Surakarta"] }
    ],
    12: [
        { q:"Demokrasi Liberal terjadi tahun?", a:"1950-1959", o:["1966-1998","1945-1950","1998-2004"] },
        { q:"Demokrasi Terpimpin dipimpin oleh?", a:"Soekarno", o:["Hatta","Soeharto","Habibie"] },
        { q:"Orde Baru dipimpin oleh?", a:"Soeharto", o:["Soekarno","BJ Habibie","Gus Dur"] },
        { q:"Gerakan Reformasi dimulai tahun?", a:"1998", o:["1990","2001","1977"] },
        { q:"Amandemen UUD 1945 dilakukan sebanyak?", a:"4 kali", o:["1 kali","2 kali","3 kali"] },
        { q:"Krisis moneter 1998 berasal dari?", a:"Asia", o:["Amerika","Eropa","Afrika"] },
        { q:"Trisakti berisi kedaulatan…", a:"Politik, Ekonomi, Budaya", o:["Militer","Agama","Sosial"] },
        { q:"DPR hasil Pemilu 1999 melahirkan presiden…", a:"Abdurrahman Wahid", o:["Megawati","Soeharto","Habibie"] },
        { q:"Era Habibie dikenal dengan…", a:"Reformasi awal", o:["Orde Lama","Orde Baru","Liberal"] },
        { q:"Presiden yang menggantikan Gus Dur?", a:"Megawati", o:["Soeharto","Jokowi","BJ Habibie"] }
    ]
};

const startBtn = document.getElementById("start-quiz");
const kelasSelect = document.getElementById("kelas-select");
const qArea = document.getElementById("questions-area");
const resultBox = document.getElementById("quiz-result");

startBtn.onclick = () => {
    let k = kelasSelect.value;
    loadQuiz(k);
};

function loadQuiz(kelas) {
    qArea.innerHTML = "";
    resultBox.style.display = "none";

    soal[kelas].forEach((s, i) => {
        let div = document.createElement("div");
        div.className = "question";

        let options = [...s.o, s.a].sort(() => Math.random() - 0.5);

        div.innerHTML = `
            <h4>${i + 1}. ${s.q}</h4>
            <div class="options">
                ${options.map(o => `
                    <label>
                        <input type="radio" name="q${i}" value="${o}">
                        ${o}
                    </label>
                `).join("")}
            </div>
        `;

        qArea.appendChild(div);
    });
}

document.getElementById("submit-quiz").onclick = () => {
    let k = kelasSelect.value;
    let benar = 0;

    soal[k].forEach((s, i) => {
        let jawaban = document.querySelector(`input[name="q${i}"]:checked`);
        if (jawaban && jawaban.value === s.a) benar++;
    });

    resultBox.innerHTML = `Skor Kamu: <strong>${benar}/10</strong>`;
    resultBox.style.display = "block";
};

document.getElementById("reset-quiz").onclick = () => {
    qArea.innerHTML = "";
    resultBox.style.display = "none";
};


// ===================== GAME ULAR TANGGA 1 VS 1 =====================
const board = document.getElementById("board");
const ctx = board.getContext("2d");

let size = 40;

// Posisi pemain
let p1 = 1;
let p2 = 1;

let turn = 1; // 1 = pemain 1, 2 = pemain 2

const turnInfo = document.getElementById("turn-info");
const diceResult = document.getElementById("dice-result");
const rollBtn = document.getElementById("roll-dice");

// Kumpulan pertanyaan sejarah
const questions = [
  { q: "Kerajaan tertua di Indonesia adalah?", a: "Kutai", options: ["Majapahit", "Sriwijaya", "Kutai", "Tarumanegara"] },
  { q: "Proklamasi Kemerdekaan RI dibacakan pada tahun?", a: "1945", options: ["1930", "1945", "1950", "1928"] },
  { q: "Pendiri Kerajaan Majapahit adalah?", a: "Raden Wijaya", options: ["Gajah Mada", "Hayam Wuruk", "Raden Wijaya", "Kertanegara"] },
  { q: "Semboyan Bhineka Tunggal Ika berasal dari?", a: "Majapahit", options: ["Sriwijaya", "Majapahit", "Mataram", "Kutai"] },
  { q: "VOC dibubarkan pada tahun?", a: "1799", options: ["1880", "1942", "1602", "1799"] }
];

// menggambar papan
function drawBoard() {
  ctx.clearRect(0,0,400,400);
  ctx.strokeStyle = "#000";

  // grid
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      ctx.strokeRect(j * size, i * size, size, size);
    }
  }

  // pemain 1 (merah)
  drawPlayer(p1, "red");

  // pemain 2 (biru)
  drawPlayer(p2, "blue");
}

function drawPlayer(pos, color){
  let px = ((pos - 1) % 10) * size + size/2;
  let py = (9 - Math.floor((pos - 1) / 10)) * size + size/2;

  ctx.beginPath();
  ctx.arc(px, py, 12, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

drawBoard();

// ---------------- PERTANYAAN -----------------
const qBox = document.getElementById("question-box");
const qText = document.getElementById("question-text");
const ansDiv = document.getElementById("answers");

function askQuestion(currentPlayer){
  qBox.style.display = "block";

  let item = questions[Math.floor(Math.random() * questions.length)];

  qText.textContent = item.q;

  ansDiv.innerHTML = "";
  item.options.forEach(opt => {
    let btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "btn gold";
    btn.style.margin = "6px";

    btn.onclick = () => {
      qBox.style.display = "none";

      if (opt === item.a) {
        // Benar → maju 1
        if (currentPlayer === 1) p1++;
        else p2++;
        alert("Jawaban benar! Maju 1 langkah!");
      } else {
        // Salah → mundur 1
        if (currentPlayer === 1) p1 = Math.max(1, p1 - 1);
        else p2 = Math.max(1, p2 - 1);
        alert("Jawaban salah! Mundur 1 langkah!");
      }

      drawBoard();
      checkWinner();
      nextTurn();
    };

    ansDiv.appendChild(btn);
  });
}

// ---------------- DADU -----------------
rollBtn.onclick = () => {
  let dice = Math.floor(Math.random() * 6) + 1;
  diceResult.textContent = "🎲 Dadu: " + dice;

  if (turn === 1){
    p1 += dice;
    if (p1 > 100) p1 = 100;
    drawBoard();
    askQuestion(1);

  } else {
    p2 += dice;
    if (p2 > 100) p2 = 100;
    drawBoard();
    askQuestion(2);
  }
};

// ---------------- GILIRAN -----------------
function nextTurn(){
  turn = turn === 1 ? 2 : 1;
  turnInfo.textContent = (turn === 1)
    ? "Giliran Pemain 1 (Merah)"
    : "Giliran Pemain 2 (Biru)";
}

nextTurn();

// ---------------- CEK MENANG -----------------
function checkWinner(){
  if (p1 >= 100){
    alert("🎉 Pemain 1 MENANG!");
    p1 = 1; p2 = 1; drawBoard();
  }
  if (p2 >= 100){
    alert("🎉 Pemain 2 MENANG!");
    p1 = 1; p2 = 1; drawBoard();
  }
}


/* ===========================
   EVALUASI PEMBELAJARAN
=========================== */

function openEvaluasi(kelas){
    let link = "";

    if(kelas === 10){
        link = "https://docs.google.com/forms/d/e/1FAIpQLScRwySrgPqwE07x4nBS8Kh77HZoG1RJNdvB11xCpS_a569_kg/viewform?usp=publish-editor";
    } 
    else if(kelas === 11){
        link = "https://docs.google.com/forms/d/e/1FAIpQLScRwySrgPqwE07x4nBS8Kh77HZoG1RJNdvB11xCpS_a569_kg/viewform?usp=publish-editor";
    }
    else if(kelas === 12){
        link = "https://docs.google.com/forms/d/e/1FAIpQLScRwySrgPqwE07x4nBS8Kh77HZoG1RJNdvB11xCpS_a569_kg/viewform?usp=publish-editor";
    }

    window.open(link, "_blank");
}


/* ===========================
   KOTAK SARAN
=========================== */

const saranBtn = document.getElementById("saran-kirim");
const saranNama = document.getElementById("saran-nama");
const saranHp = document.getElementById("saran-hp");
const saranPesan = document.getElementById("saran-pesan");
const saranStatus = document.getElementById("saran-status");

saranBtn.onclick = () => {
  if (saranNama.value === "" || saranHp.value === "" || saranPesan.value === "") {
    alert("Semua kolom harus diisi!");
    return;
  }

  let data = {
    nama: saranNama.value,
    hp: saranHp.value,
    pesan: saranPesan.value,
    waktu: new Date().toLocaleString()
  };

  // simpan ke LocalStorage
  let list = JSON.parse(localStorage.getItem("kotakSaran")) || [];
  list.push(data);
  localStorage.setItem("kotakSaran", JSON.stringify(list));

  saranStatus.style.display = "block";
  saranStatus.innerHTML = "<strong>Pesan berhasil dikirim!</strong>";

  saranNama.value = "";
  saranHp.value = "";
  saranPesan.value = "";
};


/* ===========================
   MEDIA SOSIAL SEKOLAH
=========================== */

function openSosmed(type){
    let link = "";

    if(type === "yt"){
        link = "https://youtube.com/@sman6garut?si=OAsvaFcpk1UwAOQG";  
    }
    else if(type === "ig"){
        link = "https://www.instagram.com/sman6grt?igsh=cWgxNzl2YTNmaTgz";
    }
    else if(type === "tt"){
        link = "https://www.tiktok.com/@sma.n.6.garut?is_from_webapp=1&sender_device=pc";
    }
    else if(type === "fb"){
        link = "https://web.facebook.com/share/p/1aWqj54S8J/";
    }

    window.open(link, "_blank");
}

function openVideo(type){
    let link = "";

    if(type === "absensi"){
        link = "https://docs.google.com/forms/d/e/1FAIpQLSeWPrgeItqSfJR_ZNiLSpEM9jx0QK6P8ZdV4uBsOpuBqxLbew/viewform?usp=publish-editor";
    }
    else if(type === "kuis"){
        link = "https://wayground.com/join?gc=396617";
    }

    window.open(link, "_blank");
}
