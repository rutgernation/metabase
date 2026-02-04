import { getChartSelector } from "metabase/viz-core";
import type { CardId, DashCardId } from "metabase-types/api";

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

  return getChartSelector({ cardId: cardId ?? undefined });
};
