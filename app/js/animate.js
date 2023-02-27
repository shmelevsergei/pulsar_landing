export default function animateBlocks() {
   function animateHeader() {
      window.addEventListener('scroll', animHeaderOnScroll);

      function animHeaderOnScroll() {
         const header = document.querySelector('.header');
         const promo = document.querySelector('.promo');

         window.pageYOffset >= promo.offsetHeight ? header.classList.add('_active') : header.classList.remove('_active');
      }
   }
   animateHeader();

   const animItems = document.querySelectorAll('._anim-item');

   if (animItems.length > 0) {
      window.addEventListener('scroll', animOnScroll);
      function animOnScroll(params) {
         for (let index = 0; index < animItems.length; index++) {
            const animItem = animItems[index];
            const animItemHeight = animItem.offsetHeight;
            const animItemOffset = offset(animItem).top;
            const animStart = 3;

            let animItemPoint = window.innerHeight - animItemHeight / animStart;
            if (animItemHeight > window.innerHeight) {
               let animItemPoint = window.innerHeight - window.innerHeight / animStart;
            }

            if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
               animItem.classList.add('_active');
            } else {
               animItem.classList.remove('_active');
            }

         }
      }
   }
   function offset(el) {
      const rect = el.getBoundingClientRect(),
         scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
         scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
   }
}
