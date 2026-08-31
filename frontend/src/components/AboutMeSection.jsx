import React from 'react';

export default function AboutMeSection({
    aboutMeText,
    editAboutMeText,
    setEditAboutMeText,
    isEditingAboutMe,
    setIsEditingAboutMe,
    isAdmin,
    onSave
}) {
    return (
        <section style={{ paddingBottom: '32px', borderBottom: '1px solid #eaeaea', marginBottom: '32px' }}>
            {/* Section Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#00875a', letterSpacing: '1px', textTransform: 'uppercase' }}>INTRODUCTION</span>
                    <h2 style={{ fontSize: '22px', margin: '4px 0 0 0', fontWeight: '700', color: '#111' }}>About Me</h2>
                </div>
                {isAdmin && !isEditingAboutMe && (
                    <button 
                        onClick={() => { setIsEditingAboutMe(true); setEditAboutMeText(aboutMeText); }} 
                        style={{ padding: '8px 14px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                    >
                        Edit
                    </button>
                )}
            </div>

            {isEditingAboutMe ? (
                <div>
                    <textarea 
                        value={editAboutMeText} 
                        onChange={(e) => setEditAboutMeText(e.target.value)} 
                        style={{ width: '100%', height: '100px', padding: '12px', fontSize: '13px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', marginBottom: '12px', resize: 'vertical', fontFamily: 'sans-serif' }} 
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setIsEditingAboutMe(false)} style={{ padding: '8px 14px', background: '#e0e0e0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Cancel</button>
                        <button onClick={onSave} style={{ padding: '8px 14px', background: '#00875a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Save</button>
                    </div>
                </div>
            ) : (
                <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line' }}>
                    {aboutMeText || "소개글이 아직 작성되지 않았습니다."}
                </p>
            )}
        </section>
    );
}