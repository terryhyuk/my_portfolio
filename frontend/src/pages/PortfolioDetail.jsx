import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PortfolioDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://my-portfolio-ganv.onrender.com/portfolio/`)
            .then((res) => res.json())
            .then((data) => {
                const found = data.find((item) => item.number === Number(id));
                setPortfolio(found);
                setLoading(false);
            })
            .catch((err) => {
                console.error('상세 데이터 로딩 에러:', err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>;
    if (!portfolio) return <div style={{ padding: '40px', textAlign: 'center' }}>해당 포트폴리오를 찾을 수 없습니다.</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <button
                onClick={() => navigate('/')}
                style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px' }}
            >
                ← Back to Home
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#eee',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {portfolio.image_url ? (
                        <img src={portfolio.image_url} alt={portfolio.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: '35px' }}>📱</span>
                    )}
                </div>
                <div>
                    <h1 style={{ fontSize: '32px', margin: '0 0 8px 0' }}>{portfolio.title}</h1>
                    <p style={{ color: '#666', margin: 0 }}>Released Utility App</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                <a
                    href={portfolio.store_link || "https://apps.apple.com"}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: '12px 24px', background: '#000', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}
                >
                    App Store
                </a>
                <a
                    href={portfolio.store_link || "https://play.google.com"}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: '12px 24px', background: '#0f9d58', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}
                >
                    Google Play
                </a>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '40px' }} />

            <div style={{ lineHeight: '1.8', color: '#333', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
                {portfolio.story || "No detailed story provided yet."}
            </div>
        </div>
    );
}
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// export default function PortfolioDetail() {
//     const { id } = useParams(); // URL에서 포트폴리오 번호 가져오기
//     const navigate = useNavigate();

//     const [portfolio, setPortfolio] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // 백엔드에서 해당 번호의 상세 데이터를 가져오기
//     useEffect(() => {
//         fetch(`https://my-portfolio-ganv.onrender.com/portfolio/`)
//             .then((res) => res.json())
//             .then((data) => {
//                 // 전체 목록 중에서 현재 id(number)와 일치하는 아이템 찾기
//                 const found = data.find((item) => item.number === Number(id));
//                 setPortfolio(found);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.error('상세 데이터 로딩 에러:', err);
//                 setLoading(false);
//             });
//     }, [id]);

//     if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>;
//     if (!portfolio) return <div style={{ padding: '40px', textAlign: 'center' }}>해당 포트폴리오를 찾을 수 없습니다.</div>;

//     return (
//         <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
//             {/* 1. 앱 아이콘 & 이름 */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
//                 <div style={{ width: '80px', height: '80px', background: '#eee', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '35px' }}>
//                     📱
//                 </div>
//                 <div>
//                     <h1 style={{ fontSize: '32px', margin: '0 0 8px 0' }}>{portfolio.title}</h1>
//                     <p style={{ color: '#666', margin: 0 }}>Released Utility App</p>
//                 </div>
//             </div>

//             {/* 2. 스토어 링크 2개 */}
//             <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
//                 <a
//                     href={portfolio.store_link || "https://apps.apple.com"}
//                     target="_blank"
//                     rel="noreferrer"
//                     style={{ padding: '12px 24px', background: '#000', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}
//                 >
//                     App Store
//                 </a>
//                 <a
//                     href={portfolio.store_link || "https://play.google.com"}
//                     target="_blank"
//                     rel="noreferrer"
//                     style={{ padding: '12px 24px', background: '#0f9d58', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}
//                 >
//                     Google Play
//                 </a>
//             </div>

//             <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '40px' }} />

//             {/* 3. 앱 상세 스토리 */}
//             <div style={{ lineHeight: '1.8', color: '#333', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
//                 {portfolio.story}
//             </div>
//         </div>
//     );
// }