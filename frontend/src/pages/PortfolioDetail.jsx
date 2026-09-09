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

    // ios_link나 android_link 중 하나라도 존재할 때만 링크 버튼 영역을 노출
    const hasStoreLinks = portfolio.ios_link || portfolio.android_link;

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <button
                onClick={() => navigate('/')}
                style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px', background: '#f0f0f0', border: 'none', borderRadius: '6px', fontWeight: '600' }}
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

            {/* 링크가 있을 때만 스토어 버튼 영역 렌더링 (웹처럼 비워두면 아예 출력 안 함) */}
            {hasStoreLinks && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                    {portfolio.ios_link && (
                        <a
                            href={portfolio.ios_link}
                            target="_blank"
                            rel="noreferrer"
                            style={{ padding: '12px 24px', background: '#000', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}
                        >
                            App Store
                        </a>
                    )}
                    {portfolio.android_link && (
                        <a
                            href={portfolio.android_link}
                            target="_blank"
                            rel="noreferrer"
                            style={{ padding: '12px 24px', background: '#0f9d58', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}
                        >
                            Google Play
                        </a>
                    )}
                </div>
            )}

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
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [portfolio, setPortfolio] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetch(`https://my-portfolio-ganv.onrender.com/portfolio/`)
//             .then((res) => res.json())
//             .then((data) => {
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
//             <button
//                 onClick={() => navigate('/')}
//                 style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px' }}
//             >
//                 ← Back to Home
//             </button>

//             <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
//                 <div style={{
//                     width: '80px',
//                     height: '80px',
//                     background: '#eee',
//                     borderRadius: '16px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     overflow: 'hidden'
//                 }}>
//                     {portfolio.image_url ? (
//                         <img src={portfolio.image_url} alt={portfolio.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                     ) : (
//                         <span style={{ fontSize: '35px' }}>📱</span>
//                     )}
//                 </div>
//                 <div>
//                     <h1 style={{ fontSize: '32px', margin: '0 0 8px 0' }}>{portfolio.title}</h1>
//                     <p style={{ color: '#666', margin: 0 }}>Released Utility App</p>
//                 </div>
//             </div>

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

//             <div style={{ lineHeight: '1.8', color: '#333', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
//                 {portfolio.story || "No detailed story provided yet."}
//             </div>
//         </div>
//     );
// }
