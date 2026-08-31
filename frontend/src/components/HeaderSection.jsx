import React from 'react';
import AdminHeader from './AdminHeader';

export default function HeaderSection({ visitCount, onTitleClick }) {
    return (
        <div>
            {/* Admin status banner */}
            <AdminHeader />

            {/* Visit counter badge */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <div style={{ 
                    padding: '6px 12px', 
                    background: '#f4f6f5', 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    borderRadius: '8px',
                    color: '#00875a'
                }}>
                    👀 Visitors: {visitCount}
                </div>
            </div>

            {/* Main Title Header */}
            <header style={{ paddingBottom: '32px', borderBottom: '1px solid #eaeaea', marginBottom: '32px' }}>
                <h1 
                    onClick={onTitleClick} 
                    style={{ margin: 0, cursor: 'pointer', userSelect: 'none', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}
                >
                    TERRY YOON
                </h1>
                <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#666', fontWeight: '500', letterSpacing: '0.5px' }}>
                    DEVELOPER & DESIGNER OF DIGITAL UTILITIES.
                </p>
            </header>
        </div>
    );
}