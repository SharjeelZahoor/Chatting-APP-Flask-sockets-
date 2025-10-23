$(document).ready(function() {
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();

        let email = $('#email').val();
        let password = $('#password').val();

        $.ajax({
            url: 'http://127.0.0.1:5000/api/auth/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email: email, password: password }),
            success: function(response) {
                // Save JWT token in localStorage
                localStorage.setItem('token', response.token);
                localStorage.setItem('user_id', response.user.id);
                localStorage.setItem('username', response.user.username);

                // Redirect to users list page
                window.location.href = '../users/users.html';
            },
            error: function(xhr) {
                let msg = xhr.responseJSON ? xhr.responseJSON.message : 'Login failed';
                $('#loginMessage').text(msg);
            }
        });
    });
});
