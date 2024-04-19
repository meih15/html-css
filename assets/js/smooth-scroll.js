
document.addEventListener("DOMContentLoaded", function () {
    const scrollToElement = (element, options) => {
        const { anchor, offset, parent, speed, easing } = options;
        const targetElement = document.querySelector(element);
        if (!targetElement) return;

        const targetOffset = targetElement.getBoundingClientRect()[anchor];
        let position;

        switch (anchor) {
            case "middle":
                position = targetOffset - (window.innerHeight - targetElement.offsetHeight) / 2;
                break;
            default:
            case "top":
                position = Math.max(targetOffset, 0);
        }

        if (typeof offset === "function") {
            position -= offset();
        } else {
            position -= offset;
        }

        parent.scrollTo({
            top: position,
            behavior: "smooth",
        });
    };

    document.querySelectorAll(".scrolly").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const target = this.getAttribute("href");
            if (!target || target.charAt(0) !== "#") return;

            scrollToElement(target, {
                anchor: "top", // or "middle"
                offset: 0,
                parent: document.documentElement || document.body,
                speed: 1000,
                easing: "easeInOut",
            });
        });
    });
});
