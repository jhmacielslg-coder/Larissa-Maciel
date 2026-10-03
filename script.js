/**
 * ==========================================================================
 * LARISSA MACIEL — MASSOTERAPEUTA
 * Script Principal (JavaScript Vanilla)
 * Funcionalidades:
 * 1. Sticky Header & Menu Ativo no Scroll
 * 2. Menu Mobile Hambúrguer com Acessibilidade (ARIA)
 * 3. Scroll Suave para Âncoras
 * 4. Animações de Entrada (Scroll Reveal com IntersectionObserver)
 * 5. Contadores Numéricos Animados (+1.000, 5.0, 100%)
 * 6. Acordeão Interativo de Perguntas Frequentes (FAQ)
 * 7. Formulário de Agendamento com Validação e Envio para WhatsApp
 * 8. Visualizador Modal Simples de Galeria
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. STICKY HEADER & NAVEGAÇÃO ATIVA
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleHeaderScroll() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Identificar seção visível para atualizar o link ativo
    const scrollPosition = window.scrollY + 120;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Executar na carga inicial

  /* ------------------------------------------------------------------------
     2. MENU HAMBÚRGUER MOBILE
     ------------------------------------------------------------------------ */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Fechar com tecla ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* ------------------------------------------------------------------------
     3. SCROLL SUAVE PARA ÂNCORAS COM COMPENSAÇÃO DE HEADER
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ------------------------------------------------------------------------
     4. ANIMAÇÕES DE ENTRADA (SCROLL REVEAL VIA INTERSECTION OBSERVER)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback caso navegador não suporte IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ------------------------------------------------------------------------
     5. CONTADORES NUMÉRICOS ANIMADOS
     ------------------------------------------------------------------------ */
  const statSection = document.querySelector('.stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounters() {
    statNumbers.forEach(counter => {
      const targetValue = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = counter.getAttribute('data-decimal') === 'true';
      const isThousands = counter.getAttribute('data-thousands') === 'true';
      const duration = 2000; // 2 segundos
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing cúbico suave para desacelerar no final
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = targetValue * easeOutProgress;

        if (isDecimal) {
          counter.textContent = currentValue.toFixed(1);
        } else if (isThousands) {
          // Formata com separador de milhar pt-BR (ex: 1.000)
          const rounded = Math.floor(currentValue);
          counter.textContent = rounded.toLocaleString('pt-BR');
        } else {
          counter.textContent = Math.floor(currentValue);
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          // Garantir valor final exato
          if (isDecimal) {
            counter.textContent = targetValue.toFixed(1);
          } else if (isThousands) {
            counter.textContent = targetValue.toLocaleString('pt-BR');
          } else {
            counter.textContent = targetValue;
          }
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  if (statSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    statsObserver.observe(statSection);
  }

  /* ------------------------------------------------------------------------
     6. CARROSSEL ANIMADO DE DEPOIMENTOS DO GOOGLE
     ------------------------------------------------------------------------ */
  const track = document.getElementById('carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  const trackContainer = document.getElementById('carousel-track-container');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    let autoplayTimer = null;

    function getVisibleSlidesCount() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }

    function getMaxIndex() {
      const visible = getVisibleSlidesCount();
      return Math.max(0, slides.length - visible);
    }

    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const maxIndex = getMaxIndex();
      const dotCount = maxIndex + 1;

      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Ir para página de depoimentos ${i + 1}`);
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          goToSlide(i);
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function updateSlidePosition() {
      if (!slides[0]) return;
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = 24; // Espaçamento entre os slides
      const offset = currentIndex * (slideWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
      updateDots();
    }

    function goToSlide(index) {
      const maxIndex = getMaxIndex();
      if (index < 0) {
        currentIndex = maxIndex;
      } else if (index > maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      updateSlidePosition();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
      });
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        nextSlide();
      }, 4200);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Pausar no hover/touch
    if (trackContainer) {
      trackContainer.addEventListener('mouseenter', stopAutoplay);
      trackContainer.addEventListener('mouseleave', startAutoplay);

      // Suporte a gestos touch swipe em smartphones
      let touchStartX = 0;
      let touchEndX = 0;

      trackContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
      }, { passive: true });

      trackContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
        startAutoplay();
      }, { passive: true });
    }

    // Inicialização do carrossel
    createDots();
    updateSlidePosition();
    startAutoplay();

    // Recalcular no redimensionamento da tela
    let resizeDebounce = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        const maxIndex = getMaxIndex();
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        createDots();
        updateSlidePosition();
      }, 100);
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     7. FORMULÁRIO DE AGENDAMENTO RÁPIDO & DIRECIONAMENTO WHATSAPP
     ------------------------------------------------------------------------ */
  const bookingForm = document.getElementById('booking-form');
  const phoneInput = document.getElementById('client-phone');
  const WHATSAPP_NUMBER = '5561998905441';

  // Máscara amigável de telefone brasileiro (XX) XXXXX-XXXX
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 6) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        e.target.value = `(${value}`;
      } else {
        e.target.value = '';
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameField = document.getElementById('client-name');
      const phoneField = document.getElementById('client-phone');
      const serviceField = document.getElementById('client-service');
      const timeField = document.getElementById('client-time');
      const notesField = document.getElementById('client-notes');

      let isValid = true;

      // Validação do Nome
      if (!nameField.value.trim() || nameField.value.trim().length < 3) {
        nameField.closest('.form-group').classList.add('error');
        isValid = false;
      } else {
        nameField.closest('.form-group').classList.remove('error');
      }

      // Validação do Telefone
      const cleanPhone = phoneField.value.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        phoneField.closest('.form-group').classList.add('error');
        isValid = false;
      } else {
        phoneField.closest('.form-group').classList.remove('error');
      }

      // Validação do Serviço
      if (!serviceField.value) {
        serviceField.closest('.form-group').classList.add('error');
        isValid = false;
      } else {
        serviceField.closest('.form-group').classList.remove('error');
      }

      if (!isValid) return;

      // Construção da mensagem formatada para WhatsApp
      const name = nameField.value.trim();
      const phone = phoneField.value.trim();
      const service = serviceField.options[serviceField.selectedIndex].text;
      const timePref = timeField.value ? timeField.options[timeField.selectedIndex].text : 'A combinar';
      const notes = notesField.value.trim() ? notesField.value.trim() : 'Nenhuma observação informada.';

      const messageText = 
`Olá, Larissa! Gostaria de solicitar um agendamento:

✨ *Dados do Agendamento:*
• *Nome:* ${name}
• *WhatsApp:* ${phone}
• *Serviço de Interesse:* ${service}
• *Preferência de Horário:* ${timePref}
• *Observações/Objetivo:* ${notes}

Vi o site e gostaria de confirmar os próximos horários disponíveis. Obrigado(a)!`;

      const encodedMessage = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // Abre o WhatsApp em nova aba
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
});
