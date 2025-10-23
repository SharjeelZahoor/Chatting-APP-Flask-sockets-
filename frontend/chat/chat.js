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

    // ✅ Connect Socket.IO with token
    const socket = io('http://127.0.0.1:5000', {
        query: { token: token }
    });

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
    });

    // ✅ Receive message instantly
    socket.on('receive_message', function(data) {
        console.log('Message received:', data);
        
        // Check if the message is from the current user
        if (data.sender_id === sender_id) {
            // This is our own message, we already displayed it when sending
            return;
        }
        
        const messageHTML = `<div class="message receiver">${data.message}</div>`;
        $('#messages').append(messageHTML);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    // ✅ Load previous chat messages
    $.ajax({
        url: `http://127.0.0.1:5000/api/messages?receiver_id=${receiver_id}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(data) {
            $('#messages').empty();
            data.messages.forEach(msg => {
                const className = msg.sender_id == sender_id ? 'sender' : 'receiver';
                $('#messages').append(`<div class="message ${className}">${msg.message}</div>`);
            });
        },
        error: function(err) {
            console.error("Failed to load messages", err);
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


});