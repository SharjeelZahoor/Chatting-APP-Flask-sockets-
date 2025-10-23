$(document).ready(function() {
    const token = localStorage.getItem('token');
    const sender_id = localStorage.getItem('user_id'); // Our user
    const receiver_id = localStorage.getItem('receiver_id'); // Chat partner
    const receiver_name = localStorage.getItem('receiver_name');

    if (!token || !sender_id || !receiver_id) {
        alert("Please login and select a user to chat with.");
        window.location.href = '../login/login.html';
        return;
    }

    $('#chatWith').text(`Chat with ${receiver_name}`);

    // ✅ Connect to Socket.IO with token
    const socket = io('http://127.0.0.1:5000', {
        query: { token: token }
    });

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
    });

    // ✅ Receive new messages
    socket.on('receive_message', function(data) {
        console.log('Message received:', data);

        // Skip displaying own message again
        if (data.sender_id == sender_id) return;

        const messageHTML = `<div class="message receiver">${data.message}</div>`;
        $('#messages').append(messageHTML);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    // ✅ Load previous chat messages (history)
    $.ajax({
        url: `http://127.0.0.1:5000/api/messages?receiver_id=${receiver_id}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(data) {
            $('#messages').empty();
            if (data.messages && data.messages.length > 0) {
                data.messages.forEach(msg => {
                    const className = msg.sender_id == sender_id ? 'sender' : 'receiver';
                    $('#messages').append(`<div class="message ${className}">${msg.message}</div>`);
                });
                // Scroll to the bottom
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
            }
        },
        error: function(err) {
            console.error("Failed to load messages", err);
            alert("Failed to load chat history.");
        }
    });

    // ✅ Send message
    $('#chatForm').submit(function(e) {
        e.preventDefault();
        const message = $('#messageInput').val().trim();
        if (message === '') return;

        // Show message immediately for sender
        $('#messages').append(`<div class="message sender">${message}</div>`);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        $('#messageInput').val('');

        // Send message through socket
        socket.emit('send_message', {
            sender_id: sender_id,
            receiver_id: receiver_id,
            message: message
        });
    });

    $('#logoutBtn').on('click', function () {
    if (confirm('Are you sure you want to logout?')) {
        const token = localStorage.getItem('token');

        fetch('http://127.0.0.1:5000/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(() => {
            localStorage.clear();
            socket.disconnect();  // Disconnect socket
            window.location.href = '../login/login.html';
        })
        .catch(err => {
            console.error("❌ Logout failed:", err);
            alert("Error logging out!");
        });
    }
});

});
