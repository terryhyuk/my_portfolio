import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PortfolioCard({ number, title, imageUrl, skill }) {
    const navigate = useNavigate();

    // Split the skill string by comma into an array and filter out empty values
    const skillList = skill ? skill.split(',').map(s => s.trim()).filter(Boolean) : [];

    return (
        <div 
            onClick={() => navigate(`/portfolio/${number}`)}
            style={{ 
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                cursor: 'pointer'
            }}
        >
            {/* Icon and Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: skillList.length > 0 ? '10px' : '0' }}>
                <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: '#eee', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0
                }}>
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: '20px' }}>📱</span>
                    )}
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111' }}>{title}</h3>
            </div>

            {/* Skill Tags */}
            {skillList.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '4px' }}>
                    {skillList.map((tech, idx) => (
                        <span key={idx} style={{ 
                            fontSize: '11px', 
                            background: '#f1f3f5', 
                            color: '#495057', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            fontWeight: '500'
                        }}>
                            {tech}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}