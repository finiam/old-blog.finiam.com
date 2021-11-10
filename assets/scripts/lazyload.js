import Lazyload from "vanilla-lazyload";

const lazyLoadInstance = new Lazyload();

window.addEventListener("turbo:load", () => {
  lazyLoadInstance.update();
});
