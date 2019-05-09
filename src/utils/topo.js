import Base from './topoBase'
export default class Topo extends Base {
    constructor(options) {
        super(options)
        var geometry = new THREE.BoxGeometry(100, 100, 100);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
        console.log(1111111)
    }

}