"use client";
import type { Place } from "@/lib/constants";
import { useFavorites } from "@/hooks/use-favorites";
import PlaceCard from "./place-card";

/** غلاف كلاينت للكارت عشان يربط المفضلة المحفوظة محليًا */
export default function SimilarCard({ place, index = 0 }: { place: Place; index?: number }) {
  const { favs, toggle } = useFavorites();
  return <PlaceCard place={place} index={index} isFav={favs.includes(place.slug)} onFav={toggle} />;
}
