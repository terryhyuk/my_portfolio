import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Guestbook() {
    const navigate = useNavigate();

    // 1. State management for guestbook entries, input fields, and user password
    const [guestbooks, setGuestbooks] = useState([]);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [userPw, setUserPw] = useState('');
    const [loading, setLoading] = useState(true);

    // Edit state for specific entry
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editUserPw, setEditUserPw] = useState('');

    // Check if user is logged in as admin
    const isAdmin = !!localStorage.getItem('access_token');

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

    // 3. Send a new guestbook entry with user_pw to the backend on submit (POST)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !content || !userPw) {
            alert('Please fill in name, message, and password!');
            return;
        }

        fetch('https://my-portfolio-ganv.onrender.com/guestbook/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, content, user_pw: userPw }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to create entry');
                return res.json();
            })
            .then(() => {
                setName('');
                setContent('');
                setUserPw('');
                fetchGuestbooks();
            })
            .catch((err) => console.error('Error creating guestbook entry:', err));
    };

    // 4. Handle Delete (Admin Only, requires JWT)
    const handleDelete = (guestId) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) return;

        const token = localStorage.getItem('access_token');
        fetch(`https://my-portfolio-ganv.onrender.com/guestbook/${guestId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to delete');
                fetchGuestbooks();
            })
            .catch((err) => {
                console.error('Error deleting guestbook:', err);
                alert('Failed to delete entry.');
            });
    };

    // 5. Handle Update (Author verification via user_pw)
    const handleUpdate = (guestId) => {
        if (!editContent || !editUserPw) {
            alert('Please enter your message and password to update!');
            return;
        }

        fetch(`https://my-portfolio-ganv.onrender.com/guestbook/${guestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_pw: editUserPw, content: editContent }),
        })
            .then((res) => {
                if (!res.ok) {
                    if (res.status === 403) throw new Error('Incorrect password.');
                    throw new Error('Failed to update');
                }
                return res.json();
            })
            .then(() => {
                setEditingId(null);
                setEditContent('');
                setEditUserPw('');
                fetchGuestbooks();
                alert('Successfully updated!');
            })
            .catch((err) => {
                console.error('Error updating guestbook:', err);
                alert(err.message === 'Incorrect password.' ? 'Incorrect password!' : 'Failed to update entry.');
            });
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', fontFamily: 'sans-serif' }}>
            <button
                onClick={() => navigate('/')}
                style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px', background: '#f0f0f0', border: 'none', borderRadius: '6px', fontWeight: '600' }}
            >
                ← Back to Home
            </button>

            <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>✍️ Guestbook</h2>

            {/* Input Form with user_pw Field */}
            <form onSubmit={handleSubmit} style={{ border: '1px solid #eaeaea', padding: '24px', borderRadius: '12px', marginBottom: '40px', background: '#fff' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ flex: 1, padding: '12px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={userPw}
                        onChange={(e) => setUserPw(e.target.value)}
                        style={{ flex: 1, padding: '12px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                    />
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <textarea
                        placeholder="Leave a message..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: '100%', padding: '12px', height: '100px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                    Submit
                </button>
            </form>

            {/* Entries List */}
            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Entries</h3>
            {loading ? (
                <p style={{ color: '#888' }}>Loading...</p>
            ) : guestbooks.length === 0 ? (
                <p style={{ color: '#888' }}>Be the first to leave a guestbook entry!</p>
            ) : (
                guestbooks.map((item) => (
                    <div key={item.guest_id} style={{ borderBottom: '1px solid #eaeaea', padding: '20px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{item.name}</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {/* Edit Button for Author */}
                                <button
                                    onClick={() => {
                                        if (editingId === item.guest_id) {
                                            setEditingId(null);
                                        } else {
                                            setEditingId(item.guest_id);
                                            setEditContent(item.content);
                                            setEditUserPw('');
                                        }
                                    }}
                                    style={{ fontSize: '12px', padding: '4px 8px', background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    {editingId === item.guest_id ? 'Cancel' : 'Edit'}
                                </button>

                                {/* Delete Button - Admin Only */}
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDelete(item.guest_id)}
                                        style={{ fontSize: '12px', padding: '4px 8px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Edit Mode / Normal Mode Toggle */}
                        {editingId === item.guest_id ? (
                            <div style={{ marginTop: '10px', padding: '12px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    style={{ width: '100%', padding: '8px', height: '80px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '8px', fontSize: '14px' }}
                                />
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                        type="password"
                                        placeholder="Enter password to confirm"
                                        value={editUserPw}
                                        onChange={(e) => setEditUserPw(e.target.value)}
                                        style={{ padding: '8px', flex: 1, border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
                                    />
                                    <button
                                        onClick={() => handleUpdate(item.guest_id)}
                                        style={{ padding: '8px 16px', background: '#00875a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p style={{ margin: '0 0 10px 0', color: '#333', lineHeight: '1.6' }}>{item.content}</p>
                        )}

                        {item.reply && (
                            <div style={{ background: '#f4f6f5', padding: '12px', borderRadius: '8px', marginTop: '10px', fontSize: '14px', color: '#00875a' }}>
                                └ <strong>Reply:</strong> {item.reply}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}