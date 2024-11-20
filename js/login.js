$(document).ready(function () {
    $('#magicLinkForm').on('submit', async (e) => {
        e.preventDefault();
        
        const email = $('#emailInput').val();
        console.log('email: ' + email);

        try {
            const { error } = await _supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin
                }
            });

            if (error) throw error;

            alert('Magic link sent! Check your email.');
            $('#authModal').modal('hide');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    $('#logoutButton').on('click', async (e) => {
        try {
            const {error} = await _supabase.auth.signOut();

            if(error) throw error;
            
            window.location = 'index.html';
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    $('#loginButton').on('click', function (e) {
        e.preventDefault();
        $('#authModal').modal('show');
        if(user.isLoggedIn){
            $('#authModalLabel').html('Logout');
            $('#emailInputLabel').html(user.useremail);
            $('#subMessage').html('You are logged in!');
            $('#emailInput').hide();
            $('#loginSubmit').hide();
            $('#logoutButton').show();
        }else{
            $('#emailInput').show();
            $('#loginSubmit').html('Login');
            $('#loginSubmit').show();
            $('#logoutButton').hide();
        }
    });

});