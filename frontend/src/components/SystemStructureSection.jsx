import React from 'react';

export default function SystemStructureSection({
    aboutWeb,
    isEditingAboutWeb,
    setIsEditingAboutWeb,
    isAdmin,
    erdFile,
    setErdFile,
    archFile,
    setArchFile,
    editAboutText,
    setEditAboutText,
    uploading,
    onSave
}) {
    return (
        <section style={{ paddingBottom: '32px', borderBottom: '1px solid #eaeaea', marginBottom: '32px' }}>
            {/* Section Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#00875a', letterSpacing: '1px', textTransform: 'uppercase' }}>ARCHITECTURE</span>
                    <h2 style={{ fontSize: '22px', margin: '4px 0 0 0', fontWeight: '700', color: '#111' }}>About this web</h2>
                </div>
                {isAdmin && !isEditingAboutWeb && (
                    <button 
                        onClick={() => setIsEditingAboutWeb(true)} 
                        style={{ 
                            padding: '8px 14px', 
                            background: '#000', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '8px', 
                            cursor: 'pointer', 
                            fontSize: '12px', 
                            fontWeight: '600'
                        }}
                    >
                        Edit Section
                    </button>
                )}
            </div>

            {isEditingAboutWeb ? (
                /* Edit Mode Form */
                <div style={{ background: '#fafbfc', border: '1px solid #00875a', borderRadius: '12px', padding: '24px' }}>
                    <h3 style={{ fontSize: '15px', marginBottom: '16px', color: '#00875a', fontWeight: '700' }}>✏️ Upload System Structure Images & Note</h3>
                    
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#444' }}>ERD Image File</label>
                        <input type="file" accept="image/*" onChange={(e) => setErdFile(e.target.files[0])} style={{ width: '100%', fontSize: '13px' }} />
                        {erdFile && <span style={{ fontSize: '12px', color: '#00875a', marginTop: '4px', display: 'block' }}>Selected: {erdFile.name}</span>}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#444' }}>Architecture Image File</label>
                        <input type="file" accept="image/*" onChange={(e) => setArchFile(e.target.files[0])} style={{ width: '100%', fontSize: '13px' }} />
                        {archFile && <span style={{ fontSize: '12px', color: '#00875a', marginTop: '4px', display: 'block' }}>Selected: {archFile.name}</span>}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#444' }}>Side Description Note</label>
                        <textarea 
                            value={editAboutText} 
                            onChange={(e) => setEditAboutText(e.target.value)} 
                            style={{ width: '100%', height: '100px', padding: '10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box', fontFamily: 'sans-serif', resize: 'vertical' }} 
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setIsEditingAboutWeb(false)} disabled={uploading} style={{ padding: '8px 14px', background: '#e0e0e0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Cancel</button>
                        <button onClick={onSave} disabled={uploading} style={{ padding: '8px 14px', background: '#00875a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                            {uploading ? 'Uploading...' : 'Save All'}
                        </button>
                    </div>
                </div>
            ) : (
                /* View Mode */
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '16px', background: '#fff' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#00875a', display: 'block', marginBottom: '10px' }}>DATA SCHEMA (ERD)</span>
                            {aboutWeb.about_this_web_img ? (
                                <img src={aboutWeb.about_this_web_img} alt="ERD Schema" style={{ width: '100%', borderRadius: '8px', display: 'block', objectFit: 'contain' }} />
                            ) : (
                                <div style={{ padding: '30px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#888', fontSize: '13px' }}>No ERD image uploaded yet.</div>
                            )}
                        </div>

                        <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '16px', background: '#fff' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#00875a', display: 'block', marginBottom: '10px' }}>SYSTEM LAYOUT (Architecture)</span>
                            {aboutWeb.architecture ? (
                                <img src={aboutWeb.architecture} alt="Architecture Diagram" style={{ width: '100%', borderRadius: '8px', display: 'block', objectFit: 'contain' }} />
                            ) : (
                                <div style={{ padding: '30px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#888', fontSize: '13px' }}>No Architecture image uploaded yet.</div>
                            )}
                        </div>
                    </div>

                    <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px', background: '#fff', height: '100%', boxSizing: 'border-box' }}>
                        <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line' }}>
                            {aboutWeb.about_this_web || "설명이 아직 작성되지 않았습니다."}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}