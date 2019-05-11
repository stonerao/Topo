import Base from './topoBase'
export default class Topo extends Base {
    constructor(options) {
        super(options)
        let { VUE } = options;
        this.Vue = VUE
        /* var geometry = new THREE.BoxGeometry(100, 100, 100);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        cube.datas = {
            type: 1,
            name: 2
        }
        this.options.data.push(cube) */
    }
    addNodes({ type, name, x = 0, y = 0, z = 0, id }) {
        if (type === "" || name === "") {
            alert("类型或者名字不能为空")
            return
        }
        /*  switch(type){
             
         } */

        var geometry = new THREE.BoxGeometry(30, 30, 30);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        cube.datas = {
            type: type,
            name: name,
            id: id
        }
        this.options.data.push(cube)
        this.scene.add(cube);
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
}