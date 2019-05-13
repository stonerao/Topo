import Base from './base'
var _this;
export default class Topo extends Base {
    /**
     * @webgl defalut:1   1=> webgl.1  2=>webgl.2   
     * @el String canvas 
     * @background any 画布颜色
     * @width Number 画布宽度
     * @height Number 画布高度
     * @controls Boolean 是否开启鼠标功能
     * @helper Boolean 是否启动辅助线
     * @cameraPosition Object 相机所在坐标
     */

    constructor(options) {
        super()
        /* created */
        _this = this;
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.controls = null;
        this.stats = null;
        this.raycaster = null;
        this.options = {
            width: null,
            height: null,
            click: null,
            data: [],//存储所有添加的节点
            links: []
        }
        /* 判断是否有canvas */
        this.canvas = document.querySelector(options.el)
        if (!this.isObject(this.canvas)) {
            //检查是否有canvas 
            return console.error("页面中没有canvas")
        }
        this.setOption(this.options, {
            width: options.width,
            height: options.height
        })
        this._init(options);
        //是否需要点击
        if (this.hasOwn(options, "click")) {
            if (typeof options['click'] === "function") {
                this.setOption(this.options, {
                    click: options.click
                })

                this.canvas.addEventListener("mouseup", this.click)
            }
        }
    }
    _init({
        welgl = 1,
        background = 0x04060E,
        controls = false,
        helper = false,
        cameraPosition = { x: 0, y: 1000, z: 0 },
        stats
    } = options) {
        /* created scene */
        let rendererOption = {
            canvas: this.canvas,
            antialias: true, alpha: true
        }
        let { width, height } = this.options;
        if (welgl === 2) {
            /* 如果使用webgl2 */
            if (WEBGL.isWebGL2Available() == false) {
                document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
            } else {
                var context = this.canvas.getContext('webgl2');
                rendererOption.context = context;
            }
        }
        this.renderer = new THREE.WebGLRenderer(rendererOption);
        //设置背景颜色 以及 大小
        this.renderer.setSize(width, height);
        this.renderer.setClearAlpha(0.5);
        // this.renderer.setClearColor(background, 1);
        //场景
        this.scene = new THREE.Scene()
        //透视相机
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 8000);
        //镜头位置 
        this.camera.position.set(...Object.values(cameraPosition))
        //添加
        this.scene.add(this.camera)
        //是否开启鼠标功能
        if (controls) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            //动态阻尼系数 就是鼠标拖拽旋转灵敏度
            this.controls.dampingFactor = 1;
            //是否可以缩放
            this.controls.enableZoom = true;
            //是否自动旋转controls.autoRotate = true; 设置相机距离原点的最远距离
            this.controls.minDistance = 0;
            //设置相机距离原点的最远距离
            this.controls.maxDistance = 3000;
            //是否开启右键拖拽
            this.controls.enablePan = true;
            this.controls.enableRotate = true;
            /* this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 1; */
        }
        if (helper) {
            /*   let help = new THREE.GridHelper(2200, 80)
              help.position.y=-5
              this.scene.add(help); */
        }
        if (stats) {
            this.stats = new Stats();
            this.stats.setMode(0);
            let stateNode = document.createElement('div');
            stateNode.innerHTML = '';
            stateNode.appendChild(this.stats.domElement)
            document.querySelector("body").appendChild(this.stats.domElement)
        }
        this.animationFrame();
        let resolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
        //常用贴图  
        var linkMesh = {
            color: new THREE.Color("#91FFAA"),
            opacity: 1,
            resolution: resolution,
            sizeAttenuation: 1,
            lineWidth: 6,
            near: 10,
            far: 100000,
        }

        this.Material = {
            line: new THREE.LineBasicMaterial({
                color: 0x254968,
                linewidth: 1,
                linecap: 'round', //ignored by WebGLRenderer
                linejoin: 'round' //ignored by WebGLRenderer
            }), 
            linne_mesh_1: new MeshLineMaterial({
                ...linkMesh,
                color: new THREE.Color("#91FFAA"),
            }),
            linne_mesh_2: new MeshLineMaterial({
                ...linkMesh,
                color: new THREE.Color("#fea053"),
            }),
            linne_mesh_3: new MeshLineMaterial({
                ...linkMesh,
                color: new THREE.Color("#ff3d6c"),
            }),
            linne_mesh_4: new MeshLineMaterial({
                ...linkMesh,
                color: new THREE.Color("#e17cff"),
            }), 
        }
    }
    loadImg({ width = 256, height = 256, img }, func) {
        let canvas = document.createElement('canvas');
        //导入材质
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext("2d");
        let _IMG = new Image();
        _IMG.src = img;
        _IMG.onload = () => {
            context.drawImage(_IMG, 0, 0, width, height);
            func(canvas)
        }
    }
    imgToCanvas({ width = 256, height = 256, img }) {
        //img 转换 canvas
        let canvas = document.createElement('canvas');
        //导入材质
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, width, height);
        return canvas
    }
    repeatLoadImg({ width = 64, height = 64, conut, img }, func) {
        let canvas = document.createElement('canvas');
        //导入材质
        canvas.width = width * conut;
        canvas.height = height * conut;
        let context = canvas.getContext("2d");
        let _IMG = new Image();
        _IMG.src = img;
        _IMG.onload = () => {
            var pat = context.createPattern(_IMG, "repeat");
            context.rect(0, 0, width * conut, height * conut);
            context.fillStyle = pat;
            context.fill();
            func(canvas)
        }
    }
    loadText({ width = 256, height = 128, text = "", color = "#ffba47" }) {
        let canvas = document.createElement('canvas');
        //导入材质
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext("2d");
        context.fillStyle = color;
        context.fillRect(0, 0, width, height);
        context.fill()
        context.closePath()
        context.font = 'bold 32px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#000000';
        context.lineWidth = 20;
        context.fillText(text, width / 2, height / 2);
        return canvas;
    }
    canvasItem({ width = 256, height = 256, img, x, y, z }) {
        let canvas = document.createElement('canvas');
        //导入材质
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext("2d");
        let _IMG = new Image();
        _IMG.src = img;
        _IMG.onload = () => {
            console.log("cs")
            context.drawImage(_IMG, 0, 0, width, height);
            let routerName = new THREE.Texture(canvas);
            routerName.needsUpdate = true;
            let sprMat = new THREE.SpriteMaterial({ map: routerName });
            let spriteText = new THREE.Sprite(sprMat);
            spriteText._tpye = "team"
            spriteText.scale.set(100, 100, 1);
            spriteText.position.set(x, y, z)
            this.scene.add(spriteText);
        }

    }
    dispose(mesh, state) {
        /* 删除模型 */
        if (!state) {
            mesh.traverse(function (item) {
                if (item instanceof THREE.Mesh) {
                    item.geometry.dispose(); //删除几何体

                    if (item.material) {
                        item.material.dispose(); //删除材质
                    }
                }
            });
        }
        this.scene.remove(mesh)
    }
    click(event) {
        var raycaster = new THREE.Raycaster()
        let mouse = new THREE.Vector2();
        let x, y;
        if (event.changedTouches) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;

        } else {
            x = event.clientX;
            y = event.clientY;
        }
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, _this.camera);
        let intersects = raycaster.intersectObjects([_this.scene], true);
        if (intersects.length > 0) {
            _this.options.click(intersects, event)
            /*  switch (event.button) {
                 case 0:
                     //左键  
                     break;
                 case 2:
                     //右键
                     break;
             } */
        }
    }
    addLine(src, dst, reference, index) {
        if (!src || !dst) {
            return
        }
        let p = (n) =>{
            return parseFloat(n)
        }
        let _src = {
            x: p(src[0]),
            y: p(src[1]),
            z: p(src[2])
        }
        let _dst = {
            x: p(dst[0]),
            y: p(dst[1]),
            z: p(dst[2])
        }

        //线条颜色
        let colorIndex = reference.split("-")[1];
        // colorIndex = Math.random() < 0.2 ? '4' : colorIndex
        let mesh_line
        switch (colorIndex) {
            case "1":
                mesh_line = this.Material.linne_mesh_1
                break
            case "2":
                mesh_line = this.Material.linne_mesh_2
                break
            case "3":
                mesh_line = this.Material.linne_mesh_3
                break
            default:
                mesh_line = this.Material.linne_mesh_4

        }
         
        let _center = [
            (_src.x + _dst.x) / 2,
            (_src.y + _dst.y) / 2,
            (_src.z + _dst.z) / 2
        ]

        let cinum = 200;
         
        var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(_src.x, _src.y, _src.z),
            // new THREE.Vector3(_center[0], _src.y > _dst.y ? _src.y : _dst.y, _center[2]),
            new THREE.Vector3(_dst.x, _dst.y, _dst.z),
        ]);
        let vector = curve.getPoints(cinum);
        var geometry = new THREE.Geometry();
        for (let i = 0; i < cinum; i++) {
            geometry.vertices.push(new THREE.Vector3(...src));
        }
        var line = new MeshLine();
        line.setGeometry(geometry);
        var mesh = new THREE.Mesh(line.geometry, mesh_line);
        mesh.frustumCulled = false;
        mesh.params_type = "step"
        this.scene.add(mesh);
         
        let n = 0;
        let tim = setInterval(() => {
            n++;
            if (n >= cinum) {
                //终点   
                clearInterval(tim)
            } else {
                line.advance(vector[n]) 
            }

        })
        //线条动画
        /* state._animated(_src, _dst, 1500, () => {
            line.advance(new THREE.Vector3(_src.x, _src.y, _src.z))
            _IMG.position.set(_src.x, _src.y, _src.z)
        }, () => {
            state.addStep(_center, index, reference)
            state.dispose(_IMG) 
        }) */
    }
    animationFrame() {
        _this.stats.update()
        _this.renderer.render(_this.scene, _this.camera);
        requestAnimationFrame(_this.animationFrame);
    }
    onWindowResize({ width, height }) {
        if (typeof width !== 'number' && typeof height !== 'number') {
            return console.warn("width or height not is number")
        }
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    animated(source, target, time, func, endFunc) {
        /**
         * @source 起始数据
         * @target 结束数据
         * @time 持续时间
         * @fun 持续中的事件
         * @endFunc 完成触发的事件
         */
        createjs.Tween.get(source).to(target, time)
            .call(handleChange)
        var Time = setInterval(() => {
            typeof func == 'function' ? func() : null;
        })

        function handleChange(event) {
            //完成 
            clearInterval(Time);
            typeof endFunc == 'function' ? endFunc() : null;
        }
    }
}

