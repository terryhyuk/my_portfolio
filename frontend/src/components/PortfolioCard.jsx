import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PortfolioCard({ number, title }) {
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
            {/* 앱 아이콘 자리 */}
            <div style={{ 
                width: '40px', 
                height: '40px', 
                background: '#eee', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
            }}>
                📱
            </div>
            {/* 앱 이름 */}
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{title}</h3>
        </div>
    );
}
// export default function PortfolioCard({ title, story, link }) {
//     return (
//         <div style={{ border: '1px dashed #ccc', padding: '15px', marginBottom: '10px' }}>
//             <h3 style={{ margin: '0 0 5px 0' }}>{title}</h3>
//             <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{story}</p>
//             {link && (
//                 <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#0066cc' }}>
//                     [Store Link]
//                 </a>
//             )}
//         </div>
//     );
// }