import Component from '@egjs/component';
import delegate from 'delegate';
import '../sass/index.scss';

/**
 * Copyright (c) fafazlab
 * fafaz-modal projects are licensed under the MIT license
 * https://github.com/fafaz/fafaz-modal
 *
 * @ver 1.3
 */

export default class Modal extends Component {
    constructor(trigger = undefined, customConfig = {}) {
        super();

        this._version = '1.4';

        // 기본 설정
        this._config = {
            style: {},
            fullScreen: false,
            cloneNode: false, // 노드를 복사하기 때문에, 이벤트 바인딩을 새로 해주어야 한다. 열때마다 generate 하는 방식
            ...customConfig
        };

        if (!trigger || typeof trigger !== 'string') {
            throw 'Trigger must be a css selector in string type';
        }

        this.target = {};

        // 트리거 이벤트 맵핑
        delegate(trigger, 'click', ({ delegateTarget }) => {
            this.target.trigger = delegateTarget;
            this.target.contentId = delegateTarget.getAttribute('data-modal-id');
            this.target.modalId = this._config.cloneNode ? `modal_${this.target.contentId}_clone` : `modal_${this.target.contentId}`;

            // 이미 generated 된 모달이 있으면 open, 없으면 generate
            document.getElementById(this.target.modalId) ? this.open() : this.generate();
        });
    }

    generate(openTrigger = true) {
        const wrapper = document.createElement('div');
        let content = document.getElementById(this.target.contentId);

        if (this._config.cloneNode) {
            content = content.cloneNode(true);
            wrapper.id = `modal_${this.target.contentId}_clone`;
        } else {
            wrapper.id = `modal_${this.target.contentId}`;
        }

        wrapper.className = `fafazModal-wrapper ${this._config.fullScreen ? 'fafazModal-wrapper--fullScreen' : ''} fafazModal__closeTrigger`;
        content.classList.add('fafazModal-content');

        // custom style 적용
        if (this._config.style) wrapper.style = this._config.style;

        // wrapping
        wrapper.appendChild(content);

        // 실제 DOM에 insert
        document.body.appendChild(wrapper);

        // close 이벤트 등록
        delegate('.fafazModal__closeTrigger', 'click', () => {
            this.close();
        });

        content.addEventListener('click', e => {
            e.stopPropagation();
        });

        // 이벤트 바인딩, 변수 전달 (afterGenerate)
        this.trigger('afterGenerate', { modal: wrapper });

        // generate 후 실행
        openTrigger && this.open();
    }

    open() {
        const wrapper = document.getElementById(this.target.modalId);
        wrapper.classList.add('fafazModal-wrapper--isActive');
        this.target.content = document.getElementById(this.target.modalId).children[0];
        this.target.wrapper = wrapper;
        // change html overflow hidden
        document.documentElement.style.overflowY = 'hidden';

        window.addEventListener('resize', this.positioning);

        // 이벤트 바인딩, 변수 전달 (afterOpen)
        this.trigger('afterOpen', { modal: wrapper, trigger: this.target.trigger });
    }

    close() {
        const wrapper = document.getElementById(this.target.modalId);
        const content = wrapper.children[0];

        // overlay의 active 클래스를 삭제
        wrapper.classList.remove('fafazModal-wrapper--isActive');

        window.removeEventListener('resize', this.positioning);

        // 복제된 node 라면 다시 삭제한다. ( 열떄마다 새로 generate하도록 )
        if (this._config.cloneNode) wrapper.parentNode.removeChild(wrapper);

        // html 노드의 overflow 를 초기화해준다.
        document.documentElement.style.overflowY = null;

        // 이벤트 바인딩, 변수 전달 (afterClose)
        this.trigger('afterClose', { modal: wrapper });
    }

    positioning = () => {
        if (this._config.fullScreen) return;

        /**
         * NOTE::
         * targetHeight가 windowHeight 보다 크면 상단 위치 고정 후, overlay의 overflow 를 활성화
         * windowHeight 보다 작으면 html overflow deactivate
         */
        let windowHeight = window.innerHeight;
        let targetHeight = Math.round(this.target.content.offsetHeight);
        targetHeight = targetHeight % 2 === 0 ? targetHeight : targetHeight + 1;

        if (windowHeight <= targetHeight) {
            this.target.wrapper.classList.add('fafazModal-wrapper--scrollingContent');
        } else {
            if (this.target.wrapper.classList.contains('fafazModal-wrapper--scrollingContent')) {
                this.target.wrapper.classList.remove('fafazModal-wrapper--scrollingContent');
            }
        }
    };
}
