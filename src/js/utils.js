// define window and document object
const win = typeof window !== "undefined" && window.Math === Math
    ? window
    : (
        typeof self !== "undefined" && (
            self.Math === Math ? self : Function("return this")()
        )
    );
const document = win.document;

const SUPPORT_ADDEVENTLISTENER = !!("addEventListener" in document);

const SUPPORT_PASSIVE = (() => {
    let supportsPassiveOption = false;

    try {
        if (SUPPORT_ADDEVENTLISTENER && Object.defineProperty) {
            document.addEventListener("test", null, Object.defineProperty({},
                "passive", {
                    get() {
                        supportsPassiveOption = true;
                    },
                }));
        }
    } catch (e) { }
    return supportsPassiveOption;
})();

export function nodeToArray(nodes) {
    // SCRIPT5014 in IE8
    const array = [];

    if (nodes) {
        for (let i = 0, len = nodes.length; i < len; i++) {
            array.push(nodes[i]);
        }
    }
    return array;
}

export function addEvent(element, type, handler, eventListenerOptions) {
    if (SUPPORT_ADDEVENTLISTENER) {
        let options = eventListenerOptions || false;

        if (typeof eventListenerOptions === "object") {
            options = SUPPORT_PASSIVE ? eventListenerOptions : false;
        }
        element.addEventListener(type, handler, options);
    } else if (element.attachEvent) {
        element.attachEvent(`on${type}`, handler);
    } else {
        element[`on${type}`] = handler;
    }
}

export function removeEvent(element, type, handler) {
    if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
        element.detachEvent(`on${type}`, handler);
    } else {
        element[`on${type}`] = null;
    }
}

export function hasClass(el, className) {
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return new RegExp(`(^| )${className}( |$)`, "gi").test(el.className);
    }
}
