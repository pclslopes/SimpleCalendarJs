$(document).ready(function () {
    if($('html').attr('data-bs-theme') === 'auto'){
        function updateTheme(){
            $('html').attr('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            $('nav').toggleClass("bg-light bg-dark");
            $('footer').toggleClass("bg-light bg-dark");
        }

        function toggleTheme(){
            if ($('html').attr('data-bs-theme') === 'dark') {
                $('html').attr('data-bs-theme','light')
            }
            else {
                $('html').attr('data-bs-theme','dark')
            }
            $('nav').toggleClass("bg-light bg-dark");
            $('footer').toggleClass("bg-light bg-dark");
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
        updateTheme(); 
    }

    $('#mode-toggle').on('click',()=>{
        toggleTheme();
    });

    // Calendar theme testing button
    $('#calendar-theme-test').on('click', function() {
        toggleTheme();
        
        // Update button text based on current theme
        const currentTheme = $('html').attr('data-bs-theme');
        const buttonText = currentTheme === 'dark' ? 
            '<i class="fas fa-sun"></i> Switch to Light Theme' : 
            '<i class="fas fa-moon"></i> Switch to Dark Theme';
        $(this).html(buttonText);
    });

    // Initialize button text on page load
    $(window).on('load', function() {
        const currentTheme = $('html').attr('data-bs-theme');
        const buttonText = currentTheme === 'dark' ? 
            '<i class="fas fa-sun"></i> Switch to Light Theme' : 
            '<i class="fas fa-moon"></i> Switch to Dark Theme';
        $('#calendar-theme-test').html(buttonText);
    });
});

