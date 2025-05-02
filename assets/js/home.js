// JS da Home
// Funcionalidade pra rodar os cards do seminovos

  const container = document.querySelector('.carousel-container');
  const next = document.querySelector('.carousel-btn.next');
  const prev = document.querySelector('.carousel-btn.prev');

  next.addEventListener('click', () => {
    container.scrollBy({ left: 320, behavior: 'smooth' });
  });

  prev.addEventListener('click', () => {
    container.scrollBy({ left: -320, behavior: 'smooth' });
  });


// fim da funionalidade

