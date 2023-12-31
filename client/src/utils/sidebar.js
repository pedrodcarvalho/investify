const ANIMATION_DURATION = 300;

const SIDEBAR_EL = document.getElementById("sidebar");

const SUB_MENU_ELS = document.querySelectorAll(
    ".menu > ul > .menu-item.sub-menu"
);

const FIRST_SUB_MENUS_BTN = document.querySelectorAll(
    ".menu > ul > .menu-item.sub-menu > a"
);

const INNER_SUB_MENUS_BTN = document.querySelectorAll(
    ".menu > ul > .menu-item.sub-menu .menu-item.sub-menu > a"
);

class PopperObject {
    instance = null;
    reference = null;
    popperTarget = null;

    constructor(reference, popperTarget) {
        this.init(reference, popperTarget);
    }

    init(reference, popperTarget) {
        this.reference = reference;
        this.popperTarget = popperTarget;
        this.instance = Popper.createPopper(this.reference, this.popperTarget, {
            placement: "right",
            strategy: "fixed",
            resize: true,
            modifiers: [
                {
                    name: "computeStyles",
                    options: {
                        adaptive: false
                    }
                },
                {
                    name: "flip",
                    options: {
                        fallbackPlacements: ["left", "right"]
                    }
                }
            ]
        });

        document.addEventListener(
            "click",
            (e) => this.clicker(e, this.popperTarget, this.reference),
            false
        );

        const ro = new ResizeObserver(() => {
            this.instance.update();
        });

        ro.observe(this.popperTarget);
        ro.observe(this.reference);
    }

    clicker(event, popperTarget, reference) {
        if (
            SIDEBAR_EL.classList.contains("collapsed") &&
            !popperTarget.contains(event.target) &&
            !reference.contains(event.target)
        ) {
            this.hide();
        }
    }

    hide() {
        this.instance.state.elements.popper.style.visibility = "hidden";
    }
}

class Poppers {
    subMenuPoppers = [];

    constructor() {
        this.init();
    }

    init() {
        SUB_MENU_ELS.forEach((element) => {
            this.subMenuPoppers.push(
                new PopperObject(element, element.lastElementChild)
            );
            this.closePoppers();
        });
    }

    togglePopper(target) {
        if (window.getComputedStyle(target).visibility === "hidden")
            target.style.visibility = "visible";
        else target.style.visibility = "hidden";
    }

    updatePoppers() {
        this.subMenuPoppers.forEach((element) => {
            element.instance.state.elements.popper.style.display = "none";
            element.instance.update();
        });
    }

    closePoppers() {
        this.subMenuPoppers.forEach((element) => {
            element.hide();
        });
    }
}

const slideUp = (target, duration = ANIMATION_DURATION) => {
    const { parentElement } = target;
    parentElement.classList.remove("open");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = `${duration}ms`;
    target.style.boxSizing = "border-box";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
        target.style.display = "none";
        target.style.removeProperty("height");
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
    }, duration);
};
const slideDown = (target, duration = ANIMATION_DURATION) => {
    const { parentElement } = target;
    parentElement.classList.add("open");
    target.style.removeProperty("display");
    let { display } = window.getComputedStyle(target);
    if (display === "none") display = "block";
    target.style.display = display;
    const height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = "border-box";
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = `${duration}ms`;
    target.style.height = `${height}px`;
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
    }, duration);
};

const slideToggle = (target, duration = ANIMATION_DURATION) => {
    if (window.getComputedStyle(target).display === "none")
        return slideDown(target, duration);
    return slideUp(target, duration);
};

const PoppersInstance = new Poppers();

const updatePoppersTimeout = () => {
    setTimeout(() => {
        PoppersInstance.updatePoppers();
    }, ANIMATION_DURATION);
};

document.getElementById("btn-collapse").addEventListener("click", () => {
    SIDEBAR_EL.classList.toggle("collapsed");
    PoppersInstance.closePoppers();
    if (SIDEBAR_EL.classList.contains("collapsed"))
        FIRST_SUB_MENUS_BTN.forEach((element) => {
            element.parentElement.classList.remove("open");
        });

    updatePoppersTimeout();
});

document.getElementById("btn-toggle").addEventListener("click", () => {
    SIDEBAR_EL.classList.toggle("toggled");

    updatePoppersTimeout();
});

document.getElementById("overlay").addEventListener("click", () => {
    SIDEBAR_EL.classList.toggle("toggled");
});

const defaultOpenMenus = document.querySelectorAll(".menu-item.sub-menu.open");

defaultOpenMenus.forEach((element) => {
    element.lastElementChild.style.display = "block";
});

FIRST_SUB_MENUS_BTN.forEach((element) => {
    element.addEventListener("click", () => {
        if (SIDEBAR_EL.classList.contains("collapsed"))
            PoppersInstance.togglePopper(element.nextElementSibling);
        else {
            const parentMenu = element.closest(".menu.open-current-submenu");
            if (parentMenu)
                parentMenu
                    .querySelectorAll(":scope > ul > .menu-item.sub-menu > a")
                    .forEach(
                        (el) =>
                            window.getComputedStyle(el.nextElementSibling).display !==
                            "none" && slideUp(el.nextElementSibling)
                    );
            slideToggle(element.nextElementSibling);
        }
    });
});

INNER_SUB_MENUS_BTN.forEach((element) => {
    element.addEventListener("click", () => {
        slideToggle(element.nextElementSibling);
    });
});

const getColorTheme = (baseColor, baseDarkColor, colorTheme) => {
    fetch('/theme', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.theme === 'light') {
                colorTheme.textContent = 'Light';
                document.querySelector(':root').style.setProperty('--baseColor', `${baseDarkColor}`);
                document.querySelector(':root').style.setProperty('--baseDarkColor', `${baseColor}`);
            }
            else {
                colorTheme.textContent = 'Dark';
                document.querySelector(':root').style.setProperty('--baseColor', `${baseColor}`);
                document.querySelector(':root').style.setProperty('--baseDarkColor', `${baseDarkColor}`);
            }
        })
        .catch(err => console.log(err));
};

const updateColorTheme = (baseColor, baseDarkColor, colorTheme) => {
    document.querySelector('#color-theme').addEventListener('click', (e) => {
        if (e.target.textContent === 'Dark') {
            e.target.textContent = 'Light';
            document.querySelector(':root').style.setProperty('--baseColor', `${baseDarkColor}`);
            document.querySelector(':root').style.setProperty('--baseDarkColor', `${baseColor}`);
        }
        else {
            e.target.textContent = 'Dark';
            document.querySelector(':root').style.setProperty('--baseColor', `${baseColor}`);
            document.querySelector(':root').style.setProperty('--baseDarkColor', `${baseDarkColor}`);
        }

        fetch('/theme', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                theme: (e.target.textContent).toLowerCase()
            })
        })
            .then(res => res.json())
            .catch(err => console.log(err));
    });
};


const colorTheme = () => {
    const rootStyles = getComputedStyle(document.documentElement);

    const baseColor = rootStyles.getPropertyValue('--baseColor');
    const baseDarkColor = rootStyles.getPropertyValue('--baseDarkColor');
    const colorTheme = document.querySelector('#color-theme span');

    getColorTheme(baseColor, baseDarkColor, colorTheme);
    updateColorTheme(baseColor, baseDarkColor, colorTheme);
};

colorTheme();
