import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Guestbook() {
    const navigate = useNavigate();

    // 1. State management for guestbook entries and input fields
    const [guestbooks, setGuestbooks] = useState([]);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    // 2. Fetch guestbook entries from the backend API (GET)
    const fetchGuestbooks = () => {
        fetch('https://my-portfolio-ganv.onrender.com/guestbook/')
            .then((res) => res.json())
            .then((data) => {
                setGuestbooks(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error loading guestbook:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchGuestbooks();
    }, []);

    // 3. Send a new guestbook entry to the backend on submit (POST)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !content) {
            alert('Please fill in both name and message!');
            return;
        }

        fetch('https://my-portfolio-ganv.onrender.com/guestbook/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, content }),
        })
            .then((res) => res.json())
            .then(() => {
                setName('');
                setContent('');
                fetchGuestbooks(); // Refresh the entry list
            })
            .catch((err) => console.error('Error creating guestbook entry:', err));
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <button
                onClick={() => navigate('/')}
                style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px' }}
            >
                ← Back to Home
            </button>

            <h2>✍️ Guestbook</h2>

            {/* Input Form */}
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <textarea
                        placeholder="Leave a message..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: '100%', padding: '10px', height: '80px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Submit
                </button>
            </form>

            {/* Entries List */}
            <h3>Entries</h3>
            {loading ? (
                <p>Loading...</p>
            ) : guestbooks.length === 0 ? (
                <p>Be the first to leave a guestbook entry!</p>
            ) : (
                guestbooks.map((item) => (
                    <div key={item.guest_id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{item.name}</div>
                        <p style={{ margin: '0 0 5px 0', color: '#333' }}>{item.content}</p>
                        {item.reply && (
                            <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '6px', marginTop: '5px', fontSize: '14px' }}>
                                └ <strong>Reply:</strong> {item.reply}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}