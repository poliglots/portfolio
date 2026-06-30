import type { NewsModalParams } from "../../types";
import { BaseReaderModal } from "./BaseModal";

const KNOWN_SOURCES = ["bbc", "cnn", "euronews", "nytimes", "washingtonpost"];

function NewsModal({ isActive, onClose, source, headline, link, details, imageUrl }: NewsModalParams) {
  const sourceClass = KNOWN_SOURCES.includes(source) ? `source-${source}` : "source-default";

  return (
    <BaseReaderModal isActive={isActive} onClose={onClose}>
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
    </BaseReaderModal>
  );
}

export default NewsModal;
