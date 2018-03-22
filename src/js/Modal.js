import Component from '@egjs/component';
import { addEvent, addEventDelegation } from './utils';
import '../sass/index.scss';

/**
 * Copyright (c) fafazlab
 * fafaz-modal projects are licensed under the MIT license
 * https://github.com/fafaz/fafaz-modal
 * 
 * @ver 1.3
 */

if (typeof NodeList.prototype.forEach !== "function") {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

export default class Modal extends Component {

    constructor(trigger = undefined, customConfig = {}) {
        super();

        this._version = '1.3';

        // 기본 설정
        this._config = {
            border: undefined,
            overlayColor: undefined,
            fullScreen: false,
            cloneNode: false, // 노드를 복사하기 때문에, 이벤트 바인딩을 새로 해주어야 한다. 열때마다 generate 하는 방식
            useHeader: false,
            ...customConfig
        };

        if (!trigger || typeof trigger !== 'string') {
            throw 'trigger must be a css selector in string type';
        }

        // 트리거 이벤트 맵핑
        addEventDelegation(trigger, 'click', (ev) => {
            const target = ev.delegateTarget;
            
            const params = {
                id: target.getAttribute('data-modal-id'),
                title: target.getAttribute('data-modal-title'),
                width: target.getAttribute('data-modal-width') ? target.getAttribute('data-modal-width') : 500,
            };

            const targetId = this._config.cloneNode 
                ? `wrapper_${params.id}_temp` 
                : `wrapper_${params.id}`;

            // 모달이 이미 generate 되었으면 open, 없으면 generate
            document.getElementById(targetId) 
                ? this.open(targetId, target) 
                : this.generate(params, () => this.open(targetId, target));
        });
    }
    // constructor end

    generate(params, callback) {
        // overlay element를 생성한 후 
        let overlay = document.createElement('div');
        let layer = document.getElementById(params.id);

        if (this._config.cloneNode) {
            layer = layer.cloneNode(true);
            layer.id = `${params.id}_temp`;
            overlay.id = `wrapper_${params.id}_temp`;
        } else {
            overlay.id = `wrapper_${params.id}`;
        }

        overlay.classList.add('modal-overlay');
        overlay.classList.add('modal-close');
        layer.classList.add('modal-content');

        if (!this._config.fullScreen) {
            layer.style.width = `${params.width}px`;
        } else {
            overlay.classList.add('_fullWidth');
        };

        // custom theme 설정값 적용
        if (this._config.overlayColor) overlay.style.backgroundColor = this._config.overlayColor;
        if (this._config.border) layer.style.border = this._config.border;

        let header = this._config.useHeader 
            ? `<section class="modal-header"><h1 class="modal-header__title">${params.title}</h1><button class="modal-header__closeBtn modal-close"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button></section>`
            : '';

        layer.innerHTML = `${header}<div class="modal-content__inner">${layer.innerHTML}</div>`;
        overlay.appendChild(layer);
        
        // 실제 DOM에 insert
        document.body.appendChild(overlay);

        const closeTriggers = overlay.querySelectorAll('.modal-close');
        closeTriggers.forEach((item) => addEvent(item, 'click', () => this.close(overlay.id)));
        addEvent(overlay,'click', () =>  this.close(overlay.id));
        addEvent(layer, 'click', (e) => e.stopPropagation());

       
        // callback 실행
        callback();

        // window가 resize 될떄 스크롤 여부를 판단
        addEvent(window, 'resize', () => this.checkScrolling(layer));
        this.trigger('afterGenerate', { container: layer });
    }

    open(target, trigger) {
        let overlay = document.getElementById(target);
        overlay.classList.add('is-active');
        document.documentElement.style.overflowY = 'hidden';

        let container = overlay.querySelector('.modal-content');
        this.trigger('afterOpen', { container, trigger });
        this.checkScrolling(container);
    }

    close(target) {
        const overlay = document.getElementById(target);

        // overlay의 active 클래스를 삭제
        overlay.classList.remove('is-active');

        // 복제된 node 라면 다시 삭제한다. ( 열떄마다 새로 generate하도록 )
        if (this._config.cloneNode) {
            overlay.parentNode.removeChild(overlay)
        }

        // html 노드의 overflow 를 초기화해준다.
        document.documentElement.style.overflowY = '';
        this.trigger('afterClose', { container: overlay.querySelector('.modal-content') });
    }

    checkScrolling(layer) {
        /**
         * NOTE::
         * layerHeight가 windowHeight 보다 크면 상단 위치 고정 후, overlay의 overflow 를 활성화
         * windowHeight 보다 작으면 html overflow deactivate
         */

        let windowHeight = window.innerHeight;
        let layerHeight = Math.round(layer.offsetHeight);
        layerHeight = (layerHeight%2 === 0) ? layerHeight : layerHeight+1;
        
        if (!this._config.fullScreen && windowHeight <= layerHeight) {
            layer.parentNode.classList.add('_scrollingLayer');
        } else {
            if (layer.parentNode.classList.contains('_scrollingLayer')) {
                layer.parentNode.classList.remove('_scrollingLayer');
            }
        }
    }
};
