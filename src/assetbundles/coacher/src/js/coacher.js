import StepBox from './components/step-box';

function createElement(tag, options) {
    const el = document.createElement(tag);

    if (options.className) {
        el.className = options.className
    }

    if (options.attributes) {
        for (a in options.attributes) {
            el.setAttribute(a, options.attributes[a])
        }
    }

    if (options.html !== undefined) {
        el.innerHTML = options.html
    }

    return el;
}

class Coacher {
    constructor(config) {
        console.log('Start Coacher', config);
        this.config = config;
        this.steps = [];
        this.stepIndex = 0;
        this.sidebar = document.querySelector('#global-sidebar');
        this.currentBox = null;

        // set up steps
        this.config.forEach((config) => {
            this.steps = this.steps.concat(config.steps);
        });

        // bind methods
        this.toggleOverlay = this.toggleOverlay.bind(this);
        this.createBox = this.createBox.bind(this);
        this.register = this.register.bind(this);
        this.unregister = this.unregister.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.skip = this.skip.bind(this);

        if (this.config.length) {
            this.initButton = createElement('button', {
                className: 'coachmarks-init-button hidden',
                html: `
                <?xml version="1.0" encoding="UTF-8"?>
                <svg width="45pt" height="45pt" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <path d="m50 8.332c-23.082 0-41.668 18.582-41.668 41.668 0 23.082 18.582 41.668 41.668 41.668 23.082 0 41.668-18.582 41.668-41.668 0-23.082-18.586-41.668-41.668-41.668zm0 72.918c-17.332 0-31.25-13.918-31.25-31.25s13.918-31.25 31.25-31.25 31.25 13.918 31.25 31.25-13.918 31.25-31.25 31.25z"/>
                        <path d="m50 39.75c2.918 0 5.168-2.25 5.168-5.168s-2.25-5.168-5.168-5.168-5.168 2.25-5.168 5.168 2.25 5.168 5.168 5.168z"/>
                        <path d="m56.918 60.418c-1 0-1.75-0.66797-1.75-1.582v-13.836c0-1-0.83203-1.918-1.75-1.918h-10.336c-1 0-1.75 1-1.75 1.918v3.5c0 1.082 0.83203 1.582 1.75 1.582 1 0 1.75 1 1.75 1.918v6.918c0 1.082-0.83203 1.582-1.75 1.582-1 0-1.75 1-1.75 1.918v3.4141c0 1.082 0.83203 1.582 1.75 1.582h13.918c1 0 1.75-0.66797 1.75-1.582v-3.5c-0.082031-1.082-0.91797-1.9141-1.832-1.9141z"/>
                    </g>
                </svg>
            `
            });
            this.initButton.addEventListener('click', () => {
                this.toggleOverlay();
                this.createBox();
            });

            this.sidebar.appendChild(this.initButton);
            this.showInitButton();
        }
    }

    showInitButton() {
        this.initButton.classList.remove('hidden');
    }

    register(box) {
        document.body.appendChild(box);

        const skip = box.querySelector('[data-skip]');
        const next = box.querySelector('[data-next]');
        const prev = box.querySelector('[data-prev]');

        skip.addEventListener('click', this.skip);
        next.addEventListener('click', this.next);
        prev.addEventListener('click', this.prev);
    }

    unregister(box) {
        const skip = box.querySelector('[data-skip]');
        const next = box.querySelector('[data-next]');
        const prev = box.querySelector('[data-prev]');

        skip.removeEventListener('click', this.skip);
        next.removeEventListener('click', this.next);
        prev.removeEventListener('click', this.prev);

        this.currentBox.destroy();
    }

    next() {
        if (this.stepIndex === (this.steps.length - 1)) {
            return this.skip();
        }

        this.unregister(this.currentBox.html);
        this.stepIndex = this.stepIndex + 1;
        this.createBox();
    }

    prev() {
        this.unregister(this.currentBox.html);
        this.stepIndex = this.stepIndex - 1;
        this.createBox();
    }

    skip() {
        this.unregister(this.currentBox.html);
        this.currentBox = null;
        this.stepIndex = 0;

        this.toggleOverlay();
    }

    toggleOverlay() {
        document.body.classList.toggle('u-coachmarks');
    }

    createBox() {
        const step = this.steps[this.stepIndex];
        const box = new StepBox({ index: (this.stepIndex + 1), ...step });
        this.currentBox = box;
        this.register(box.html);
    }
}

window.Coacher = Coacher;