import { useMutation } from "@tanstack/react-query";

import { customInstance } from "@/shared/mutator";

export interface CharacterResult {
  anime: string;
  character: string;
  similarity: number;
  all_anime: string[];
  character_id: number;
}

export interface AnimeAggregatedResult {
  anime: string;
  score: number;
  characters: { name: string; similarity: number; character_id?: number }[];
  match_count: number;
  best_similarity: number;
  confidence: "very_high" | "high" | "medium" | "low";
}

export interface SearchResponse {
  results: CharacterResult[];
  aggregated: AnimeAggregatedResult[];
  top_anime: string;
  confidence: string;
  context_filtered?: boolean;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export interface DetectedCharacter {
  character: string;
  anime: string;
  character_id: number;
  similarity: number;
  bbox: BoundingBox;
  confidence: string;
  alternatives: {
    character: string;
    anime: string;
    character_id: number;
    similarity: number;
    all_anime: string[];
  }[];
}

export interface MultiSearchResponse {
  detected_characters: DetectedCharacter[];
  total_detected: number;
  anime_summary: AnimeAggregatedResult[];
  detection_method: string;
  context_filtered?: boolean;
}

export function useCharacterSearch() {
  return useMutation({
    mutationFn: async ({
      file,
      topK = 20,
      animeContext,
    }: {
      file: File;
      topK?: number;
      animeContext?: string;
    }) => {
      const formData = new FormData();
      formData.append("file", file);

      // Формируем query params в URL напрямую:
      // customInstance сериализует params только для GET
      const params = new URLSearchParams();
      params.append("top_k", String(topK));
      if (animeContext) params.append("anime_context", animeContext);

      return customInstance<SearchResponse>({
        url: `/character-search/search?${params}`,
        method: "POST",
        data: formData,
      });
    },
  });
}

export function useMultiCharacterSearch() {
  return useMutation({
    mutationFn: async ({
      file,
      minFaceConfidence = 0.5,
      topKPerFace = 3,
    }: {
      file: File;
      minFaceConfidence?: number;
      topKPerFace?: number;
    }) => {
      const formData = new FormData();
      formData.append("file", file);

      const params = new URLSearchParams({
        min_face_confidence: String(minFaceConfidence),
        top_k_per_face: String(topKPerFace),
      });

      return customInstance<MultiSearchResponse>({
        url: `/character-search/search-multi?${params}`,
        method: "POST",
        data: formData,
      });
    },
  });
}
