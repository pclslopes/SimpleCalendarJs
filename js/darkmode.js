document.addEventListener('DOMContentLoaded', function () {
    const htmlElement = document.documentElement;
    
    if(htmlElement.getAttribute('data-bs-theme') === 'auto'){
        function updateTheme(){
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            htmlElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
            
            const nav = document.querySelector('nav');
            const footer = document.querySelector('footer');
            if (nav) nav.classList.toggle('bg-light', !isDark);
            if (nav) nav.classList.toggle('bg-dark', isDark);
            if (footer) footer.classList.toggle('bg-light', !isDark);
            if (footer) footer.classList.toggle('bg-dark', isDark);
        }

        function toggleTheme(){
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-bs-theme', newTheme);
            
            const nav = document.querySelector('nav');
            const footer = document.querySelector('footer');
            if (nav) {
                nav.classList.toggle('bg-light');
                nav.classList.toggle('bg-dark');
            }
            if (footer) {
                footer.classList.toggle('bg-light');
                footer.classList.toggle('bg-dark');
            }
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
        updateTheme(); 
    }

    const modeToggle = document.querySelector('#mode-toggle');
    if (modeToggle) {
        modeToggle.addEventListener('click', () => {
            toggleTheme();
        });
    }

    // Calendar theme testing button
    const themeTestButton = document.querySelector('#calendar-theme-test');
    if (themeTestButton) {
        themeTestButton.addEventListener('click', function() {
            toggleTheme();
            
            // Update button text based on current theme
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const buttonText = currentTheme === 'dark' ? 
                '<i class="fas fa-sun"></i> Switch to Light Theme' : 
                '<i class="fas fa-moon"></i> Switch to Dark Theme';
            this.innerHTML = buttonText;
        });
    }

    // Initialize button text on page load
    window.addEventListener('load', function() {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const buttonText = currentTheme === 'dark' ? 
            '<i class="fas fa-sun"></i> Switch to Light Theme' : 
            '<i class="fas fa-moon"></i> Switch to Dark Theme';
        if (themeTestButton) {
            themeTestButton.innerHTML = buttonText;
        }
    });
});

