import "./index.less";
import Topo from "../../utils/topo"
import Vue from 'vue/dist/vue.js'
import "perfect-scrollbar/css/perfect-scrollbar.css";
import PerfectScrollbar from 'perfect-scrollbar'
import '../../utils/component'
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
                type: "",
                id: ""
            },
            types: [
                { name: "路由器", value: "1" },
                { name: "服务器", value: "2" },
                { name: "队伍", value: "3" },
            ],
            nodes: [

            ],
            is_new: false,
            save_name: "graph",
            currNode: null,
            max_id: 0,
            itemAdd: null,
            links: [],//连线
        }
    },
    created() {

    },
    mounted() {
        initScroll("#nodes")
        /* this.node = {
            x: 0,
            y: 0,
            z: 0,
            name: "测试",
            type: "1",
            id: this.max_id++
        }

        setTimeout(() => {
            this.new_submit()
        }) */
    },
    methods: {
        restore() {
            let data = this.getSaveData()
            let { nodes, links } = JSON.parse(data)
            this.nodes = nodes;
            this.links = links;
            var getNode = (data) => {
                topo.addNodes({
                    ...data
                })
                if (data.children.length != 0) {
                    data.children.forEach((n, index) => {
                        getNode(n);
                    })
                }
                return false
            }
            this.nodes.forEach((node, index) => {
                getNode(node);
            })
            topo.updataLink()

        },
        clcikNode(node) {
            let currnode = topo.options.data.filter(n => n.datas.id == node.id)
            if (currnode.length == 1) {
                VM.currNode = currnode[0];
                topo.setOption(VM.node, {
                    x: VM.currNode.position.x,
                    y: VM.currNode.position.y,
                    z: VM.currNode.position.z,
                    ...VM.currNode.datas
                })
            }
        },
        itemdeleteode(id) {
            var getNode = (data) => {
                if (data.id == id) {
                    console.log(data)
                    return true
                }
                if (data.children.length != 0) {
                    data.children.forEach((n, index) => {
                        let is_get = getNode(n);
                        if (is_get) {
                            data.children.splice(index, 1)
                        }
                    })
                }
                return false
            }
            this.nodes.forEach((node, index) => {
                let is_get = getNode(node);
                if (is_get) {
                    this.nodes.splice(index, 1)
                }
            })

            this.deleteRelatedLink(id)
        },
        deleteRelatedLink(id) {
            //删除相关连线
            this.links = this.links.filter(link => {
                return link.src.id != id && link.dst.id != id;
            })
            topo.updataLink()
        },
        itemaddnode(item) {
            this.itemAdd = item;
            this.is_new = true;
        },
        clearNodeEdit() {
            for (let key in this.node) {
                this.node[key] = ""
            }
        },
        newNodes(state) {
            switch (state) {
                case 1:
                    // 新建第一个
                    this.clearNodeEdit();
                    this.is_new = true;
                    break
            }
        },
        save_node() {
            let { x, y, z, type, name, id } = this.node;
            if (Object.values(this.node).includes("")) {
                return
            }
            this.currNode.position.set(x, y, z)
            this.currNode.datas.type = type;
            this.currNode.datas.name = name;
            //更新到nodes
            var getNode = (data) => {
                console.log(data.id, id)
                if (data.id == id) {
                    data.name = name;
                    data.x = x;
                    data.y = y;
                    data.z = z;
                    data.type = type;
                    return
                }
                if (data.children.length != 0) {
                    data.children.forEach(n => {
                        getNode(n)
                    })
                }
            }
            this.nodes.forEach(node => {
                getNode(node)
            }) 
            //更新link中的数据 
            this.updateLines(this.node)
        },
        updateLines(item) {
            this.links.forEach(l => {
                if (l.src.id == item.id) {
                    l.src.x = item.x
                    l.src.y = item.y
                    l.src.z = item.z
                }
                else if (l.dst.id == item.id) {
                    l.dst.x = item.x
                    l.dst.y = item.y
                    l.dst.z = item.z
                }
            })
            topo.updataLink()
        },
        new_submit() {
            //新建
            let node = {
                ...this.node,
                id: this.max_id++,
                children: []
            }
            if (Object.values(node).includes("")) {
                return alert("信息不能为空")
            }
            if (this.itemAdd === null) {
                this.nodes.push(node);
            } else {
                var getNode = (data) => {
                    if (data.id == this.itemAdd.id) {
                        this.links.push({
                            src: {
                                id: data.id,
                                x: data.x,
                                y: data.y,
                                z: data.z
                            },
                            dst: {
                                id: node.id,
                                x: node.x,
                                y: node.y,
                                z: node.z
                            }
                        })
                        data.children.push(node)
                        return
                    }
                    if (data.children.length != 0) {
                        data.children.forEach(n => {
                            getNode(n)
                        })
                    }
                }
                this.nodes.forEach(node => {
                    getNode(node)
                })
            }
            topo.addNodes(node)
            this.is_new = false;
            this.itemAdd = null;
            this.clearNodeEdit()
        },
        update(data) {

        },
        save() {
            window.localStorage.setItem("graph", JSON.stringify({
                nodes: this.nodes,
                links: this.links
            }))
        },
        getSaveData() {
            return window.localStorage.getItem("graph")
        },
        ww(type) {

        }
    },
    watch: {
        is_new(val) {
            if (val) {
                this.clearNodeEdit()
            }
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
        /* mesh.object.position.x = 200;
        this.data[0].position.y = 200;
        //把所有节点映射到Vue上面
        console.log(this.data)
        VM.update(this.data) */
        VM.currNode = data[0].object;
        topo.setOption(VM.node, {
            x: VM.currNode.position.x,
            y: VM.currNode.position.y,
            z: VM.currNode.position.z,
            ...VM.currNode.datas
        })
    }
}) 