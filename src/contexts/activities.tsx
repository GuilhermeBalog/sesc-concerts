import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

import { Activity, Sesc } from "@/services/sesc";

export interface MusicActivity {
  id: number,
  image: string,
  link: string,
  title: string,
  subtitle: string
  places: (string | null)[],
  date: Date,
  categories: string[]
}

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

function formatActivities(activities: Activity[]): MusicActivity[] {
  return activities.map(activity => ({
    id: activity.id,
    image: activity.imagem,
    link: `${Sesc.DOMAIN}${activity.link}`,
    title: activity.titulo,
    subtitle: activity.complemento,
    places: activity.unidade.map(unit => unit.name),
    date: new Date(activity.dataProxSessao),
    categories: activity.categorias.map(category => category.titulo),
  }))
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

    const sesc = new Sesc();
    sesc.getAllActivities().then(data => {
      setActivities(formatActivities(data.atividade))
      setUpdatedAt(new Date());
      setLoading(false);
    })
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