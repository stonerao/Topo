import "./index.less";
import Topo from "../../utils/topo"
import Vue from 'vue/dist/vue.js'
import "perfect-scrollbar/css/perfect-scrollbar.css";
import PerfectScrollbar from 'perfect-scrollbar'
import '../../utils/component'
import types from '../../utils/type.json'
import graphs from '../../utils/topo_regular'

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
            types: JSON.parse(JSON.stringify(types)),
            nodes: [

            ],
            is_new: false,
            save_name: "graph",
            currNode: null,
            max_id: 0,
            itemAdd: null,
            links: [],//连线
            inp_img:""
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
        /*  const random = () => {
             return parseInt(Math.random() * (Math.random() > 0.5 ? 1200 : -1200))
         }
         types.forEach(x => {
             this.nodes.push({
                 type: x.type,
                 x: random(),
                 y: 0,
                 z: random(),
                 name: x.name,
                 id: ++this.max_id,
                 children: []
             })
 
         })
         this.save()  */
       /*  let n = 0;
        this.nodes = graphs.nodes;
        this.links = graphs.links;
        this.save() */
        setTimeout(() => {
            this.restore()
            /* setTimeout(() => {
                let nodes = topo.options.data.map(x => {
                    return {
                        id: x.datas.id,
                        ...x.position
                    }
                })
                this.links.forEach(x => {
                    let src = nodes.filter(y => y.id == x.src.id)[0]
                    if (src) {
                        x.src.x = src.x
                        x.src.y = src.y
                        x.src.z = src.z
                    }
                    let dst = nodes.filter(y => y.id == x.dst.id)[0]
                    if (dst) {
                        x.dst.x = dst.x
                        x.dst.y = dst.y
                        x.dst.z = dst.z
                    }
                })
                this.save()
                console.log(this.getSaveData())

            }, 3000) */
        }, 3000)

    },
    methods: {
        restore() {
            topo.clearAll()
            let data = this.getSaveData()
            let { nodes, links } = JSON.parse(data)
            this.nodes = nodes;
            this.links = links;
            var getNode = (data) => {
                if (this.max_id <= data.id) {
                    this.max_id = parseInt(data.id) + 1
                }
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
            let dele_id = []
            let dele = (data, state) => {
                data.forEach(node => {
                    let is_delete = node.id == id || state;
                    if (is_delete) {
                        dele_id.push(node.id)
                    }
                    if (node.children.length > 0 && Array.isArray(node.children)) {
                        dele(node.children, is_delete)
                    }
                })
            }
            dele(JSON.parse(JSON.stringify(this.nodes)), false)
            dele_id.forEach(x => {
                topo.deleteNode(x)
                this.deleteRelatedLink(x)
            })
            this.nodes.forEach((node, index) => {
                let is_get = getNode(node);
                if (is_get) {
                    this.nodes.splice(index, 1)
                }
            })


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
            let data = JSON.stringify({
                nodes: this.nodes,
                links: this.links
            })
            console.log(data)
            window.localStorage.setItem("graph", data)
        },
        getSaveData() {
            return window.localStorage.getItem("graph")
        },
        ww(type) {

        }
    },
    watch: {
        is_new(val) {
            if (!val) {
                this.clearNodeEdit()
            }
        },
        ['node.type'](val) {
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
    typeMap: types,
    cameraPosition: {
        x: 300,
        y: 3000,
        z: 900
    },
    click: function (data) {
        let mesh = data[0]
        /* if (mesh.object.type !== "Mesh") {
            return false
        } */

        console.log(mesh)
        /* mesh.object.position.x = 200;
        this.data[0].position.y = 200;
        //把所有节点映射到Vue上面 
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