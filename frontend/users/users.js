// users.js
 $(document).ready(function () {
    const token = localStorage.getItem('token');
    const currentUserId = parseInt(localStorage.getItem('user_id'));

    console.log("Token:", token);
    console.log("Current User ID:", currentUserId);

    // ✅ Redirect to login if missing credentials
    if (!token || !currentUserId) {
        alert("Please login first!");
        window.location.href = '../login/login.html';
        return;
    }

    console.log("Fetching all users...");

    // ✅ Connect to Socket.IO with JWT
    const socket = io('http://127.0.0.1:5000', {
        query: { token: token }
    });

    socket.on('connect', () => {
        console.log('✅ Connected to socket server');
    });

    socket.on('disconnect', () => {
        console.log('⚠️ Disconnected from socket server');
    });

    // ✅ Listen for live user status updates
    socket.on('user_status_update', function (data) {
        console.log('📡 Status update received:', data);
        const { user_id, status } = data;

        // Update the specific user's status dynamically
        const userElement = $(`#user-list li[data-id="${user_id}"]`);
        if (userElement.length) {
            userElement.removeClass('online offline').addClass(status);
        }
    });

    // ✅ Fetch all users from backend
    $.ajax({
        url: 'http://127.0.0.1:5000/api/users',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (data) {
            console.log("✅ Users data received:", data);
            console.log("Users array:", data.users);
            console.log("Users array length:", data.users ? data.users.length : 0);

            if (!data.users || data.users.length === 0) {
                $('#message').text("No users found.");
                return;
            }

            $('#user-list').empty();
            data.users.forEach(user => {
                console.log("Processing user:", user);
                if (user.id !== currentUserId) {
                    const userClass = user.status === 'online' ? 'online' : 'offline';
                    $('#user-list').append(`
                        <li class="${userClass}" data-id="${user.id}">
                            ${user.username}
                        </li>
                    `);
                }
            });
        },
        error: function (err) {
            console.error("❌ Failed to fetch users:", err);
            console.error("Status code:", err.status);
            console.error("Response text:", err.responseText);
            const msg = err.responseJSON ? err.responseJSON.message : "Error fetching users!";
            $('#message').text(msg);
        }
    });

    // ✅ Click on user to open chat
    $(document).on('click', '#user-list li', function () {
        const receiverId = $(this).data('id');
        const receiverName = $(this).text();
        localStorage.setItem('receiver_id', receiverId);
        localStorage.setItem('receiver_name', receiverName);
        window.location.href = '../chat/chat.html';
    });



});