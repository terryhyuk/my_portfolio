import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PortfolioCard({ number, title, imageUrl }) {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate(`/portfolio/${number}`)}
            style={{ 
                border: '1px solid #ccc', 
                padding: '15px 20px', 
                marginBottom: '10px', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                cursor: 'pointer',
                background: '#fff',
                transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#000'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#ccc'}
        >
            <div style={{ 
                width: '40px', 
                height: '40px', 
                background: '#eee', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                {imageUrl ? (
                    <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <span style={{ fontSize: '20px' }}>📱</span>
                )}
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{title}</h3>
        </div>
    );
}