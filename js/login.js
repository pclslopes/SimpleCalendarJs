//const authModal = new bootstrap.Modal(document.getElementById('authModal'));

        document.getElementById('magicLinkForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('emailInput').value;

            try {
                const { error } = await _supabase.auth.signInWithOtp({
                    email,
                    options: {
                        emailRedirectTo: window.location.origin
                    }
                });

                if (error) throw error;

                alert('Magic link sent! Check your email.');
                $('#authModal').hide();
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });