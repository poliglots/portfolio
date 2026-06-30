import { useState, useCallback } from "react";
import type { PageName } from "../types";

/**
 * Manages page navigation state.
 * Provides setCurrentPage for use in any component.
 */
export function useNavigation() {
  const [currentPage, setCurrentPage] = useState<PageName>("landing");

  const navigateTo = useCallback((page: PageName) => {
    setCurrentPage(page);
  }, []);

  return { currentPage, navigateTo, setCurrentPage };
}
