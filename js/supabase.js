const user = {
    isLoggedIn: false,
    access_token: null,
    username: null,
    useremail: null
};

const { createClient } = supabase
const _supabase = createClient('https://cznwtzffiumbdivohifm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bnd0emZmaXVtYmRpdm9oaWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMDc5NDYsImV4cCI6MjA0NzY4Mzk0Nn0.gFcY2dsFGdgPbVmsknLeEO0jRxO8QJQpbWZ8anGJp34')

console.log('Supabase Instance: ', _supabase)

const { data } = _supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session)
    
    if (event === 'INITIAL_SESSION') {
        // handle initial session
    } else if (event === 'SIGNED_IN') {
        // handle sign in event
        user.isLoggedIn = session !== null;
        user.access_token = session?.access_token || null;
        user.username= session?.user?.user_metadata?.name || null;
        user.useremail = session?.user?.email || null;


        
    } else if (event === 'SIGNED_OUT') {
        // handle sign out event
    } else if (event === 'PASSWORD_RECOVERY') {
        // handle password recovery event
    } else if (event === 'TOKEN_REFRESHED') {
        // handle token refreshed event
    } else if (event === 'USER_UPDATED') {
        // handle user updated event
    }
});


async function registerUser(email, password){
    const { data, error } = await _supabase.auth.signUp({
        email,
        password,
    });
}

async function signInUser(email, password){
    return await _supabase.auth.signInWithPassword({
        email,
        password,
    });
}

async function signInWithEmail(email) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: false,
        emailRedirectTo: 'https://simplecalendarJs.com/',
      },
    })
  }

  async function logoutFromSupabase() {
    try {
        const { error } = await _supabase.auth.signOut();
        
        if (error) {
            console.error('Logout error:', error.message);
            return false;
        }
        
        // Optional: Additional logout handling
        console.log('Logged out successfully');
        return true;
    } catch (err) {
        console.error('Unexpected logout error:', err);
        return false;
    }
}
