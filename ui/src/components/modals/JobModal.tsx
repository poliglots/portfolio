import type { JobModalParams } from "../../types";
import BaseModal from "./BaseModal";
import { htmlToText } from "../../utils/html";

const KNOWN_SOURCES = ["aws", "google", "here", "mastercard"];

function JobModal({
  isActive,
  onClose,
  source,
  title,
  company,
  location,
  url,
  jobDescription,
  basicQualifications,
  preferredQualifications,
}: JobModalParams) {
  const sourceClass = KNOWN_SOURCES.includes(source) ? `source-${source}` : "source-default";

  return (
    <BaseModal isActive={isActive} onClose={onClose}>
      <div className={`m-dialog ${sourceClass}`}>
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
    </BaseModal>
  );
}

export default JobModal;
