import PS from 'perfect-scrollbar';
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

        this.PS = PS;
        this._trigger = trigger;

        this._options = {
            customStyle: {
              overlayColor: '',
            },
            header: {
                use: true
            },
            footer: {
                use: true,
                focusingColor: '',
                applyCallback: null
            },
            useContainerScroll: true,
            useContentCache: true,
            preventBackgroundScroll: false,
            callback: null
        };

        if (options) Object.assign(this._options, options);

        this._trigger.addEventListener('click', (ev) => {
            const target = ev.currentTarget || ev.target;
            const params = {};
            params.id = target.getAttribute('data-modal-id');
            params.title = target.getAttribute('data-modal-title');
            params.width = target.getAttribute('data-width') ? target.getAttribute('data-width') : 300;

            // 이미 생성됐는지 체크.
            if (document.getElementById(`modal_${params.id}_temp`)) {
              this.open(`${params.id}_temp`);
            } else {
              this.generate(params, () => {
                this.open(`${params.id}_temp`);
              });
            }
        });
    } // constructor end

    generate(params, callback) {
        const layer = document.getElementById(params.id);
        const layerClone = layer.cloneNode(true);
        layerClone.id = `${params.id}_temp`;

        const overlay = document.createElement('div');
        const wrapper = document.createElement('div');

        layerClone.style.width = `${params.width}px`;
        overlay.id = `modal_${params.id}_temp`;
        overlay.classList.add('modal-overlay');
        if ( this._options.customStyle.overlayColor ) overlay.style.backgroundColor = this._options.customStyle.overlayColor;

        wrapper.classList.add('modal-wrapper');
        wrapper.classList.add('close');

        let header = this._options.header.use
            ? `<div class="modal-header"><span class="modal-header__title">${params.title}</span><button class="modal-header__closeBtn close"><svg width='1em' height='1em' fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.85" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>`
            : '';

        let footer = this._options.footer.use
            ? `<div class="modal-footer"><button class="modal-footer__close close">닫기</button><button class="modal-footer__apply" style="background-color:${this._options.footer.focusingColor}">적용</button></div>`
            : '';

        layerClone.innerHTML = `${header}<div class="modal-content__inner">${layerClone.innerHTML}</div>${footer}`;

        wrapper.appendChild(layerClone);
        overlay.appendChild(wrapper);
        document.body.appendChild(overlay);

        //let height = layer.clientHeight;
        if ( typeof this._options.footer.applyCallback === 'function' ) layerClone.querySelector('.modal-footer__apply').addEventListener('click', this._options.footer.applyCallback);
        if ( typeof callback === 'function' ) callback();
    }

    open(id) {
      const layer = document.getElementById(id);
      const overlay = document.getElementById(`modal_${id}`);
      const nodeForClose = overlay.querySelectorAll('.close');

      overlay.classList.add('is-active');
      layer.classList.add('is-active');

      const scrollArea = layer.querySelector('.modal-content__inner');
      const inputHeight = () => {
        let contentHeight = scrollArea.scrollHeight;
        let maxHeight = window.innerHeight - 30;
        let substractHeight = (() => {
          if ( !this._options.footer.use && !this._options.header.use ) return 30;
          else if ( (this._options.header.use && !this._options.footer.use) || (!this._options.footer.use && this._options.footer.use) ) return 80;
          else return 130;
        })();
        let scrollAreaHeight = contentHeight >= maxHeight ? maxHeight - substractHeight : contentHeight;
        scrollArea.style.height = `${scrollAreaHeight}px`;
        return contentHeight >= maxHeight;
      }

      const checkHeight = inputHeight();
      window.addEventListener('resize', inputHeight, true);

      // close event
      nodeForClose.forEach((item) => {
        item.addEventListener('click', () => {
          this.close(layer, overlay);
        });
      });

      layer.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      if ( this._options.useContainerScroll && checkHeight ) {
        this.PS.initialize(scrollArea);
      }

      document.body.style.overflowY = 'hidden';

      if (typeof this._options.callback === 'function') this._options.callback(layer);
    }

    close(layer, overlay) {
      if (!this._options.useContentCache) {
        overlay.parentNode.removeChild(overlay)
      }
      overlay.classList.remove('is-active');
      layer.classList.remove('is-active');

      document.body.style.overflowY = 'auto';
    }

};

Modal.VERSION = '1.0.0';
module.exports = Modal;
