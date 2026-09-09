import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export default function PortfolioModal({ isOpen, onClose, onSuccess, editData }) {
    const isEditMode = !!editData;

    const [title, setTitle] = useState('');
    const [story, setStory] = useState('');
    const [iosLink, setIosLink] = useState('');
    const [androidLink, setAndroidLink] = useState('');
    
    // 스킬 관리용 상태 (입력 중인 단일 값 + 추가된 스킬 배열)
    const [skillInput, setSkillInput] = useState('');
    const [skillsArray, setSkillsArray] = useState([]);

    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (editData) {
            setTitle(editData.title || '');
            setStory(editData.story || '');
            setIosLink(editData.ios_link || '');
            setAndroidLink(editData.android_link || '');
            
            if (editData.skill) {
                setSkillsArray(editData.skill.split(',').map(s => s.trim()).filter(Boolean));
            } else {
                setSkillsArray([]);
            }
            
            setSkillInput('');
            setImageFile(null);
        } else {
            setTitle('');
            setStory('');
            setIosLink('');
            setAndroidLink('');
            setSkillsArray([]);
            setSkillInput('');
            setImageFile(null);
        }
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const handleAddSkill = () => {
        if (!skillInput.trim()) return;
        const trimmed = skillInput.trim();
        if (!skillsArray.includes(trimmed)) {
            setSkillsArray([...skillsArray, trimmed]);
        }
        setSkillInput('');
    };

    const handleRemoveSkill = (indexToRemove) => {
        setSkillsArray(skillsArray.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = editData ? editData.image_url : '';
            const token = localStorage.getItem('access_token');

            if (imageFile) {
                const uniqueFileName = `${Date.now()}_${imageFile.name}`;
                const storageRef = ref(storage, `portfolio_icons/${uniqueFileName}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            const combinedSkillString = skillsArray.join(', ');

            const url = isEditMode
                ? `https://my-portfolio-ganv.onrender.com/portfolio/${editData.number}`
                : 'https://my-portfolio-ganv.onrender.com/portfolio/';

            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    story,
                    ios_link: iosLink,
                    android_link: androidLink,
                    skill: combinedSkillString,
                    image_url: imageUrl
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save portfolio');
            }

            alert(isEditMode ? 'Portfolio successfully updated!' : 'Portfolio successfully created!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving portfolio:', error);
            alert('An error occurred while saving.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
                    {isEditMode ? 'EDIT PORTFOLIO' : 'NEW PORTFOLIO'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Piggy Log"
                            required
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '6px' }}
                        />
                    </div>

                    {/* 스킬 추가 UI */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Skills</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                                placeholder="e.g. Flutter"
                                style={{ flex: 1, padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '6px' }}
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                style={{ padding: '0 16px', background: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                + Add
                            </button>
                        </div>
                        {/* 추가된 스킬 칩 목록 */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '30px', padding: '6px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #eaeaea' }}>
                            {skillsArray.length === 0 ? (
                                <span style={{ fontSize: '12px', color: '#888', padding: '4px' }}>No skills added yet.</span>
                            ) : (
                                skillsArray.map((s, idx) => (
                                    <span key={idx} style={{ 
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        background: '#fff', border: '1px solid #ccc', padding: '3px 8px', 
                                        borderRadius: '4px', fontSize: '12px', fontWeight: '500' 
                                    }}>
                                        {s}
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveSkill(idx)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4f', fontWeight: 'bold', padding: 0, fontSize: '14px' }}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Story</label>
                        <textarea
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                            placeholder="Briefly describe the app..."
                            rows="3"
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '6px', resize: 'vertical', fontFamily: 'sans-serif' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>iOS Link (App Store)</label>
                        <input
                            type="text"
                            value={iosLink}
                            onChange={(e) => setIosLink(e.target.value)}
                            placeholder="https://apps.apple.com/..."
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '6px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Android Link (Google Play)</label>
                        <input
                            type="text"
                            value={androidLink}
                            onChange={(e) => setAndroidLink(e.target.value)}
                            placeholder="https://play.google.com/..."
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '6px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>App Icon Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            style={{ fontSize: '14px' }}
                        />
                        {isEditMode && editData.image_url && !imageFile && (
                            <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>* Existing image will be kept.</p>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                            type="submit"
                            disabled={uploading}
                            style={{ flex: 1, padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            {uploading ? 'Saving...' : (isEditMode ? 'Update' : 'Save')}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ flex: 1, padding: '12px', background: '#fff', color: '#000', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}