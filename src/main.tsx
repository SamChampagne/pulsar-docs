import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, ChevronRight, Command, ExternalLink, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { docs, featured, getDoc, icons, sections, type DocBlock, type DocPage } from './content';
import './styles.css';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const routeFromLocation = () => {
  let path = window.location.pathname.replace(/\/$/, '');
  if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length) || '';
  if (!path || path === '') return 'home';
  if (path.startsWith('/docs/')) return path.replace('/docs/', '');
  return 'home';
};

function navigate(slug: string) {
  const next = slug === 'home' ? `${basePath || ''}/` : `${basePath || ''}/docs/${slug}`;
  window.history.pushState({}, '', next);
  window.dispatchEvent(new Event('pulsar:navigate'));
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export default function App() {
  const [route, setRoute] = useState(routeFromLocation());
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const update = () => setRoute(routeFromLocation());
    window.addEventListener('popstate', update);
    window.addEventListener('pulsar:navigate', update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('pulsar:navigate', update);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        const input = document.querySelector<HTMLInputElement>('#doc-search');
        input?.focus();
      }
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activeDoc = route === 'home' ? undefined : getDoc(route);
  const searchResults = useMemo(() => searchDocs(query), [query]);

  return (
    <div className="app-shell">
      <Header dark={dark} setDark={setDark} query={query} setQuery={setQuery} results={searchResults} onMenu={() => setMenuOpen(true)} />
      {menuOpen && <button className="sidebar-scrim" aria-label="Fermer la navigation" onClick={() => setMenuOpen(false)} />}
      <div className="layout">
        <Sidebar activeSlug={activeDoc?.slug ?? 'home'} open={menuOpen} close={() => setMenuOpen(false)} />
        <main className="main-content">
          {route === 'home' ? <Home /> : <Doc doc={activeDoc!} />}
        </main>
        {activeDoc && <Toc doc={activeDoc} />}
      </div>
    </div>
  );
}

function Header({ dark, setDark, query, setQuery, results, onMenu }: { dark: boolean; setDark: (v: boolean) => void; query: string; setQuery: (v: string) => void; results: DocPage[]; onMenu: () => void }) {
  return (
    <header className="topbar">
      <button className="menu-button" onClick={onMenu} aria-label="Navigation"><Menu size={20} /></button>
      <button className="brand" onClick={() => navigate('home')}>
        <span className="brand-mark"><img src={asset('/assets/pulsar-logo-source.jpg')} alt="Pulsar" /></span>
        <span><strong>Pulsar</strong><em>Docs</em></span>
      </button>
      <div className="search-wrap">
        <Search size={18} />
        <input id="doc-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher dans la documentation" />
        <kbd><Command size={12} /> K</kbd>
        {query.trim() && (
          <div className="search-popover">
            <span className="result-count">{results.length} résultat{results.length > 1 ? 's' : ''}</span>
            {results.map((doc) => (
              <button key={doc.slug} onClick={() => { setQuery(''); navigate(doc.slug); }}>
                <strong>{doc.title}</strong>
                <small>{doc.description}</small>
              </button>
            ))}
          </div>
        )}
      </div>
      <a className="repo-link" href="https://github.com/SamChampagne/Pulsar" target="_blank" rel="noreferrer">Repo Pulsar <ExternalLink size={14} /></a>
      <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Changer le thème">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
    </header>
  );
}

function Sidebar({ activeSlug, open, close }: { activeSlug: string; open: boolean; close: () => void }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-head">
        <span>Documentation</span>
        <button onClick={close} aria-label="Fermer"><X size={18} /></button>
      </div>
      <button className={activeSlug === 'home' ? 'nav-item active' : 'nav-item'} onClick={() => { navigate('home'); close(); }}>Accueil</button>
      {sections.map((section) => (
        <nav key={section}>
          <p>{section}</p>
          {docs.filter((doc) => doc.section === section).map((doc) => {
            const Icon = icons[doc.icon];
            return (
              <button key={doc.slug} className={activeSlug === doc.slug ? 'nav-item active' : 'nav-item'} onClick={() => { navigate(doc.slug); close(); }}>
                <Icon size={16} />
                <span>{doc.title}</span>
              </button>
            );
          })}
        </nav>
      ))}
    </aside>
  );
}

function Home() {
  const cards = featured.map(getDoc);
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <div className="pill"><span /> Documentation officielle</div>
          <h1>Tout comprendre, construire et opérer Pulsar.</h1>
          <p>Pulsar Docs rassemble la vision, les guides métier, l’architecture, les APIs et les runbooks d’une plateforme logistique modulaire avec agents IA gouvernés.</p>
          <div className="hero-actions">
            <button onClick={() => navigate('overview')}>Commencer <ArrowRight size={18} /></button>
            <button className="secondary" onClick={() => navigate('getting-started')}>Installer en local</button>
          </div>
        </div>
        <div className="signal-card">
          <img src={asset('/assets/pulsar-logo-source.jpg')} alt="Logo Pulsar" />
          <div className="signal-line"><span>LSOS</span><strong>Modular logistics operating system</strong></div>
          <div className="pulse-grid">
            <b>13</b><span>modules documentés</span>
            <b>72</b><span>contrôleurs analysés</span>
            <b>24/7</b><span>agents gouvernés</span>
          </div>
        </div>
      </section>
      <section className="quick-grid">
        {cards.map((doc) => {
          const Icon = icons[doc.icon];
          return <button className="quick-card" key={doc.slug} onClick={() => navigate(doc.slug)}><Icon size={22} /><strong>{doc.title}</strong><span>{doc.description}</span><ChevronRight size={18} /></button>;
        })}
      </section>
      <section className="doc-map">
        <div>
          <h2>Une documentation pensée comme un produit</h2>
          <p>Navigation par sections, recherche locale, contenu métier et technique côte à côte — pour que Sam, les devs, les opérateurs et les futurs clients puissent lire Pulsar sans fouiller le monorepo.</p>
        </div>
        <div className="timeline">
          <span>Core → Modules → Workbenches → Agents → Policies → Control Tower</span>
        </div>
      </section>
    </div>
  );
}

function Doc({ doc }: { doc: DocPage }) {
  const Icon = icons[doc.icon];
  return (
    <article className="doc">
      <div className="breadcrumb">Docs <ChevronRight size={14} /> {doc.section}</div>
      <header className="doc-header">
        <div className="doc-icon"><Icon size={26} /></div>
        <div><h1>{doc.title}</h1><p>{doc.description}</p></div>
      </header>
      <div className="tags">{doc.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="doc-body">{doc.body.map((block, index) => <Block key={index} block={block} />)}</div>
      <footer className="doc-footer">
        <strong>Besoin d’un ajout?</strong>
        <span>Chaque phase Pulsar devrait ajouter un guide utilisateur, une référence technique et les invariants dev associés.</span>
      </footer>
    </article>
  );
}

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case 'lead': return <p className="lead">{block.text}</p>;
    case 'h2': return <h2 id={slugify(block.text)}>{block.text}</h2>;
    case 'h3': return <h3 id={slugify(block.text)}>{block.text}</h3>;
    case 'p': return <p>{block.text}</p>;
    case 'ul': return <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
    case 'steps': return <ol className="steps">{block.items.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.text}</span></li>)}</ol>;
    case 'cards': return <div className="cards">{block.items.map((item) => <button key={item.title} onClick={() => item.href && navigate(item.href.replace('/docs/', ''))}><strong>{item.title}</strong><span>{item.text}</span></button>)}</div>;
    case 'callout': return <aside className={`callout ${block.tone ?? 'info'}`}><strong>{block.title}</strong><p>{block.text}</p></aside>;
    case 'code': return <pre><code>{block.code}</code></pre>;
    case 'table': return <div className="table-wrap"><table><thead><tr>{block.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{block.rows.map((row, idx) => <tr key={idx}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
  }
}

function Toc({ doc }: { doc: DocPage }) {
  const headings = doc.body.filter((block) => block.type === 'h2' || block.type === 'h3') as Extract<DocBlock, { type: 'h2' | 'h3' }>[];
  return <aside className="toc"><p>Sur cette page</p>{headings.map((h) => <a key={h.text} href={`#${slugify(h.text)}`}>{h.text}</a>)}</aside>;
}

function searchDocs(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return docs.filter((doc) => {
    const body = doc.body.map((block) => JSON.stringify(block)).join(' ');
    return [doc.title, doc.description, doc.section, doc.tags.join(' '), body].join(' ').toLowerCase().includes(q);
  }).slice(0, 8);
}

function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
