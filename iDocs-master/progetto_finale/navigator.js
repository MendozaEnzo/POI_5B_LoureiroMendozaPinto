const hide = (elements) => {
   elements.forEach((element) => {
       element.classList.add("hidden");
       element.classList.remove("visible");
   });
};

const show = (element) => {
   element.classList.add("visible");
   element.classList.remove("hidden");
};

export const createNavigator = (parentElement) => {
   const pages = Array.from(parentElement.querySelectorAll(".page"));

   const render = () => {
       const url = new URL(document.location.href);
       const pageName = url.hash.replace("#", "") || "homepage"; 

       
       const selected = pages.find((page) => page.id === pageName) || pages[0];

       
       hide(pages);
       show(selected);
   };

   window.addEventListener("hashchange", render);
   render(); 
};

document.addEventListener("DOMContentLoaded", () => {
   const parentElement = document.body;
   createNavigator(parentElement);
});

