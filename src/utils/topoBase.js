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
            data:[]
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
        cameraPosition = { x: 0, y: 500, z: 0 },
        stats
    } = options) {
        /* created scene */
        let rendererOption = {
            canvas: this.canvas
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
        this.renderer.setClearColor(background, 1.0);
        this.renderer.setSize(width, height);
        //场景
        this.scene = new THREE.Scene()
        //透视相机
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
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
            this.controls.minDistance = 30;
            //设置相机距离原点的最远距离
            this.controls.maxDistance = 5000;
            //是否开启右键拖拽
            this.controls.enablePan = true;
            this.controls.enableRotate = true;
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 1;
        }
        if (helper) {
            this.scene.add(new THREE.GridHelper(10000, 200));
        }
        if (stats) {
            this.stats = new Stats();
            this.stats.setMode(0);
            let stateNode = document.createElement('div');
            stateNode.innerHTML = '';
            stateNode.appendChild(this.stats.domElement)
            document.querySelector("body").appendChild(this.stats.domElement)
        }
        this.animationFrame()
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

