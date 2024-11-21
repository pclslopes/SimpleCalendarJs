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
});

