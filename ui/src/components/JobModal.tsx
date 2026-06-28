import { useEffect } from "react";

function htmlToText(html: string): string {
  return html
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

interface ModalParams {
  isActive: boolean;
  onClose: () => void;
  source: string;
  title: string;
  company: string;
  location: string;
  url: string;
  jobDescription: string;
  basicQualifications: string;
  preferredQualifications: string;
}

const KNOWN_SOURCES = ["aws", "google", "here", "mastercard"];

function JobModal({ isActive, onClose, source, title, company, location, url, jobDescription, basicQualifications, preferredQualifications }: ModalParams) {
  useEffect(() => {
    if (!isActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isActive, onClose]);

  if (!isActive) return null;

  const sourceClass = KNOWN_SOURCES.includes(source) ? `source-${source}` : "source-default";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`m-dialog ${sourceClass}`} onClick={(e) => e.stopPropagation()}>

        <div className="m-topbar">
          <span className="m-source-label">{company}</span>
          <button className="m-close" aria-label="close" onClick={onClose}>✕</button>
        </div>

        <div className="m-headline-section">
          <h2 className="m-headline">{title}</h2>
          <p className="m-location">{location}</p>
        </div>

        <div className="m-body">
          {jobDescription && (
            <div className="m-section">
              <h3 className="m-section-title">About the Role</h3>
              <p className="m-section-content">{htmlToText(jobDescription)}</p>
            </div>
          )}
          {basicQualifications && (
            <div className="m-section">
              <h3 className="m-section-title">Basic Qualifications</h3>
              <p className="m-section-content">{htmlToText(basicQualifications)}</p>
            </div>
          )}
          {preferredQualifications && (
            <div className="m-section">
              <h3 className="m-section-title">Preferred Qualifications</h3>
              <p className="m-section-content">{htmlToText(preferredQualifications)}</p>
            </div>
          )}
        </div>

        <div className="m-footer">
          <a href={url} target="_blank" rel="noopener noreferrer" className="m-cta-apply">
            Apply →
          </a>
          <button className="m-dismiss" onClick={onClose}>Dismiss</button>
        </div>

      </div>
    </div>
  );
}

export default JobModal;
