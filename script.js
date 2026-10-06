document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // NAVIGASI SMOOTH SCROLL
    // =========================
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    // =========================
    // TAHUN OTOMATIS
    // =========================
    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // =========================
    // MENU AKTIF SAAT SCROLL
    // =========================
    const sections = document.querySelectorAll("section[id]");
    const menuLinks = document.querySelectorAll('nav a[href^="#"]');

    function updateActiveMenu() {

        let currentSection = "";

        sections.forEach(function (section) {

            const sectionTop = section.offsetTop - 200;

            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }

        });

        menuLinks.forEach(function (link) {

            const linkTarget = link.getAttribute("href");

            if (linkTarget === "#" + currentSection) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }

        });
    }

    window.addEventListener("scroll", updateActiveMenu);

    updateActiveMenu();


    // =========================
    // TOMBOL BACK TO TOP
    // =========================
    const backToTop = document.querySelector(".back-to-top");

    if (backToTop) {

        window.addEventListener("scroll", function () {

            if (window.scrollY > 500) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }

        });

        backToTop.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");

                // Supaya animasi hanya berjalan sekali
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});
        });
    }

});
