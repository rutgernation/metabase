import { resolveChartImageSelector } from "./chart-dom-selectors";

describe("resolveChartImageSelector", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("uses dashcard selector when the dashcard element is in the DOM", () => {
    document.body.innerHTML =
      '<div data-dashcard-key="42"></div><div data-card-key="1"></div>';

    expect(
      resolveChartImageSelector({ dashcardId: 42, cardId: 1 }),
    ).toBe("[data-dashcard-key='42']");
  });

  it("falls back to card selector when dashcardId is set but not in the DOM", () => {
    document.body.innerHTML = '<div data-card-key="1"></div>';

    expect(
      resolveChartImageSelector({ dashcardId: 42, cardId: 1 }),
    ).toBe("[data-card-key='1']");
  });

  it("uses card selector when dashcardId is not provided", () => {
    document.body.innerHTML = '<div data-card-key="unsaved"></div>';

    expect(resolveChartImageSelector({ cardId: undefined })).toBe(
      "[data-card-key='unsaved']",
    );
  });
});
