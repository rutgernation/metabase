import type { CardId, DashCardId } from "metabase-types/api";

export function getCardKey(cardId: CardId | undefined) {
  return `${cardId ?? "unsaved"}`;
}

export const getChartSelector = (
  input: { dashcardId: number | undefined } | { cardId: number | undefined },
) => {
  if ("dashcardId" in input) {
    return `[data-dashcard-key='${input.dashcardId}']`;
  } else {
    return `[data-card-key='${getCardKey(input.cardId)}']`;
  }
};

/**
 * Picks a chart DOM selector for PNG export. When a question is opened from a
 * dashboard, `dashcardId` may still be set on the card even in the query builder,
 * where only `data-card-key` exists — prefer whichever element is in the DOM.
 */
export const resolveChartImageSelector = ({
  dashcardId,
  cardId,
}: {
  dashcardId?: DashCardId | null;
  cardId?: CardId | null;
}): string => {
  if (dashcardId != null) {
    const dashcardSelector = getChartSelector({ dashcardId });
    if (document.querySelector(dashcardSelector)) {
      return dashcardSelector;
    }
  }

  return getChartSelector({ cardId });
};
