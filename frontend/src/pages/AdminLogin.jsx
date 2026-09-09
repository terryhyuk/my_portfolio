import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        console.log(`Login button clicked! Sending ID: ${userId} Password: ${password}`);

        try {
            const response = await fetch('https://my-portfolio-ganv.onrender.com/auth/login', {
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
                throw new Error('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
            }

            const data = await response.json();
            
            // save the access token to localStorage
            localStorage.setItem('access_token', data.access_token);
            alert('로그인 성공!');
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: Failed to fetch / Invalid credentials');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleLogin} style={{ border: '1px solid #000', padding: '40px', width: '350px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>ADMIN LOGIN</h2>
                <div style={{ marginBottom: '15px' }}>
                    <input 
                        type="number" 
                        placeholder="Admin ID" 
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1, padding: '10px', background: '#000', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Login</button>
                    <button type="button" onClick={() => navigate('/')} style={{ flex: 1, padding: '10px', background: '#fff', border: '1px solid #000', cursor: 'pointer' }}>Cancel</button>
                </div>
            </form>
        </div>
    );
}