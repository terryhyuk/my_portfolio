import React, { useState, useEffect } from 'react';
import PortfolioCard from '../components/PortfolioCard';

export default function Home() {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/portfolio/')
            .then((res) => res.json())
            .then((data) => {
                setPortfolios(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('API 연동 에러:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
            {/* Header */}
            <header style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>TERRY YOON</h1>
                <p style={{ margin: 0 }}>DEVELOPER & DESIGNER OF DIGITAL UTILITIES.</p>
            </header>

            {/* About Me */}
            <section style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px' }}>
                <h2>[01] ABOUT ME</h2>
                <p>모바일 소프트웨어 엔지니어로서 Flutter와 데이터베이스 아키텍처를 다룹니다.</p>
            </section>

            {/* Portfolio */}
            <section style={{ border: '1px solid #000', padding: '20px', marginBottom: '20px' }}>
                <h2>[03] PORTFOLIO // RELEASED APPS</h2>
                {loading ? (
                    <p>데이터 불러오는 중...</p>
                ) : portfolios.length === 0 ? (
                    <p>등록된 포트폴리오가 없습니다.</p>
                ) : (
                    portfolios.map((item) => (
                        <PortfolioCard
                            key={item.number || item.id}
                            title={item.title}
                            story={item.story}
                            link={item.store_link}
                        />
                    ))
                )}
            </section>
        </div>
    );
}