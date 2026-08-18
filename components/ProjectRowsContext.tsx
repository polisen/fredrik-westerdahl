'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ProjectRowId = string;

type ProjectRowsContextValue = {
  selectedId: ProjectRowId | null;
  select: (id: ProjectRowId) => void;
  isSelected: (id: ProjectRowId) => boolean;
};

const ProjectRowsContext = createContext<ProjectRowsContextValue | null>(null);

export function ProjectRowsProvider({
  children,
  defaultSelectedId = null,
}: {
  children: ReactNode;
  defaultSelectedId?: ProjectRowId | null;
}) {
  const [selectedId, setSelectedId] = useState<ProjectRowId | null>(
    defaultSelectedId
  );

  const select = useCallback((id: ProjectRowId) => {
    setSelectedId(id);
  }, []);

  const value = useMemo(
    () => ({
      selectedId,
      select,
      isSelected: (id: ProjectRowId) => selectedId === id,
    }),
    [selectedId, select]
  );

  return (
    <ProjectRowsContext.Provider value={value}>
      {children}
    </ProjectRowsContext.Provider>
  );
}

export function useProjectRows() {
  const ctx = useContext(ProjectRowsContext);
  if (!ctx) {
    throw new Error('useProjectRows must be used within ProjectRowsProvider');
  }
  return ctx;
}

/** Collapsed project row height vs full (1.0). */
export const PROJECT_ROW_COLLAPSED_SCALE = 0.66;
export const PROJECT_ROW_EXPANDED_SCALE = 1;
