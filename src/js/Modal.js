require('../sass/modal.scss');

/**
 * Copyright (c) fafazlab
 * fafaz-modal projects are licensed under the MIT license
 */

// IE8
// https://stackoverflow.com/questions/43216659/babel-ie8-inherit-issue-with-object-create
/* eslint-disable */
if (typeof Object.create !== "function") {
  Object.create = function(o, properties) {
    if (typeof o !== "object" && typeof o !== "function") {
      throw new TypeError("Object prototype may only be an Object: " + o);
    } else if (o === null) {
      throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
    }

    function F() {}
    F.prototype = o;
    return new F();
  };
}

export default class Modal {
  constructor(trigger, options) {
    if (!trigger) return;
    trigger = document.querySelectorAll(trigger);

    this._options = {
      overlayColor: '',
      useContainerScroll: false,
      nodeClone: true,
      useContentCache: true,
      preventBackgroundScroll: true,
      useHeader: true,
      useFooter: true,
      footerFocusingColor: '',
      footerButtonName: ['cancel', 'apply'],
      footerApplyCallback: null,
      callback: null,
    };

    if (options) {
      Object.assign(this._options, options);
    }

    for (let i = 0, c = trigger.length; i < c; i++) {
      trigger[i].addEventListener('click', (ev) => {
        const target = ev.currentTarget || ev.target;
        const params = {};
        params.id = target.getAttribute('data-modal-id');
        params.title = target.getAttribute('data-modal-title');
        params.width = target.getAttribute('data-modal-width') ? target.getAttribute('data-modal-width') : 500;

        // checking already generated
        let target_id = this._options.nodeClone ? `${params.id}_temp` : params.id;
        if (document.getElementById(`modal_${target_id}`)) {
          this.open(target_id);
        } else {
          this.generate(params, () => {
            this.open(target_id);
          });
        }
      });
    }
  } // constructor end


  generate(params, callback) {
    const overlay = document.createElement('div');
    const wrapper = document.createElement('div');

    let layer = document.getElementById(params.id);

    if (this._options.nodeClone) {
      layer = layer.cloneNode(true);
      layer.id = `${params.id}_temp`;
      overlay.id = `modal_${params.id}_temp`;
    } else {
      overlay.id = `modal_${params.id}`;
    }

    layer.classList.add('modal-content');
    layer.style.width = `${params.width}px`;
    overlay.classList.add('modal-overlay');
    if (this._options.overlayColor) overlay.style.backgroundColor = this._options.overlayColor;

    wrapper.classList.add('modal-wrapper');
    wrapper.classList.add('close');
    let header = this._options.useHeader ?
      `<div class="modal-header"><span class="modal-header__title">${params.title}</span><button class="modal-header__closeBtn close"><svg width='1em' height='1em' fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>` :
      '';

    let footer = this._options.useFooter ?
      `<div class="modal-footer"><button class="modal-footer__close close">${this._options.footerButtonName[0]}</button><button class="modal-footer__apply" style="background-color:${this._options.footerFocusingColor}">${this._options.footerButtonName[1]}</button></div>` :
      '';

    layer.innerHTML = `${header}<div class="modal-content__inner">${layer.innerHTML}</div>${footer}`;

    wrapper.appendChild(layer);
    overlay.appendChild(wrapper);
    document.body.appendChild(overlay);

    //let height = layer.clientHeight;
    if (this._options.useFooter && typeof this._options.footerApplyCallback === 'function') layer.querySelector('.modal-footer__apply').addEventListener('click', this._options.footerApplyCallback);
    if (typeof callback === 'function') callback(layer);
  }

  open(id) {
    const layer = document.getElementById(id);
    const overlay = document.getElementById(`modal_${id}`);
    const nodeForClose = overlay.querySelectorAll('.close');

    overlay.classList.add('is-active');
    layer.classList.add('is-active');

    const scrollArea = layer.querySelector('.modal-content__inner');
    this.resize(scrollArea);
    window.addEventListener('resize', () => {
      this.resize(scrollArea);
    }, true);

    // close event
    nodeForClose.forEach((item) => {
      item.addEventListener('click', () => {
        this.close(layer, overlay);
      });
    });

    layer.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    if (this._options.preventBackgroundScroll) {
      document.documentElement.style.overflowY = 'hidden';
      document.body.style.overflowY = 'hidden';
    }

    if (typeof this._options.callback === 'function') this._options.callback(layer);
  }

  close(layer, overlay) {
    if (!this._options.useContentCache) {
      overlay.parentNode.removeChild(overlay)
    }
    overlay.classList.remove('is-active');
    layer.classList.remove('is-active');

    document.documentElement.style.overflowY = 'initial';
    document.body.style.overflowY = 'initial';
  }

  resize(scrollArea) {
    let contentHeight = scrollArea.scrollHeight;
    let maxHeight = window.innerHeight - 30;
    let substractHeight = (() => {
      if (!this._options.useFooter && !this._options.useHeader) return 30;
      else if ((this._options.useHeader && !this._options.useFooter) || (!this._options.useHeader && this._options.useFooter)) return 80;
      else return 130;
    })();

    if (contentHeight >= maxHeight - substractHeight) {
      scrollArea.style.height = `${maxHeight - substractHeight}px`;
      if (this._options.useContainerScroll) scrollArea.style.overflowY = 'scroll';
    }
  }
};

Modal.VERSION = '1.0.1';
module.exports = Modal;
