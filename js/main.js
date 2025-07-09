document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const shareBtn = document.querySelector('.share-btn button');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            burger.classList.toggle('toggle');

            navLinks.querySelectorAll('li').forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });

        navLinks.querySelectorAll('.nav-link, .login-btn').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.querySelectorAll('li').forEach(item => {
                    item.style.animation = '';
                });
            });
        });
    }

    if (themeToggleBtn) {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            document.body.classList.add(currentTheme);
            if (currentTheme === 'light-mode') {
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            }
        } else {
            document.body.classList.add('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            document.body.classList.toggle('dark-mode');
            let theme = 'dark-mode';
            if (document.body.classList.contains('light-mode')) {
                theme = 'light-mode';
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            }
            localStorage.setItem('theme', theme);
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: 'TyperPro Racer',
                    text: 'Improve your typing speed and accuracy with TyperPro Racer!',
                    url: window.location.href,
                }).then(() => {
                    console.log('Thanks for sharing!');
                }).catch(console.error);
            } else {
                const shareMessage = document.createElement('div');
                shareMessage.classList.add('share-message-popup');
                shareMessage.innerHTML = `
                    <div class="share-message-content">
                        <p>Share not supported on this browser. You can copy the URL:</p>
                        <input type="text" value="${window.location.href}" readonly id="shareUrlInput">
                        <button id="copyUrlBtn">Copy URL</button>
                        <button id="closeSharePopup">Close</button>
                    </div>
                `;
                document.body.appendChild(shareMessage);

                document.getElementById('copyUrlBtn').addEventListener('click', () => {
                    const shareUrlInput = document.getElementById('shareUrlInput');
                    shareUrlInput.select();
                    document.execCommand('copy');
                    alert('URL copied to clipboard!');
                });

                document.getElementById('closeSharePopup').addEventListener('click', () => {
                    document.body.removeChild(shareMessage);
                });
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});