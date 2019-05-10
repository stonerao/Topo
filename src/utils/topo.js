import Base from './topoBase'
export default class Topo extends Base {
    constructor(options) {
        super(options)
        let { VUE } = options;
        var geometry = new THREE.BoxGeometry(100, 100, 100);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
        this.options.data.push(cube)

    }
    addNodes({ type, name, x = 0, y = 0, z = 0 }) {
        if (type === "" || name === "") {
            alert("类型或者名字不能为空")
            return
        }
        switch(type){
            
        }

    }
}