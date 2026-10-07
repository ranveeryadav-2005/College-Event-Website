// Shared UI behavior for all pages.
document.addEventListener("DOMContentLoaded", () => {
  setActiveNavigation();
  setupMobileNavigation();
  setupRevealAnimations();
  setupRegistrationForm();
  setupAnnouncementTicker();
});

function setActiveNavigation() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === page) {
      link.classList.add("active");
    }
  });
}

function setupMobileNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  });
}

function setupRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((element) => observer.observe(element));
}

function setupRegistrationForm() {
  const form = document.getElementById("registrationForm");
  if (!form) return;

  const message = document.getElementById("formMessage");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;

    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const college = form.college.value.trim();
    const selectedEvent = form.event.value.trim();

    valid = validateField(form.fullName, fullName.length >= 3, "Enter your full name.") && valid;
    valid =
      validateField(
        form.email,
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        "Enter a valid email address."
      ) && valid;
    valid =
      validateField(
        form.phone,
        /^[0-9+\-\s]{10,15}$/.test(phone),
        "Enter a valid phone number."
      ) && valid;
    valid = validateField(form.college, college.length >= 3, "Enter your college name.") && valid;
    valid = validateField(form.event, selectedEvent.length > 0, "Select an event.") && valid;

    if (!message) return;

    if (valid) {
      message.textContent = "Registration submitted successfully. We will contact you soon.";
      message.className = "form-message success";
      form.reset();
    } else {
      message.textContent = "Please fix the highlighted fields and submit again.";
      message.className = "form-message error";
    }
  });
}

function validateField(input, condition, errorText) {
  const container = input.closest(".input-group");
  if (!container) return condition;

  const error = container.querySelector(".error-message");
  if (!error) return condition;

  if (condition) {
    error.textContent = "";
    input.setAttribute("aria-invalid", "false");
    return true;
  }

  error.textContent = errorText;
  input.setAttribute("aria-invalid", "true");
  return false;
}

function setupAnnouncementTicker() {
  const ticker = document.getElementById("tickerText");
  if (!ticker) return;

  const notices = [
    "Registrations close on August 10, 2026. Secure your slot early.",
    "Hackathon teams must check in by 8:30 AM on Day 1.",
    "Project Expo participants can set up posters from 2:30 PM onward.",
    "Certificates will be emailed within 5 business days after the event."
  ];

  let index = 0;
  setInterval(() => {
    index = (index + 1) % notices.length;
    ticker.style.opacity = "0";
    setTimeout(() => {
      ticker.textContent = notices[index];
      ticker.style.opacity = "1";
    }, 220);
  }, 4000);
}
