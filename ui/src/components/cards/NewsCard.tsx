import type { NewsCardProps } from "../../types";
import NewsModal from "../modals/NewsModal";
import { sourceBadgeClass } from "../../utils/sources";
import { formatDate } from "../../utils/formatting";
import { useState, useCallback } from "react";

function NewsCard({ newsLog, headlineRank = -1 }: NewsCardProps) {
  const [isModalActive, setIsModalActive] = useState(false);

  const openModal = useCallback(() => setIsModalActive(true), []);
  const closeModal = useCallback(() => setIsModalActive(false), []);

  const handleReadMore = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
    },
    []
  );

  let cardClass = "news-card";
  if (newsLog.isHeadline) {
    if (headlineRank === 0) cardClass += " is-headline headline-primary";
    else if (headlineRank === 1) cardClass += " is-headline headline-secondary";
    else cardClass += " is-headline";
  }

  const dateStr = formatDate(newsLog.updatedAt);

  return (
    <>
      <article className={cardClass} onClick={openModal}>
        {/* Primary headline (rank 0) */}
        {headlineRank === 0 && (
          <>
            <div className="primary-image-wrap">
              {newsLog.imageUrl ? (
                <img className="primary-image" src={newsLog.imageUrl} alt="" loading="lazy" />
              ) : (
                <div className="primary-image-placeholder" />
              )}
            </div>
            <div className="primary-text">
              <div className="primary-meta">
                <span className="breaking-label">Breaking Today</span>
                <span className={`source-badge ${sourceBadgeClass(newsLog.level)}`}>{newsLog.level}</span>
              </div>
              <p className="primary-headline">{newsLog.headline}</p>
              <p className="primary-message">{newsLog.message}</p>
              <time className="primary-date">{dateStr}</time>
              <a href={newsLog.link} target="_blank" rel="noopener noreferrer" className="card-read-btn" onClick={handleReadMore}>
                Read full article →
              </a>
            </div>
          </>
        )}

        {/* Secondary headline (rank 1) */}
        {headlineRank === 1 && (
          <>
            {newsLog.imageUrl && (
              <img className="secondary-image" src={newsLog.imageUrl} alt="" loading="lazy" />
            )}
            <div className="secondary-text">
              <div className="secondary-meta">
                <span className="breaking-label">Breaking Today</span>
                <span className={`source-badge ${sourceBadgeClass(newsLog.level)}`}>{newsLog.level}</span>
              </div>
              <p className="secondary-headline">{newsLog.headline}</p>
              <p className="secondary-message">{newsLog.message}</p>
              <time className="secondary-date">{dateStr}</time>
              <a href={newsLog.link} target="_blank" rel="noopener noreferrer" className="card-read-btn" onClick={handleReadMore}>
                Read full article →
              </a>
            </div>
          </>
        )}

        {/* Editorial headline (rank 2+) */}
        {headlineRank >= 2 && (
          <div className="editorial-wrap">
            {newsLog.imageUrl ? (
              <img className="editorial-image" src={newsLog.imageUrl} alt="" loading="lazy" />
            ) : (
              <div className="editorial-placeholder" />
            )}
            <div className="editorial-vignette" />
            <div className="editorial-content">
              <div className="editorial-meta">
                <span className="breaking-label">Breaking Today</span>
                <span className={`source-badge ${sourceBadgeClass(newsLog.level)}`}>{newsLog.level}</span>
              </div>
              <p className="editorial-headline">{newsLog.headline}</p>
              <p className="editorial-message">{newsLog.message}</p>
              <time className="editorial-date">{dateStr}</time>
              <a href={newsLog.link} target="_blank" rel="noopener noreferrer" className="card-read-btn" onClick={handleReadMore}>
                Read full article →
              </a>
            </div>
          </div>
        )}

        {/* Regular story */}
        {!newsLog.isHeadline && (
          <>
            {newsLog.imageUrl && (
              <div className="news-card-image-wrap">
                <img className="news-card-image" src={newsLog.imageUrl} alt="" loading="lazy" />
              </div>
            )}
            <div className="news-card-header">
              <p className="news-headline">{newsLog.headline}</p>
              <div className="news-card-badges">
                <span className={`source-badge ${sourceBadgeClass(newsLog.level)}`}>{newsLog.level}</span>
              </div>
            </div>
            <div className="news-card-body">
              <p className="news-message">{newsLog.message}</p>
              <time className="news-date">{dateStr}</time>
              <a href={newsLog.link} target="_blank" rel="noopener noreferrer" className="card-read-btn" onClick={handleReadMore}>
                Read full article →
              </a>
            </div>
          </>
        )}
      </article>
      <NewsModal
        isActive={isModalActive}
        onClose={closeModal}
        source={newsLog.level}
        headline={newsLog.headline}
        link={newsLog.link}
        details={newsLog.message}
        imageUrl={newsLog.imageUrl ?? undefined}
      />
    </>
  );
}

export default NewsCard;
