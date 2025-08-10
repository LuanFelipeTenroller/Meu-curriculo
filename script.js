document.addEventListener('DOMContentLoaded', function() {
    const menu = document.querySelector('.menu');
    const header = document.querySelector('header');
    const menuLinks = document.querySelectorAll('.menu-item a');
    const backToTopButton = document.getElementById('backToTop');
    let isMenuFixed = false;

    function checkMenuPosition() {
        const headerBottom = header.offsetTop + header.offsetHeight;
        const scrollPosition = window.pageYOffset;

        if (scrollPosition >= headerBottom && !isMenuFixed) {
            menu.classList.add('fixed');
            isMenuFixed = true;
        } else if (scrollPosition < headerBottom && isMenuFixed) {
            menu.classList.remove('fixed');
            isMenuFixed = false;
        }
    }

    function drawHorizontalSkillsChart() {
        const canvas = document.getElementById('grafico');
        if (!canvas) {
            console.error('Elemento canvas não encontrado');
            return;
        }

        canvas.width = 500; 
        canvas.height = 280;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const skills = [
            { name: 'Java', value: 65, color: '#032b70' },
            { name: 'MySQL', value: 60,  color: '#0040ad' },
            { name: 'Postgres', value: 60, color: '#3498db' },
            { name: 'React', value: 50, color: '#53a9ff' }
        ];

        const barHeight = 25; 
        const spacing = 30; 
        const startY = 50;    
        const maxWidth = canvas.width - 180; 
        const textOffset = 100;

        skills.forEach((skill, index) => {
            const y = startY + (index * (barHeight + spacing));
            const barWidth = (skill.value / 100) * maxWidth;

            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(textOffset, y, maxWidth, barHeight);

            ctx.fillStyle = skill.color;
            ctx.fillRect(textOffset, y, barWidth, barHeight);

            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(skill.name, textOffset - 10, y + barHeight/2 + 5);

            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(skill.value + '%', textOffset + maxWidth + 10, y + barHeight/2 + 5);
        });
    }

    function handleMenuClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80, 
                behavior: 'smooth'
            });
            
            menuLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            history.pushState(null, null, targetId);
        }
    }

    function updateActiveMenu() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    function handleScroll() {
        checkMenuPosition();
        updateActiveMenu();
        backToTopButton.style.display = (window.pageYOffset > 300) ? 'block' : 'none';
    }

    function setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-section');

                    const delay = Array.from(document.querySelectorAll('section'))
                        .indexOf(entry.target) * 100;
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    function setupEventListeners() {
        window.addEventListener('scroll', handleScroll);

        menuLinks.forEach(link => {
            link.addEventListener('click', handleMenuClick);
        });

        if (backToTopButton) {
            backToTopButton.addEventListener('click', scrollToTop);
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    setupEventListeners();
    setupIntersectionObserver();
    drawHorizontalSkillsChart();
    checkMenuPosition();
});