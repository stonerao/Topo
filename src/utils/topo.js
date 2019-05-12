import Base from './topoBase'
const MODEL_SRC = '/assets/model/'
const IMG_SRC = '/assets/image/'
export default class Topo extends Base {
    constructor(options) {
        super(options)
        let { VUE, typeMap } = options;
        this.Vue = VUE;
        this.typeMap = typeMap;
        /* var geometry = new THREE.BoxGeometry(100, 100, 100);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        cube.datas = {
            type: 1,
            name: 2
        }
        this.options.data.push(cube) */
        var light = new THREE.AmbientLight(0xffffff); // soft white light
        this.scene.add(light);
        var directionalLight = new THREE.DirectionalLight(0xffffff,1);
        this.scene.add(directionalLight);
        //平铺地板
        let conut = 120;
        let wsize = 64;
        this.repeatLoadImg({
            width: wsize, height: wsize,
            conut: conut, img: IMG_SRC + "BG2.png"
        }, (canvas) => {
            let routerName = new THREE.Texture(canvas);
            routerName.needsUpdate = true;
            let geometry = new THREE.PlaneGeometry(2400, 2400, 6);
            let material = new THREE.MeshBasicMaterial({ map: routerName, side: THREE.DoubleSide });
            let plane = new THREE.Mesh(geometry, material);
            plane.datas = {
                type: "footer",
            }
            plane.rotation.x = Math.PI / 2;
            plane.position.y = -2;
            // plane.position.set(x, y, z);
            this.scene.add(plane);
            this.options.data.push(plane);
        })

    }
    addNodes({ type, name, x = 0, y = 0, z = 0, id, info }) {
        if (type === "" || name === "") {
            alert("类型或者名字不能为空")
            return
        }
        let rotation = [1]
        let type_id = parseInt(type);
        var mtlLoader = new THREE.MTLLoader();
        let scene = this.scene;
        let node = this.typeMap.filter(x => x.type == type)[0]
        const meshAdd = (mesh) => {
            let node = mesh.children[0]
            node.position.set(x, y, z)
            node.datas = {
                type: type,
                name: name,
                id: id
            }
            this.options.data.push(node)
            if (rotation.includes(type_id)) {
                //如果在z为负数  反方向
                if (z < 0) {
                    node.rotation.y = Math.PI
                }
            }
            scene.add(node)
        }
        let obj_arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let img_type_plane = [11, 12]

        if (obj_arr.includes(type_id)) {
            //有模型 
            if (this.hasOwn(node, "obj") && this.hasOwn(node, "mtl")) {
                mtlLoader.load(MODEL_SRC + node.mtl, function (materials) {
                    materials.preload();
                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(MODEL_SRC + node.obj, function (mesh) {
                        meshAdd(mesh)
                    });
                });
            } else if (this.hasOwn(node, "obj") && !this.hasOwn(node, "mtl")) {
                var objLoader = new THREE.OBJLoader();
                objLoader.load(MODEL_SRC + node.obj, function (mesh) {
                    meshAdd(mesh)
                });
            }
        } else if (img_type_plane.includes(type_id)) {
            //加载地板系列
            /* let node = this.canvasItem({
                width: 1024,
                height: 1024,
                img: "/assets/image/" + info,
                x: x,
                y: y,
                z: z,
            }) */
            switch (type_id) {
                case 11:
                    // 队伍
                    this.loadImg({
                        width: 256,
                        height: 256,
                        img: IMG_SRC + info
                    }, (canvas) => {
                        let routerName = new THREE.Texture(canvas);
                        routerName.needsUpdate = true;
                        var geometry = new THREE.PlaneGeometry(367 / 5.5, 496 / 5.5, 6);
                        var material = new THREE.MeshBasicMaterial({ map: routerName, side: THREE.DoubleSide });
                        var plane = new THREE.Mesh(geometry, material);
                        plane.datas = {
                            type: type,
                            name: name,
                            id: id,
                            info: info
                        }
                        plane.rotation.x = -Math.PI / 2 + 0.15;
                        plane.position.set(x, parseInt(y) + 7, z)
                        scene.add(plane)
                        this.options.data.push(plane)
                    })
                    break;
                case 12:
                    //地板
                    // 图片 宽 高 标题名 标题颜色1黄色2蓝色
                    let info_arr = info.split(",")
                    if (info_arr.length != 5) {
                        console.warn("信息不正确", name)
                        return
                    } 
                    this.loadImg({
                        width: info_arr[1],
                        height: info_arr[2] ,
                        img: IMG_SRC + info_arr[0]
                    }, (canvas) => {
                        let routerName = new THREE.Texture(canvas);
                        routerName.needsUpdate = true;
                        let geometry = new THREE.PlaneGeometry(info_arr[1], info_arr[2], 6);
                        let material = new THREE.MeshBasicMaterial({ map: routerName, side: THREE.DoubleSide });
                        let plane = new THREE.Mesh(geometry, material);
                        plane.datas = {
                            type: type,
                            name: name,
                            id: id,
                            info: info
                        }
                        plane.rotation.x = Math.PI / 2;
                        plane.position.set(x, y, z);
                        scene.add(plane);
                        this.options.data.push(plane);
                    })
                    if (info_arr[3] != 'false') {
                        //不需要字的地板 
                        let [twidth, theight] = [256, 64]
                        let color = info_arr[4] == '1' ?'#ffba47':'#0094f8'
                        let textImg = this.loadText({ width: twidth, height: theight, text: info_arr[3], color: color})

                        let routerName = new THREE.Texture(textImg);
                        routerName.needsUpdate = true;
                        let geometry = new THREE.PlaneGeometry(twidth, theight, 6);
                        let material = new THREE.MeshBasicMaterial({ map: routerName, side: THREE.DoubleSide });
                        let plane = new THREE.Mesh(geometry, material);
                        plane.datas = {
                            type: type,
                            name: name,
                            id: id,
                            info: info
                        }
                        plane.rotation.z = Math.PI * 2;
                        plane.rotation.x = -Math.PI /8;
                        let p = (n) => {
                            return parseFloat(n)
                        }
                        plane.position.set(x, p(y) + theight / 2, p(z) + p(info_arr[2]) / 2 +20);
                        scene.add(plane);
                        this.options.data.push(plane);
                    }
                    break;
            }


        }


        /*  switch (parseInt(type)) {
             case 1:
                 
                 break;
         }
  */
        /* var geometry = new THREE.BoxGeometry(30, 30, 30);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        cube.datas = {
            type: type,
            name: name,
            id: id
        }
        this.options.data.push(cubew)
        this.scene.add(cube); */
        this.updataLink()
    }
    addLink(item) {
        //添加连线 
        let LineBasicMaterial = this.Material.line;
        let { src, dst } = item;
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(src.x, src.y, src.z),
            new THREE.Vector3(dst.x, dst.y, dst.z)
        );
        var line = new THREE.Line(geometry, LineBasicMaterial);
        this.scene.add(line);
        this.options.links.push(line)
    }
    clearAll() {
        this.options.data.forEach(node => {
            this.dispose(node)
        })
        this.options.links.forEach(link => {
            this.dispose(link)
        })
    }
    updataLink() {
        //更新所有节点
        let links = this.Vue.links;
        this.options.links.forEach(l => {
            this.dispose(l)
        })
        links.forEach(link => {
            this.addLink(link)
        })
    }
    deleteNode(id) {
        this.options.data.forEach(node => {
            if (node.datas.id == id) {
                this.dispose(node)
            }
        })
    }
}