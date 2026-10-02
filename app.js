/* =========================================
   MUGHAI MUTRAM VISITOR APP
========================================= */

const CONTACT = {
    phone: "9600979001",
    whatsapp: "https://wa.me/919600979001",
    instagram: "https://www.instagram.com/mughaimutram",
    facebook: "https://www.facebook.com/share/1cGcCdycH5/?mibextid=wwXIfr",
    email: "mughaimutram@gmail.com",
    maps: "https://maps.app.goo.gl/zG3cB71xnDahFnUr6"
};


/* =========================================
   YEAR
========================================= */

document.getElementById("year").textContent =
    new Date().getFullYear();


/* =========================================
   FLOATING CONTACT MENU
========================================= */

const contactFloat =
    document.querySelector(".contact-float");

const contactToggle =
    document.getElementById("contactToggle");

contactToggle.addEventListener("click", () => {

    contactFloat.classList.toggle("active");

});


/* =========================================
   CLOSE CONTACT MENU WHEN CLICKING OUTSIDE
========================================= */

document.addEventListener("click", (event) => {

    if (!contactFloat.contains(event.target)) {

        contactFloat.classList.remove("active");

    }

});


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(
        ".about-card, .program-card, .gallery-card, .video-card, .contact-row"
    );

const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";
                    entry.target.style.transform =
                        "translateY(0)";

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition =
        "opacity .7s ease, transform .7s ease";

    revealObserver.observe(element);

});


/* =========================================
   ANNOUNCEMENTS
   (data comes from the admin site via MMStore)
========================================= */

async function loadAnnouncement() {

    try {

        const text = await MMStore.getAnnouncement();

        if (text && text.trim()) {

            document.getElementById("announcementText").textContent = text;

        }

    } catch (error) {
        console.warn("Announcement could not be loaded", error);
    }

}


/* =========================================
   GALLERY
========================================= */

async function loadGallery() {

    let gallery = [];

    try {
        gallery = await MMStore.getGallery();
    } catch (error) {
        console.warn("Gallery could not be loaded", error);
        return;
    }

    const container =
        document.getElementById("galleryGrid");

    if (!gallery.length) {
        return;
    }

    container.innerHTML = "";

    gallery.forEach(item => {

        const card =
            document.createElement("article");

        card.className = "gallery-card";

        card.innerHTML = `

            <img
                src="${escapeHTML(item.image)}"
                alt="${escapeHTML(item.title || "Mughai Mutram")}"
                loading="lazy"
            >

            <div class="gallery-card-content">

                <h3>
                    ${escapeHTML(item.title || "Beautiful Moment")}
                </h3>

                <p>
                    ${escapeHTML(item.caption || "")}
                </p>

            </div>

        `;

        container.appendChild(card);

        revealObserver.observe(card);

    });

}


/* =========================================
   VIDEOS
========================================= */

async function loadVideos() {

    let videos = [];

    try {
        videos = await MMStore.getVideos();
    } catch (error) {
        console.warn("Videos could not be loaded", error);
        return;
    }

    const container =
        document.getElementById("videoGrid");

    if (!videos.length) {
        return;
    }

    container.innerHTML = "";

    videos.forEach(item => {

        const card =
            document.createElement("article");

        card.className = "video-card";

        let media = "";

        if (item.type === "youtube") {

            media = `
                <iframe
                    src="${escapeHTML(item.url)}"
                    title="${escapeHTML(item.title || "Mughai Mutram video")}"
                    allowfullscreen
                ></iframe>
            `;

        } else {

            media = `
                <video
                    controls
                    preload="metadata"
                >
                    <source src="${escapeHTML(item.url)}">
                </video>
            `;

        }

        card.innerHTML = `

            ${media}

            <div class="video-content">

                <h3>
                    ${escapeHTML(item.title || "Our Memories")}
                </h3>

                <p>
                    ${escapeHTML(item.caption || "")}
                </p>

            </div>

        `;

        container.appendChild(card);

        revealObserver.observe(card);

    });

}


/* =========================================
   ENQUIRY
========================================= */

document
    .getElementById("enquiryForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("parentName").value.trim();

        const phone =
            document.getElementById("parentPhone").value.trim();

        const program =
            document.getElementById("programChoice").value;

        const message =
            document.getElementById("message").value.trim();

        const text = `
Hello Mughai Mutram,

Parent Name: ${name}
Phone: ${phone}
Program: ${program}
Message: ${message}
        `;

        const whatsappURL =
            CONTACT.whatsapp +
            "?text=" +
            encodeURIComponent(text);

        /* open WhatsApp straight away (must happen inside the click) */

        window.open(whatsappURL, "_blank");

        /* ...and also save the enquiry so it appears in the admin site */

        MMStore.addEnquiry({
            name: name,
            phone: phone,
            program: program,
            message: message,
            status: "New",
            createdAt: new Date().toISOString()
        }).catch(error => {
            console.warn("Enquiry could not be saved online", error);
        });

        this.reset();

    });


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================
   LOAD ALL CONTENT
========================================= */

loadAnnouncement();
loadGallery();
loadVideos();


/* =========================================
   PLAYFUL EXTRAS
========================================= */

const reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CONFETTI = ["⭐", "🎈", "🌈", "🦋", "🧸", "✨", "🎉", "🌼"];

function burstConfetti(x, y) {

    if (reduceMotion) {
        return;
    }

    for (let i = 0; i < 12; i++) {

        const piece = document.createElement("span");

        piece.className = "confetti";
        piece.textContent =
            CONFETTI[Math.floor(Math.random() * CONFETTI.length)];

        piece.style.left = x + "px";
        piece.style.top = y + "px";

        const angle = (Math.PI * 2 * i) / 12;
        const distance = 60 + Math.random() * 70;

        piece.style.setProperty("--dx", Math.cos(angle) * distance + "px");
        piece.style.setProperty("--dy", Math.sin(angle) * distance + 40 + "px");
        piece.style.setProperty("--rot", (Math.random() * 360 - 180) + "deg");

        document.body.appendChild(piece);

        setTimeout(() => piece.remove(), 1200);

    }

}


/* tap an animal or toy -> it boings and confetti pops */

document
    .querySelectorAll(".hero-animal, .hero-toy, .toy, .star")
    .forEach(item => {

        item.addEventListener("click", event => {

            item.classList.remove("boing");
            void item.offsetWidth;
            item.classList.add("boing");

            burstConfetti(event.clientX, event.clientY);

            setTimeout(() => item.classList.remove("boing"), 750);

        });

    });


/* confetti when the enquiry button is pressed */

document
    .querySelectorAll(".primary-button, #enquiryForm button")
    .forEach(button => {

        button.addEventListener("click", event => {

            burstConfetti(event.clientX, event.clientY);

        });

    });


/* gentle parallax: front-page toys drift as the mouse moves */

const heroSection = document.querySelector(".hero");

if (heroSection && !reduceMotion && window.innerWidth > 1050) {

    const drifters = heroSection.querySelectorAll(
        ".sun, .hero-logo, .star"
    );

    heroSection.addEventListener("mousemove", event => {

        const rect = heroSection.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        drifters.forEach((el, index) => {

            const depth = (index % 3 + 1) * 6;

            el.style.translate =
                `${x * depth}px ${y * depth}px`;

        });

    });

}