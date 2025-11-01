let globalSlideIndex = 0;
let globalInterval: NodeJS.Timeout | null = null;

export const getSliderState = () => globalSlideIndex;

export const setSliderState = (index: number) => {
  globalSlideIndex = index;
};

export const startSlider = (callback: (index: number) => void, totalSlides: number) => {
  if (globalInterval) clearInterval(globalInterval);
  globalInterval = setInterval(() => {
    globalSlideIndex = (globalSlideIndex + 1) % totalSlides;
    callback(globalSlideIndex);
  }, 3000);
};

export const stopSlider = () => {
  if (globalInterval) {
    clearInterval(globalInterval);
    globalInterval = null;
  }
};