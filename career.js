// career.js

document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.career-nav-link');
    const jobCards = document.querySelectorAll('.career-job-card');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');

            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('career-active'));
            // Add active class to the clicked link
            this.classList.add('career-active');

            // Filter job cards
            jobCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-type') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});