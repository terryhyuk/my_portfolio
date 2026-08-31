import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // 이미 로그인된 상태라면 로그인 페이지 접근 차단 후 홈으로 이동
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
            
            // 토큰 저장
            localStorage.setItem('access_token', data.access_token);
            alert('로그인 성공!');
            navigate('/');
            window.location.reload(); // 상태 반영을 위한 새로고침
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
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function AdminLogin() {
//     const navigate = useNavigate();
//     const [userId, setUserId] = useState('');
//     const [password, setPassword] = useState('');

//     // Handle login submission
//     const handleLogin = (e) => {
//         e.preventDefault();
//         console.log("Login button clicked! Sending ID:", userId, "Password:", password);

//         fetch('https://my-portfolio-ganv.onrender.com/auth/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 user_id: Number(userId),
//                 password: password
//             }),
//         })
//             .then(async (res) => {
//                 console.log("Response status:", res.status);
//                 const data = await res.json();
//                 console.log("Response data:", data);

//                 if (!res.ok) {
//                     throw new Error(data.detail || 'Login failed');
//                 }
//                 return data;
//             })
//             .then((data) => {
//                 // Save access token to local storage
//                 localStorage.setItem('access_token', data.access_token);
//                 alert('Login successful!');
//                 navigate('/');
//             })
//             .catch((err) => {
//                 console.error('Login error details:', err);
//                 alert(`Login failed: ${err.message}`);
//             });
//     };

//     return (
//         <div style={{ maxWidth: '350px', margin: '100px auto', padding: '30px', border: '1px solid #000', fontFamily: 'sans-serif' }}>
//             <h2 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '18px' }}>ADMIN LOGIN</h2>

//             <form onSubmit={handleLogin}>
//                 {/* User ID input field (Changed to text to prevent number input bugs) */}
//                 <div style={{ marginBottom: '15px' }}>
//                     <input
//                         type="text"
//                         placeholder="ID"
//                         value={userId}
//                         onChange={(e) => setUserId(e.target.value)}
//                         style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc' }}
//                         required
//                     />
//                 </div>

//                 {/* Password input field */}
//                 <div style={{ marginBottom: '20px' }}>
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc' }}
//                         required
//                     />
//                 </div>

//                 {/* Action buttons (Login & Cancel) */}
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                     <button
//                         type="submit"
//                         style={{ flex: 1, padding: '10px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
//                     >
//                         Login
//                     </button>
//                     <button
//                         type="button"
//                         onClick={() => navigate('/')}
//                         style={{ flex: 1, padding: '10px', background: '#fff', color: '#000', border: '1px solid #000', cursor: 'pointer', fontWeight: 'bold' }}
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }