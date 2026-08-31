import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

// Import split section components
import HeaderSection from '../components/HeaderSection';
import ProjectsSection from '../components/ProjectsSection';
import SystemStructureSection from '../components/SystemStructureSection';
import AboutMeSection from '../components/AboutMeSection';
import GuestbookSection from '../components/GuestbookSection';
import PortfolioModal from '../components/PortfolioModal';

export default function Home() {
    const navigate = useNavigate();
    
    // States
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clickCount, setClickCount] = useState(0);
    const [visitCount, setVisitCount] = useState(0);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPortfolio, setEditingPortfolio] = useState(null);

    // About This Web state
    const [aboutWeb, setAboutWeb] = useState({ about_this_web: '', architecture: '', about_this_web_img: '' });
    const [isEditingAboutWeb, setIsEditingAboutWeb] = useState(false);
    const [erdFile, setErdFile] = useState(null);
    const [archFile, setArchFile] = useState(null);
    const [editAboutText, setEditAboutText] = useState('');
    const [uploading, setUploading] = useState(false);

    // About Me state
    const [aboutMeText, setAboutMeText] = useState('');
    const [editAboutMeText, setEditAboutMeText] = useState('');
    const [isEditingAboutMe, setIsEditingAboutMe] = useState(false);

    const isAdmin = !!localStorage.getItem('access_token');

    // Fetch initial data from server API
    const fetchData = () => {
        fetch('http://127.0.0.1:8000/portfolio/')
            .then((res) => res.json())
            .then((data) => { setPortfolios(data); setLoading(false); })
            .catch((err) => { console.error('Portfolio fetch error:', err); setLoading(false); });

        fetch('http://127.0.0.1:8000/visit/')
            .then((res) => res.json())
            .then((data) => { setVisitCount(typeof data === 'number' ? data : (data.total || data.length || 0)); })
            .catch((err) => { console.error('Visit count fetch error:', err); });

        fetch('http://127.0.0.1:8000/user/about-web')
            .then((res) => res.json())
            .then((data) => {
                setAboutWeb(data);
                setEditAboutText(data.about_this_web || '');
                setAboutMeText(data.about_me || '');
            })
            .catch((err) => { console.error('About web fetch error:', err); });
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle hidden admin login trigger on title click (5 times)
    const handleTitleClick = () => {
        if (isAdmin) {
            alert('Already logged in as admin.');
            return;
        }
        const nextCount = clickCount + 1;
        if (nextCount >= 5) {
            setClickCount(0);
            navigate('/admin/login');
        } else {
            setClickCount(nextCount);
        }
    };

    // Handle portfolio deletion
    const handleDeletePortfolio = async (number) => {
        if (!window.confirm(`Are you sure you want to delete portfolio #${number}?`)) return;

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://127.0.0.1:8000/portfolio/${number}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete portfolio');
            alert('Portfolio successfully deleted.');
            fetchData();
        } catch (error) {
            console.error('Delete error:', error);
            alert('An error occurred while deleting.');
        }
    };

    // Helper function to upload image file to Firebase Storage
    const uploadImageFile = async (file) => {
        const uniqueFileName = `about_web_${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `system_structure/${uniqueFileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    };

    // Handle saving About This Web section
    const handleSaveAboutWeb = async () => {
        try {
            setUploading(true);
            const token = localStorage.getItem('access_token');
            
            let erdImgUrl = aboutWeb.about_this_web_img;
            let archImgUrl = aboutWeb.architecture;

            if (erdFile) erdImgUrl = await uploadImageFile(erdFile);
            if (archFile) archImgUrl = await uploadImageFile(archFile);

            const response = await fetch('http://127.0.0.1:8000/user/about-web', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    about_this_web_img: erdImgUrl,
                    architecture: archImgUrl,
                    about_this_web: editAboutText
                })
            });

            if (!response.ok) throw new Error('Failed to update About This Web');
            alert('Successfully updated!');
            setIsEditingAboutWeb(false);
            setErdFile(null);
            setArchFile(null);
            fetchData();
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update system structure.');
        } finally {
            setUploading(false);
        }
    };

    // Handle saving About Me section
    const handleSaveAboutMe = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch('http://127.0.0.1:8000/user/about-me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ about_me: editAboutMeText })
            });
            if (!res.ok) throw new Error('Failed to update');
            setAboutMeText(editAboutMeText);
            setIsEditingAboutMe(false);
            alert('About Me successfully updated!');
        } catch (err) {
            console.error(err);
            alert('Failed to update About Me.');
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif', background: '#fafbfc', minHeight: '100vh' }}>
            {/* Header Section */}
            <HeaderSection visitCount={visitCount} onTitleClick={handleTitleClick} />

            {/* Projects Section */}
            <ProjectsSection 
                portfolios={portfolios}
                loading={loading}
                isAdmin={isAdmin}
                onNewPortfolio={() => { setEditingPortfolio(null); setIsModalOpen(true); }}
                onEditPortfolio={(item) => { setEditingPortfolio(item); setIsModalOpen(true); }}
                onDeletePortfolio={handleDeletePortfolio}
            />

            {/* System Structure Section */}
            <SystemStructureSection 
                aboutWeb={aboutWeb}
                isEditingAboutWeb={isEditingAboutWeb}
                setIsEditingAboutWeb={setIsEditingAboutWeb}
                isAdmin={isAdmin}
                erdFile={erdFile}
                setErdFile={setErdFile}
                archFile={archFile}
                setArchFile={setArchFile}
                editAboutText={editAboutText}
                setEditAboutText={setEditAboutText}
                uploading={uploading}
                onSave={handleSaveAboutWeb}
            />

            {/* About Me Section */}
            <AboutMeSection 
                aboutMeText={aboutMeText}
                editAboutMeText={editAboutMeText}
                setEditAboutMeText={setEditAboutMeText}
                isEditingAboutMe={isEditingAboutMe}
                setIsEditingAboutMe={setIsEditingAboutMe}
                isAdmin={isAdmin}
                onSave={handleSaveAboutMe}
            />

            {/* Guestbook Section */}
            <GuestbookSection onNavigateGuestbook={() => navigate('/guestbook')} />

            {/* Portfolio Modal Form */}
            <PortfolioModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchData} 
                editData={editingPortfolio} 
            />
        </div>
    );
}