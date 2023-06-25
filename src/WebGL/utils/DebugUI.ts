import { Pane } from 'tweakpane';
export default class DebugUI {
    ui: Pane | null = null;
    isActive: boolean = false;
    constructor() {
        if (window.location.hash === "#debug") {
            this.isActive = true,
                this.ui = new Pane({ title: 'Tweak Values' })

            const ui = this.ui as any
            ui.containerElem_.style.zIndex = "10"

        }
    }
    destroy() {
        if (this.ui) {
            this.ui.dispose()
        }
    }
}