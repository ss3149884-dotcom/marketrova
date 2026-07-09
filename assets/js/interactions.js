(function () {
  window.MarketRova = window.MarketRova || {};

  window.MarketRova.motion = {
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    finePointer: window.matchMedia("(hover: hover) and (pointer: fine)").matches
  };

  window.MarketRova.getData = function (key) {
    return (window.MARKETROVA_DATA && window.MARKETROVA_DATA[key]) || [];
  };
})();
