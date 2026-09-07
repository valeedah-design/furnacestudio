export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { duration: 1.5 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

export const scrollToY = (y) => {
  if (window.__lenis) {
    window.__lenis.scrollTo(y, { duration: 1.5 });
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};
