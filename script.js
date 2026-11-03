// Animate the RJ45 intro and open the portfolio automatically after three seconds.
(() => {
  const loader = document.getElementById('introLoader');
  if (!loader) return;

  const scene = document.getElementById('networkScene');
  const plug = document.getElementById('lanPlug');
  const cablePaths = ['lanCableShadow', 'lanCable', 'lanCableHighlight']
    .map(id => document.getElementById(id));
  const percent = document.getElementById('loaderPercent');
  const bar = document.getElementById('loaderBar');
  const status = document.getElementById('loaderStatus');
  const linkStatus = document.getElementById('linkStatus');
  const instruction = document.getElementById('networkInstruction');
  const ports = [...loader.querySelectorAll('.lan-port')].map(element => ({
    element,
    x: Number(element.dataset.x),
    y: Number(element.dataset.y),
    number: element.dataset.port
  }));
  const requiredPort = ports[Math.floor(Math.random() * ports.length)];

  if (!scene || !plug || !ports.length || !requiredPort || cablePaths.some(path => !path)) {
    throw new Error('RJ45 intro markup is incomplete.');
  }

  const isEnglish = document.documentElement.dataset.language === 'en';
  loader.setAttribute('aria-label', isEnglish ? 'Portfolio loading automatically' : 'Memuat portofolio secara otomatis');
  scene.setAttribute('aria-label', isEnglish ? 'Animation of an RJ45 cable connecting to a switch.' : 'Animasi kabel RJ45 tersambung ke switch.');
  status.textContent = isEnglish ? 'PREPARING PORTFOLIO' : 'MENYIAPKAN PORTOFOLIO';
  instruction.textContent = isEnglish ? 'CONNECTING CABLE AUTOMATICALLY' : 'MENGHUBUNGKAN KABEL SECARA OTOMATIS';
  plug.setAttribute('aria-label', isEnglish ? 'RJ45 connector moving automatically' : 'Konektor RJ45 bergerak otomatis');
  document.body.classList.add('loader-active');

  const startPosition = { x: 240, y: 390 };
  const duration = 2200;
  const startTime = performance.now();

  function updateCable(position) {
    const tailX = position.x - 86;
    const tailY = position.y;
    const path = `M54 432 C118 380 106 470 ${tailX - 56} ${tailY + 28} C${tailX - 30} ${tailY + 42} ${tailX - 18} ${tailY} ${tailX} ${tailY}`;
    cablePaths.forEach(cable => cable.setAttribute('d', path));
    plug.setAttribute('transform', `translate(${position.x} ${position.y})`);
  }

  function finishIntro() {
    updateCable(requiredPort);
    requiredPort.element.classList.add('is-connected');
    loader.classList.add('is-connected');
    linkStatus.textContent = 'ONLINE';
    status.textContent = isEnglish ? 'CONNECTED — OPENING PORTFOLIO' : 'KONEKSI TERHUBUNG — MEMBUKA PORTOFOLIO';
    percent.textContent = '100%';
    bar.style.width = '100%';
    instruction.textContent = isEnglish ? `PORT ${requiredPort.number} CONNECTED` : `PORT ${requiredPort.number} TERHUBUNG`;

    window.setTimeout(() => {
      loader.classList.add('is-leaving');
      window.setTimeout(() => {
        loader.remove();
        document.body.classList.remove('loader-active');
      }, 500);
    }, 300);
  }

  function animateConnection(timestamp) {
    const progressValue = Math.min(1, (timestamp - startTime) / duration);
    const easedProgress = progressValue * progressValue * (3 - 2 * progressValue);
    const position = {
      x: startPosition.x + (requiredPort.x - startPosition.x) * easedProgress,
      y: startPosition.y + (requiredPort.y - startPosition.y) * easedProgress - Math.sin(progressValue * Math.PI) * 34
    };

    updateCable(position);
    requiredPort.element.classList.toggle('is-target', progressValue > 0.6);
    percent.textContent = `${String(Math.round(progressValue * 96)).padStart(2, '0')}%`;
    bar.style.width = `${Math.round(progressValue * 96)}%`;
    status.textContent = isEnglish
      ? progressValue < 0.7 ? 'CONNECTING CABLE TO SWITCH' : 'FINALIZING CONNECTION'
      : progressValue < 0.7 ? 'MENYAMBUNGKAN KABEL KE SWITCH' : 'MENYELESAIKAN KONEKSI';

    if (progressValue < 1) {
      window.requestAnimationFrame(animateConnection);
      return;
    }

    finishIntro();
  }

  updateCable(startPosition);
  window.requestAnimationFrame(animateConnection);
})();

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const themeButtons = document.querySelectorAll('[data-theme-choice]');
const languageButtons = document.querySelectorAll('[data-language-choice]');
const skillFilters = document.querySelectorAll('[data-skill-filter]');
const skillCards = document.querySelectorAll('[data-skill-category]');
const projectFilters = document.querySelectorAll('[data-project-filter]');
const projectCards = document.querySelectorAll('[data-project-categories]');
const portraitImage = document.getElementById('portraitImage');
const portraitFrame = document.getElementById('portraitFrame');
const projectImages = document.querySelectorAll('.project-image');
const progress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-link');

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  themeButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
  });
  localStorage.setItem('yora-theme', theme);
}

themeButtons.forEach(button => {
  button.addEventListener('click', () => setTheme(button.dataset.themeChoice));
});
setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

const englishTranslations = {
  'MENYIAPKAN KONEKSI SWITCH': 'PREPARING SWITCH CONNECTION',
  'MENYIAPKAN PORTOFOLIO': 'PREPARING PORTFOLIO',
  'MENGHUBUNGKAN SECARA OTOMATIS': 'CONNECTING AUTOMATICALLY',
  'MENGHUBUNGKAN KABEL SECARA OTOMATIS': 'CONNECTING CABLE AUTOMATICALLY',
  'Memuat portofolio secara otomatis': 'Portfolio loading automatically',
  'Animasi kabel RJ45 tersambung ke switch.': 'Animation of an RJ45 cable connecting to a switch.',
  'Konektor RJ45 bergerak otomatis': 'RJ45 connector moving automatically',
  'NETWORK ADMINISTRATOR': 'NETWORK ADMINISTRATOR',
  'About': 'About',
  'Skills': 'Skills',
  'Portfolio': 'Portfolio',
  'Contact': 'Contact',
  'Let’s Connect': 'Let’s Connect',
  'OPEN TO WORK': 'OPEN TO WORK',
  'Halo! Saya suka mempelajari jaringan komputer dan bereksperimen dengan teknologi baru. Mulai dari konfigurasi jaringan hingga troubleshooting, saya tertarik memahami bagaimana setiap perangkat saling terhubung untuk menciptakan koneksi yang stabil, aman, dan andal.': 'Hi! I enjoy learning about computer networks and exploring new technologies. From network configuration to troubleshooting, I am interested in understanding how devices connect to create stable, secure, and reliable networks.',
  'Bidang fokus': 'Areas of focus',
  'Lihat Proyek': 'View Projects',
  'Foto diri Yova Rezky Apriliano': 'Portrait of Yova Rezky Apriliano',
  'Ringkasan keahlian dan sertifikasi': 'Skills and certifications overview',
  'Configuration & management': 'Configuration & management',
  'BNSP Certified': 'BNSP Certified',
  'Network Administrator · 2025–2028': 'Network Administrator · 2025–2028',
  'Network, systems & support': 'Networks, systems & support',
  'NETWORKING • INFRASTRUCTURE • SUPPORT': 'NETWORKING • INFRASTRUCTURE • SUPPORT',
  '02 — ABOUT ME': '02 — ABOUT ME',
  'ABOUT ME': 'ABOUT ME',
  'SAYA MEMBANGUN KONEKSI YANG ANDAL.': 'I BUILD RELIABLE CONNECTIONS.',
  'Saya Yova Rezky Apriliano, lulusan Teknik Informatika dari Universitas Muhammadiyah Jakarta dengan minat pada administrasi jaringan dan infrastruktur IT. Saya memiliki pengalaman praktik dalam konfigurasi jaringan, troubleshooting, serta administrasi sistem.': 'I am Yova Rezky Apriliano, an Informatics Engineering graduate from Universitas Muhammadiyah Jakarta with an interest in network administration and IT infrastructure. I have hands-on experience with network configuration, troubleshooting, and system administration.',
  'Saya senang mempelajari teknologi baru dan memecahkan masalah secara terstruktur. Saya ingin terus mengembangkan kemampuan teknis dan berkontribusi dalam membangun sistem yang stabil, aman, dan bermanfaat.': 'I enjoy learning new technologies and solving problems methodically. I aim to continue developing my technical skills and contribute to building stable, secure, and useful systems.',
  'Jakarta, Indonesia': 'Jakarta, Indonesia',
  'PENDIDIKAN': 'EDUCATION',
  'SARJANA TEKNIK INFORMATIKA': 'BACHELOR OF INFORMATICS ENGINEERING',
  'Latar belakang Teknik Informatika dengan fokus dan minat pada jaringan, infrastruktur IT, serta administrasi sistem.': 'An Informatics Engineering background with a focus on networks, IT infrastructure, and system administration.',
  'TEKNIK KOMPUTER DAN JARINGAN': 'COMPUTER AND NETWORK ENGINEERING',
  'Mempelajari dasar komputer dan jaringan sebagai fondasi untuk melanjutkan studi di bidang teknologi informasi.': 'Studied computer and networking fundamentals as a foundation for further education in information technology.',
  'JENJANG': 'EDUCATION',
  'PENDIDIKAN': 'EDUCATION',
  'SERTIFIKAT &': 'CERTIFICATES &',
  'PENGAKUAN': 'RECOGNITION',
  'FOKUS': 'CORE',
  'UTAMA': 'FOCUS',
  'PROGRAM': 'PROGRAM',
  'MSIB': 'MSIB',
  'PENGALAMAN': 'EXPERIENCE',
  'Mendampingi sesi laboratorium dan praktikum, serta membantu mahasiswa memahami konsep teknis dan menyelesaikan tugas.': 'Supported laboratory and practical sessions, helping students understand technical concepts and complete assignments.',
  'LIHAT DETAIL': 'VIEW DETAILS',
  'Mendampingi mahasiswa selama sesi laboratorium dan kegiatan praktikum.': 'Supported students during laboratory and practical sessions.',
  'Membantu menjelaskan konsep teknis dan mendukung penyelesaian tugas.': 'Explained technical concepts and helped students complete assignments.',
  'Memimpin program departemen sains dan teknologi serta mendukung kegiatan dan inisiatif teknologi organisasi.': 'Led the science and technology department’s programs and supported the organization’s technology initiatives.',
  'Memimpin dan mengoordinasikan program departemen serta kegiatan terkait teknologi.': 'Led and coordinated department programs and technology-related activities.',
  'Mengelola anggota tim dan mendukung pelaksanaan inisiatif departemen.': 'Managed team members and supported the delivery of department initiatives.',
  'Memimpin tim dalam program PKM-GFT 2025 dan mengembangkan konsep sistem keamanan otomatis.': 'Led a team in the 2025 PKM-GFT program and developed an automated security system concept.',
  'Memimpin tim pada program PKM-GFT tingkat nasional tahun 2025.': 'Led a team in the 2025 national-level PKM-GFT program.',
  'Mengembangkan konsep sistem keamanan otomatis berbasis teknologi proyeksi holografik.': 'Developed an automated security system concept using holographic projection technology.',
  'Menerapkan Python, machine learning, NLP, dan generative AI dalam proyek akhir program Data Science & Generative AI.': 'Applied Python, machine learning, NLP, and generative AI in the Data Science & Generative AI program’s final project.',
  'Menerapkan Python, machine learning, NLP, dan generative AI.': 'Applied Python, machine learning, NLP, and generative AI.',
  'Mengerjakan proyek akhir end-to-end selama program Data Science & Generative AI.': 'Completed an end-to-end final project during the Data Science & Generative AI program.',
  'Sertifikat kelulusan program tersedia sebagai dokumen PDF.': 'The program completion certificate is available as a PDF.',
  'Buka sertifikat kelulusan MSIB (PDF)': 'Open MSIB completion certificate (PDF)',
  'Sertifikasi kompetensi profesi di bidang administrasi jaringan.': 'Professional competency certification in network administration.',
  'DETAIL SERTIFIKASI': 'CERTIFICATION DETAILS',
  'Sertifikat kompetensi Administrator Jaringan (CNA), diterbitkan 26 Desember 2025 dan berlaku 3 tahun. Nomor sertifikat: 61100 2522 6 0037472 2025.': 'Certified Network Administrator (CNA) competency certificate, issued December 26, 2025 and valid for 3 years. Certificate number: 61100 2522 6 0037472 2025.',
  'Materi operasional dan pengelolaan server cloud.': 'Covers cloud server operation and management.',
  'Kursus Apsara Clouder – Cloud Computing. Berlaku hingga 27 Mei 2027; nomor sertifikat ACLC03250500211633.': 'Apsara Clouder – Cloud Computing course. Valid through May 27, 2027; certificate number ACLC03250500211633.',
  'Dasar keamanan pada platform dan layanan cloud.': 'An introduction to security for cloud platforms and services.',
  'Kursus Apsara Clouder – Cloud Security. Berlaku hingga 9 Juli 2027; nomor sertifikat ACLS01250700216380.': 'Apsara Clouder – Cloud Security course. Valid through July 9, 2027; certificate number ACLS01250700216380.',
  'Sertifikat kelulusan program Data Science & Generative AI dari Celerates Acceleration Mastery Program.': 'Completion certificate for the Data Science & Generative AI program by the Celerates Acceleration Mastery Program.',
  'DETAIL SERTIFIKAT': 'CERTIFICATE DETAILS',
  'Celerates Acceleration Mastery Program (CAMP) Batch 2 2025, untuk program Data Science & Generative AI. Program berlangsung 3 Maret–30 Juni 2025; sertifikat diterbitkan di Jakarta pada 1 Juli 2025.': 'Celerates Acceleration Mastery Program (CAMP) Batch 2 2025, in Data Science & Generative AI. The program ran from March 3 to June 30, 2025; the certificate was issued in Jakarta on July 1, 2025.',
  'Nomor sertifikat: 035/CERTIFICATE-C/DSAI/CAMP-B2/2025.': 'Certificate number: 035/CERTIFICATE-C/DSAI/CAMP-B2/2025.',
  'Buka dokumen sertifikat tambahan (PDF)': 'Open additional certificate document (PDF)',
  'Pemateri pada acara bertema Laravel API Masterclass: Autentikasi, Role-Based Access and CRUD Testing.': 'Speaker at an event on Laravel API Masterclass: Authentication, Role-Based Access, and CRUD Testing.',
  'Sertifikat bernomor 10.002/F4.1.7-UMJ/VII/2025, diberikan di Jakarta pada 13 Juli 2025.': 'Certificate number 10.002/F4.1.7-UMJ/VII/2025, awarded in Jakarta on July 13, 2025.',
  'Buka sertifikat pemateri': 'Open speaker certificate',
  'PROGRAM STUDI TI FT-UMJ · 13 JULI 2025': 'INFORMATICS STUDY PROGRAM, FT-UMJ · JULY 13, 2025',
  'Let’s make things': 'Let’s make things',
  'connect.': 'connect.',
  'Sertifikasi asosiasi untuk pengetahuan dan keterampilan jaringan MikroTik.': 'Associate-level certification in MikroTik networking knowledge and skills.',
  'Periode 2018–2023 sesuai yang tercantum di CV; status aktif tidak dinyatakan.': 'The CV lists the period as 2018–2023; active status is not specified.',
  '03 — TECHNICAL ARSENAL': '03 — TECHNICAL ARSENAL',
  'SEMUA': 'ALL',
  'DEVELOPMENT': 'DEVELOPMENT',
  'IOT SYSTEMS': 'IOT SYSTEMS',
  'DATA SCIENCE': 'DATA SCIENCE',
  'TOOLS & SYSTEMS': 'TOOLS & SYSTEMS',
  '04 — SELECTED WORKS': '04 — SELECTED WORKS',
  'SECURITY CONCEPT': 'SECURITY CONCEPT',
  'DATA & AI': 'DATA & AI',
  'ACADEMIC PROGRAM': 'ACADEMIC PROGRAM',
  'Sistem Presensi RFID Berbasis IoT': 'IoT-Based RFID Attendance System',
  'Sistem presensi berbasis RFID yang mengirimkan notifikasi secara real-time saat kartu dipindai.': 'An RFID-based attendance system that sends real-time notifications when a card is scanned.',
  'LIHAT SOURCE CODE': 'VIEW SOURCE CODE',
  'Konsep sistem keamanan otomatis berbasis teknologi proyeksi holografik yang dikembangkan dalam program PKM-GFT.': 'An automated security system concept using holographic projection technology, developed as part of the PKM-GFT program.',
  'BACA DETAIL PROYEK': 'VIEW PROJECT DETAILS',
  'Memimpin tim dalam program PKM-GFT tingkat nasional tahun 2025.': 'Led a team in the 2025 national-level PKM-GFT program.',
  'Mengembangkan konsep sistem keamanan otomatis menggunakan teknologi proyeksi holografik.': 'Developed an automated security system concept using holographic projection technology.',
  'Tell us your mood': 'Tell us your mood',
  '> Find your music': '> Find your music',
  'Spotify recommendations': 'Spotify recommendations',
  'Moodify — Rekomendasi Lagu Berdasarkan Mood': 'Moodify — Mood-Based Song Recommendations',
  'Proyek Data Science & Generative AI berupa aplikasi Streamlit untuk menemukan rekomendasi lagu Spotify berdasarkan suasana hati.': 'A Data Science & Generative AI project: a Streamlit app that recommends Spotify songs based on your mood.',
  'Ringkasan proyek dan program berdasarkan CV. Ilustrasi bersifat representatif, bukan dokumentasi visual proyek asli.': 'Project and program summaries are based on the CV. Illustrations are representative, not original project documentation.',
  'MORE ABOUT MY BACKGROUND': 'MORE ABOUT MY BACKGROUND',
  'Unduh CV untuk melihat informasi pendidikan, keterampilan, dan pengalaman secara ringkas.': 'Download my resume for a concise overview of my education, skills, and experience.',
  '05 — CONTACT': '05 — CONTACT',
  'Terbuka untuk kesempatan entry-level di bidang IT Network, IT Infrastructure, dan IT Support. Silakan hubungi saya melalui kontak berikut.': 'Open to entry-level opportunities in IT networking, IT infrastructure, and IT support. Please reach out using the contact details below.',
  'Kembali ke atas': 'Back to top',
  'Pilihan bahasa': 'Language selection',
  'Pilihan tema': 'Theme selection',
  'Bahasa Indonesia': 'Indonesian',
  'Portfolio loading automatically': 'Memuat portofolio secara otomatis',
  'Animation of an RJ45 cable connecting to a switch.': 'Animasi kabel RJ45 tersambung ke switch.',
  'RJ45 connector moving automatically': 'Konektor RJ45 bergerak otomatis',
  'Navigasi utama': 'Main navigation',
  'Buka navigasi': 'Open navigation',
  'Tutup navigasi': 'Close navigation',
  'Foto diri Yova Rezky Apriliano': 'Portrait of Yova Rezky Apriliano',
  'Ilustrasi switch. Seret konektor RJ45 ke port yang diminta. Port lain akan ditolak.': 'Illustration of a switch. Connect the RJ45 cable to the requested port. Other ports will be rejected.',
  'Tangkapan layar dashboard presensi dan perangkat RFID berbasis IoT': 'Screenshot of the attendance dashboard and IoT-based RFID device',
  'Dashboard rekap presensi siswa dengan filter kelas dan laporan': 'Student attendance dashboard with class filters and reports',
  'Perangkat presensi RFID berbasis IoT dengan layar LCD': 'IoT-based RFID attendance device with an LCD screen',
  'Ilustrasi konsep sistem keamanan otomatis berbasis proyeksi holografik': 'Illustration of an automated security system concept using holographic projection',
  'Ilustrasi aplikasi Moodify untuk rekomendasi lagu berdasarkan suasana hati': 'Illustration of the Moodify app for mood-based song recommendations',
  'Buka sertifikat kompetensi BNSP Network Administrator': 'Open BNSP Network Administrator competency certificate',
  'Sertifikat kompetensi BNSP Network Administrator atas nama Yova Rezky Apriliano': 'BNSP Network Administrator competency certificate awarded to Yova Rezky Apriliano',
  'Buka sertifikat Operate and Manage a Cloud Server': 'Open Operate and Manage a Cloud Server certificate',
  'Sertifikat Alibaba Cloud: Operate and Manage a Cloud Server': 'Alibaba Cloud certificate: Operate and Manage a Cloud Server',
  'Buka sertifikat Cloud Platform Security Overview': 'Open Cloud Platform Security Overview certificate',
  'Sertifikat Alibaba Cloud: Cloud Platform Security Overview': 'Alibaba Cloud certificate: Cloud Platform Security Overview',
  'Buka sertifikat kelulusan Celerates Data Science dan Generative AI': 'Open Celerates Data Science and Generative AI completion certificate',
  'Sertifikat kelulusan Celerates Acceleration Mastery Program Data Science dan Generative AI Batch 2 2025': 'Celerates Acceleration Mastery Program Data Science and Generative AI Batch 2 2025 completion certificate',
  'Buka sertifikat pemateri webinar dan workshop Teknik Informatika FT-UMJ': 'Open Informatics Engineering FT-UMJ webinar and workshop speaker certificate',
  'Sertifikat sebagai pemateri webinar dan workshop Teknik Informatika FT-UMJ': 'Certificate as a speaker at an Informatics Engineering FT-UMJ webinar and workshop'
};

const indonesianTranslations = {
  'About': 'Tentang',
  'Skills': 'Keahlian',
  'Portfolio': 'Portofolio',
  'Contact': 'Kontak',
  'Let’s Connect': 'Mari Terhubung',
  'OPEN TO WORK': 'TERBUKA UNTUK PEKERJAAN',
  'Network Administration': 'Administrasi Jaringan',
  'Configuration & management': 'Konfigurasi & pengelolaan',
  'BNSP Certified': 'Bersertifikat BNSP',
  'IT Infrastructure': 'Infrastruktur TI',
  'Network, systems & support': 'Jaringan, sistem & dukungan',
  'NETWORKING • INFRASTRUCTURE • SUPPORT': 'JARINGAN • INFRASTRUKTUR • DUKUNGAN',
  'Network Support': 'Dukungan Jaringan',
  'Data Science & AI': 'Sains Data & AI',
  'Network Administrator · 2025–2028': 'Administrator Jaringan · 2025–2028',
  '02 — ABOUT ME': '02 — TENTANG SAYA',
  'ABOUT ME': 'TENTANG SAYA',
  'Laboratory Assistant & Teaching Mentor': 'Asisten Laboratorium & Mentor Praktikum',
  'Head of Science and Technology Department': 'Kepala Departemen Sains dan Teknologi',
  'HMIF — Informatics Engineering Student Association': 'HMIF — Himpunan Mahasiswa Teknik Informatika',
  'PKM-GFT Team Chair': 'Ketua Tim PKM-GFT',
  'Data Science & Generative AI Participant — MSIB': 'Peserta Data Science & Generative AI — MSIB',
  'Celerates Acceleration Mastery Program — PT Mitra Talenta Grup': 'Celerates Acceleration Mastery Program — PT Mitra Talenta Grup',
  'LICENSES & CERTIFICATIONS': 'SERTIFIKASI & LISENSI',
  '03 — TECHNICAL ARSENAL': '03 — KEAHLIAN TEKNIS',
  '// SKILLS': '// KEAHLIAN',
  'DEVELOPMENT': 'PENGEMBANGAN',
  'IOT SYSTEMS': 'SISTEM IOT',
  'TOOLS & SYSTEMS': 'ALAT & SISTEM',
  'Development': 'Pengembangan',
  'IoT Systems': 'Sistem IoT',
  'Tools & Systems': 'Alat & Sistem',
  '04 — SELECTED WORKS': '04 — PROYEK PILIHAN',
  '05 — CONTACT': '05 — KONTAK',
  'BUILT': 'KARYA',
  'PROJECTS': 'PROYEK',
  'SECURITY CONCEPT': 'KONSEP KEAMANAN',
  'ACADEMIC PROGRAM': 'PROGRAM AKADEMIK',
  'Real-Time Notification': 'Notifikasi Real-Time',
  'Automated Security System Concept': 'Konsep Sistem Keamanan Otomatis',
  'PKM-GFT': 'PKM-GFT',
  'Team Leadership': 'Kepemimpinan Tim',
  'Holographic Projection': 'Proyeksi Holografik',
  'Tell us your mood': 'Ceritakan suasana hati Anda',
  '> Find your music': '> Temukan musik Anda',
  'Spotify recommendations': 'Rekomendasi Spotify',
  'Mood-Based Recommendation': 'Rekomendasi Berdasarkan Suasana Hati',
  'MORE ABOUT MY BACKGROUND': 'LEBIH TENTANG LATAR BELAKANG SAYA',
  'Let’s review my': 'Mari tinjau',
  'resume.': 'CV saya.',
  'Download CV': 'Unduh CV',
  'Let’s make things': 'Mari kita buat semuanya',
  'connect.': 'terhubung.',
  'Terbuka untuk kesempatan entry-level di bidang IT Network, IT Infrastructure, dan IT Support. Silakan hubungi saya melalui kontak berikut.': 'Terbuka untuk posisi tingkat pemula di bidang jaringan TI, infrastruktur TI, dan dukungan TI. Silakan hubungi saya melalui kontak berikut.',
  'PHONE': 'TELEPON',
  'GMAIL': 'GMAIL',
  'Designed to connect. Built to solve.': 'Dirancang untuk terhubung. Dibangun untuk memberi solusi.'
};

const originalTextNodes = new Map();
const originalAttributes = new Map();
const translatableAttributes = ['aria-label', 'alt'];

function setLanguage(language) {
  const selectedLanguage = language === 'en' ? 'en' : 'id';
  document.documentElement.dataset.language = selectedLanguage;
  document.documentElement.lang = selectedLanguage;
  localStorage.setItem('yora-language', selectedLanguage);
  languageButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.languageChoice === selectedLanguage));
  });

  if (!originalTextNodes.size) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (!node.parentElement.closest('script, style')) originalTextNodes.set(node, node.textContent);
      node = walker.nextNode();
    }
  }

  originalTextNodes.forEach((originalText, node) => {
    const key = originalText.trim();
    if (!key) return;
    const leadingWhitespace = originalText.match(/^\s*/)[0];
    const trailingWhitespace = originalText.match(/\s*$/)[0];
    const translatedText = selectedLanguage === 'en'
      ? englishTranslations[key] || key
      : indonesianTranslations[key] || key;
    node.textContent = `${leadingWhitespace}${translatedText}${trailingWhitespace}`;
  });

  if (!originalAttributes.size) {
    document.querySelectorAll('*').forEach(element => {
      translatableAttributes.forEach(attribute => {
        if (element.hasAttribute(attribute)) {
          originalAttributes.set(`${attribute}:${originalAttributes.size}`, {
            element,
            attribute,
            value: element.getAttribute(attribute)
          });
        }
      });
    });
  }
  originalAttributes.forEach(({ element, attribute, value }) => {
    element.setAttribute(attribute, selectedLanguage === 'en' ? englishTranslations[value] || value : value);
  });

  const isMenuOpen = navLinks.classList.contains('open');
  menuToggle?.setAttribute('aria-label', selectedLanguage === 'en'
    ? isMenuOpen ? 'Close navigation' : 'Open navigation'
    : isMenuOpen ? 'Tutup navigasi' : 'Buka navigasi');
  document.querySelector('meta[name="description"]').content = selectedLanguage === 'en'
    ? 'Portfolio of Yova Rezky Apriliano, an Informatics Engineering graduate focused on network administration, IT infrastructure, data science, and generative AI.'
    : 'Portofolio Yova Rezky Apriliano, lulusan Teknik Informatika dengan fokus Network Administration, IT Infrastructure, Data Science, dan Generative AI.';
}

languageButtons.forEach(button => {
  button.addEventListener('click', () => setLanguage(button.dataset.languageChoice));
});

skillFilters.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.skillFilter;
    skillFilters.forEach(filter => {
      const isActive = filter === button;
      filter.classList.toggle('is-active', isActive);
      filter.setAttribute('aria-pressed', String(isActive));
    });
    skillCards.forEach(card => {
      const isVisible = category === 'all' || card.dataset.skillCategory === category;
      card.hidden = !isVisible;
      if (isVisible) card.classList.add('in-view');
    });
  });
});

projectFilters.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.projectFilter;
    projectFilters.forEach(filter => {
      const isActive = filter === button;
      filter.classList.toggle('is-active', isActive);
      filter.setAttribute('aria-pressed', String(isActive));
    });
    projectCards.forEach(card => {
      const categories = card.dataset.projectCategories.split(' ');
      const isVisible = category === 'all' || categories.includes(category);
      card.hidden = !isVisible;
      if (isVisible) card.classList.add('in-view');
    });
  });
});

portraitImage?.addEventListener('load', () => portraitFrame.classList.add('has-photo'));
if (portraitImage?.complete && portraitImage.naturalWidth > 0) {
  portraitFrame.classList.add('has-photo');
}
projectImages.forEach(image => {
  const projectArt = image.closest('.project-art');
  image.addEventListener('load', () => projectArt.classList.add('has-photo'));
  if (image.complete && image.naturalWidth > 0) {
    projectArt.classList.add('has-photo');
  }
});

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', document.documentElement.lang === 'en'
    ? isOpen ? 'Close navigation' : 'Open navigation'
    : isOpen ? 'Tutup navigasi' : 'Buka navigasi');
  menuToggle.textContent = isOpen ? '✕' : '☰';
});

navItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) {
      menuToggle.textContent = '☰';
      menuToggle.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Open navigation' : 'Buka navigasi');
    }
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${percent}%`;
  backToTop.classList.toggle('visible', window.scrollY > 450);

  let current = 'home';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 150) current = section.id;
  });
  const activeSection = current === 'home' ? 'about' : current;
  navItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${activeSection}`);
  });
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.getElementById('year').textContent = new Date().getFullYear();
setLanguage(document.documentElement.dataset.language);
