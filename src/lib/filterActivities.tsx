import { FilterOptions } from "@/contexts/activities";
import { MusicActivity } from "@/services/activities";

export function filterActivities(activities: MusicActivity[], { places, categories }: FilterOptions): MusicActivity[] {
  return activities.filter(activity => (
    matchPlaces(activity, places) &&
    matchCategories(activity, categories)
  ));

  function matchPlaces(activity: MusicActivity, places?: (string | null)[]) {
    if (!places) return true;
    if (!places.length) return true;

    const placesSet = new Set(places);

    return activity.places.some(place => placesSet.has(place));
  }

  function matchCategories(activity: MusicActivity, categories?: string[]) {
    if (!categories) return true;
    if (!categories.length) return true;

    const categoriesSet = new Set(categories);

    return activity.categories.some(category => categoriesSet.has(category));
  }
}
