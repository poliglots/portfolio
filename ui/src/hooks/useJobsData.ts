import { useState, useEffect, useMemo, useCallback } from "react";
import type { JobLog } from "../../../crawl/src/store";
import { fetchJobsData } from "../lib/dataService";
import {
  deduplicateJobs,
  sortJobs,
  extractLocations,
  extractSources,
  filterJobs,
} from "../lib/jobsService";

interface UseJobsDataReturn {
  jobsData: JobLog[];
  allJobs: JobLog[];
  locations: string[];
  sources: string[];
  sourceFilters: string[];
  locationFilters: string[];
  techFilters: string[];
  locationSearch: string;
  locationDropdownOpen: boolean;
  setLocationSearch: (s: string) => void;
  setLocationDropdownOpen: (o: boolean) => void;
  filtered: JobLog[];
  filteredLocations: string[];
  toggleSource: (src: string) => void;
  toggleLocation: (loc: string) => void;
  toggleTech: (tech: string) => void;
  clearAllFilters: () => void;
}

const TECH_STACKS = [
  "Python", "Java", "Go", "TypeScript", "JavaScript", "C++",
  "Rust", "Kotlin", "SQL", "AWS", "Kubernetes", "React", "Node.js", "ML", "AI",
];

export { TECH_STACKS };

/**
 * Loads, deduplicates, and filters jobs data.
 */
export function useJobsData(): UseJobsDataReturn {
  const [rawData, setRawData] = useState<JobLog[]>([]);

  // Filter state
  const [sourceFilters, setSourceFilters] = useState<string[]>([]);
  const [locationFilters, setLocationFilters] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [techFilters, setTechFilters] = useState<string[]>([]);

  // Load data
  useEffect(() => {
    fetchJobsData().then((data) => {
      const parsed = data as JobLog[];
      setRawData(parsed);
    });
  }, []);

  // Derived data
  const allJobs = useMemo(() => {
    const deduped = deduplicateJobs(rawData);
    return sortJobs(deduped);
  }, [rawData]);

  const locations = useMemo(() => extractLocations(rawData), [rawData]);
  const sources = useMemo(() => extractSources(rawData), [rawData]);

  const filteredLocations = useMemo(
    () => locations.filter((loc) => loc.toLowerCase().includes(locationSearch.toLowerCase())),
    [locations, locationSearch]
  );

  const filtered = useMemo(
    () => filterJobs(allJobs, { sourceFilters, locationFilters, techFilters }),
    [allJobs, sourceFilters, locationFilters, techFilters]
  );

  // Filter action helpers
  const toggleSource = useCallback((src: string) => {
    setSourceFilters((prev) =>
      prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]
    );
  }, []);

  const toggleLocation = useCallback((loc: string) => {
    setLocationFilters((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  }, []);

  const toggleTech = useCallback((tech: string) => {
    setTechFilters((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setSourceFilters([]);
    setLocationFilters([]);
    setTechFilters([]);
  }, []);

  return {
    jobsData: filtered,
    allJobs,
    locations,
    sources,
    sourceFilters,
    locationFilters,
    techFilters,
    locationSearch,
    locationDropdownOpen,
    setLocationSearch,
    setLocationDropdownOpen,
    filtered,
    filteredLocations,
    toggleSource,
    toggleLocation,
    toggleTech,
    clearAllFilters,
  };
}
