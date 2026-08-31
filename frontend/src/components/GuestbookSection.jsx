import React from 'react';

export default function GuestbookSection({ onNavigateGuestbook }) {
    return (
        <section style={{ paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#00875a', letterSpacing: '1px', textTransform: 'uppercase' }}>COMMUNITY</span>
                <h2 style={{ fontSize: '22px', margin: '4px 0 4px 0', fontWeight: '700', color: '#111' }}>Guestbook</h2>
                <p style={{ fontSize: '13px', color: '#666', margin: 0, fontWeight: '500' }}>Thanks for visiting! Leave a short memo and your name.</p>
            </div>

            <div
                style={{
                    padding: '20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: '#f4f6f5',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#00875a',
                    boxShadow: 'inset 0 0 0 1px rgba(0,135,90,0.15)'
                }}
                onClick={onNavigateGuestbook}
            >
                ✍️ Go to Guestbook
            </div>
        </section>
    );
}