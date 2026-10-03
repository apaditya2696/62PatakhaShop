const fs = require('fs');

// In CatalogClient.tsx, replace styles.grid and styles.catalogMain with styles.productGrid and styles.contentArea
let tsx = fs.readFileSync('src/app/catalog/CatalogClient.tsx', 'utf8');
tsx = tsx.replace('<div className={styles.catalogMain}>', '<div className={styles.contentArea}>');
tsx = tsx.replace('<div className={styles.grid}>', '<div className={styles.productGrid}>');
fs.writeFileSync('src/app/catalog/CatalogClient.tsx', tsx);

// In CatalogClient.module.css, upgrade productGrid for desktop/tablet/mobile
const css = `.catalogWrapper {
  background-color: var(--bg-primary);
  min-height: 100vh;
  padding-bottom: 100px;
}

.editorialHeader {
  padding: 50px 0 32px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-light);
}

.catalogTitle {
  font-family: var(--font-serif);
  font-size: 38px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 14px;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.catalogSubtitle {
  font-family: var(--font-sans);
  font-size: 14.5px;
  color: var(--text-secondary);
  max-width: 640px;
  line-height: 1.6;
}

.contentArea {
  padding: 40px 0 60px;
}

.productGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.emptyIcon {
  font-size: 32px;
  color: var(--gold-primary);
  margin-bottom: 16px;
}

.emptyTitle {
  font-family: var(--font-serif);
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.emptyDesc {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--text-secondary);
  max-width: 440px;
  line-height: 1.6;
  margin-bottom: 24px;
}

@media (max-width: 1200px) {
  .productGrid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (max-width: 860px) {
  .productGrid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .catalogTitle {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .productGrid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
`;

fs.writeFileSync('src/app/catalog/CatalogClient.module.css', css);
console.log('Fixed catalog grid styles and responsiveness');
