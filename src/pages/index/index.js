import "./index.less";
import Topo from "../../utils/graph/global"
import Vue from 'vue/dist/vue.js'
import "perfect-scrollbar/css/perfect-scrollbar.css";
import PerfectScrollbar from 'perfect-scrollbar'
import types from '../../utils/type.json'
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
            teamTop5: [...new Array(5)].map((x, i) => ({})),
            levelTop: [...new Array(3)].map((x, i) => ({})),
            typeTop: [...new Array(5)].map((x, i) => ({})),
            attackTop5: [...new Array(5)].map((x, i) => ({})),
            sendInter: null,
            attackType: 1,
            attackType1: 1,
            ws: null,
            ws1: null,
            playType: 2,//1 全局 2回放
            teams: [],
            threat: [],
            threat_id: "",
            ThreatInformation: [],
            stepIndex: [],
            threatAddlineItem: [],
            team_obj: {
                name: "",
                id: "",
                icon: ""
            },
            is_next: true,
            blackInterval: null
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
 
    },
    methods: {
        tableFull() {
            if (this.playType == 2) {
                this.playType = 1 
                this.is_next = false
                topo.deleteMeshLine()
                this.deletePlayList(this.threat_id)
                this.reloadPlayback(this.threat_id)
            }
        },
        clickTreat(item) {
            this.is_next = false
            this.threat_id= item.id
            topo.deleteMeshLine()
            setTimeout(() => {
                this.is_next = true
                this.getThreatInformation(item.id)
            }, 1200)
        },
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
            if (this.onloadNum == 2) {
                //全部加载完成
                this.socket()
                this.getTeam();
                this.blacksocket()
            }
        },
        clone(data){
            return JSON.parse(JSON.stringify(data))
        },
        socket(func) {
            clearInterval(this.sendInter)
            let url = this.attackType == '1' ? 'normalGlobal' : 'additionalGlobal'
            this.ws = new WebSocket(`ws://172.18.0.23/mimic/websocket/` + url);
            this.ws.onopen = () => {
                // this.ws.send(JSON.stringify({ "unitId": this.unitId.toString() }))
                // // typeof func == 'function' ? func() : '';
                this.sendInter = setInterval(() => {
                    this.ws.send("{'test':'1'}")
                }, 10000);
            };
            this.ws.onmessage = e => {
                if (this.playType == 1) {
                    let data = JSON.parse(e.data)
                    //  str = {"levelTop":[{"name":"3","value":928},{"name":"2","value":0},{"name":"1","value":0}],"path":[{"start":"130","end":"13"},{"start":"102","end":"13"},{"start":"71","end":"10"},{"start":"112","end":"13"},{"start":"144","end":"10"}],"srcTop":[{"name":"team12","value":19},{"name":"team5","value":17},{"name":"team4","value":17},{"name":"team1","value":16},{"name":"team13","value":15}],"typeTop":[{"name":"web扫描","value":353}],"dstTop":[{"name":"白盒拟态路由器","value":193},{"name":"白盒拟态WEB服务器","value":160}]}
                    let { path, srcTop, dstTop, levelTop, typeTop } = data;
                    // let paths = path.filter((x, i) => i < 5)
                    let arr = []
                    let indexn = 0;
                    var addline = (arr) => {
                        indexn++
                        if (arr.length == 0) {
                            return
                        }
                        let item = arr.shift()
                        let obj = {}
                        let index = 0;
                        while (index < this.nodes.length) {
                            let node = this.nodes[index];
                            if (item.start == node.id) {
                                obj.src = node;
                            }
                            if (item.end == node.id) {
                                obj.dst = node;
                            }
                            index++;
                        }
                        if (obj.hasOwnProperty("src") && obj.hasOwnProperty("dst")) {
                            // arr.push(obj)  
                            topo.addLine([obj.src.x, obj.src.y, obj.src.z], [obj.dst.x, obj.dst.y, obj.dst.z], item.type, null, indexn)

                        }
                        setTimeout(() => {
                            if (this.playType == 1) {
                                addline(arr)
                            }
                        }, 180)
                    }
                    addline(path)
                    // 攻击队伍top5
                    this.teamTop5 = [...new Array(5)].map((x, i) => srcTop[i] ? srcTop[i] : {})
                    // 攻击队伍top5
                    this.attackTop5 = [...new Array(5)].map((x, i) => dstTop[i] ? dstTop[i] : {})
                    // /攻击程度top5
                    this.levelTop = levelTop
                    // /攻击类型top5
                    this.typeTop = [...new Array(5)].map((x, i) => typeTop[i] ? typeTop[i] : {})
                } else {
                }

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
        blacksocket(func) {
            clearInterval(this.sendInter1)
            let url = this.attackType == '1' ? 'normalPlayback' : 'additionalPlayback'
            this.ws1 = new WebSocket(`ws://172.18.0.23/mimic/websocket/` + url);
            this.ws1.onopen = () => {

                this.sendInter1 = setInterval(() => {
                    this.ws1.send("{'test':'1'}")
                }, 10000);
            };
            this.ws1.onmessage = e => {
                let data = JSON.parse(e.data)
                //  str = {"levelTop":[{"name":"3","value":928},{"name":"2","value":0},{"name":"1","value":0}],"path":[{"start":"130","end":"13"},{"start":"102","end":"13"},{"start":"71","end":"10"},{"start":"112","end":"13"},{"start":"144","end":"10"}],"srcTop":[{"name":"team12","value":19},{"name":"team5","value":17},{"name":"team4","value":17},{"name":"team1","value":16},{"name":"team13","value":15}],"typeTop":[{"name":"web扫描","value":353}],"dstTop":[{"name":"白盒拟态路由器","value":193},{"name":"白盒拟态WEB服务器","value":160}]}
                if (this.playType == 1) {
                    let query = ""
                    if (this.attackType == 1) {
                        query = '?type=2&cookie=2'
                    } else {
                        query = '?type=4&cookie=2'
                    }
                    // window.location.href = "/black.html" + query;

                    this.threatAddlineItem = data.list 
                    if (data.list.length == 0) {
                        this.playType = 1 
                        return
                    } else {
                        setTimeout(() => {
                            
                            this.loadGlobal(this.clone(this.threatAddlineItem), 0)
                        }, 2000)
                    }

                } else {

                }

            }
            this.ws1.onerror = e => { };
            this.ws1.onclose = () => {
                //通道关闭了
                if (this.ws1.readyState == 3) {
                    //五秒钟后重连
                    setTimeout(() => {
                        this.blacksocket();
                        // this.socket(func());
                    }, 5000)
                }
            };
        },
        deletePlayList(id) {
            axios("/mimic/threat/deletePlayList", {
                params: {
                    id: id,
                    topologyId: this.attackType == 1 ? '1' : '2'
                }
            }).then(res => {

            })
        },
        getAttackLine(steps, func) {
            this.stepIndex = 0;
            //开始走攻击线
            let links = JSON.parse(JSON.stringify(steps))
            let addLine = (arr) => {
                if (!this.is_next) {
                    return
                }
                this.stepIndex++;
                if (arr.length == 0) {
                    this.deletePlayList(this.threat_id)
                    this.reloadPlayback(this.threat_id)
                    // history.go(-1) 
                    // // this.$refs['iframe'].contentWindow.postMessage('向iframe传的值', '*')
                    typeof func == 'function' ? func() : null;
                    return
                }
                let obj = arr.shift();
                let arrs = [];
                if (obj) {
                    obj.node_id.forEach(n => {
                        this.nodes.forEach(node => {
                            if (n == node.id) {
                                arrs.push(node)
                            }
                        })
                    })
                }
                if (this.is_next) {
                    topo.addLineBlack(arrs, obj.reference, () => {
                        if (this.is_next) {
                            addLine(arr)
                        }
                    })
                }
            }
            addLine(links)

        },
        getTeam(id) {
            axios("/mimic/team/list").then(res => {
                this.teams = res.list;
            })
        },
        getThreatInformation(id, func) {
            axios("/mimic/threat/getThreatInformation", {
                params: {
                    id: id,
                    topologyId: this.attackType == 1 ? '1' : '2'
                }
            }).then(res => {
                // let str = '{"information":[{"date":"2019-05-15 04:46:05","type":"拟态存储漏洞攻击","steps":[{"reference":"2-4-1","name":"资源窃取","node_id":["46","45","14","1","9","10"]},{"reference":"2-2-1","name":"资源窃取","node_id":["33","15","14","13","9","34"]}]}],"ret_code":0}'
                // res = JSON.parse(str)
                if (res.ret_code == -1) {
                    console.log(this.playType)
                    this.playType = 1;
                    this.is_next = false;
                    this.deletePlayList(this.threat_id)
                    this.reloadPlayback(this.threat_id)
                    return
                } else {
                    this.playType = 2
                }

                this.ThreatInformation = res.information[0].steps;
                /*  for (let i = 0; i < 2; i++) {
                     this.ThreatInformation.push(...res.information[0].steps)
                 } */
                if (this.ThreatInformation.length == 0) {
                    typeof func == 'function' ? func() : null;
                } else {
                    this.getAttackLine(this.ThreatInformation, () => {
                        //所有线条播放完成 
                        
                        if (!this.is_next) {
                            return
                        }
                        console.log(111111)
                        typeof func == 'function' ? func() : null;
                    })
                }
            }).catch(() => {
                // this.playType=1
            })
        },
        reloadPlayback(id) {
            axios("/mimic/threat/reloadPlayback", {
                params: {
                    topologyId: this.attackType == 1 ? '1' : '2'
                }
            })
        },
        clickteam(item) {
            this.is_next = false
            topo.deleteMeshLine();
            this.threatAddlineItem = []
            this.team_obj = {
                name: item.name,
                icon: item.small_icon,
                id: item.team_id
            }
            setTimeout(() => {
                this.is_next = true
                this.getThreatList(item.team_id, (data) => {
                    let addline = (arr) => {
                        if (arr.length == 0) {
                            return
                        }
                        let obj = arr.shift()
                        this.threat_id=obj.id
                        this.getThreatInformation(obj.id, () => {
                            addline(arr)
                        })
                    }
                    addline(data)
                })
            }, 1200)
        },
        getThreatList(id, func) {
            axios("/mimic/threat/getThreatList", {
                params: {
                    teamId: id,
                    skip: 0,
                    amount: 20,
                    topologyId: this.attackType == 1 ? '1' : '2'
                }
            }).then(res => {
                this.threat = res.list;
                if (res.list.length == 0) {
                    return false
                } else {
                    this.team_obj = {
                        name: res.teamName,
                        id: res.teamId,
                        icon: res.teamIcon
                    }
                }
                typeof func == 'function' ? func(this.clone(this.threat)) : null;

            })
        },
        loadGlobal(item) {
            // 
            this.is_next=true
            if (item.length == 0) {
                this.playType = 1;
                return
            } else {
                let obj = item.shift()
                this.getThreatList(obj.teamId)
                this.threat_id = obj.id;
                this.getThreatInformation(obj.id, () => {
                    this.loadGlobal(item)
                })

            }
            // let index = 0;

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
                    if (node.children == undefined) {
                        node.children = []
                    }
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
    controls: false,
    stats: false,
    data: [],
    VUE: VM,
    typeMap: types,
    // deep: 100,
    cameraPosition: {
        x: 14,
        y: 861,
        z: 1901
    },
    click: function (data) {
        let index = 0;
        let mesh = null
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
        VM.currNode = mesh;
        console.log(mesh)
        topo.setOption(VM.node, {
            x: VM.currNode.position.x,
            y: VM.currNode.position.y,
            z: VM.currNode.position.z,
            ...VM.currNode.datas
        })

    }
}) 