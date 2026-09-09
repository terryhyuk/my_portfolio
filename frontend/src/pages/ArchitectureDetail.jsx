import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ArchitectureDetail() {
    const navigate = useNavigate();
    const [aboutWeb, setAboutWeb] = useState({ about_this_web: '', architecture: '', about_this_web_img: '', skill: '' });
    const [loading, setLoading] = useState(true);
    const [modalImage, setModalImage] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch('https://my-portfolio-ganv.onrender.com/user/about-web')
            .then((res) => res.json())
            .then((data) => {
                setAboutWeb(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('About web fetch error:', err);
                setLoading(false);
            });
    }, []);

    let parsedContent = {};
    try {
        parsedContent = aboutWeb.about_this_web ? JSON.parse(aboutWeb.about_this_web) : {};
    } catch (e) {
        parsedContent = { whyBuilt: aboutWeb.about_this_web || "" };
    }

    // Split skill string into an array
    const skillList = aboutWeb.skill ? aboutWeb.skill.split(',').map(s => s.trim()).filter(Boolean) : [];

    if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', fontFamily: 'sans-serif', background: '#fafbfc', minHeight: '100vh' }}>
            <button
                onClick={() => navigate('/')}
                style={{ marginBottom: '24px', cursor: 'pointer', padding: '8px 16px', background: '#f0f0f0', border: 'none', borderRadius: '6px', fontWeight: '600' }}
            >
                ← Back to Home
            </button>

            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#111' }}>Web Architecture & System Design</h1>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>Detailed technical breakdown of how this portfolio website was planned, structured, and built.</p>

            {/* Tech Stack Badges */}
            {skillList.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '32px' }}>
                    {skillList.map((tech, idx) => (
                        <span key={idx} style={{ 
                            fontSize: '12px', 
                            background: '#e9ecef', 
                            color: '#343a40', 
                            padding: '4px 10px', 
                            borderRadius: '6px',
                            fontWeight: '600'
                        }}>
                            {tech}
                        </span>
                    ))}
                </div>
            )}

            {/* Diagram Image Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '16px', background: '#fff' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#00875a', display: 'block', marginBottom: '10px' }}>DATA SCHEMA (ERD) - Click to enlarge</span>
                    {aboutWeb.about_this_web_img ? (
                        <img 
                            src={aboutWeb.about_this_web_img} 
                            alt="ERD Schema" 
                            onClick={() => setModalImage(aboutWeb.about_this_web_img)}
                            style={{ width: '100%', borderRadius: '8px', display: 'block', objectFit: 'contain', cursor: 'pointer', transition: 'opacity 0.2s' }} 
                            title="Click to zoom"
                        />
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#888', fontSize: '13px' }}>No ERD image uploaded.</div>
                    )}
                </div>

                <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '16px', background: '#fff' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#00875a', display: 'block', marginBottom: '10px' }}>SYSTEM LAYOUT (Architecture) - Click to enlarge</span>
                    {aboutWeb.architecture ? (
                        <img 
                            src={aboutWeb.architecture} 
                            alt="Architecture Diagram" 
                            onClick={() => setModalImage(aboutWeb.architecture)}
                            style={{ width: '100%', borderRadius: '8px', display: 'block', objectFit: 'contain', cursor: 'pointer', transition: 'opacity 0.2s' }} 
                            title="Click to zoom"
                        />
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#888', fontSize: '13px' }}>No Architecture image uploaded.</div>
                    )}
                </div>
            </div>

            {/* Detail Content */}
            <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '32px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {parsedContent.whyBuilt && (
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: '#111' }}>Why I Built This Website</h3>
                        <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line' }}>{parsedContent.whyBuilt}</p>
                    </div>
                )}
                {parsedContent.whyReact && (
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: '#111' }}>Why React?</h3>
                        <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line' }}>{parsedContent.whyReact}</p>
                    </div>
                )}
                {parsedContent.whyBackend && (
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: '#111' }}>Why Backend and Database?</h3>
                        <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line' }}>{parsedContent.whyBackend}</p>
                    </div>
                )}
                {parsedContent.databaseStorage && (
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: '#111' }}>Database and Storage</h3>
                        <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line' }}>{parsedContent.databaseStorage}</p>
                    </div>
                )}
                {parsedContent.adminAccess && (
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0', color: '#111' }}>Admin Access</h3>
                        <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line' }}>{parsedContent.adminAccess}</p>
                    </div>
                )}
            </div>

            {modalImage && (
                <div 
                    onClick={() => setModalImage(null)}
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
                        padding: '20px', boxSizing: 'border-box', cursor: 'zoom-out'
                    }}
                >
                    <img 
                        src={modalImage} 
                        alt="Enlarged view" 
                        style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain', borderRadius: '8px', background: '#fff', padding: '10px' }} 
                    />
                </div>
            )}
        </div>
    );
}