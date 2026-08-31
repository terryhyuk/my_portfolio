import React from 'react';
import PortfolioCard from './PortfolioCard';

export default function ProjectsSection({ 
    portfolios, 
    loading, 
    isAdmin, 
    onNewPortfolio, 
    onEditPortfolio, 
    onDeletePortfolio 
}) {
    return (
        <section style={{ paddingBottom: '32px', borderBottom: '1px solid #eaeaea', marginBottom: '32px' }}>
            {/* Section Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#00875a', letterSpacing: '1px', textTransform: 'uppercase' }}>PORTFOLIO</span>
                    <h2 style={{ fontSize: '22px', margin: '4px 0 0 0', fontWeight: '700', color: '#111' }}>Projects</h2>
                </div>
                {isAdmin && (
                    <button 
                        onClick={onNewPortfolio}
                        style={{ 
                            padding: '8px 14px', 
                            background: '#000', 
                            color: '#fff', 
                            border: 'none', 
                            cursor: 'pointer', 
                            fontWeight: '600', 
                            fontSize: '12px',
                            borderRadius: '8px'
                        }}
                    >
                        + New Portfolio
                    </button>
                )}
            </div>

            {/* Content Body */}
            {loading ? (
                <p style={{ fontSize: '14px', color: '#888', padding: '20px 0' }}>Loading data...</p>
            ) : portfolios.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#888', padding: '20px 0' }}>No portfolios registered.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                    {portfolios.map((item) => (
                        <div key={item.number} style={{ 
                            border: '1px solid #eaeaea', 
                            borderRadius: '12px', 
                            padding: '20px', 
                            background: '#fff', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <PortfolioCard number={item.number} title={item.title} imageUrl={item.image_url} />
                            </div>
                            {isAdmin && (
                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f2f2f2' }}>
                                    <button 
                                        onClick={() => onEditPortfolio(item)} 
                                        style={{ flex: 1, padding: '8px 0', cursor: 'pointer', background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#333' }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => onDeletePortfolio(item.number)} 
                                        style={{ flex: 1, padding: '8px 0', background: '#fff1f0', color: '#ff4d4f', border: '1px solid #ffa39e', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}