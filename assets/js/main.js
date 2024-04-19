document.addEventListener('DOMContentLoaded', function() {
    var body = document.body,
        wrapper = document.getElementById('page-wrapper'),
        banner = document.getElementById('banner'),
        header = document.getElementById('header');

    // Function to add a class to an element
    function addClass(element, className) {
        if (!element.classList.contains(className)) {
            element.classList.add(className);
        }
    }

    // Function to remove a class from an element
    function removeClass(element, className) {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        }
    }

    // Function to check if the device is a mobile
    function isMobile() {
        return /Mobi/i.test(navigator.userAgent);
    }

    // Function to handle window load event
    function handleWindowLoad() {
        setTimeout(function() {
            removeClass(body, 'is-preload');
        }, 100);
    }

    // Function to handle window resize event
    function handleWindowResize() {
        window.dispatchEvent(new Event('scroll'));
    }

    // Function to handle banner scroll events
    function handleBannerScroll() {
        var headerHeight = header.offsetHeight;
        var bannerBottom = banner.getBoundingClientRect().bottom;
        
        if (bannerBottom <= headerHeight + 1) {
            removeClass(header, 'alt');
        } else {
            addClass(header, 'alt');
        }
    }

    // Attach event listeners
    window.addEventListener('load', handleWindowLoad);
    window.addEventListener('resize', handleWindowResize);

    // Initial animations
    handleWindowLoad();

    // Mobile check
    if (isMobile()) {
        addClass(body, 'is-mobile');
    } else {
        window.addEventListener('resize', function() {
            if (window.innerWidth > 980) {
                removeClass(body, 'is-mobile');
            } else {
                addClass(body, 'is-mobile');
            }
        });
    }

    // Header scroll handling
    if (banner && header.classList.contains('alt')) {
        window.addEventListener('scroll', handleBannerScroll);
        handleBannerScroll(); // Trigger on initial load
    }
});
