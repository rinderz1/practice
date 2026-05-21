export const PAPER_STATUS = {
  PENDING_REVIEW: "pending_review",
  UNDER_REVIEW: "under_review",
  REVISION_REQUIRED: "revision_required",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

export const PAPER_STATUS_META = {
  [PAPER_STATUS.PENDING_REVIEW]: { label: "Ожидает проверки", variant: "info" },
  [PAPER_STATUS.UNDER_REVIEW]: { label: "На рецензировании", variant: "warning" },
  [PAPER_STATUS.REVISION_REQUIRED]: { label: "Требуется доработка", variant: "accent" },
  [PAPER_STATUS.ACCEPTED]: { label: "Принята", variant: "success" },
  [PAPER_STATUS.REJECTED]: { label: "Отклонена", variant: "danger" },
};

export const CONF_STATUS = {
  UPCOMING: "upcoming",
  ACTIVE: "active",
  COMPLETED: "completed",
  ARCHIVED: "archived",
};

export const CONF_STATUS_META = {
  [CONF_STATUS.UPCOMING]: { label: "Предстоит", variant: "info" },
  [CONF_STATUS.ACTIVE]: { label: "Активна", variant: "success" },
  [CONF_STATUS.COMPLETED]: { label: "Завершена", variant: "neutral" },
  [CONF_STATUS.ARCHIVED]: { label: "Архив", variant: "dark" },
};

export const RECOMMENDATION = {
  ACCEPTED: "accepted",
  REVISION: "revision",
  REJECTED: "rejected",
};

export const RECOMMENDATION_META = {
  [RECOMMENDATION.ACCEPTED]: { label: "Принять", variant: "success" },
  [RECOMMENDATION.REVISION]: { label: "Доработать", variant: "warning" },
  [RECOMMENDATION.REJECTED]: { label: "Отклонить", variant: "danger" },
};
