import Stats from "three/examples/jsm/libs/stats.module.js"

export default class Performance {
    stats: Stats;
    constructor() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
    }

    update() {
        this.stats.update()
    }

    // dispose() {

    // }
}