import type { JobCardProps } from "../../types";
import JobModal from "../modals/JobModal";
import { cardClass } from "../../utils/sources";
import { stripHtml } from "../../utils/html";
import { formatDateLong } from "../../utils/formatting";
import { useState, useCallback } from "react";

function JobCard({ job }: JobCardProps) {
  const [isModalActive, setIsModalActive] = useState(false);
  const openModal = useCallback(() => setIsModalActive(true), []);
  const closeModal = useCallback(() => setIsModalActive(false), []);

  const postedDate = formatDateLong(job.postedAt);
  const plainDescription = stripHtml(job.jobDescription || job.message);
  const cardClassValue = cardClass(job.level);

  return (
    <>
      <article className={`job-card ${cardClassValue}`} onClick={openModal}>
        <p className="job-title">{job.title}</p>
        <div className="job-meta">
          <span>{job.location}</span>
          <span className="job-meta-sep">·</span>
          <time>{postedDate}</time>
        </div>
        <p className="job-message">{plainDescription}</p>
        <div className="job-footer">
          <span className={`source-badge ${cardClassValue}`}>{job.level}</span>
        </div>
      </article>
      <JobModal
        isActive={isModalActive}
        onClose={closeModal}
        source={job.level}
        title={job.title}
        company={job.company}
        location={job.location}
        url={job.url}
        jobDescription={job.jobDescription ?? ""}
        basicQualifications={job.basicQualifications ?? ""}
        preferredQualifications={job.preferredQualifications ?? ""}
      />
    </>
  );
}

export default JobCard;
