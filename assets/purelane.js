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

    /* ---------- 10. Universal AJAX Add to Cart Engine & Cart Badge Synchronization ---------- */
    function updateCartBadge() {
      fetch('/cart.js')
        .then(function (res) { return res.json(); })
        .then(function (cart) {
          var dots = document.querySelectorAll('.navtools .dot, #hdr .dot, [data-cart-count]');
          dots.forEach(function (d) {
            d.textContent = cart.item_count || '0';
          });
        })
        .catch(function () {});
    }

    updateCartBadge();

    function executeAddToCart(variantId, btnElement) {
      var origText = btnElement ? btnElement.innerHTML : '';
      if (btnElement) {
        btnElement.disabled = true;
        btnElement.innerHTML = 'Adding...';
      }

      var parsedId = parseInt(variantId, 10);
      if (isNaN(parsedId)) {
        if (btnElement) {
          btnElement.disabled = false;
          btnElement.innerHTML = origText || 'Add to cart';
        }
        alert('Please assign a valid Shopify product in Theme Editor.');
        return;
      }

      var formData = {
        items: [{ id: parsedId, quantity: 1 }],
        sections: 'cart-drawer,cart-icon-bubble'
      };

      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (errData) {
            throw new Error(errData.description || errData.message || 'Could not add item to cart');
          });
        }
        return res.json();
      })
      .then(function (data) {
        updateCartBadge();

        var cartDrawerEl = document.querySelector('cart-drawer');
        if (cartDrawerEl) {
          cartDrawerEl.classList.remove('is-empty');
          if (data.sections && data.sections['cart-drawer']) {
            var parsedHtml = new DOMParser().parseFromString(data.sections['cart-drawer'], 'text/html');
            var innerHtml = parsedHtml.querySelector('.drawer__inner');
            if (innerHtml && cartDrawerEl.querySelector('.drawer__inner')) {
              cartDrawerEl.querySelector('.drawer__inner').replaceWith(innerHtml);
            }
          }
        }

        if (data.sections && data.sections['cart-icon-bubble']) {
          var iconBubble = document.getElementById('cart-icon-bubble');
          if (iconBubble) {
            var parsedIcon = new DOMParser().parseFromString(data.sections['cart-icon-bubble'], 'text/html');
            if (parsedIcon.body.firstElementChild) {
              var countBadge = parsedIcon.querySelector('.cart-count-bubble');
              if (countBadge) {
                var dotBadge = iconBubble.querySelector('.dot');
                if (dotBadge) dotBadge.textContent = countBadge.textContent.trim();
              }
            }
          }
        }

        document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: data } }));

        if (cartDrawerEl && typeof cartDrawerEl.open === 'function') {
          cartDrawerEl.open();
        } else if (cartDrawerEl) {
          cartDrawerEl.classList.add('active');
        }

        if (btnElement) {
          btnElement.disabled = false;
          btnElement.innerHTML = 'Added! ✓';
          setTimeout(function () {
            btnElement.innerHTML = origText || 'Add to cart';
          }, 2000);
        }
      })
      .catch(function (err) {
        if (btnElement) {
          btnElement.disabled = false;
          btnElement.innerHTML = 'Error';
          setTimeout(function () {
            btnElement.innerHTML = origText || 'Add to cart';
          }, 2000);
        }
        console.error('Add to Cart Error:', err);
      });
    }


    function handleAddToCartClick(e) {
      var btn = e.target ? e.target.closest('.purelane-add-to-cart-btn, [data-add-to-cart], button[name="add"]') : null;
      if (!btn) return;

      if (e.preventDefault) e.preventDefault();
      var variantId = btn.getAttribute('data-variant-id') || btn.getAttribute('data-add-to-cart');

      var form = btn.closest('form');
      if ((!variantId || variantId === 'blank') && form) {
        var inputId = form.querySelector('input[name="id"]');
        if (inputId && inputId.value) {
          variantId = inputId.value;
        }
      }

      // Fallback: search DOM for any valid data-variant-id attribute
      if (!variantId || variantId === 'blank') {
        var validBtn = document.querySelector('[data-variant-id]:not([data-variant-id=""]):not([data-variant-id="blank"])');
        if (validBtn) {
          variantId = validBtn.getAttribute('data-variant-id');
        }
      }

      if (!variantId || variantId === 'blank') {
        alert('Please assign a product to this block in Shopify Theme Editor.');
        return;
      }

      executeAddToCart(variantId, btn);
    }

    document.addEventListener('click', handleAddToCartClick);
    document.addEventListener('submit', function (e) {
      if (e.target && (e.target.matches('[data-type="add-to-cart-form"]') || e.target.getAttribute('action') === '/cart/add')) {
        e.preventDefault();
        var form = e.target;
        var btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
        handleAddToCartClick({ target: btn || form, preventDefault: function () {} });
      }
    });



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

