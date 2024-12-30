import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

import { MusicActivity } from "@/services/activities";

export interface FilterOptions {
  categories?: string[],
  places?: string[],
}

interface ContextData {
  activities: MusicActivity[],
  setActivities(value: MusicActivity[]): void,
  placesFilter: FilterOptions["places"],
  setPlacesFilter(value: FilterOptions["places"]): void,
  categoriesFilter: FilterOptions["categories"],
  setCategoriesFilter(value: FilterOptions["categories"]): void,
  update(): void,
  updatedAt: Date | null,
  loading: boolean,
}

const ActivitiesContext = createContext<ContextData>({} as ContextData)

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<MusicActivity[]>([]);
  const [placesFilter, setPlacesFilter] = useState<FilterOptions["places"]>([]);
  const [categoriesFilter, setCategoriesFilter] = useState<FilterOptions["categories"]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const update = useCallback(() => {
    setLoading(true);

    fetch('/api/activities')
      .then(res => res.json() as Promise<MusicActivity[]>)
      .then(response => {
        setActivities(response);
        setUpdatedAt(new Date());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [])

  useEffect(() => {
    update()
  }, [update]);

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        setActivities,
        categoriesFilter,
        setCategoriesFilter,
        placesFilter,
        setPlacesFilter,
        update,
        updatedAt,
        loading,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  )
}

export function useActivities() {
  const context = useContext(ActivitiesContext);

  return context
}