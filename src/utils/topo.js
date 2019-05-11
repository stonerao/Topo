import Base from './topoBase'
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
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        this.scene.add(directionalLight);
    }
    addNodes({ type, name, x = 0, y = 0, z = 0, id }) {
        if (type === "" || name === "") {
            alert("类型或者名字不能为空")
            return
        }
        const random = () => {
            return parseInt(Math.random() * (Math.random() > 0.5 ? 1200 : -1200))
        }
        var mtlLoader = new THREE.MTLLoader();

        let scene = this.scene;
        let node = this.typeMap.filter(x => x.type == type)[0] 
        if (this.hasOwn(node, "obj") && this.hasOwn(node, "mtl")) {
            mtlLoader.load('/assets/model/' + node.mtl, function (materials) {
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load('/assets/model/' + node.obj, function (mesh) {
                    mesh.position.set(random(), y, random())
                    mesh.datas = {
                        type: type,
                        name: name,
                        id: id
                    }
                   
                    scene.add(mesh)  
                });
            });
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
        console.log(this.options.data)
        this.options.data.forEach(node => {
            if (node.datas.id == id) {
                this.dispose(node)
            }
        })
    }
}