//const authModal = new bootstrap.Modal(document.getElementById('authModal'));
$(document).ready(function () {
    $('#magicLinkForm').on('submit', async (e) => {
        e.preventDefault();
        if(user.isLoggedIn){
            const {error} = await _supabase.auth.signout();

            if(error) throw error;
            
            window.location = 'index.html';
        }else{

            const email = $('#emailInput').value;

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
            $('#loginSubmit').html('Logout');
        }else{
            $('#emailInput').show();
            $('#loginSubmit').html('Login');
        }
    });

});