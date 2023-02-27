export default function tabsButton(buttons, tabs, button) {
   buttons.forEach(item => {
      item.addEventListener('click', () => {
         let currentBtn = item;
         let tabId = currentBtn.getAttribute("data-tab");
         let currentTab = document.querySelector(tabId);

         if (!currentBtn.classList.contains('_active')) {

            removeClass(buttons);
            removeClass(tabs);

            currentBtn.classList.add('_active');
            currentTab.classList.add('_active');
         }

         function removeClass(elem) {
            elem.forEach(item => {
               item.classList.remove('_active');
            });
         }

      });
      button.click();
   });
}