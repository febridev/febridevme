// navbar toFixed(
window.onscroll = function () {
  const header = document.querySelector("header");
  const fixedNav = header.offsetTop;

  if (window.pageYOffset > fixedNav) {
    header.classList.add("navbar-fixed");
  } else {
    header.classList.remove("navbar-fixed");
  }
};
// );
// copyright year
document.querySelector("#copyright-year").innerText = new Date().getFullYear();

// humberger
const hamburger = document.querySelector("#humberger");
const navMenu = document.querySelector("#nav-menu");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("humberger-active");
  navMenu.classList.toggle("hidden");
});
