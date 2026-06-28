import { useState } from "react";
import JobModal from "./JobModal";
import type { JobLog } from "../../crawl/src/store";

const stripHtml = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s{2,}/g, " ").trim();

const KNOWN_SOURCES = ["aws", "google", "here", "mastercard"];

function cardClass(level: string) {
  return KNOWN_SOURCES.includes(level) ? `card-${level}` : "card-default";
}

function badgeClass(level: string) {
  return KNOWN_SOURCES.includes(level) ? `source-badge source-${level}` : "source-badge source-default";
}

function JobCard({ job }: { job: JobLog }) {
  const [isModalActive, setIsModalActive] = useState(false);

  return (
    <>
      <article className={`job-card ${cardClass(job.level)}`} onClick={() => setIsModalActive(true)}>
        <p className="job-title">{job.title}</p>
        <div className="job-meta">
          <span>{job.location}</span>
          <span className="job-meta-sep">·</span>
          <time>{new Date(job.postedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
        </div>
        <p className="job-message">{stripHtml(job.jobDescription || job.message)}</p>
        <div className="job-footer">
          <span className={badgeClass(job.level)}>{job.level}</span>
        </div>
      </article>
      <JobModal
        isActive={isModalActive}
        onClose={() => setIsModalActive(false)}
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
