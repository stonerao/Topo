import "./index.less";
import Topo from "../../utils/topo"
import Vue from 'vue/dist/vue.js'
import "perfect-scrollbar/css/perfect-scrollbar.css";
import PerfectScrollbar from 'perfect-scrollbar'
let VM = new Vue({
    el: "#app",
    data() {
        return {
            show: false,
            items: [],
            node: {
                x: "",
                y: "",
                z: "",
                name: "",
                type: ""
            },
            types: [
                { name: "路由器", value: "1" },
                { name: "服务器", value: "2" }
            ]
        }
    },
    mounted() {
        initScroll("#nodes")
    },
    methods: {
        update(data) { 
            this.items = data;
        }
    }
})
function initScroll(id, state) {
    let params = {
        wheelSpeed: 1,
        wheelPropagation: true,
        minScrollbarLength: 20,
        useBothWheelAxes: true
    }
    if (state == 'x') {
        params.suppressScrollY = true
        params.swipeEasing = true
    }
    const ps = new PerfectScrollbar(id, params);
    return ps
}
let topo = new Topo({
    el: "#canvas",
    width: window.innerWidth,
    height: window.innerHeight - 5,
    helper: true,
    controls: true,
    stats: true,
    data: [],
    VUE: VM,
    cameraPosition: {
        x: 300,
        y: 3000,
        z: 900
    },
    click: function (data) {
        let mesh = data[0]
        if (mesh.object.type !== "Mesh") {
            return false
        }
        mesh.object.position.x = 200;
        console.log(this)
        this.data[0].position.y = 200;
        //把所有节点映射到Vue上面
        VM.update(this.data)
    }
}) 