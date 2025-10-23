$(document).ready(function() {
    const token = localStorage.getItem('token');
    const sender_id = localStorage.getItem('user_id');
    const receiver_id = localStorage.getItem('receiver_id');
    const receiver_name = localStorage.getItem('receiver_name');

    if (!token || !sender_id || !receiver_id) {
        alert("Please login and select a user to chat with.");
        window.location.href = '../login/login.html';
        return;
    }

    $('#chatWith').text(`Chat with ${receiver_name}`);

    // Connect to Socket.IO
    const socket = io('http://127.0.0.1:5000', { query: { token: token } });

    socket.on('connect', () => console.log('Socket connected:', socket.id));

    // Track messages to avoid duplicates
    const loadedMessages = new Set();

    // Receive messages
    socket.on('receive_message', function(data) {
        if ((data.sender_id == sender_id && data.receiver_id == receiver_id) ||
            (data.sender_id == receiver_id && data.receiver_id == sender_id)) {

            const msgKey = `${data.sender_id}_${data.receiver_id}_${data.message}_${data.timestamp || Date.now()}`;
            if (loadedMessages.has(msgKey)) return;
            loadedMessages.add(msgKey);

            const className = data.sender_id == sender_id ? 'sender' : 'receiver';
            $('#messages').append(`<div class="message ${className}">${data.message}</div>`);
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
        }
    });

    // Load chat history
    function loadChatHistory() {
        $.ajax({
            url: `http://127.0.0.1:5000/api/messages?receiver_id=${receiver_id}`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            success: function(data) {
                if (data.messages) {
                    data.messages.forEach(msg => {
                        const msgKey = `${msg.sender_id}_${msg.receiver_id}_${msg.message}_${msg.timestamp}`;
                        if (loadedMessages.has(msgKey)) return;
                        loadedMessages.add(msgKey);

                        const className = msg.sender_id == sender_id ? 'sender' : 'receiver';
                        $('#messages').append(`<div class="message ${className}">${msg.message}</div>`);
                    });
                    $('#messages').scrollTop($('#messages')[0].scrollHeight);
                }
            },
            error: function(err) { console.error("Failed to load messages", err); }
        });
    }

    loadChatHistory();
    setInterval(loadChatHistory, 5000); // Optional periodic check

    // Send message
    $('#chatForm').submit(function(e) {
        e.preventDefault();
        const message = $('#messageInput').val().trim();
        if (message === '') return;

        // Send through socket only
        socket.emit('send_message', {
            sender_id: sender_id,
            receiver_id: receiver_id,
            message: message
        });

        $('#messageInput').val('');
    });

    // Logout
    $('#logoutBtn').on('click', function () {
        if (!confirm('Are you sure you want to logout?')) return;

        fetch('http://127.0.0.1:5000/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(() => {
            localStorage.clear();
            socket.disconnect();
            window.location.href = '../login/login.html';
        })
        .catch(err => { console.error("Logout failed:", err); alert("Error logging out!"); });
    });
});
