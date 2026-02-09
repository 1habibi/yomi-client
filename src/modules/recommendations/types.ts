import type {
  PersonalRecommendationDto,
  PersonalRecommendationsResponseDto,
  PopularAnimeResponseDto,
  SimilarAnimeResponseDto,
} from "@/shared/api/generated/model";

// Алиасы для более читаемых имён
export type PersonalRecommendations = PersonalRecommendationsResponseDto;
export type RecommendationItem = PersonalRecommendationDto;
export type SimilarAnime = SimilarAnimeResponseDto;
export type PopularAnime = PopularAnimeResponseDto;
