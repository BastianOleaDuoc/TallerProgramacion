document.addEventListener("DOMContentLoaded", () => {

  const links = document.querySelectorAll('a[href]');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const target = this.getAttribute('target');
      
  
      if (
        href && 
        !href.startsWith('#') && 
        !href.startsWith('javascript:') && 
        target !== '_blank' &&
        this.hostname === window.location.hostname
      ) {
        e.preventDefault(); 
        const targetUrl = this.href;


        document.body.classList.add('page-exit');


        setTimeout(() => {
          window.location.href = targetUrl;
        }, 350); 
      }
    });
  });
});