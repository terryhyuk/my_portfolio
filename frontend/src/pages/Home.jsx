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
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { storage } from '../firebase';
// import PortfolioCard from '../components/PortfolioCard';
// import AdminHeader from '../components/AdminHeader';
// import PortfolioModal from '../components/PortfolioModal';

// export default function Home() {
//     const navigate = useNavigate();
//     const [portfolios, setPortfolios] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [clickCount, setClickCount] = useState(0);
//     const [visitCount, setVisitCount] = useState(0);
    
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingPortfolio, setEditingPortfolio] = useState(null);

//     // About This Web state
//     const [aboutWeb, setAboutWeb] = useState({
//         about_this_web: '',
//         architecture: '',
//         about_this_web_img: ''
//     });
//     const [isEditingAboutWeb, setIsEditingAboutWeb] = useState(false);
    
//     // Edit form states (Files and Text for About This Web)
//     const [erdFile, setErdFile] = useState(null);
//     const [archFile, setArchFile] = useState(null);
//     const [editAboutText, setEditAboutText] = useState('');
//     const [uploading, setUploading] = useState(false);

//     // About Me state
//     const [aboutMeText, setAboutMeText] = useState('');
//     const [editAboutMeText, setEditAboutMeText] = useState('');
//     const [isEditingAboutMe, setIsEditingAboutMe] = useState(false);

//     const isAdmin = !!localStorage.getItem('access_token');

//     const fetchData = () => {
//         fetch('http://127.0.0.1:8000/portfolio/')
//             .then((res) => res.json())
//             .then((data) => {
//                 setPortfolios(data);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.error('API connection error (Portfolio):', err);
//                 setLoading(false);
//             });

//         fetch('http://127.0.0.1:8000/visit/')
//             .then((res) => res.json())
//             .then((data) => {
//                 setVisitCount(typeof data === 'number' ? data : (data.total || data.length || 0));
//             })
//             .catch((err) => {
//                 console.error('API connection error (Visit):', err);
//             });

//         fetch('http://127.0.0.1:8000/user/about-web')
//             .then((res) => res.json())
//             .then((data) => {
//                 setAboutWeb(data);
//                 setEditAboutText(data.about_this_web || '');
//                 setAboutMeText(data.about_me || '');
//             })
//             .catch((err) => {
//                 console.error('API connection error (About Web):', err);
//             });
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const handleTitleClick = () => {
//         if (isAdmin) {
//             alert('Already logged in as admin.');
//             return;
//         }

//         const nextCount = clickCount + 1;
//         if (nextCount >= 5) {
//             setClickCount(0);
//             navigate('/admin/login');
//         } else {
//             setClickCount(nextCount);
//         }
//     };

//     const handleDelete = async (number) => {
//         if (!window.confirm(`Are you sure you want to delete portfolio #${number}?`)) {
//             return;
//         }

//         try {
//             const token = localStorage.getItem('access_token');
//             const response = await fetch(`http://127.0.0.1:8000/portfolio/${number}`, {
//                 method: 'DELETE',
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });

//             if (!response.ok) throw new Error('Failed to delete portfolio');

//             alert('Portfolio successfully deleted.');
//             fetchData();
//         } catch (error) {
//             console.error('Error deleting portfolio:', error);
//             alert('An error occurred while deleting the portfolio.');
//         }
//     };

//     // Helper function to upload an image file directly to Firebase Storage
//     const uploadImageFile = async (file) => {
//         const uniqueFileName = `about_web_${Date.now()}_${file.name}`;
//         const storageRef = ref(storage, `system_structure/${uniqueFileName}`);

//         const snapshot = await uploadBytes(storageRef, file);
//         const downloadUrl = await getDownloadURL(snapshot.ref);
//         return downloadUrl;
//     };

//     const handleSaveAboutWeb = async () => {
//         try {
//             setUploading(true);
//             const token = localStorage.getItem('access_token');
            
//             let erdImgUrl = aboutWeb.about_this_web_img;
//             let archImgUrl = aboutWeb.architecture;

//             // If a new ERD file is selected, upload it directly to Firebase Storage
//             if (erdFile) {
//                 erdImgUrl = await uploadImageFile(erdFile);
//             }

//             // If a new Architecture file is selected, upload it directly to Firebase Storage
//             if (archFile) {
//                 archImgUrl = await uploadImageFile(archFile);
//             }

//             const response = await fetch('http://127.0.0.1:8000/user/about-web', {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     about_this_web_img: erdImgUrl,
//                     architecture: archImgUrl,
//                     about_this_web: editAboutText
//                 })
//             });

//             if (!response.ok) throw new Error('Failed to update About This Web');

//             alert('Successfully updated!');
//             setIsEditingAboutWeb(false);
//             setErdFile(null);
//             setArchFile(null);
//             fetchData();
//         } catch (error) {
//             console.error('Error updating about web:', error);
//             alert('Failed to update system structure.');
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', position: 'relative' }}>
//             <AdminHeader />

//             <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
//                 <div style={{ border: '1px solid #ccc', padding: '4px 10px', background: '#fafafa', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px' }}>
//                     👀 Visitors: {visitCount}
//                 </div>
//             </div>

//             <header style={{ border: '1px solid #000', padding: '20px', marginBottom: '30px' }}>
//                 <h1 onClick={handleTitleClick} style={{ margin: 0, cursor: 'pointer', userSelect: 'none' }}>
//                     TERRY YOON
//                 </h1>
//                 <p style={{ margin: '5px 0 0 0' }}>DEVELOPER & DESIGNER OF DIGITAL UTILITIES.</p>
//             </header>

//             {/* Section 01: Portfolio */}
//             <section style={{ marginBottom: '40px' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                     <h2 style={{ margin: 0, fontSize: '18px', color: '#00875a' }}>PROJECTS</h2>
//                     {isAdmin && (
//                         <button 
//                             onClick={() => { setEditingPortfolio(null); setIsModalOpen(true); }}
//                             style={{ padding: '6px 12px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
//                         >
//                             + New Portfolio
//                         </button>
//                     )}
//                 </div>

//                 {loading ? <p>Loading data...</p> : portfolios.length === 0 ? <p>No portfolios registered.</p> : (
//                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
//                         {portfolios.map((item) => (
//                             <div key={item.number} style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '20px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//                                 <div>
//                                     <PortfolioCard number={item.number} title={item.title} imageUrl={item.image_url} />
//                                 </div>
//                                 {isAdmin && (
//                                     <div style={{ display: 'flex', gap: '8px', marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #f0f0f0' }}>
//                                         <button onClick={() => { setEditingPortfolio(item); setIsModalOpen(true); }} style={{ flex: 1, padding: '6px 0', cursor: 'pointer', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}>Edit</button>
//                                         <button onClick={() => handleDelete(item.number)} style={{ flex: 1, padding: '6px 0', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </section>

//             {/* Section 02: About This Web (System Structure) */}
//             <section style={{ marginBottom: '40px' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
//                     <div>
//                         <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00875a', letterSpacing: '1px' }}>SYSTEM STRUCTURE</span>
//                         <h2 style={{ fontSize: '24px', margin: '5px 0 0 0' }}>About this web</h2>
//                     </div>
//                     {isAdmin && !isEditingAboutWeb && (
//                         <button 
//                             onClick={() => setIsEditingAboutWeb(true)} 
//                             style={{ padding: '6px 14px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
//                         >
//                             Edit Section
//                         </button>
//                     )}
//                 </div>

//                 {isEditingAboutWeb ? (
//                     <div style={{ border: '1px solid #00875a', borderRadius: '12px', padding: '24px', background: '#fdfdfd', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
//                         <h3 style={{ fontSize: '15px', marginBottom: '15px', color: '#00875a' }}>✏️ Upload System Structure Images & Note</h3>
                        
//                         <div style={{ marginBottom: '15px' }}>
//                             <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>ERD Image File</label>
//                             <input 
//                                 type="file" 
//                                 accept="image/*" 
//                                 onChange={(e) => setErdFile(e.target.files[0])} 
//                                 style={{ fontSize: '13px' }} 
//                             />
//                             {erdFile && <span style={{ fontSize: '12px', color: '#00875a', marginLeft: '10px' }}>Selected: {erdFile.name}</span>}
//                         </div>

//                         <div style={{ marginBottom: '15px' }}>
//                             <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Architecture Image File</label>
//                             <input 
//                                 type="file" 
//                                 accept="image/*" 
//                                 onChange={(e) => setArchFile(e.target.files[0])} 
//                                 style={{ fontSize: '13px' }} 
//                             />
//                             {archFile && <span style={{ fontSize: '12px', color: '#00875a', marginLeft: '10px' }}>Selected: {archFile.name}</span>}
//                         </div>

//                         <div style={{ marginBottom: '15px' }}>
//                             <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Side Description Note (Optional)</label>
//                             <textarea value={editAboutText} onChange={(e) => setEditAboutText(e.target.value)} style={{ width: '100%', height: '80px', padding: '8px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
//                         </div>

//                         <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
//                             <button onClick={() => setIsEditingAboutWeb(false)} disabled={uploading} style={{ padding: '6px 12px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
//                             <button onClick={handleSaveAboutWeb} disabled={uploading} style={{ padding: '6px 12px', background: '#00875a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
//                                 {uploading ? 'Uploading...' : 'Save All'}
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
//                         {/* Left: Two stacked Image Cards */}
//                         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//                             <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '16px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
//                                 <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#00875a', display: 'block', marginBottom: '8px' }}>DATA SCHEMA (ERD)</span>
//                                 {aboutWeb.about_this_web_img ? (
//                                     <img src={aboutWeb.about_this_web_img} alt="ERD Schema" style={{ width: '100%', borderRadius: '8px', display: 'block', objectFit: 'contain' }} />
//                                 ) : (
//                                     <div style={{ padding: '30px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#888', fontSize: '13px' }}>
//                                         No ERD image uploaded yet.
//                                     </div>
//                                 )}
//                             </div>

//                             <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '16px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
//                                 <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#00875a', display: 'block', marginBottom: '8px' }}>SYSTEM LAYOUT (Architecture)</span>
//                                 {aboutWeb.architecture ? (
//                                     <img src={aboutWeb.architecture} alt="Architecture Diagram" style={{ width: '100%', borderRadius: '8px', display: 'block', objectFit: 'contain' }} />
//                                 ) : (
//                                     <div style={{ padding: '30px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#888', fontSize: '13px' }}>
//                                         No Architecture image uploaded yet.
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Right: Side Note / Description */}
//                         <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
//                             <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>
//                                 {aboutWeb.about_this_web || "설명이 아직 작성되지 않았습니다."}
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </section>

//             {/* Section 03: About Me */}
//             <section style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px', background: '#fff', borderRadius: '8px' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
//                     <h2 style={{ margin: 0, fontSize: '18px' }}>[03] ABOUT ME</h2>
//                     {isAdmin && !isEditingAboutMe && (
//                         <button 
//                             onClick={() => { setIsEditingAboutMe(true); setEditAboutMeText(aboutMeText); }} 
//                             style={{ padding: '6px 12px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
//                         >
//                             Edit
//                         </button>
//                     )}
//                 </div>

//                 {isEditingAboutMe ? (
//                     <div>
//                         <textarea 
//                             value={editAboutMeText} 
//                             onChange={(e) => setEditAboutMeText(e.target.value)} 
//                             style={{ width: '100%', height: '80px', padding: '10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '10px', resize: 'vertical', fontFamily: 'sans-serif' }} 
//                         />
//                         <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
//                             <button 
//                                 onClick={() => setIsEditingAboutMe(false)} 
//                                 style={{ padding: '6px 12px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
//                             >
//                                 Cancel
//                             </button>
//                             <button 
//                                 onClick={async () => {
//                                     try {
//                                         const token = localStorage.getItem('access_token');
//                                         const res = await fetch('http://127.0.0.1:8000/user/about-me', {
//                                             method: 'PUT',
//                                             headers: {
//                                                 'Content-Type': 'application/json',
//                                                 'Authorization': `Bearer ${token}`
//                                             },
//                                             body: JSON.stringify({ about_me: editAboutMeText })
//                                         });
//                                         if (!res.ok) throw new Error('Failed to update');
//                                         setAboutMeText(editAboutMeText);
//                                         setIsEditingAboutMe(false);
//                                         alert('About Me successfully updated!');
//                                     } catch (err) {
//                                         console.error(err);
//                                         alert('Failed to update About Me.');
//                                     }
//                                 }} 
//                                 style={{ padding: '6px 12px', background: '#00875a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>
//                         {aboutMeText || "소개글이 아직 작성되지 않았습니다."}
//                     </p>
//                 )}
//             </section>

//             {/* Section 04: Guestbook entry link */}
//             <section style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px' }}>
//                 <h2>[04] GUESTBOOK // SHORT MEMO</h2>
//                 <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>Thanks for visiting! Leave a short memo and your name.</p>

//                 <div
//                     style={{
//                         border: '1px solid #ccc',
//                         padding: '15px 20px',
//                         borderRadius: '8px',
//                         cursor: 'pointer',
//                         background: '#fafafa',
//                         textAlign: 'center',
//                         fontWeight: '600'
//                     }}
//                     onClick={() => navigate('/guestbook')}
//                 >
//                     ✍️ Go to Guestbook
//                 </div>
//             </section>

//             <PortfolioModal 
//                 isOpen={isModalOpen} 
//                 onClose={() => setIsModalOpen(false)} 
//                 onSuccess={fetchData} 
//                 editData={editingPortfolio} 
//             />
//         </div>
//     );
// }