import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminHeader() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('access_token');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        alert('로그아웃 되었습니다.');
        navigate('/');
        window.location.reload();
    };

    // 로그인된 상태가 아니면 우측 상단에 아무것도 띄우지 않음 (방문자 수 자리를 지켜야 하니까!)
    if (!isLoggedIn) {
        return null;
    }

    return (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, display: 'flex', gap: '10px' }}>
            <button 
                onClick={handleLogout} 
                style={{ padding: '8px 16px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
                로그아웃
            </button>
        </div>
    );
}