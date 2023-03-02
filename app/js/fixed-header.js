export default function animateHeader() {
   window.addEventListener('scroll', animHeaderOnScroll);

   function animHeaderOnScroll() {
      const header = document.querySelector('.header');
      const promo = document.querySelector('.promo');

      window.pageYOffset >= promo.offsetHeight ? header.classList.add('_active') : header.classList.remove('_active');
   }
}