export const PAPER_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  REVIEWED: "reviewed",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  REVISION: "revision",
  WITHDRAWN: "withdrawn",
};

export const PAPER_STATUS_META = {
  [PAPER_STATUS.DRAFT]: { label: "Черновик", variant: "neutral" },
  [PAPER_STATUS.SUBMITTED]: { label: "Отправлена", variant: "info" },
  [PAPER_STATUS.UNDER_REVIEW]: { label: "На рецензии", variant: "warning" },
  [PAPER_STATUS.REVIEWED]: { label: "Рецензирована", variant: "primary" },
  [PAPER_STATUS.ACCEPTED]: { label: "Принята", variant: "success" },
  [PAPER_STATUS.REJECTED]: { label: "Отклонена", variant: "danger" },
  [PAPER_STATUS.REVISION]: { label: "Требует доработки", variant: "accent" },
  [PAPER_STATUS.WITHDRAWN]: { label: "Отозвана", variant: "dark" },
};
