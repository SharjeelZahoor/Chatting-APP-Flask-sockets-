$(document).ready(function() {
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();

        let username = $('#username').val();
        let email = $('#email').val();
        let password = $('#password').val();

        $.ajax({
            url: 'http://127.0.0.1:5000/api/auth/register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: username, email: email, password: password }),
            success: function(response) {
                $('#registerMessage').css('color', 'green').text(response.message);

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = '../login/login.html';
                }, 2000);
            },
            error: function(xhr) {
                let msg = xhr.responseJSON ? xhr.responseJSON.message : 'Registration failed';
                $('#registerMessage').css('color', 'red').text(msg);
            }
        });
    });
});
