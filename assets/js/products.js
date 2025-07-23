document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.product-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  cards.forEach(card => observer.observe(card));
});



document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.product-card');

  // Lazy reveal on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));

  // Tab filtering
  const buttons = document.querySelectorAll('.tab-button');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // update active state
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter.toLowerCase();

      cards.forEach(card => {
        const tags = card.dataset.tags.toLowerCase();
        const shouldShow = filter === 'all' || tags.includes(filter);
        card.classList.toggle('hidden', !shouldShow);
      });
    });
  });
});



