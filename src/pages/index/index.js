import "./index.less";
import Topo from "../../utils/topo"

let topo = new Topo({
    el: "#canvas",
    width: window.innerWidth,
    height: window.innerHeight - 5,
    helper: true,
    controls: true,
    stats: true,
    cameraPosition: {
        x: 300,
        y: 3000,
        z: 900
    },
    click(data) {
        console.log(data)
    }
})
console.log(topo)