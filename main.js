// OdynsEye WebLab — main.js
// Small, dependency-free enhancements:
//   1. Highlights the nav link for whichever in-page section is in view.
//   2. Keeps the footer copyright year current automatically.
//
// Nothing here runs unless the matching markup exists on the page,
// so this file is safe to include as-is on every page (about/,
// architecture/, experiments/...).

document.addEventListener('DOMContentLoaded', () => {
    setFooterYear();
    initScrollSpy();
});

function setFooterYear() {
    const yearEl = document.querySelector('[data-year]');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

function initScrollSpy() {
    // Only nav links that point to an in-page anchor (href="#...")
    // are eligible — links to other pages (about/index.html, etc.)
    // are left alone.
    const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    if (!navLinks.length || !('IntersectionObserver' in window)) return;

    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!sections.length) return;

    const linkForSection = section =>
        navLinks.find(link => link.getAttribute('href') === `#${section.id}`);

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                const link = linkForSection(entry.target);
                if (!link) return;
                link.classList.toggle('active', entry.isIntersecting);
            });
        },
        {
            // Treat a section as "current" once it crosses the
            // middle band of the viewport, rather than only when
            // it's fully visible.
            rootMargin: '-40% 0px -55% 0px',
        }
    );

    sections.forEach(section => observer.observe(section));
}
