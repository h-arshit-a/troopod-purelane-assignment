/**
 * Purelane Shopify Theme Interactive Engine
 * Defensive implementation for reveal animations, scroll parallax,
 * scene crossfading, stage carousels, and Shopify Theme Editor compatibility.
 */

(function () {
  'use strict';

  function initPurelaneEngine() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. Reveal on Scroll (.rv) ---------- */
    var revs = document.querySelectorAll('.rv');
    if (revs.length > 0) {
      if ('IntersectionObserver' in window && !reduce) {
        var ro = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) {
                e.target.classList.add('in');
                ro.unobserve(e.target);
              }
            });
          },
          { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
        );
        revs.forEach(function (el) {
          ro.observe(el);
        });
      } else {
        revs.forEach(function (el) {
          el.classList.add('in');
        });
      }
    }

    /* ---------- 2. Deterministic Scene Crossfade ---------- */
    var scenes = [].slice.call(document.querySelectorAll('.scene'));
    var zones = [].slice.call(document.querySelectorAll('[data-scene]'));
    var stage = document.getElementById('scenes');
    var currentScene = 0;

    function setScene(n) {
      if (n === currentScene) return;
      currentScene = n;
      scenes.forEach(function (s, i) {
        s.classList.toggle('on', i + 1 === n);
      });
      if (stage) stage.setAttribute('data-d', String(n));
    }

    function pickScene() {
      if (zones.length === 0) return;
      var focus = window.scrollY + window.innerHeight * 0.5;
      var n = 1;
      for (var i = 0; i < zones.length; i++) {
        var z = zones[i];
        var top = 0;
        var el = z;
        while (el) {
          top += el.offsetTop;
          el = el.offsetParent;
        }
        if (top <= focus) {
          n = parseInt(z.getAttribute('data-scene'), 10) || n;
        }
      }
      setScene(n);
    }

    /* ---------- 3. Progress Rail Sync ---------- */
    var railLinks = [].slice.call(document.querySelectorAll('.rail a'));
    var targets = railLinks
      .map(function (a) {
        var href = a.getAttribute('href');
        return href ? document.querySelector(href) : null;
      })
      .filter(Boolean);

    function syncRail() {
      if (railLinks.length === 0 || targets.length === 0) return;
      var mid = window.scrollY + window.innerHeight * 0.42;
      var idx = 0;
      targets.forEach(function (t, i) {
        if (t && t.offsetTop <= mid) idx = i;
      });
      railLinks.forEach(function (a, i) {
        a.classList.toggle('on', i === idx);
      });
    }

    /* ---------- 4. Scroll & Parallax Engine ---------- */
    var hdr = document.getElementById('hdr');
    var prod = document.getElementById('heroProd');
    var raf = null;
    var mx = 0;
    var my = 0;

    function frame() {
      raf = null;
      var y = window.scrollY || window.pageYOffset;
      if (hdr) hdr.classList.toggle('up', y > 90);

      if (!reduce) {
        var wl = document.querySelectorAll('#water .wl');
        for (var i = 0; i < wl.length; i++) {
          var d = [0.05, 0.09, 0.03, 0.02][i] || 0.05;
          wl[i].style.setProperty('--px', (mx * d * 130).toFixed(1) + 'px');
          wl[i].style.setProperty('--py', (-y * d + my * d * 90).toFixed(1) + 'px');
        }
        if (prod) {
          var f = Math.min(y / 700, 1);
          prod.style.transform =
            'translate3d(' +
            (mx * -16).toFixed(2) +
            'px,' +
            (-f * 54 + my * -10).toFixed(2) +
            'px,0) scale(' +
            (1 - f * 0.06).toFixed(3) +
            ')';
          prod.style.opacity = (1 - f * 0.55).toFixed(3);
        }
      }
      syncRail();
      pickScene();
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    if (!reduce && window.matchMedia('(min-width: 1024px)').matches) {
      window.addEventListener(
        'mousemove',
        function (e) {
          mx = (e.clientX / window.innerWidth - 0.5) * 2;
          my = (e.clientY / window.innerHeight - 0.5) * 2;
          onScroll();
        },
        { passive: true }
      );
    }

    /* ---------- 5. Ambient Drift on Hero Product ---------- */
    if (!reduce && prod && typeof prod.animate === 'function') {
      prod.animate(
        [
          { filter: 'drop-shadow(0 34px 54px rgba(2,20,19,.6))' },
          { filter: 'drop-shadow(0 42px 68px rgba(2,20,19,.68))' },
          { filter: 'drop-shadow(0 34px 54px rgba(2,20,19,.6))' },
        ],
        { duration: 7000, iterations: Infinity, easing: 'ease-in-out' }
      );
    }

    /* ---------- 6. Hero Stage Carousel (#hstage) ---------- */
    var hstage = document.getElementById('hstage');
    if (hstage) {
      var hs = [].slice.call(hstage.querySelectorAll('.hslide'));
      var hd = [].slice.call(document.querySelectorAll('#hdots button'));
      var hi = 0;
      var htimer = null;

      function hgo(n) {
        if (hs.length === 0) return;
        hi = (n + hs.length) % hs.length;
        hs.forEach(function (s, i) {
          s.classList.toggle('on', i === hi);
        });
        hd.forEach(function (d, i) {
          d.classList.toggle('on', i === hi);
        });
      }

      function hplay() {
        if (!htimer && !reduce && hs.length > 1) {
          htimer = setInterval(function () {
            hgo(hi + 1);
          }, 3800);
        }
      }

      function hstop() {
        if (htimer) {
          clearInterval(htimer);
          htimer = null;
        }
      }

      hd.forEach(function (d, i) {
        d.addEventListener('click', function () {
          hstop();
          hgo(i);
          hplay();
        });
      });

      hstage.addEventListener('mouseenter', hstop);
      hstage.addEventListener('mouseleave', hplay);

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              e.isIntersecting ? hplay() : hstop();
            });
          },
          { threshold: 0.2 }
        ).observe(hstage);
      } else {
        hplay();
      }
    }

    /* ---------- 7. Product Rotator (#rot) ---------- */
    var rot = document.getElementById('rot');
    if (rot) {
      var rimgs = [].slice.call(rot.querySelectorAll('.frame .pimg'));
      var rdots = [].slice.call(rot.querySelectorAll('.dots i'));
      var rcapB = rot.querySelector('.cap b');
      var rcapS = rot.querySelector('.cap span');
      var ri = 0;
      var rtimer = null;

      function rstep() {
        if (rimgs.length === 0) return;
        rimgs[ri].classList.remove('on');
        if (rdots[ri]) rdots[ri].classList.remove('on');
        ri = (ri + 1) % rimgs.length;
        rimgs[ri].classList.add('on');
        if (rdots[ri]) rdots[ri].classList.add('on');
        if (rcapB) rcapB.innerHTML = rimgs[ri].getAttribute('data-name') || '';
        if (rcapS) rcapS.textContent = rimgs[ri].getAttribute('data-note') || '';
      }

      if (!reduce && rimgs.length > 1) {
        var rio = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting && !rtimer) {
                rtimer = setInterval(rstep, 2900);
              } else if (!e.isIntersecting && rtimer) {
                clearInterval(rtimer);
                rtimer = null;
              }
            });
          },
          { threshold: 0.25 }
        );
        rio.observe(rot);
      }
    }

    /* ---------- 8. Shop Category Tab Filter (#shop) ---------- */
    var shopSec = document.getElementById('shop');
    if (shopSec) {
      var filterTabs = shopSec.querySelectorAll('.shop-tab, [data-category-tab]');
      var shopCards = shopSec.querySelectorAll('.glass.card, [data-product-category]');
      filterTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var targetCat = (this.getAttribute('data-category-tab') || 'all').toLowerCase();
          filterTabs.forEach(function (t) {
            t.classList.remove('on', 'active');
          });
          this.classList.add('on', 'active');

          shopCards.forEach(function (card) {
            var cardCat = (card.getAttribute('data-product-category') || '').toLowerCase();
            if (targetCat === 'all' || cardCat.indexOf(targetCat) !== -1 || targetCat.indexOf(cardCat) !== -1) {
              card.style.display = '';
              card.classList.add('in');
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }

    // Trigger initial frame
    frame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPurelaneEngine);
  } else {
    initPurelaneEngine();
  }

  /* ---------- Shopify Theme Editor Lifecycle Hooks ---------- */
  if (typeof Shopify !== 'undefined' && Shopify.designMode) {
    document.addEventListener('shopify:section:load', function () {
      initPurelaneEngine();
    });
    document.addEventListener('shopify:section:select', function () {
      initPurelaneEngine();
    });
  }
})();
