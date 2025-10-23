$(document).ready(function() {
    const token = localStorage.getItem('token'); // JWT token stored after login
    const currentUserId = parseInt(localStorage.getItem('user_id')); // Logged-in user ID

    if (!token || !currentUserId) {
        alert("Please login first!");
        window.location.href = '../login/login.html';
        return;
    }

    console.log("Fetching all users...");

    // Fetch all users from backend
    $.ajax({
        url: 'http://127.0.0.1:5000/api/users',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        success: function(data) {
            console.log("Users data received:", data);

            if (!data.users || data.users.length === 0) {
                $('#message').text("No other users found.");
                return;
            }

            $('#user-list').empty();
            data.users.forEach(user => {
                if (user.id !== currentUserId) { // Don't show self
                    const status = user.is_online ? "(Online)" : "(Offline)";
                    $('#user-list').append(`<li data-id="${user.id}">${user.username} ${status}</li>`);
                }
            });
        },
        error: function(err) {
            console.error("Failed to fetch users:", err);
            let msg = err.responseJSON ? err.responseJSON.message : "Failed to fetch users!";
            $('#message').text(msg);
        }
    });

    // Click on user to start chat
    $(document).on('click', '#user-list li', function() {
        const receiverId = $(this).data('id');
        const receiverName = $(this).text();
        localStorage.setItem('receiver_id', receiverId);
        localStorage.setItem('receiver_name', receiverName);
        window.location.href = '../chat/chat.html'; // Redirect to chat page
    });
});
