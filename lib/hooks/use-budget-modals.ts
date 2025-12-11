/**
 * Use Budget Modals Hook
 * Manages all modal states for budgets-v3
 */

import { useCallback } from 'react';
import { useBudgetsV3UIStore } from '@/lib/stores/budgets-v3-ui-store';

export function useBudgetModals() {
  const {
    modals,
    openIncomeAllocationModal,
    closeIncomeAllocationModal,
    openForecastDetailModal,
    closeForecastDetailModal,
    openHealthScoreModal,
    closeHealthScoreModal,
    openTemplateSelectionModal,
    closeTemplateSelectionModal,
  } = useBudgetsV3UIStore();

  const handleOpenModal = useCallback(
    (modalName: keyof typeof modals) => {
      switch (modalName) {
        case 'isIncomeAllocationModalOpen':
          openIncomeAllocationModal();
          break;
        case 'isForecastDetailModalOpen':
          openForecastDetailModal();
          break;
        case 'isHealthScoreModalOpen':
          openHealthScoreModal();
          break;
        case 'isTemplateSelectionModalOpen':
          openTemplateSelectionModal();
          break;
      }
    },
    [
      openIncomeAllocationModal,
      openForecastDetailModal,
      openHealthScoreModal,
      openTemplateSelectionModal,
    ]
  );

  const handleCloseModal = useCallback(
    (modalName: keyof typeof modals) => {
      switch (modalName) {
        case 'isIncomeAllocationModalOpen':
          closeIncomeAllocationModal();
          break;
        case 'isForecastDetailModalOpen':
          closeForecastDetailModal();
          break;
        case 'isHealthScoreModalOpen':
          closeHealthScoreModal();
          break;
        case 'isTemplateSelectionModalOpen':
          closeTemplateSelectionModal();
          break;
      }
    },
    [
      closeIncomeAllocationModal,
      closeForecastDetailModal,
      closeHealthScoreModal,
      closeTemplateSelectionModal,
    ]
  );

  const handleToggleModal = useCallback(
    (modalName: keyof typeof modals) => {
      if (modals[modalName]) {
        handleCloseModal(modalName);
      } else {
        handleOpenModal(modalName);
      }
    },
    [modals, handleOpenModal, handleCloseModal]
  );

  const closeAllModals = useCallback(() => {
    closeIncomeAllocationModal();
    closeForecastDetailModal();
    closeHealthScoreModal();
    closeTemplateSelectionModal();
  }, [
    closeIncomeAllocationModal,
    closeForecastDetailModal,
    closeHealthScoreModal,
    closeTemplateSelectionModal,
  ]);

  return {
    modals,
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
    toggleModal: handleToggleModal,
    closeAllModals,
  };
}
