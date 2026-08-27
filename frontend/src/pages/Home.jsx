import React, { useState, useEffect } from 'react';
import PortfolioCard from '../components/PortfolioCard';

export default function Home() {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch portfolio items from backend API
    useEffect(() => {
        fetch('http://127.0.0.1:8000/portfolio/')
            .then((res) => res.json())
            .then((data) => {
                setPortfolios(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('API connection error:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            {/* Header section */}
            <header style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>TERRY YOON</h1>
                <p style={{ margin: 0 }}>DEVELOPER & DESIGNER OF DIGITAL UTILITIES.</p>
            </header>

            {/* 1. Portfolio // Released Apps section */}
            <section style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px' }}>
                <h2>[01] PORTFOLIO // RELEASED APPS</h2>
                {loading ? (
                    <p>Loading data...</p>
                ) : portfolios.length === 0 ? (
                    <p>No portfolios registered.</p>
                ) : (
                    portfolios.map((item) => (
                        <PortfolioCard
                            key={item.number}
                            number={item.number}
                            title={item.title}
                        />
                    ))
                )}
            </section>

            {/* 2. About This Web section */}
            <section style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px' }}>
                <h2>[02] ABOUT THIS WEB</h2>
                <p style={{ marginBottom: '10px' }}>This website is a full-stack portfolio architecture built with React, FastAPI, and PostgreSQL.</p>
                <div style={{ fontSize: '14px', color: '#555', background: '#f9f9f9', padding: '10px', borderRadius: '6px' }}>
                    💡 Coming soon: A <strong>[Show this web]</strong> button to view system architecture diagrams and database ERD schemas.
                </div>
            </section>

            {/* 3. About Me section */}
            <section style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px' }}>
                <h2>[03] ABOUT ME</h2>
                <p>Mobile software engineer specializing in Flutter development and database architectures.</p>
            </section>

            {/* 4. Guestbook entry link section */}
            <section style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px' }}>
                <h2>[04] GUESTBOOK // SHORT MEMO</h2>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>Thanks for visiting! Leave a short memo and your name.</p>
                
                {/* Placeholder card linking to the separate guestbook page */}
                <div 
                    style={{ 
                        border: '1px solid #ccc', 
                        padding: '15px 20px', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        background: '#fafafa',
                        textAlign: 'center',
                        fontWeight: '600'
                    }}
                    onClick={() => {
                        // TODO: Navigate to guestbook page later
                        alert('Guestbook page routing will be connected next!');
                    }}
                >
                    ✍️ 방명록 남기러 가기 (Go to Guestbook)
                </div>
            </section>
        </div>
    );
}
// import React, { useState, useEffect } from 'react';
// import PortfolioCard from '../components/PortfolioCard';

// export default function Home() {
//     const [portfolios, setPortfolios] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetch('http://127.0.0.1:8000/portfolio/')
//             .then((res) => res.json())
//             .then((data) => {
//                 setPortfolios(data);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.error('API 연동 에러:', err);
//                 setLoading(false);
//             });
//     }, []);

//     return (
//         <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
//             {/* Header */}
//             <header style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px' }}>
//                 <h1 style={{ margin: 0 }}>TERRY YOON</h1>
//                 <p style={{ margin: 0 }}>DEVELOPER & DESIGNER OF DIGITAL UTILITIES.</p>
//             </header>

//             {/* About Me */}
//             <section style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px' }}>
//                 <h2>[01] ABOUT ME</h2>
//                 <p>모바일 소프트웨어 엔지니어로서 Flutter와 데이터베이스 아키텍처를 다룹니다.</p>
//             </section>

//             {/* Portfolio */}
//             <section style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px' }}>
//                 <h2>[03] PORTFOLIO // RELEASED APPS</h2>
//                 {loading ? (
//                     <p>데이터 불러오는 중...</p>
//                 ) : portfolios.length === 0 ? (
//                     <p>등록된 포트폴리오가 없습니다.</p>
//                 ) : (
//                     portfolios.map((item) => (
//                         <PortfolioCard
//                             key={item.number || item.id}
//                             title={item.title}
//                             story={item.story}
//                             link={item.store_link}
//                         />
//                     ))
//                 )}
//             </section>
//         </div>
//     );
// }