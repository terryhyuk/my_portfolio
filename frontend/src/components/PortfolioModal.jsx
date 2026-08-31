import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; // 설정한 firebase.js 경로에 맞게 수정해줘!

export default function PortfolioModal({ isOpen, onClose, onSuccess, editData }) {
    const isEditMode = !!editData;

    const [title, setTitle] = useState('');
    const [story, setStory] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (editData) {
            setTitle(editData.title || '');
            setStory(editData.story || '');
            setImageFile(null);
        } else {
            setTitle('');
            setStory('');
            setImageFile(null);
        }
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = editData ? editData.image_url : '';
            const token = localStorage.getItem('access_token');

            // 1. If a new image file is selected, upload it DIRECTLY to Firebase Storage
            if (imageFile) {
                // 파일명을 유니크하게 만들기 위해 타임스탬프와 원래 이름 조합
                const uniqueFileName = `${Date.now()}_${imageFile.name}`;
                const storageRef = ref(storage, `portfolio_icons/${uniqueFileName}`);

                // 파이어베이스 스토리지로 직접 업로드 실행
                const snapshot = await uploadBytes(storageRef, imageFile);
                
                // 업로드된 파일의 공개 다운로드 URL 획득
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            // 2. Save portfolio data (POST or PUT) to FastAPI backend
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
            <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '450px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
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

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Story</label>
                        <textarea
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                            placeholder="Briefly describe the app..."
                            rows="4"
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '6px', resize: 'vertical', fontFamily: 'sans-serif' }}
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
                            <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>* Existing image will be kept. Choose a new file to replace it.</p>
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