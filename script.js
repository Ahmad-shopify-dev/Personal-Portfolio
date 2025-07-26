document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    }, {
      threshold: 0.1
    });

    sections.forEach(section => {
      observer.observe(section);
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const drawerClose = document.querySelector('.drawer-close');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerNavLinks = document.querySelectorAll('.drawer-nav a'); // Get all links in the drawer

    // Function to open the drawer
    const openDrawer = () => {
        mobileDrawer.classList.add('is-open');
        drawerOverlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden'; // Prevent scrolling on body
    };

    // Function to close the drawer
    const closeDrawer = () => {
        mobileDrawer.classList.remove('is-open');
        drawerOverlay.classList.remove('is-visible');
        document.body.style.overflow = ''; // Restore scrolling on body
    };

    // Event listener for opening the drawer
    menuToggle.addEventListener('click', openDrawer);

    // Event listener for closing the drawer
    drawerClose.addEventListener('click', closeDrawer);

    // Event listener for closing the drawer by clicking the overlay
    drawerOverlay.addEventListener('click', closeDrawer);

    // Event listener for closing the drawer when a navigation link is clicked
    drawerNavLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Optional: Prevent default scroll if you're using a smooth scroll library
            // event.preventDefault();
            closeDrawer();
            // Optional: Manually scroll to the section if you prevented default
            // const targetId = link.getAttribute('href').substring(1);
            // document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Close drawer on resize (if it was open) - useful for changing from mobile to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileDrawer.classList.contains('is-open')) {
            closeDrawer();
        }
    });
});



document.addEventListener('DOMContentLoaded', () => {
    // --- Case Study Carousel Logic ---
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselTrack = document.querySelector('.carousel-track');
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    const prevButton = document.querySelector('.carousel-button.prev-button');
    const nextButton = document.querySelector('.carousel-button.next-button');

    if (carouselContainer && carouselTrack && caseStudyCards.length > 0 && prevButton && nextButton) {
        let currentIndex = 0;
        const totalCards = caseStudyCards.length;
        let itemsPerPage = 3; // Default for desktop
        let cardWidthWithGap = 0; // Will be calculated dynamically
        let innerWidth = window.innerWidth;
        const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--carousel-gap') * 16) || 24;

        // Function to determine items per page based on screen size
        const getItemsPerPage = () => {
            const width = window.innerWidth;
            if (width >= 1025) return 3;
            else if (width >= 769) return 2;
            else return 1;
        };

        // Function to calculate total track width
        const calculateTrackWidth = () => {
            let totalWidth = 0;
            caseStudyCards.forEach((card, index) => {
                const cardWidth = card.offsetWidth;
                // Add gap for all cards except the last one
                totalWidth += cardWidth + (index < totalCards - 1 ? gap : 0);
            });
            return totalWidth;
        };

        // Function to update the carousel's position and UI
        const updateCarousel = () => {
            itemsPerPage = getItemsPerPage();
            const maxIndex = Math.max(0, totalCards - itemsPerPage);
            currentIndex = Math.min(currentIndex, maxIndex);

            // Calculate card width including gap (except for last card)
            cardWidthWithGap = caseStudyCards[0] ? caseStudyCards[0].offsetWidth + gap : 0;

            // Calculate offset
            let offset;
            if (currentIndex === maxIndex) {
                // Align the last set of cards to the right of the container
                const trackWidth = calculateTrackWidth();
                const containerWidth = carouselContainer.offsetWidth;
                offset = -(trackWidth - containerWidth);
            } else {
                offset = (-currentIndex * cardWidthWithGap);
            }

            // Ensure offset doesn't push content out of view
            offset = Math.max(offset, -(calculateTrackWidth() - carouselContainer.offsetWidth));
            if(offset === -(calculateTrackWidth() - carouselContainer.offsetWidth) && innerWidth > 768) {
                offset = offset - 20;
            }
            carouselTrack.style.transform = `translateX(${offset}px)`;

            // Update button states
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex >= maxIndex;
        };

        // Handle navigation
        const nextSlide = () => {
            const maxIndex = Math.max(0, totalCards - itemsPerPage);
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        };

        const prevSlide = () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        };

        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);

        // Handle window resize
        const handleResize = () => {
            itemsPerPage = getItemsPerPage();
            currentIndex = 0; // Reset index
            updateCarousel();
        };

        // Initialize carousel
        const initCarousel = () => {
            itemsPerPage = getItemsPerPage();
            cardWidthWithGap = caseStudyCards[0] ? caseStudyCards[0].offsetWidth + gap : 0;
            updateCarousel();
        };

        window.addEventListener('resize', () => {
            innerWidth = window.innerWidth;
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(handleResize, 250);
        });

        initCarousel();
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const impactSection = document.getElementById('impactSection');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animationTriggered = false; // Flag to ensure animation runs only once

    const animateNumber = (element) => {
        const target = parseInt(element.dataset.target);
        const duration = 2000; // 2 seconds
        const start = 0;
        let startTime = null;

        const formatNumber = (num) => {
            // Add comma separators for large numbers
            return num.toLocaleString('en-US');
        };

        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const currentValue = Math.floor(progress * (target - start) + start);
            element.textContent = formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = formatNumber(target); // Ensure final value is exact
            }
        };

        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationTriggered) {
                statNumbers.forEach(animateNumber);
                animationTriggered = true; // Set flag to true after animating
                observer.unobserve(impactSection); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the section is visible
    });

    if (impactSection) {
        observer.observe(impactSection);
    }
});




document.addEventListener('DOMContentLoaded', () => {
    // No longer using a JS array for all data; fetching from HTML data attributes
    const carouselImagesContainer = document.querySelector('.carousel-images-container');
    if(carouselImagesContainer) {
        const prevBtn = document.getElementById('prevImageBtn');
        const nextBtn = document.getElementById('nextImageBtn');
        const dynamicCarouselHeading = document.getElementById('dynamicCarouselHeading');
        const dynamicCarouselDescription = document.getElementById('dynamicCarouselDescription');
    
        const itemsInDOM = document.querySelectorAll('.carousel-image-item');
        let currentIndex = 0; // Start with the first image as active
        const numItems = itemsInDOM.length;
    
        // Function to update the carousel display
        const updateCarousel = (newIndex) => {
            // Ensure infinite loop
            currentIndex = (newIndex + numItems) % numItems;
    
            // Get the currently active item from the DOM
            const currentActiveItem = itemsInDOM[currentIndex];
    
            // Update dynamic text with fade effect
            const newHeading = currentActiveItem?.dataset.heading;
            const newBodyText = currentActiveItem?.dataset.bodyText;
    
            dynamicCarouselHeading.style.opacity = 0;
            dynamicCarouselDescription.style.opacity = 0;
    
            setTimeout(() => {
                dynamicCarouselHeading.textContent = newHeading;
                dynamicCarouselDescription.textContent = newBodyText;
                dynamicCarouselHeading.style.opacity = 1;
                dynamicCarouselDescription.style.opacity = 1;
            }, 300); // Match CSS transition duration
    
            itemsInDOM.forEach((item, index) => {
                item.classList.remove('active', 'prev-1', 'next-1', 'prev-2', 'next-2');
    
                // Calculate logical position relative to the active item
                let position = (index - currentIndex + numItems) % numItems;
    
                // Adjust position for visual display (e.g., if item 0 is active and we want item numItems-1 to be prev-1)
                if (position > numItems / 2) {
                    position -= numItems;
                } else if (position < -numItems / 2) {
                    position += numItems;
                }
    
                if (position === 0) {
                    item.classList.add('active');
                } else if (position === -1) {
                    item.classList.add('prev-1');
                } else if (position === 1) {
                    item.classList.add('next-1');
                } else if (position === -2) {
                    item.classList.add('prev-2');
                } else if (position === 2) {
                    item.classList.add('next-2');
                }
                // Items with distance > 2 or < -2 will have no class and be hidden by default CSS
            });
        };
    
        // Initial setup
        // No need for createCarouselItems() as content is in HTML
        updateCarousel(0); // Position items and set initial text
    
        // Event Listeners for navigation buttons
        prevBtn.addEventListener('click', () => {
            updateCarousel(currentIndex - 1);
        });
    
        nextBtn.addEventListener('click', () => {
            updateCarousel(currentIndex + 1);
        });
    }
});



window.addEventListener("scroll", function () {
    const card = document.getElementById("stickyCard");
    if (window.scrollY > 150) {
      card.classList.add("show");
    } else {
      card.classList.remove("show");
    }

    const progressCircle = document.querySelector('.scroll-indicator .progress');
    const scrollPercentText = document.getElementById('scrollPercent');
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    // Update circle stroke
    const offset = 283 - (scrollPercent / 100) * 283;
    progressCircle.style.strokeDashoffset = offset;

    // Update percent text
    scrollPercentText.textContent = `${scrollPercent}%`;
});



// BLOGS FILTER CODE
let searchInput = document.querySelector('.stack_blogs_search-input');
if(searchInput) {
    searchInput.addEventListener('input', function (e) {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.stack_blogs_card');
    
      cards.forEach(card => {
        const title = card.querySelector('.stack_blogs_card_title').textContent.toLowerCase();
        const desc = card.querySelector('.stack_blogs_card_description').textContent.toLowerCase();
    
        if (title.includes(query) || desc.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
    document.querySelectorAll('.stack_blogs_card_button').forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const card = this.closest('.stack_blogs_card');
        const content = card.innerHTML;
        document.getElementById('stack_blogs_modal_inner').innerHTML = content;
        document.getElementById('stack_blogs_modal').classList.add('active');
      });
    });
    document.getElementById('stack_blogs_modal_close').addEventListener('click', () => {
      document.getElementById('stack_blogs_modal').classList.remove('active');
    });
    document.getElementById('stack_blogs_modal_overlay').addEventListener('click', () => {
      document.getElementById('stack_blogs_modal').classList.remove('active');
    });
}



// CASE STUDY CAROUSEL CODE
let casestudyButtons = document.querySelectorAll('.view-case-study-btn.case_stk_button');
if(casestudyButtons) {
    casestudyButtons.forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const parentCard = this.closest('.case-study-card');
        const blogContent = parentCard.querySelector('.blog_original_container').innerHTML;
        
        const modal = document.getElementById('case-study-modal');
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = blogContent;
        modal.classList.remove('hidden');
      });
    });
  
    // Close modal
    document.querySelector('.modal-close')?.addEventListener('click', function () {
      document.getElementById('case-study-modal').classList.add('hidden');
    });
  
    // Close modal when clicking outside the modal content
    document.getElementById('case-study-modal')?.addEventListener('click', function (e) {
      if (e.target === this) {
        this.classList.add('hidden');
      }
    });
}



// RESUME MODEL OPENER
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("stackResumeModal");
  const openBtn = document.querySelector(".stack_resume_trigger");
  const closeBtn = modal?.querySelector(".stack_resume_close");
  const backdrop = modal?.querySelector(".stack_resume_backdrop");

  function openModal(e) {
    e.preventDefault();
    modal.classList.add("active");
  }

  function closeModal() {
    modal.classList.remove("active");
  }


  // Attach to *all* resume buttons, including ones added later
  function attachResumeTriggers() {
    const triggers = document.querySelectorAll(".stack_resume_trigger");
    triggers.forEach(trigger => {
      trigger.removeEventListener("click", openModal); // Avoid duplicate listeners
      trigger.addEventListener("click", openModal);
    });
  }

  attachResumeTriggers();

  const observer = new MutationObserver(() => {
    attachResumeTriggers();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });




  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  // Optional: ESC key support
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
});


document.addEventListener('click', function (event) {
    if (event.target.matches('.tab-button')) {
        const clickedButton = event.target;
        const targetTabId = clickedButton.dataset.tab;
        const tabsContainer = clickedButton.closest('.tabs-container');
        const tabButtons = tabsContainer.querySelectorAll('.tab-button');
        const tabPanes = tabsContainer.querySelectorAll('.tab-pane');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');
        tabPanes.forEach(pane => pane.classList.remove('active'));
        tabsContainer.querySelector(`#${targetTabId}`).classList.add('active');
    }
});


