let showPrices = false;

export function getShowPrices(): boolean {
  return showPrices;
}

export function setShowPrices(show: boolean): boolean {
  showPrices = show;
  return showPrices;
}
