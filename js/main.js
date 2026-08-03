const initializeSwipers = () => {
    if (typeof window.Swiper === 'undefined') {
        return;
    }

    const heroSwiperElement = document.querySelector('.hero-swiper');

    if (!heroSwiperElement) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    new window.Swiper(heroSwiperElement, {
        slidesPerView: 1,
        slidesPerGroup: 1,
        loop: true,
        speed: prefersReducedMotion ? 0 : 300,
        autoplay: prefersReducedMotion
            ? false
            : {
                  delay: 4000,
                  disableOnInteraction: false,
              },
        navigation: {
            prevEl: heroSwiperElement.querySelector('.hero__control--prev'),
            nextEl: heroSwiperElement.querySelector('.hero__control--next'),
        },
        pagination: {
            el: heroSwiperElement.querySelector('.hero__pagination'),
            bulletElement: 'button',
            clickable: true,
        },
        watchOverflow: true,
    });
};

const initializeCon1Motion = () => {
    const sections = document.querySelectorAll('[data-con1-motion]');

    if (sections.length === 0) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    sections.forEach((section) => {
        section.classList.add('con1-motion-ready');
    });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        sections.forEach((section) => {
            section.classList.add('con1-motion-visible');
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
                    return;
                }

                entry.target.classList.add('con1-motion-visible');
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.2,
        },
    );

    sections.forEach((section) => {
        observer.observe(section);
    });
};

const initializeCon3Motion = () => {
    const section = document.querySelector('[data-con3-motion]');

    if (!section) {
        return;
    }

    const intro = section.querySelector('[data-con3-intro]');
    const cards = Array.from(section.querySelectorAll('[data-con3-card]'));
    const leftColumn = section.querySelector('[data-con3-column="left"]');
    const rightColumn = section.querySelector('[data-con3-column="right"]');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopQuery = window.matchMedia('(min-width: 1200px)');
    const supportsIntersectionObserver = 'IntersectionObserver' in window;

    section.classList.add('con3-motion-ready');

    cards.forEach((card) => {
        const isRightColumn = card.parentElement === rightColumn;
        card.style.setProperty('--con3-card-delay', isRightColumn ? '0.08s' : '0s');
    });

    if (reducedMotionQuery.matches || !supportsIntersectionObserver) {
        intro.classList.add('con3-intro-visible');
        cards.forEach((card) => card.classList.add('con3-card-visible'));
    } else {
        const introObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    intro.classList.add('con3-intro-visible');
                    introObserver.unobserve(entry.target);
                });
            },
            {
                rootMargin: '0px 0px -20% 0px',
                threshold: 0.1,
            },
        );

        const cardObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('con3-card-visible');
                    cardObserver.unobserve(entry.target);
                });
            },
            {
                rootMargin: '0px 0px -8% 0px',
                threshold: 0.15,
            },
        );

        introObserver.observe(intro);
        cards.forEach((card) => cardObserver.observe(card));
    }

    if (reducedMotionQuery.matches || !leftColumn || !rightColumn) {
        return;
    }

    let animationFrameId = null;

    const resetParallax = () => {
        leftColumn.style.setProperty('--con3-parallax-y', '0px');
        rightColumn.style.setProperty('--con3-parallax-y', '0px');
    };

    const updateParallax = () => {
        animationFrameId = null;

        if (!desktopQuery.matches) {
            resetParallax();
            return;
        }

        const sectionRect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const rawProgress = (viewportHeight - sectionRect.top) / (viewportHeight + sectionRect.height);
        const progress = Math.min(1, Math.max(0, rawProgress));
        const centeredProgress = (progress - 0.5) * 2;
        const leftOffset = centeredProgress * 35;
        const rightOffset = centeredProgress * -55;

        leftColumn.style.setProperty('--con3-parallax-y', `${leftOffset.toFixed(2)}px`);
        rightColumn.style.setProperty('--con3-parallax-y', `${rightOffset.toFixed(2)}px`);
    };

    const requestParallaxUpdate = () => {
        if (animationFrameId !== null) {
            return;
        }

        animationFrameId = window.requestAnimationFrame(updateParallax);
    };

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    window.addEventListener('resize', requestParallaxUpdate, { passive: true });
    desktopQuery.addEventListener('change', requestParallaxUpdate);
    requestParallaxUpdate();
};

const initializeNavActiveState = () => {
    const navLinks = Array.from(document.querySelectorAll('#nav .nav__link'));

    if (navLinks.length === 0) {
        return;
    }

    const setActiveLink = (selectedLink) => {
        navLinks.forEach((link) => {
            const isActive = link === selectedLink;

            link.classList.toggle('active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const initialActiveLink = navLinks.find((link) => link.classList.contains('active')) || navLinks[0];
    setActiveLink(initialActiveLink);

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            setActiveLink(link);
        });

        link.addEventListener('keydown', (event) => {
            if (event.key !== ' ' && event.key !== 'Spacebar') {
                return;
            }

            event.preventDefault();
            setActiveLink(link);
        });
    });
};

document.addEventListener('DOMContentLoaded', initializeSwipers);
document.addEventListener('DOMContentLoaded', initializeCon1Motion);
document.addEventListener('DOMContentLoaded', initializeCon3Motion);
document.addEventListener('DOMContentLoaded', initializeNavActiveState);
