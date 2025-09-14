import { ModelData, Collection } from '../types/home';
import { convertHouseToModel } from '../data/realModelsData';
import { toggleItemInArray, canAddToCompare, getNextImageIndex, getPreviousImageIndex } from '../utils/navigationHelpers';
import { DEFAULT_VALUES } from '../constants/home';

interface UseHomeActionsProps {
  actions: {
    setSelectedModel: (model: ModelData | null) => void;
    setMainTab: (tab: 'collections' | 'model-details') => void;
    setCurrentImageIndex: (index: number) => void;
    setSelectedCollection: (collection: Collection) => void;
    setFavorites: (favorites: string[] | ((prev: string[]) => string[])) => void;
    setCompareList: (compareList: string[] | ((prev: string[]) => string[])) => void;
    setShowComparison: (show: boolean) => void;
    setCurrent360Model: (model: ModelData | null) => void;
    setIs360ViewerOpen: (open: boolean) => void;
    setDetailedModel: (model: ModelData | null) => void;
  };
  state: {
    currentImageIndex: number;
    compareList: string[];
  };
}

/**
 * Custom hook for home page actions
 */
export function useHomeActions({ actions, state }: UseHomeActionsProps) {
  // Handle 360 viewer
  const handle360ViewerOpen = (model: ModelData) => {
    actions.setCurrent360Model(model);
    actions.setIs360ViewerOpen(true);
  };

  const handle360ViewerClose = () => {
    actions.setIs360ViewerOpen(false);
    actions.setCurrent360Model(null);
  };

  // Navigation functions
  const nextImage = () => {
    const nextIndex = getNextImageIndex(state.currentImageIndex);
    actions.setCurrentImageIndex(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = getPreviousImageIndex(state.currentImageIndex);
    actions.setCurrentImageIndex(prevIndex);
  };

  // Handle model selection
  const handleModelSelect = (model: ModelData) => {
    // Конвертируем модель в полный формат для детального просмотра
    const fullModel = convertHouseToModel(model);
    actions.setDetailedModel(fullModel);
  };

  // Handle model selection for main tab (old functionality)
  const handleModelSelectForTab = (model: ModelData) => {
    actions.setSelectedModel(model);
    actions.setMainTab('model-details');
    actions.setCurrentImageIndex(0);
  };

  // Handle collection click
  const handleCollectionClick = (collectionId: Collection) => {
    actions.setSelectedCollection(collectionId);
  };

  // Toggle favorite
  const toggleFavorite = (modelId: string) => {
    actions.setFavorites(prev => toggleItemInArray(prev, modelId));
  };

  // Toggle compare
  const toggleCompare = (modelId: string) => {
    actions.setCompareList(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else if (canAddToCompare(prev, DEFAULT_VALUES.MAX_COMPARE_ITEMS)) {
        return [...prev, modelId];
      } else {
        alert(`You can compare up to ${DEFAULT_VALUES.MAX_COMPARE_ITEMS} models at once`);
        return prev;
      }
    });
  };

  // Chat handler
  const onOpenChat = () => {
    console.log('Opening chat...');
  };

  return {
    handle360ViewerOpen,
    handle360ViewerClose,
    nextImage,
    prevImage,
    handleModelSelect,
    handleModelSelectForTab,
    handleCollectionClick,
    toggleFavorite,
    toggleCompare,
    onOpenChat
  };
}
