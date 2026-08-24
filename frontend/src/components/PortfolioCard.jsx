export default function PortfolioCard({ title, story, link }) {
    return (
        <div style={{ border: '1px dashed #ccc', padding: '15px', marginBottom: '10px' }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{title}</h3>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{story}</p>
            {link && (
                <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#0066cc' }}>
                    [Store Link]
                </a>
            )}
        </div>
    );
}