document.addEventListener('DOMContentLoaded', function() {
    (function() {

        // Generate an indented list of links from a nav. Meant for use with panel().
        HTMLElement.prototype.navList = function() {
            var $this = this,
                a = $this.querySelectorAll('a'),
                b = [];

            a.forEach(function(link) {
                var indent = Math.max(0, link.closest('li').querySelectorAll('li').length - 1),
                    href = link.getAttribute('href'),
                    target = link.getAttribute('target');

                b.push(
                    '<a ' +
                    'class="link depth-' + indent + '"' +
                    (target ? ' target="' + target + '"' : '') +
                    (href ? ' href="' + href + '"' : '') +
                    '>' +
                    '<span class="indent-' + indent + '"></span>' +
                    link.textContent +
                    '</a>'
                );
            });

            return b.join('');
        };

        // Panel-ify an element.
        HTMLElement.prototype.panel = function(userConfig) {
            var element = this,
                body = document.body,
                id = element.getAttribute('id'),
                config = Object.assign({
                    delay: 0,
                    hideOnClick: false,
                    hideOnEscape: false,
                    hideOnSwipe: false,
                    resetScroll: false,
                    resetForms: false,
                    side: null,
                    visibleClass: 'visible'
                }, userConfig),
                target = config.target instanceof HTMLElement ? config.target : document.querySelector(config.target);

            // Methods.
            element._hide = function(event) {
                if (!target.classList.contains(config.visibleClass)) return;
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                target.classList.remove(config.visibleClass);

                window.setTimeout(function() {
                    if (config.resetScroll) element.scrollTop = 0;
                    if (config.resetForms) {
                        element.querySelectorAll('form').forEach(function(form) {
                            form.reset();
                        });
                    }
                }, config.delay);
            };

            // Hide on click.
            if (config.hideOnClick) {
                element.querySelectorAll('a').forEach(function(link) {
                    link.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
                    link.addEventListener('click', function(event) {
                        var href = link.getAttribute('href'),
                            target = link.getAttribute('target');
                        if (!href || href === '#' || href === '#' + id) return;

                        event.preventDefault();
                        event.stopPropagation();

                        element._hide();

                        window.setTimeout(function() {
                            if (target === '_blank') {
                                window.open(href);
                            } else {
                                window.location.href = href;
                            }
                        }, config.delay + 10);
                    });
                });
            }

            // Event: Hide panel on body click/tap.
            body.addEventListener('click', function(event) {
                element._hide(event);
            });

            // Event: Toggle.
            body.addEventListener('click', function(event) {
                var toggleLink = event.target.closest('a[href="#' + id + '"]');
                if (!toggleLink) return;

                event.preventDefault();
                event.stopPropagation();

                target.classList.toggle(config.visibleClass);
            });

            // Event: Hide on ESC.
            if (config.hideOnEscape) {
                window.addEventListener('keydown', function(event) {
                    if (event.keyCode === 27) element._hide(event);
                });
            }

            return element;
        };

        // Moves elements to/from the first positions of their respective parents.
        function prioritize($elements, condition) {
            if (typeof $elements === 'string') $elements = document.querySelectorAll($elements);
            $elements.forEach(function(element) {
                var parent = element.parentElement,
                    placeholder;
                if (!parent) return;
                if (!element.dataset.__prioritize) {
                    if (!condition) return;
                    placeholder = element.previousElementSibling;
                    if (!placeholder) return;
                    parent.insertBefore(element, parent.firstChild);
                    element.dataset.__prioritize = placeholder;
                } else {
                    if (condition) return;
                    placeholder = element.dataset.__prioritize;
                    parent.insertBefore(element, placeholder.nextElementSibling);
                    delete element.dataset.__prioritize;
                }
            });
        }

        window.prioritize = prioritize;
    })();
});
