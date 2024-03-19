// MIT License

// Copyright (c) 2023 Asaki Zuki

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

"use strict";

// Keybind
const keybindList = {
    ondown: {},
    onup: {},
    onpress: {}
};

/**
 * Add and edit Keybind to a certain Function
 */
class KeyBind {
    /**
     * @typedef {Object} KeyEvent
     * @property {string} key
     * @property {boolean} shiftKey
     * @property {boolean} altKey 
     * @property {boolean} ctrlKey
     * @property {boolean} metaKey
     * @typedef {'down'|'up'|'press'} SetupKeyType
     * @callback KeyPressEvent
     * @param {KeyboardEvent}
     */

    /**
     * Create a new Keybind
     * @param {SetupKeyType} type - Event Name
     * @param {KeyEvent} setup - Key pressed
     * @param {KeyboardEvent} callback - Event Callback
     * @returns 
     */
    static createSetup(type, setup, callback) {
        setup['key'] = setup?.key ?? 'A';
        setup['shiftKey'] = setup?.shiftKey ?? false;
        setup['altKey'] = setup?.altKey ?? false;
        setup['ctrlKey'] = setup?.ctrlKey ?? false;
        setup['metaKey'] = setup?.metaKey ?? false;
        keybindList[`on${type}`][JSON.stringify(setup).toLowerCase()] = callback;

        return class {
            /**
             * Edit keybind
             * @param {KeyEvent} editSetup 
             * @returns 
             */
            static editKey(editSetup) {
                delete keybindList[`on${type}`][JSON.stringify(setup).toLowerCase()];
                setup['key'] = editSetup?.key ?? setup.key;
                setup['shiftKey'] = (editSetup?.shiftKey !== undefined) ? editSetup.shiftKey : setup.shiftKey;
                setup['altKey'] = (editSetup?.altKey !== undefined) ? editSetup.altKey : setup.altKey;
                setup['ctrlKey'] = (editSetup?.ctrlKey !== undefined) ? editSetup.ctrlKey : setup.ctrlKey;
                setup['metaKey'] = (editSetup?.metaKey !== undefined) ? editSetup.metaKey : setup.metaKey;
                keybindList[`on${type}`][JSON.stringify(setup).toLowerCase()] = callback;
                return this;
            }
            /**
             * Edit callback on press this key
             * @param {KeyPressEvent} callback
             * @returns 
             */
            static editCallback(callback) {
                keybindList[`on${type}`][JSON.stringify(setup).toLowerCase()] = callback;
                return this;
            }

            /**
             * Get the string of keybind
             * @param {boolean} hideUndefined 
             * @returns {string[]}
             */
            static getStrings(hideUndefined) {
                const arr = [setup.key.toUpperCase(), undefined, undefined, undefined, undefined];
                if (setup.shiftKey) arr[1] = 'Shift'
                if (setup.ctrlKey) arr[2] = 'Ctrl'
                if (setup.meta) arr[3] = 'Window'
                if (setup.altKey) arr[4] = 'Alt'
                if (hideUndefined) return arr.filter(v => v !== undefined)
                return arr;
            }
        }
    }
}

document.addEventListener('keydown', e => {
    (keybindList.ondown[JSON.stringify({
        key: e.key,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey
    }).toLowerCase()] ?? (() => undefined))(e)
});
document.addEventListener('keyup', e => {
    (keybindList.onup[JSON.stringify({
        key: e.key,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey
    }).toLowerCase()] ?? (() => undefined))(e)
});
document.addEventListener('keypress', e => {
    (keybindList.onpress[JSON.stringify({
        key: e.key,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey
    }).toLowerCase()] ?? (() => undefined))(e)
});

// HTML dom
/**
 * Create a Event for node
 */
class ElementEvent {
    /**
     * @typedef {keyof DocumentEventMap} EventType - The type of event, e.g., 'click', 'keydown', etc.
     * @typedef {Record<EventType, (event: DocumentEventMap[EventType]) => void>} EventListeners
     */

    /**
     * Create a Event
     * @param {HTMLElement} node 
     * @param {EventListeners} eventObject 
     */
    static create(node, eventObject) {
        Object.keys(eventObject).forEach(k => node.addEventListener(k, eventObject[k]))
    }
}

/**
 * Get element node
 */
class GetElement {
    /**
     * Get a Node has that ID
     * @param {String} id 
     * @param {HTMLElement} node 
     * @returns {HTMLElement}
     */
    static id(id, node) {
        if (node) return GetElement.selector(`[id="${id}"]`, node);
        return GetElement.selector(`[id="${id}"]`)
    }
    /**
     * Get all node include ID list
     * @param {String[]} ids 
     * @param {HTMLElement} node 
     * @returns {HTMLElement[]}
     */
    static ids(ids, node) {
        return Array.from(ids, v => GetElement.id(v, node));
    }
    /**
     * Get all node has className
     * @param {String} className 
     * @param {HTMLElement} node 
     * @returns {HTMLElement[]}
     */
    static class(className, node) {
        if (node) return node.getElementsByClassName(className);
        return document.getElementsByClassName(className)
    }
    /**
     * Get all node has tagName
     * @param {String} tagName 
     * @param {HTMLElement} node 
     * @returns {HTMLElement[]}
     */
    static tag(tagName, node) {
        if (node) return node.getElementsByTagName(tagName);
        return document.getElementsByTagName(tagName);
    }
    /**
     * Get all node has name
     * @param {String} name 
     * @param {HTMLElement} node 
     * @returns {HTMLElement[]}
     */
    static name(name, node) {
        if (node) return node.getElementsByName(name);
        return document.getElementsByName(name);
    }
    /**
     * Get a node by selector
     * @param {String} selectorString 
     * @param {HTMLElement} node 
     * @returns {HTMLElement}
     */
    static selector(selectorString, node) {
        if (node) return node.querySelector(selectorString)
        return document.querySelector(selectorString);
    }
    /**
     * Get all node by selector
     * @param {String} selectorString 
     * @param {HTMLElement} node 
     * @returns {HTMLElement[]}
     */
    static selectors(selectorString, node) {
        if (node) return node.querySelectorAll(selectorString)
        return document.querySelectorAll(selectorString);
    }
    /**
     * Get <div> element with className="body"
     * @returns {HTMLElement}
     */
    static body() {
        return this.selector('[class="body"]', document.body);
    }
}

/**
 * setCssNode
 */
class ElementCSS {
    /**
     * @typedef {Object} ElementCSSReturn
     * @property {(keys: String[]) => String[]} get
     * @property {(styleObject: CSSStyleDeclaration) => ElementCSSReturn} set
     */

    /**
     * Set node style
     * @param {HTMLElement} node 
     * @param {CSSStyleDeclaration} styleObject 
     * @returns {ElementCSSReturn}
     */
    static set(node, styleObject) {
        Object.keys(styleObject).forEach(k => {
            node.style[k] = styleObject[k];
        })
        return {
            /**
             * Get CSS property
             * @param {String} keys 
             * @returns {[...String]}
             */
            get: (keys) => ElementCSS.get(node, keys),
            /**
             * Set node style
             * @param {CSSStyleDeclaration} styleObject
             * @returns {ElementCSSReturn}
             */
            set: (styleObject) => ElementCSS.set(node, styleObject)
        }
    }
    /**
     * Get CSS property
     * @param {HTMLElement} node
     * @param {String} keys 
     * @returns {[...String]}
     */
    static get(node, keys) {
        if (keys) {
            const obj = {};
            keys.forEach(k => obj[k] = node.style[k]);
            return obj;
        } else {
            return node.style;
        }
    }
}

/**
 * Add or Edit the attribute of node
 */
class ElementAttribute {
    /** 
     * @typedef {Record<String, String>} SetElementAttribute
     */

    /**
     * @typedef {Object} ElementAttributeReturn
     * @property {(attributeObject: SetElementAttribute) => ElementAttributeReturn} set
     * @property {(keys: string) => string}
     */

    /**
     * Set attribute for node
     * @param {ElementAttribute} node 
     * @param {SetElementAttribute} attributeObject
     * @returns 
     */
    static set(node, attributeObject) {
        Object.keys(attributeObject).forEach(k => {
            node.setAttribute(k, attributeObject[k])
        })
        return {
            /**
             * Set attribute for node
             * @param {SetElementAttribute} attributeObject 
             * @returns {ElementAttributeReturn}
             */
            set: (attributeObject) => ElementAttribute.set(node, attributeObject),
            /**
             * Get attribute value of node
             * @param {String|String[]} keys 
             * @returns {String|String[]}
             */
            get: (keys) => ElementAttribute.get(node, keys)
        }
    };
    /**
     * Get attribute value of node
     * @param {HTMLElement} node 
     * @param {String|String[]} keys 
     * @returns {String|String[]}
     */
    static get(node, keys) {
        let obj;
        if (keys.length === 1) obj = node.getAttribute(keys[0]);
        else {
            obj = {};
            keys.forEach(k => obj[k] = node.getAttribute(k));
        }
        return obj;
    };
}

/**
 * Edit class of node
 */
class ElementClass {
    /**
     * @typedef {(className: string) => ElementClassReturn} addFunctionReturn
     * @typedef {(className: string) => ElementClassReturn} removeFunctionReturn
     * @typedef {(className: string, replaceClassName: string) => ElementClassReturn} toggleFunctionReturn
     * 
     * @typedef {Object} ElementClassReturn
     * @property {addFunctionReturn} add
     * @property {removeFunctionReturn} remove
     * @property {toggleFunctionReturn} toggle 
     */

    /**
     * Add a class of node
     * @param {HTMLElement} node 
     * @param {String} className 
     * @returns 
     */
    static add(node, className = 'classname') {
        node.classList.add(className);
        return {
            /**
             * Add a class of node
             * @param {String} className 
             * @returns {ElementClassReturn}
             */
            add: (className) => ElementClass.add(node, className),
            /**
             * Remove a class of node
             * @param {String} className 
             * @returns {ElementClassReturn}
             */
            remove: (className) => ElementClass.remove(node, className),
            /**
             * Toggle class of node
             * @param {String} className 
             * @param {String} replaceClassName 
             * @returns {ElementClassReturn}
             */
            toggle: (className, replaceClassName) => ElementClass.toggle(node, className, replaceClassName)
        }
    }
    /**
     * Remove a class of node
     * @param {HTMLElement} node 
     * @param {String} className 
     * @returns 
     */
    static remove(node, className = 'classname') {
        node.classList.remove(className);
        return {
            /**
             * Add a class of node
             * @param {String} className 
             * @returns {ElementClassReturn}
             */
            add: (className) => ElementClass.add(node, className),
            /**
             * Remove a class of node
             * @param {String} className 
             * @returns {ElementClassReturn}
             */
            remove: (className) => ElementClass.remove(node, className),
            /**
             * Toggle class of node
             * @param {String} className 
             * @param {String} replaceClassName 
             * @returns {ElementClassReturn}
             */
            toggle: (className, replaceClassName) => ElementClass.toggle(node, className, replaceClassName)
        }
    }
    /**
     * Check node include a class
     * @param {HTMLElement} node 
     * @param {String} className 
     * @returns {boolean}
     */
    static get(node, classname) {
        if (classname) return node.classList.includes(classname)
        else return node.classList;
    }
    /**
     * Toggle class of node
     * @param {HTMLElement} node 
     * @param {String} className
     * @param {String} replaceClassName 
     * @returns 
     */
    static toggle(node, className, replaceClassName) {
        if (Array.from(node.classList).includes(className)) {
            if (replaceClassName) ElementClass.add(node, replaceClassName)
            ElementClass.remove(node, className);
        }
        else {
            if (replaceClassName) ElementClass.remove(node, replaceClassName)
            ElementClass.add(node, className);
        }
        return {
            /**
             * Add a class of node
             * @param {String} className 
             * @returns {ElementClassReturn}
             */
            add: (className) => ElementClass.add(node, className),
            /**
             * Remove a class of node
             * @param {String} className 
             * @returns {ElementClassReturn}
             */
            remove: (className) => ElementClass.remove(node, className),
            /**
             * Toggle class of node
             * @param {String} className 
             * @param {String} replaceClassName 
             * @returns {ElementClassReturn}
             */
            toggle: (className, replaceClassName) => ElementClass.toggle(node, className, replaceClassName)
        }
    }
    /**
     * Set a node to use action
     * @param {HTMLElement} node 
     * @returns 
     */
    static setNode(node) {
        return {
            /**
             * Add a class of node
             * @param {String} className 
             * @returns {ElementClassReturn}
             */
            add: (className) => ElementClass.add(node, className),
            /**
             * Remove a class of node
             * @param {String} className 
             * @returns {ElementClassReturn}
             */
            remove: (className) => ElementClass.remove(node, className),
            /**
             * Toggle class of node
             * @param {String} className 
             * @param {String} replaceClassName 
             * @returns {ElementClassReturn}
             */
            toggle: (className, replaceClassName) => ElementClass.toggle(node, className, replaceClassName)
        }
    }
}

/**
 * Custom a Toggle
 */
class ElementToggle {
    /**
     * Create a normal toggle
     * @param {HTMLElement} node 
     * @param {String} classEnabled - Use class when toggle enabled
     * @param {Boolean} toggle 
     * @param {(event: DocumentEventMap['click'], toggle: boolean)} callback 
     * @param {Boolean} classDisabled - Use class when toggle diabled
     */
    static create(node, classEnabled, toggle, callback = () => { }, classDisabled = 'classname') {
        const att = ElementAttribute.set(node, { toggle: `${toggle}` });
        const cls = ElementClass.add(node, toggle ? classEnabled : classDisabled);
        node.onclick = (event) => {
            cls.toggle(classEnabled, classDisabled);
            callback(event, att.set({ toggle: att.get(['toggle']) === 'false' }).get(['toggle']) === 'true');
        }
        return class {
            /**
             * Click this toggle
             * @returns {ElementToggle}
             */
            static click() {
                node.click();
                return this;
            }
            /**
             * Set value this toggle
             * @returns {ElementToggle}
             */
            static setValue(bool) {
                if (att.get(['toggle']) !== `${bool}`) cls.toggle(classEnabled, classDisabled);
                att.set({ toggle: `${bool}` });
                return this;
            }
        }
    }

    /**
     * Create a ratio toggle
     * @param {HTMLElement} nodes 
     * @param {String} classEnabled - Use class when toggle enabled
     * @param {Number} defaultToggleIndex - Set default index of this
     * @param {(event: DocumentEventMap['click'], index: Number) => void} callback 
     * @param {String} classDisabled  - Use class when toggle disabled
     */
    static createRatio(nodes, classEnabled, defaultToggleIndex = 0, callback = (event = new Event(), index = 0) => { }, classDisabled = 'classname') {
        nodes.forEach((node, index) => {
            ElementClass.add(node, (defaultToggleIndex === index) ? classEnabled : classDisabled);
            node.onclick = (event) => {
                ElementClass.toggle(node, classEnabled, classDisabled);
                ElementClass.toggle(nodes[defaultToggleIndex], classEnabled, classDisabled);
                defaultToggleIndex = index;
                callback(event, index);
            }
        })
        return class {
            /**
             * Click toggle of index
             * @returns {ElementToggle}
             */
            static click(index) {
                nodes[index]?.click();
                return this;
            }
            /**
             * Enable toggle of index
             * @returns {ElementToggle}
             */
            static setValue(index) {
                ElementClass.toggle(nodes[index], classEnabled, classDisabled);
                ElementClass.toggle(nodes[defaultToggleIndex], classEnabled, classDisabled);
                defaultToggleIndex = index;
                return this;
            }
        }
    }
}

const dialogList = []
KeyBind.createSetup('down', { key: 'escape' }, () => {
    if (dialogList.length > 0) dialogList[dialogList.length - 1].hide();
})

/**
 * Custom a dialog
 */
class Dialog {
    /**
     * Setup custom dialog
     * @param {HTMLElement|CreateNode} dialogNode 
     * @param {Number} backgroundOpacity 
     * @param {(dialog: CreateNode, ...data: any) => void} onShow 
     * @param {(dialog: CreateNode, ...data: any) => void} onClose 
     * @param {HTMLElement} closeNode - Set a node for close this dialog 
     * @returns {Dialog}
     */
    constructor(dialogNode, backgroundOpacity = 1, onShow = () => { }, onClose = () => { this.hideDialog() }, closeNode) {
        this.background = document.createElement('div');
        this.onCloseCallback = null;
        this.onShow = onShow;
        this.onClose = onClose;
        this.autoHideDialogOnClose = true;

        if (dialogNode.constructor.name === 'CreateNode') dialogNode = dialogNode.getNode()
        if (dialogNode) {
            this.background.appendChild(dialogNode);
            ElementCSS.set(dialogNode, {
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            })
        };
        if (closeNode) closeNode.onclick = () => this.hide();
        else GetElement.id('close', this.background).onclick = () => this.hide();
        ElementCSS.set(this.background, {
            backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})`,
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: '100%',
            height: '100%',
            display: 'none'
        });
    }
    /**
     * Setup custom dialog
     * @param {HTMLElement} dialogNode 
     * @param {Number} backgroundOpacity 
     * @param {(dialog: CreateNode) => void} onShow 
     * @param {(dialog: CreateNode) => void} onClose 
     * @param {HTMLElement} closeNode - Set a node for close this dialog 
     * @returns {Dialog}
     */
    static setup(dialogNode, backgroundOpacity = 1, onShow = () => { }, onClose = () => { }, closeNode) {
        return new Dialog(dialogNode, backgroundOpacity, onShow, onClose, closeNode).create();
    }
    /**
     * Create dialog
     */
    create() {
        document.body.appendChild(this.background);
        return this;
    }
    /**
     * Popup this dialog
     * @param {any} data
     * @returns {Dialog} 
     */
    show(data) {
        this.onShow(new CreateNode(this.background), data);
        ElementCSS.set(this.background, {
            display: '',
            zIndex: 10000 + dialogList.length
        })
        dialogList.push(this);
        return this;
    }
    /**
     * Hide this dialog
     * @returns {Dialog} 
     */
    hide() {
        this.onClose(new CreateNode(this.background), this.onCloseCallback);
        dialogList.pop(this);
        if (this.autoHideDialogOnClose) this.hideDialog();
        delete this.onCloseCallback;
        return this;
    }
    hideDialog() {
        ElementCSS.set(this.background, {
            display: 'none'
        })
    }
    /**
     * Edit this dialog
     * @param {(dialog: CreateNode) => void} callback
     * @returns {Dialog} 
     */
    editDialog(callback = () => { }) {
        callback(new CreateNode(this.background));
        return this;
    }
    /**
     * Clean this dialog
     */
    release() {
        document.body.removeChild(this.background);
    }

    /**
     * Set close event callback
     * @param {*} data 
     */
    setOnCloseData(data) {
        this.onCloseCallback = data;
    }
}

/**
 * Create a node
 */
class CreateNode {
    /**
     * Get or create a node
     * @param {keyof HTMLElementTagNameMap|CreateNode|HTMLElement} nodeOrTagName 
     * @param {CreateNode|HTMLElement} appendNode
     */
    constructor(nodeOrTagName, appendNode) {
        /**
         * @type {HTMLElement}
         */
        this.node = (typeof nodeOrTagName === 'string') ? document.createElement(nodeOrTagName) : (nodeOrTagName.constructor.name === 'CreateNode') ? nodeOrTagName.getNode() : nodeOrTagName;
        if (appendNode) this.addToNode(appendNode)
    }
    /**
     * Set style of this node
     * @param {CSSStyleDeclaration} objectStyle 
     * @returns {CreateNode}
     */
    setCSS(objectStyle) {
        ElementCSS.set(this.node, objectStyle);
        return this;
    }
    /**
     * Set string of innertext
     * @param {String} text 
     * @returns {CreateNode}
     */
    setText(text) {
        this.node.innerText = text;
        return this;
    }
    /**
     * Append string of innertext
     * @param {String} text 
     * @returns  {CreateNode}
     */
    addText(text) {
        this.node.innerText += text;
        return this;
    }
    /**
     * Set string of innerHTML
     * @param {String} htmlString 
     * @returns {CreateNode}
     */
    setHTML(htmlString) {
        this.node.innerHTML = htmlString;
        return this;
    }
    /**
     * Append string of innerHTML
     * @param {String} htmlString 
     * @returns {CreateNode}
     */
    addHTML(htmlString) {
        this.node.innerHTML = htmlString;
        return this;
    }
    /**
     * Set attribute of node
     * @param {Record<String, String>} attributeObject 
     * @returns {CreateNode}
     */
    setAttribute(attributeObject) {
        ElementAttribute.set(this.node, attributeObject);
        return this;
    }
    /**
     * Get attribute of node
     * @param {String[]} keys 
     * @returns {CreateNode}
     */
    getAttribute(keys) {
        return ElementAttribute.get(this.node, keys);
    }
    /**
     * Add class of node
     * @param {String[]} classNameArray 
     * @returns {CreateNode}
     */
    setClass(classNameArray) {
        const node = ElementClass.setNode(this.node);
        classNameArray.forEach(c => node.add(c));
        return this;
    }
    /**
     * Check this node is has class
     * @param {String} classname 
     * @returns {Boolean}
     */
    getClass(classname) {
        return ElementClass.get(this.node, classname);
    }
    /**
     * Remove class of node
     * @param {String[]} classNameArray 
     * @returns {CreateNode}
     */
    removeClass(classNameArray) {
        const node = ElementClass.setNode(this.node);
        classNameArray.forEach(c => node.remove(c));
        return this;
    }
    /**
     * Toggle class of node
     * @param {String} className 
     * @param {String} replaceClassName
     * @returns {CreateNode}
     */
    toggleClass(className, replaceClassName = 'classname') {
        const node = ElementClass.setNode(this.node);
        node.toggle(className, replaceClassName);
        return this;
    }
    /**
     * Set event of node
     * @param {EventListeners} eventObject 
     * @returns 
     */
    setEvent(eventObject) {
        ElementEvent.create(this.node, eventObject);
        return this;
    }
    /**
     * Set property of node
     * @param {HTMLElement} propertyObject 
     * @returns {CreateNode}
     */
    setProperty(propertyObject = new HTMLElement()) {
        Object.keys(propertyObject).forEach(k => this.node[k] = propertyObject[k]);
        return this;
    }
    /**
     * Get node or get node in callback
     * @param {(node: HTMLElement) => void} callback 
     * @returns {HTMLElement|CreateNode}
     */
    getNode(callback) {
        if (!callback) return this.node;
        callback(this.node);
        return this;
    }
    /**
     * Add this node to orther node
     * @param {HTMLElement|CreateNode} node 
     * @returns {CreateNode}
     */
    addToNode(node) {
        try {
            if (node.constructor.name === 'CreateNode') node.getNode().appendChild(this.node);
            else node.appendChild(this.node);
        } catch (error) {
            console.error(error)
            console.log(node)
        }
        return this;
    }
    /**
     * Add a node to this node
     * @param {HTMLElement|CreateNode} node 
     * @returns {CreateNode} 
     */
    appendNode(node) {
        if (node.constructor.name === 'Array')
            node.forEach(n => {
                if (n.constructor.name === 'CreateNode') n.addToNode(this.node)
                else this.node.appendChild(n);
            })
        else
            if (node.constructor.name === 'CreateNode') node.addToNode(this.node)
            else this.node.appendChild(node);
        return this;
    }
    /**
     * Clean up this node
     */
    release() {
        this.node.remove();
    }
    /**
     * @typedef {Object} RemoveChildReturn
     * @property {CreateNode} parent
     * @property {HTMLElement[]} childNodes
     */

    /**
     * Remove all child of node or specified child
     * @param {HTMLElement} node 
     * @returns {RemoveChildReturn}
     */
    removeChild(node = undefined) {
        let n;
        if (node) n = this.node.removeChild(node)
        else n = Array.from({ length: this.node.childNodes.length }, v => this.node.removeChild(this.node.childNodes[0]));
        return {
            parent: this,
            childNodes: n
        };
    }
    /**
     * Clone this node
     * @param {Boolean} includeChildNodes 
     * @returns {CreateNode}
     */
    clone(includeChildNodes = true) {
        const cloneNode = new CreateNode(this.node.cloneNode());
        if (includeChildNodes) this.node.childNodes.forEach(n => cloneNode.appendNode(new CreateNode(n).clone()));
        return cloneNode;
    }
    /**
     * Visible toggle
     */
    visibleToggle() {
        this.node.style.display = (this.node.style.display === 'none') ? '' : 'none';
        return this;
    }
    /**
     * Get child node by is in this node
     * @param {String} id
     * @param {(node: CreateNode) => void} callback
     * @returns {CreateNode}
     */
    getChild(id, callback = () => {}) {
        callback(new CreateNode(GetElement.id(id, this.node)));
        return this;
    }
    
    /**
     * @typedef {Object} AnimateObject
     * @property {Number} duration - Set delay time (ms)
     * @property {CSSStyleDeclaration} css - Set style of animate 
     */

    /**
     * Set animate of this node
     * @param {AnimateObject[]} animateObject 
     * @param {(node: CreateNode) => void} callbackOnEnd
     */
    setAnimate(animateObject, callbackOnEnd = () => { }) {
        (async () => {
            for (const v of animateObject) {
                await new Promise(res => {
                    this.setCSS(v.css);
                    setTimeout(res, v?.duration ?? 0);
                });
            }
            callbackOnEnd(this);
        })();
        return this;
    }

    /**
     * Insert node to this node on index
     * @param {CreateNode|HTMLElement} node 
     * @param {Number} index 
     * @returns 
     */
    insertNode(node, index) {
        node = new CreateNode(node).getNode();
        const childNodes = Array.from(this.node.childNodes).filter(n => n.nodeName[0] !== '#');
        this.node.insertBefore(node, childNodes[index]);
        return this;
    }

    /**
     * Insert this node to orther node
     * @param {CreateNode|HTMLElement} node 
     * @param {Number} index 
     */
    insertToNode(node, index) {
        new CreateNode(node).insertNode(this.node, index);
        return this;
    }
}

/**
 * Custom html site
 */
class PageDisplay {
    static setTitle(titleString = 'Page') {
        document.title = titleString;
        return this;
    }
    static importDialogFile(path = '') {
        fetch(path).then(v => v.text()).then(v => {
            new CreateNode('div').setCSS({ display: 'none' }).addHTML(v).addToNode(document.body)
        });
        return this;
    }
    static importCSS(cssPath) {
        if (cssPath) {
            if (typeof cssPath === 'string') new CreateNode('link').setProperty({ rel: 'stylesheet', href: cssPath }).addToNode(document.head)
            else cssPath.forEach(v => new CreateNode('link').setProperty({ rel: 'stylesheet', href: v }).addToNode(document.head))
        }
        return this;
    }
    static setIcon(iconPath) {
        if (GetElement.selector('[rel="icon"]')) GetElement.selector('[rel="icon"]').href = iconPath;
        else new CreateNode('link').setAttribute({
            rel: 'icon',
            type: 'image/x-icon',
            href: iconPath
        }).addToNode(document.head)
        return this;
    }
    static setGraph(graphContent = { facebook: { type: undefined, title: undefined, description: undefined, image: undefined, url: undefined }, twitter: { card: undefined, title: undefined, description: undefined, image: undefined, url: undefined } }) {
        const { facebook, twitter } = graphContent;
        if (facebook?.type) new CreateNode('meta').setAttribute({ property: 'og:type', content: facebook.type }).addToNode(document.head);
        if (facebook?.title) new CreateNode('meta').setAttribute({ property: 'og:title', content: facebook.title }).addToNode(document.head);
        if (facebook?.description) new CreateNode('meta').setAttribute({ property: 'og:description', content: facebook.description }).addToNode(document.head);
        if (facebook?.image) new CreateNode('meta').setAttribute({ property: 'og:image', content: facebook.image }).addToNode(document.head);
        if (facebook?.url) new CreateNode('meta').setAttribute({ property: 'og:url', content: facebook.url }).addToNode(document.head);

        if (twitter?.card) new CreateNode('meta').setAttribute({ property: 'twitter:card', content: facebook.card }).addToNode(document.head);
        if (twitter?.title) new CreateNode('meta').setAttribute({ property: 'twitter:title', content: facebook.title }).addToNode(document.head);
        if (twitter?.description) new CreateNode('meta').setAttribute({ property: 'twitter:description', content: facebook.description }).addToNode(document.head);
        if (twitter?.image) new CreateNode('meta').setAttribute({ property: 'twitter:image', content: facebook.image }).addToNode(document.head);
        if (twitter?.url) new CreateNode('meta').setAttribute({ property: 'twitter:url', content: facebook.url }).addToNode(document.head);
        return this;
    }
}

/**
 * Download a file
 * @param {String} fileURL 
 * @param {String} fileName 
 * @param {boolean} isTextFile
 */
const DownloadFile = (fileURL, fileName = 'content.txt', isTextFile) => {
    let url = fileURL;
    if (typeof fileURL === 'object') url = URL.createObjectURL(fileURL);
    if (isTextFile) url = `data:text/plain;charset=utf-8,${encodeURIComponent(fileURL)}`

    console.log(url);
    new CreateNode('a')
        .setCSS({ display: 'none' })
        .setProperty({ href: url, download: fileName })
        .getNode((node) => {
            node.click(); URL.revokeObjectURL(url);
        })
        .release()
}

/**
 * Custom import file event
 */
class ImportFile {
    /**
     * Setup import file
     * @param {HTMLElement|CreateNode} node 
     * @param {(base64: string, fileName: string, fileType: string) => void} callback 
     * @param {String} allowTypes 
     * @param {Boolean} notBase64URL 
     * @param {Boolean} resetInput 
     * @param {Number} delayPerFile
     * @param {(node: CreateNode) => void} dragEnterCallback
     * @param {(node: CreateNode) => void} dragLeaveCallback
     * @returns {CreateNode}
     */
    static setup(node, callback = () => { }, allowTypes = undefined, notBase64URL = false, resetInput = true, delayPerFile = 0, dragEnterCallback = () => { }, dragLeaveCallback = () => { }) {
        const importEvent = f => {
            if (allowTypes === undefined || allowTypes.includes(f.type) || allowTypes === f.type) {
                const r = new FileReader();
                r.onload = (e) => callback((notBase64URL) ? e.currentTarget.result.split(',')[1] : e.currentTarget.result, f.name, f.type);
                r.readAsDataURL(f);
            }
        }
        node = new CreateNode(node);
        if (node.setAttribute({ multiple: true }).getAttribute(['type']) === 'file') node.setEvent({
            change: (e) => {
                (async () => {
                    for (const f of Array.from(e.currentTarget.files)) {
                        await new Promise(res => {
                            importEvent(f);
                            setTimeout(res, delayPerFile);
                        })
                    }
                })();
                if (resetInput) e.currentTarget.value = '';
            }
        })
        else node.setEvent({
            dragover: (e) => e.preventDefault(),
            drop: (e) => {
                e.preventDefault(); e.stopPropagation();
                (async () => {
                    for (const f of Array.from(e.dataTransfer.files)) {
                        await new Promise(res => {
                            importEvent(f);
                            setTimeout(res, delayPerFile);
                        })
                    }
                })();
            }
        })
        return new CreateNode(node).setEvent({
            dragover: () => dragEnterCallback(new CreateNode(node)),
            drop: () => dragLeaveCallback(new CreateNode(node)),
            dragleave: (e) => {
                if (e.clientX === 0 && e.clientY === 0) dragLeaveCallback(new CreateNode(node))
            },
        });
    }
}

class ImageHandle {
    /**
     * @typedef {Object} Point
     * @property {Number} width
     * @property {Number} height
     */

    /**
     * Get image data
     * @param {String} urlSrc 
     * @param {(arrayData: Uint8ClampedArray, size: Point) => void} callback
     * @param {Number} maxHeightSize 
     */
    static getImageData(urlSrc, callback, maxHeightSize) {
        const img = new Image();
        img.src = urlSrc;
        img.onload = () => {
            if (maxHeightSize === undefined || maxHeightSize <= img.height) maxHeightSize = img.height;

            new CreateNode('canvas')
                .setProperty({ width: img.width * (maxHeightSize / img.height), height: img.height * (maxHeightSize / img.height) })
                .getNode(c => {
                    const ctx = c.getContext('2d');
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, c.width, c.height);
                    callback(ctx.getImageData(0, 0, img.width * (maxHeightSize / img.height), img.height * (maxHeightSize / img.height)).data, { width: c.width, height: c.height });
                    img.remove();
                }).release();
        }
    }
    /**
     * Get base64 of image data
     * @param {number[]} imageData 
     * @param {Point} size 
     * @param {(base64: string) => void} callback 
     */
    static dataToImage(imageData, size = { width: 64, height: 64 }, callback = () => { }) {
        new CreateNode('canvas')
            .setProperty(size)
            .getNode(c => {
                const data = new ImageData(size.width, size.height, { colorSpace: 'srgb' });
                data.data.set(imageData);
                c.getContext('2d').putImageData(data, 0, 0);
                callback(c.toDataURL().split(',')[1]);
            })
    }
    /**
     * Get image pixel value
     * @param {Array|ArrayBuffer} arrayBuffer 
     * @param {number} index 
     * @returns {number[]}
     */
    static getPixel(arrayBuffer, index) {
        arrayBuffer = new Uint8Array(arrayBuffer);
        index *= 4;
        return [arrayBuffer[index], arrayBuffer[index + 1], arrayBuffer[index + 2], arrayBuffer[index + 3]]
    }

    /**
     * For each per pixel
     * @param {Array} array 
     * @param {(r: Number, g: Number, b: Number, a: Number, index: Number) => void} callback 
     */
    static forEachFixel(array, callback) {
        array = Array.from(array);
        for (let i = 0; i < array.length / 4; i++) {
            const no = i * 4;
            callback(array[no], array[no + 1], array[no + 2], array[no + 3], i);
        }
    }
}

/**
 * Convert array number to string
 */
class Handle {
    /**
     * idk
     * @param {any[]} array 
     * @returns {String}
     */
    static arrayToString(array) {
        return new TextDecoder().decode(new Uint8Array(array))
    }
}

class HTML {
    static pageDisplay = PageDisplay;
    static keyBind = KeyBind;
    static event = ElementEvent;
    static get = GetElement;
    static CSS = ElementCSS;
    static attribute = ElementAttribute;
    static class = ElementClass;
    static toggle = ElementToggle;
    static dialog = Dialog;
    static create = CreateNode;
    static importFile = ImportFile;
    static imageHandle = ImageHandle;
    static handle = Handle;
    static downloadFile = DownloadFile;
}
