import "./index.less";
import Topo from "../../utils/graph/black.js"
import Vue from 'vue/dist/vue.js'
import "perfect-scrollbar/css/perfect-scrollbar.css";
import PerfectScrollbar from 'perfect-scrollbar'
import types from '../../utils/type.json'
import graphs from '../../json/topo2.json'
import axios from '../../utils/axios'
import { GetRequest } from '../../utils/full'
import '../../utils/template'

let VM = new Vue({
    el: "#app",
    data() {
        return {
            show: false,
            items: [],
            mes: "1",
            node: {
                x: "",
                y: "",
                z: "",
                name: "",
                type: "",
                id: "",
                info: ""
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
            inp_img: "",
            dsc: "队伍直接图片名，地板=图片名,width,height",
            soketInterVal: null,
            onloadNum: 0,
            graphs: {},
            teamTop5: [],
            levelTop: [],
            typeTop: [],
            attackTop5: [],
            sendInter: null,
            attackType: 1
        }
    },
    created() {
        let query = GetRequest();
        if (!query.hasOwnProperty("type")) {
            return
        }
        this.attackType = query.type
        this.get(this.attackType)
    },
    mounted() {

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
        /*  var graphs = JSON.parse(this.getSaveData())
         let nodes = graphs.nodes;
         let links = graphs.links;
         let get = (data) => {
             data.forEach(node => {
                 if (node.type == 11) {
                     console.log(node)
                     node.children.forEach((x, i) => {
                         x.x = parseInt(node.x) + i * 30 - 40
                         x.z = parseInt(node.z) + 80,
                             x.y = node.y
                     })
                 }
                 //    links.forEach(x => {
                 //         if (node.id == x.src.id) {
                 //             x.src.x = node.x
                 //             x.src.y = node.y
                 //             x.src.z = node.z
                 //         }
                 //         if (node.id == x.dst.id) {
                 //             x.dst.x = node.x
                 //             x.dst.y = node.y
                 //             x.dst.z = node.z
                 //         }
                 //     }) 
                 if (node.children.length > 0 && Array.isArray(node.children)) {
                     get(node.children)
                 }
             })
         }
         get(nodes)
         let n = this.linksHui(graphs)
         this.links = n.links;
         this.nodes = n.nodes;
         this.save() */

        // window.localStorage.setItem("graph", JSON.stringify(graphs))
        setTimeout(() => {
            // this.restore()   
            /*       this.node = {
                      x: "100",
                      y: "0",
                      z: "100",
                      name: "213",
                      type: "11",
                      id: "3",
                      info: "5.png"
                  }
                  this.new_submit()
                 
*/

            /*   let nodes = graphs.nodes;
              let links = graphs.links;
              let index = 0;
              let get = (data) => {
                  data.forEach(node => {
                      if (node.type == 9) {
                          if (index < 30) {
                              index++;
                          }
                      }
                      if (node.children.length > 0 && Array.isArray(node.children)) {
                          get(node.children)
                      }
                  })
              }
              get(nodes) */

        }, 3000)


    },
    methods: {
        get(id) {
            axios("/mimic/topology/get", {
                params: {
                    id: id
                }
            }).then(res => {
                let { nodes, links } = res.topology;
                this.graphs = res.topology;
                this.nodes = this.returnNode(nodes)
                topo.loadGraph({
                    nodes: this.nodes,
                    links: links
                })
            })
        },
        onload() {
            console.log(this.onloadNum)
            if (this.onloadNum == 2) {
                //全部加载完成
                this.socket()
            }
        },
        socket(func) {
            clearInterval(this.sendInter)
            let url = this.attackType == '2' ? 'additionalGlobal' : 'additionalPlayback'
            this.ws = new WebSocket(`ws://172.18.0.23/mimic/websocket/` + url);
            this.ws.onopen = () => {
                // this.ws.send(JSON.stringify({ "unitId": this.unitId.toString() }))
                // // typeof func == 'function' ? func() : '';
                this.sendInter = setInterval(() => {
                    this.ws.send("{'test':'1'}")
                }, 10000);
            };
            this.ws.onmessage = e => {
                let data = JSON.parse(e.data)
                //  str = {"levelTop":[{"name":"3","value":928},{"name":"2","value":0},{"name":"1","value":0}],"path":[{"start":"130","end":"13"},{"start":"102","end":"13"},{"start":"71","end":"10"},{"start":"112","end":"13"},{"start":"144","end":"10"}],"srcTop":[{"name":"team12","value":19},{"name":"team5","value":17},{"name":"team4","value":17},{"name":"team1","value":16},{"name":"team13","value":15}],"typeTop":[{"name":"web扫描","value":353}],"dstTop":[{"name":"白盒拟态路由器","value":193},{"name":"白盒拟态WEB服务器","value":160}]}
                let { path, srcTop, dstTop, levelTop, typeTop } = data;
                console.log(data)
                let arr = []
                path.forEach(x => {
                    let index = 0;
                    let obj = {}
                    while (index < this.nodes.length) {
                        let node = this.nodes[index];
                        if (x.start == node.id) {
                            obj.src = node;
                        }
                        if (x.end == node.id) {
                            obj.dst = node;
                        }

                        index++;
                    }
                    if (obj.hasOwnProperty("src") && obj.hasOwnProperty("dst")) {
                        // arr.push(obj)
                        topo.buildingAnimation([obj.dst.x, obj.dst.y, obj.dst.z], 50)
                        topo.addLine([obj.src.x, obj.src.y, obj.src.z], [obj.dst.x, obj.dst.y, obj.dst.z], '2-' + path.length % 4 + '-3')
                    }
                })

                // 攻击队伍top5
                this.teamTop5 = srcTop
                // 攻击队伍top5
                this.attackTop5 = dstTop
                // /攻击程度top5
                this.levelTop = levelTop
                // /攻击类型top5
                this.typeTop = typeTop


            }
            this.ws.onerror = e => { };
            this.ws.onclose = () => {
                //通道关闭了
                if (this.ws.readyState == 3) {
                    //五秒钟后重连
                    setTimeout(() => {
                        this.socket();
                        // this.socket(func());
                    }, 5000)
                }
            };
        },

        objLoad() {
            //所有图形加载完毕
            this.get()
        },
        linksHui(graphs) {
            let nodes = graphs.nodes;
            let links = graphs.links;
            let get = (data) => {
                data.forEach(node => {
                    links.forEach(x => {
                        if (node.id == x.src.id) {
                            x.src.x = node.x
                            x.src.y = node.y
                            x.src.z = node.z
                        }
                        if (node.id == x.dst.id) {
                            x.dst.x = node.x
                            x.dst.y = node.y
                            x.dst.z = node.z
                        }
                    })
                    if (node.children.length > 0 && Array.isArray(node.children)) {
                        get(node.children)
                    }
                })
            }
            get(nodes)
            return graphs
        },
        returnNode(nodes) {
            let data_arr = [];
            let get = (data) => {
                data.forEach(node => {
                    data_arr.push({
                        ...node,
                        children: []
                    })
                    if (node.children.length > 0 && Array.isArray(node.children)) {
                        get(node.children)
                    }
                })
            }
            get(nodes)
            return data_arr
        },
        restore() {
            // topo.clearAll()
            let data = JSON.parse(this.getSaveData())
            //把nodes整理成平级渲染 
            topo.loadGraph({
                nodes: this.returnNode(data.nodes),
                links: data.links
            })
            /* 
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
                        setTimeout(() => {
                            getNode(n);
                        }, 500)
                    })
                }
                return false
            }
            this.nodes.forEach((node, index) => {
                getNode(node);
            })
            topo.updataLink(); */


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
            console.log(Object.values(this.node).includes(""))
            /* if (Object.values(this.node).includes("")) {
                return
            } */
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
        addNode(node) {
            node['children'] = [];
            node['id'] = ++this.max_id;
            topo.addNodes(node)
            this.is_new = false;
            this.itemAdd = null;
            this.nodes.push(node)
            this.clearNodeEdit()
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
    // deep: 100,
    cameraPosition: {
        x: 300,
        y: 1800,
        z: 1800
    },
    click: function (data) {
        let index = 0;
        let mesh = null
        console.log(JSON.stringify(data[0].point))
        //如果点击的地板 互相关联
        while (index < data.length) {
            if (data[index].object.type == "Mesh") {
                mesh = data[index].object;
                index = data.length

            }
            index++;
        }
        if (mesh == null) {
            return
        }

        // let mesh = data[0].object.type == "Line" ? data[1]:data[0]
        /* if (mesh.object.type !== "Mesh") {
            return false
        } */

        /* mesh.object.position.x = 200;
        this.data[0].position.y = 200;
        //把所有节点映射到Vue上面 
        VM.update(this.data) */
        VM.currNode = mesh
        topo.setOption(VM.node, {
            x: VM.currNode.position.x,
            y: VM.currNode.position.y,
            z: VM.currNode.position.z,
            ...VM.currNode.datas
        })

    }
}) 