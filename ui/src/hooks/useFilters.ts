import { useState, useCallback } from "react";

/**
 * Reusable hook for managing a set of filter tags with remove capability.
 */
export function useFilterTags(initial: string[] = []): {
  tags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  clearAll: () => void;
  hasTags: boolean;
} {
  const [tags, setTags] = useState<string[]>(initial);

  const addTag = useCallback((tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
  }, []);

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const clearAll = useCallback(() => setTags([]), []);

  const hasTags = tags.length > 0;

  return { tags, addTag, removeTag, clearAll, hasTags };
}

/**
 * Reusable hook for a boolean filter toggle (active / inactive).
 */
export function useToggleFilter(initial: boolean = false): {
  isActive: boolean;
  toggle: () => void;
} {
  const [isActive, setIsActive] = useState(initial);
  const toggle = useCallback(() => setIsActive((p) => !p), []);
  return { isActive, toggle };
}
