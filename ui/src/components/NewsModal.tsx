import { useEffect } from "react";

interface ModalParams {
  isActive: boolean;
  onClose: () => void;
  source: string;
  headline: string;
  link: string;
  details: string;
  imageUrl?: string;
}

const KNOWN_SOURCES = ["bbc", "cnn", "euronews", "nytimes", "washingtonpost"];

function NewsModal({ isActive, onClose, source, headline, link, details, imageUrl }: ModalParams) {
  useEffect(() => {
    if (!isActive) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isActive, onClose]);

  if (!isActive) return null;

  const sourceClass = KNOWN_SOURCES.includes(source) ? `source-${source}` : "source-default";

  return (
    <div className="m-overlay" onClick={onClose}>
      <div className="m-reader" onClick={e => e.stopPropagation()}>

        <div className="m-reader-bar">
          <span className={`m-reader-source ${sourceClass}`}>{source}</span>
          <button className="m-reader-close" aria-label="close" onClick={onClose}>✕</button>
        </div>

        <div className="m-reader-scroll">

          {imageUrl && (
            <div className="m-hero-wrap">
              <img className="m-hero-image" src={imageUrl} alt="" />
            </div>
          )}

          <div className="m-article">
            <h1 className="m-article-headline">{headline}</h1>
            <p className="m-article-body">{details}</p>
          </div>

        </div>

        <div className="m-article-footer">
          <a href={link} target="_blank" rel="noopener noreferrer" className="m-cta">
            Read full article →
          </a>
        </div>
      </div>
    </div>
  );
}

export default NewsModal;
