import Component from '@egjs/component';
import { nodeToArray, addEvent } from './utils';
import '../sass/modal.scss';

/**
 * Copyright (c) fafazlab
 * fafaz-modal projects are licensed under the MIT license
 * https://github.com/fafaz/fafaz-modal
 */

export default class Modal extends Component {

    constructor(trigger = undefined, customOptions = {}) {
        super();

        if (!trigger) throw 'trigger is not exist';
        this._version = '1.1';

        // 기본 설정값
        const defaultOptions = {
            theme: {
                useBorder: true,
                borderColor: undefined,
                overlayColor: undefined,
            },
            cloneNode: true,
            fixedHeight: false,
            useHeader: true,
            usePreloader: false
        };
        
        // 커스텀 설정값 불러오기 
        this._config = { ...defaultOptions, ...customOptions, theme: { ...defaultOptions.theme, ...customOptions.theme } };
        
        // 트리거 이벤트 맵핑
        this._triggers = nodeToArray(document.querySelectorAll(trigger));
        this._triggers.map((item, idx) => {
            addEvent(item, 'click', () => {
                const params = {
                    id: item.getAttribute('data-modal-id'),
                    title: item.getAttribute('data-modal-title'),
                    width: item.getAttribute('data-modal-width') ? item.getAttribute('data-modal-width') : 500,
                    height: item.getAttribute('data-modal-height') ? item.getAttribute('data-modal-height') : null
                };

                // 이미 생성되었는지 확인, 이미 있으면 open 없으면 generate
                const targetId = this._config.cloneNode ? `wrapper_${params.id}_temp` : `wrapper_${params.id}`;
                document.getElementById(targetId) ? this.open(targetId) : this.generate(params, () => this.open(targetId));
            });
        });
    }
    // constructor end

    generate(params, callback) {
        // overlay element를 생성한 후 
        let overlay = document.createElement('div');
        let layer = document.getElementById(params.id);
        // let preloader;

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

        layer.style.width = `${params.width}px`;
        if (this._config.fixedHeight && params.height) layer.style.height = `${params.height}px`;
        
        // custom theme 설정값 적용
        if (this._config.theme.overlayColor) {
            overlay.style.backgroundColor = this._config.theme.overlayColor;
        }

        if (!this._config.theme.useBorder) {
            layer.style.border = '0';
        } else {
            if (this._config.theme.borderColor) layer.style.borderColor = this._config.theme.borderColor;
        }


        let header = this._config.useHeader 
        ? `<section class="modal-header"><h1 class="modal-header__title">${params.title}</h1><button class="modal-header__closeBtn modal-close"><svg width='1em' height='1em' fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button></section>` 
        : '';

        layer.innerHTML = `${header}<div class="modal-content__inner">${layer.innerHTML}</div>`;
        overlay.appendChild(layer);

        // 실제 DOM에 insert
        document.body.appendChild(overlay);

        // postioning 메서드 실행, ovelay overlow 고정 ( fixedHeight && params.height 일 경우에만 )
        if (this._config.fixedHeight && params.height) {
            const layerInner = layer.querySelector('.modal-content__inner');
            layerInner.style.height = 'calc(100% - 40px)';
            this.positioning(layer, params.height);
            addEvent(window, 'resize', () => this.positioning(layer, params.height), true);
            overlay.style.overflowY = 'hidden';
        }

        // close 이벤트를 등록
        const nodeForClose = nodeToArray(document.querySelectorAll('.modal-close'));
        nodeForClose.map((item) => addEvent(item, 'click', () => this.close(overlay.id)));
        addEvent(layer, 'click', (e) => e.stopPropagation());

        // event trigger 등록
        this.trigger('afterGenerate', { container: layer });

        // callback 실행
        callback();
    }

    open(target) {
        document.getElementById(target).classList.add('is-active');
        document.documentElement.style.overflowY = 'hidden';
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
        document.documentElement.style.overflowY = 'initial';
    }

    positioning(layer, layerHeight) {
        /**
         * 1. 만약 고정된 높이값이 브라우저의 높이보다 크다면, 90vh 로 리사이즈한 후 margin 상하 값을 5vh로 주면 된다.
         * 2. 고정된 높이값이 브라우저 높이보다 작다면, (브라우저 높이값 - 고정된 높이값)/2 를 margin의 상하값으로 대입
         */
        const calculateValue = window.innerHeight - layerHeight;
        layer.style.maxHeight = '90vh';
        layer.style.marginTop = calculateValue > 0 ? `${calculateValue/2}px` : '5vh';
    }
};
