window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

document.addEventListener("DOMContentLoaded", function () {
    const spinner = document.getElementById("loading-spinner");

    // Ensure the spinner is visible for at least 3 seconds
    const minLoadingTime = 0; // 3 seconds
    const startTime = Date.now();

    window.onload = function () {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        setTimeout(() => {
            spinner.style.opacity = "0"; // Start fade-out

            // Wait for the fade-out transition to complete before hiding the spinner
            setTimeout(() => {
                spinner.style.display = "none"; // Hide the spinner completely
            }, 1000); // Match the duration of the CSS transition (1s)
        }, remainingTime);
    };
});

const hiddens = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle("show", entry.isIntersecting);
            if (entry.isIntersecting) observer.unobserve(entry.target);
        });
    },
    {
        rootMargin: "1px",
    }
);

hiddens.forEach(hidden => {
    observer.observe(hidden);
});

document.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    const background = document.querySelector('.background');
    const middle = document.querySelector('.middle');
    const middle2 = document.querySelector('.middle2');
    const foreground = document.querySelector('.foreground');

    // Adjust movement rates for parallax effect
    middle2.style.transform = `translateY(${scrollTop * -0.5}px)`;
    middle.style.transform = `translateY(${scrollTop * 0.5}px)`;
    foreground.style.transform = `translateY(${scrollTop * 0.2}px)`;
    foreground.style.filter = `blur(${scrollTop * 0.005}px)`;
});

const menu_btn = document.querySelector('.hamburger');
const mobile_menu = document.querySelector('.mobile-nav');

menu_btn.addEventListener('click', function () {
    menu_btn.classList.toggle('is-active');
    mobile_menu.classList.toggle('is-active');
});

