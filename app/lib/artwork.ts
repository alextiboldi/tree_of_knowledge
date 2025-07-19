// Artwork categories
export enum ArtworkCategory {
  Tree = "tree",
  Creature = "creature",
  Education = "education",
  UI = "ui",
  Landing = "landing",
  Fallback = "fallback",
}

// Knowledge domains
export enum Domain {
  Science = "science",
  Nature = "nature",
  Math = "math",
}

// Growth states for tree branches
export enum GrowthState {
  Empty = "empty",
  Growing01 = "growing_01",
  Growing02 = "growing_02",
  Growing03 = "growing_03",
}

// Base paths for artwork assets
export const ARTWORK_BASE_PATH = "/artwork";

// Interface for artwork asset metadata
export interface ArtworkAsset {
  filename: string;
  category: ArtworkCategory;
  domain?: Domain;
  concept: string;
  variant?: string;
  width: number;
  height: number;
}

/**
 * Get the full path for an artwork asset
 */
export function getArtworkPath(asset: ArtworkAsset): string {
  const { category, filename } = asset;
  return `${ARTWORK_BASE_PATH}/${category}/${filename}`;
}

/**
 * Generate a filename for an artwork asset following the naming convention:
 * [category]_[domain]_[concept]_[variant].png
 */
export function generateArtworkFilename(asset: ArtworkAsset): string {
  const parts = [
    asset.category,
    asset.domain,
    asset.concept,
    asset.variant,
  ].filter(Boolean);

  return `${parts.join("_")}.png`;
}

/**
 * Tree artwork assets
 */
export const TreeArtwork = {
  // Base tree structure
  BASE_TRUNK: {
    filename: "tree_base_trunk_main.png",
    category: ArtworkCategory.Tree,
    concept: "base_trunk",
    variant: "main",
    width: 1200,
    height: 800,
  } as ArtworkAsset,

  BASE_ROOTS: {
    filename: "tree_base_roots_main.png",
    category: ArtworkCategory.Tree,
    concept: "base_roots",
    variant: "main",
    width: 1200,
    height: 400,
  } as ArtworkAsset,

  BASE_BACKGROUND: {
    filename: "tree_base_background_magical.png",
    category: ArtworkCategory.Tree,
    concept: "base_background",
    variant: "magical",
    width: 1920,
    height: 1080,
  } as ArtworkAsset,

  // Domain branches (static)
  SCIENCE_BRANCH_EMPTY: {
    filename: "tree_branch_science_empty.png",
    category: ArtworkCategory.Tree,
    domain: Domain.Science,
    concept: "branch",
    variant: GrowthState.Empty,
    width: 1024,
    height: 1024,
  } as ArtworkAsset,

  NATURE_BRANCH_EMPTY: {
    filename: "tree_branch_nature_empty.png",
    category: ArtworkCategory.Tree,
    domain: Domain.Nature,
    concept: "branch",
    variant: GrowthState.Empty,
    width: 1024,
    height: 1024,
  } as ArtworkAsset,

  MATH_BRANCH_EMPTY: {
    filename: "tree_branch_math_empty.png",
    category: ArtworkCategory.Tree,
    domain: Domain.Math,
    concept: "branch",
    variant: GrowthState.Empty,
    width: 1024,
    height: 1024,
  } as ArtworkAsset,

  // Helper function to get branch asset by domain and growth state
  getBranchAsset(domain: Domain, growthState: GrowthState): ArtworkAsset {
    return {
      filename: `tree_branch_${domain}_${growthState}.png`,
      category: ArtworkCategory.Tree,
      domain,
      concept: "branch",
      variant: growthState,
      width: 1024,
      height: 1024,
    };
  },
};

/**
 * Creature artwork assets
 */
export const CreatureArtwork = {
  // Science creatures
  SCIENCE_OWL_NEUTRAL: {
    filename: "creature_science_professor_owl_neutral.png",
    category: ArtworkCategory.Creature,
    domain: Domain.Science,
    concept: "professor_owl",
    variant: "neutral",
    width: 512,
    height: 512,
  } as ArtworkAsset,

  // Nature creatures
  NATURE_FOX_NEUTRAL: {
    filename: "creature_nature_forest_fox_neutral.png",
    category: ArtworkCategory.Creature,
    domain: Domain.Nature,
    concept: "forest_fox",
    variant: "neutral",
    width: 512,
    height: 512,
  } as ArtworkAsset,

  // Math creatures
  MATH_BEAR_NEUTRAL: {
    filename: "creature_math_counting_bear_neutral.png",
    category: ArtworkCategory.Creature,
    domain: Domain.Math,
    concept: "counting_bear",
    variant: "neutral",
    width: 512,
    height: 512,
  } as ArtworkAsset,

  // Helper function to get creature asset by domain and variant
  getCreatureAsset(
    domain: Domain,
    concept: string,
    variant: string
  ): ArtworkAsset {
    return {
      filename: `creature_${domain}_${concept}_${variant}.png`,
      category: ArtworkCategory.Creature,
      domain,
      concept,
      variant,
      width: 512,
      height: 512,
    };
  },
};

/**
 * Educational concept artwork assets
 */
export const EducationalArtwork = {
  // Helper function to get educational asset
  getEducationalAsset(
    domain: Domain,
    concept: string,
    variant: string = "01"
  ): ArtworkAsset {
    return {
      filename: `education_${domain}_${concept}_${variant}.png`,
      category: ArtworkCategory.Education,
      domain,
      concept,
      variant,
      width: 1024,
      height: 1024,
    };
  },
};

/**
 * UI element artwork assets
 */
export const UIArtwork = {
  SPARKLES: {
    filename: "ui_sparkles_01.png",
    category: ArtworkCategory.UI,
    concept: "sparkles",
    variant: "01",
    width: 512,
    height: 512,
  } as ArtworkAsset,

  LOADING: {
    filename: "ui_loading_animation_01.png",
    category: ArtworkCategory.UI,
    concept: "loading_animation",
    variant: "01",
    width: 512,
    height: 512,
  } as ArtworkAsset,

  // Helper function to get UI asset
  getUIAsset(concept: string, variant: string = "01"): ArtworkAsset {
    return {
      filename: `ui_${concept}_${variant}.png`,
      category: ArtworkCategory.UI,
      concept,
      variant,
      width: 512,
      height: 512,
    };
  },
};

/**
 * Fallback artwork assets
 */
export const FallbackArtwork = {
  GENERAL_LEARNING: {
    filename: "fallback_general_learning_01.png",
    category: ArtworkCategory.Fallback,
    concept: "general_learning",
    variant: "01",
    width: 1024,
    height: 1024,
  } as ArtworkAsset,

  // Helper function to get fallback asset
  getFallbackAsset(concept: string, variant: string = "01"): ArtworkAsset {
    return {
      filename: `fallback_${concept}_${variant}.png`,
      category: ArtworkCategory.Fallback,
      concept,
      variant,
      width: 1024,
      height: 1024,
    };
  },
};
