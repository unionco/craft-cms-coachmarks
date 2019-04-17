export default class StepBox {
    constructor(options) {
        this.options = options;
        this.element = document.querySelector(this.options.selector);
        this.oldZIndex = this.element.style.zIndex;

        this.box = this.render();
    }

    get html() {
        return this.box;
    }

    destroy() {
        document.body.removeChild(this.html);
    }

    overlayPosition() {
        const rect = this.element.getBoundingClientRect();
        return `top: ${rect.top}px; left: ${rect.left}px; width: ${rect.width}px; height: ${rect.height}px`;
    }

    boxPosition() {
        let position;

        switch (this.options.position) {
            case 'bottom':
                position = `top: 100%; left: 0px;`;
                break;
            case 'top':
                position = `top: 0px; left: 0px; transform: translateY(-100%); margin-top: 0px; margin-bottom: 10px;`;
                break;
            case 'left':
                position = `top: ${rect.top}px; left: ${rect.left}px;`;
                break;
            case 'right':
                position = `top: 0px; left: 100%; margin-top: 0px; margin-left: 10px;`;
                break;
            default:
        }

        return position;
    }

    render() {
        const { description, title, index } = this.options;
        const position = this.overlayPosition();
        const boxPosition = this.boxPosition();

        const html = document.createElement('div');

        html.innerHTML = `
            <div class="coachmark-overlay-background" style="${position}" id="${index}-box-background"></div>
            <div class="coachmark-overlay" style="${position}" id="${index}-box">
                <div class="coachmark-overlay-box" style="${boxPosition}">
                    <div class="coachmark-overlay-step">${index}</div>
                    <h4>${title}</h4>
                    <p>${description}</p>
                    <div class="coachmark-overlay-actions">
                        <button data-skip>Skip</button>

                        <div class="coachmark-overlay-actions coachmark-overlay-actions-group">
                            <button data-prev ${index === 1 ? 'disabled' : ''}>Prev</button>
                            <button data-next>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }
}