import { clean, stripHtml } from "../../utils/html.ts";

/**
 * Parse a raw Google Jobs row into a Job object.
 * Raw data is an array with positional fields from Google's internal format.
 */
export function parseGoogleRaw(raw: unknown[]): {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  jobDescription: string;
  basicQualifications: string;
  preferredQualifications: string;
  url: string;
  postedAt: string;
} {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = raw as any[];
  const id = String(r[0] ?? "");
  const descHtml: string = r[10]?.[1] ?? "";

  return {
    id,
    title: clean(r[1] ?? ""),
    company: clean(r[7] ?? "") || "Google",
    location: clean(r[9]?.[0]?.[0]),
    description: stripHtml(descHtml).slice(0, 250),
    jobDescription: clean(descHtml),
    basicQualifications: clean(r[3]?.[1] ?? ""),
    preferredQualifications: clean(r[4]?.[1] ?? ""),
    url: "", // filled by caller
    postedAt: r[12]?.[0]
      ? new Date(r[12][0] * 1000).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Parse a raw Mastercard job record into a Job object.
 */
export function parseMastercardRaw(raw: {
  jobId?: string;
  title?: string;
  descriptionTeaser?: string;
  cityStateCountry?: string;
  location?: string;
  applyUrl?: string;
  postedDate?: string;
}): {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  jobDescription: string;
  basicQualifications: string;
  preferredQualifications: string;
  url: string;
  postedAt: string;
} {
  const jobUrl = (raw.applyUrl ?? "").replace(/\/apply$/, "");

  return {
    id: clean(raw.jobId),
    title: clean(raw.title),
    company: "Mastercard",
    location: clean(raw.cityStateCountry ?? raw.location),
    description: clean(raw.descriptionTeaser),
    jobDescription: clean(raw.descriptionTeaser),
    basicQualifications: "",
    preferredQualifications: "",
    url: jobUrl || "",
    postedAt: raw.postedDate
      ? new Date(raw.postedDate).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Parse an AWS job record from the Amazon Jobs API response.
 */
export function parseAwsRaw(raw: Record<string, unknown>): {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  jobDescription: string;
  basicQualifications: string;
  preferredQualifications: string;
  url: string;
  postedAt: string;
} {
  return {
    id: String(raw.id_icims ?? ""),
    title: clean(raw.title),
    company: clean(raw.company_name) || "Amazon Web Services",
    location: clean(raw.location),
    description: clean(raw.description_short),
    jobDescription: clean(raw.description),
    basicQualifications: clean(raw.basic_qualifications),
    preferredQualifications: clean(raw.preferred_qualifications),
    url: "", // filled by caller
    postedAt: raw.posted_date
      ? new Date(raw.posted_date as string).toISOString()
      : new Date().toISOString(),
  };
}
