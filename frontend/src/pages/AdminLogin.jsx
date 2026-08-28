import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Redirect to home if already authenticated
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        
        console.log(`Login button clicked! Sending ID: ${userId} Password: ${password}`);

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: Number(userId),
                    password: password
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed: Please check your ID or password.');
            }

            const data = await response.json();
            
            // Save access token to local storage and redirect
            localStorage.setItem('access_token', data.access_token);
            alert('Login successful!');
            navigate('/');
            window.location.reload(); // Refresh to apply authentication state across components
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: Failed to fetch / Invalid credentials');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
            <form onSubmit={handleLogin} style={{ border: '1px solid #000', padding: '40px', width: '350px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '18px' }}>ADMIN LOGIN</h2>
                
                {/* User ID input field */}
                <div style={{ marginBottom: '15px' }}>
                    <input 
                        type="number" 
                        placeholder="Admin ID" 
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc' }}
                        required
                    />
                </div>

                {/* Password input field */}
                <div style={{ marginBottom: '20px' }}>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc' }}
                        required
                    />
                </div>

                {/* Submit and Cancel action buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        type="submit" 
                        style={{ flex: 1, padding: '10px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Login
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate('/')} 
                        style={{ flex: 1, padding: '10px', background: '#fff', color: '#000', border: '1px solid #000', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}