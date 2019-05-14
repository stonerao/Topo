import "./index.less";
import Vue from 'vue/dist/vue.js'
import "perfect-scrollbar/css/perfect-scrollbar.css";
import PerfectScrollbar from 'perfect-scrollbar'  
import echarts from 'echarts'  
import {icons} from '../../utils/icon'  
Vue.component("l-chart", {
    template: '#item-template',
    name: "chart-item",
    data() {
        return {
            attackList:[
                {name:'华大科技队',value:121},
                {name:'中大网按',value:101},
                {name:'科技大学研究所',value:81},
                {name:'天安网络科技',value:61},
                {name:'西南联合',value:41},
            ],
            maxValue:1,
        }
    },
    mounted(){
        let arr = this.attackList.map(x=> x.value);
        this.maxValue = Math.max(...arr);
    
    },
    methods: {
    }
})
Vue.component("r-chart", {
    template: '#item-template1',
    name: "r-chart",
    props: {

    },
    data() {
        return {
            attackList:[
                {name:'华大科技队',value:121},
                {name:'中大网按',value:101},
                {name:'科技大学研究所',value:81},
                {name:'天安网络科技',value:61},
                {name:'西南联合',value:41},
            ],
            maxValue:1,
        }
    },
    methods: {

    },
    mounted(){
        let arr = this.attackList.map(x=> x.value);
        this.maxValue = Math.max(...arr);
    }
})
Vue.component("t-rank", {
    template: '#item-template2',
    name: "t-rank",
    data(){
        return {
            rankData:{
                code:'004',
                name:'队伍名称',
                icon:''
            },
            rankList:[],
            iconIndex:0,
            rankShow:false

        }
    },
    methods:{
    },
    created(){
        this.rankList = icons;
    }
})
Vue.component("l-list", {
    template: '#item-template3',
    name: "l-list",
    data(){
        return {
            dataList:[
                {time:'2019-05-06 12:00:00',name:'资源窃取',id:1},
                {time:'2019-05-06 12:00:00',name:'资源窃取',id:2},
                {time:'2019-05-06 12:00:00',name:'资源窃取',id:3},
                {time:'2019-05-06 12:00:00',name:'资源窃取',id:4},
                {time:'2019-05-06 12:00:00',name:'资源窃取',id:5},
                {time:'2019-05-06 12:00:00',name:'资源窃取',id:6},
                {time:'2019-05-06 12:00:00',name:'资源窃取',id:7},
                {time:'2019-05-06 12:00:00',name:'资源窃取',id:8},
                {time:'2019-05-06 12:00:00',name:'资源窃取',id:9},
                {time:'2019-05-06 12:00:00',name:'资源窃取',id:10},
            ],
            threatIndex:0,
        }
    },
    methods:{
        getThreat(index){
            this.threatIndex = index;
        }
    },
    mounted(){
    }
})
Vue.component("r-step", {
    template: '#item-template4',
    name: "r-step",
    data(){
        return {
            stepList:[
                {stepname:'攻击步骤攻击步骤',type:'1'},
                {stepname:'攻击步骤攻击步骤',type:'1'},
                {stepname:'攻击步骤攻击步骤',type:'1'},
                {stepname:'攻击步骤攻击步骤',type:'1'},
                {stepname:'攻击步骤攻击步骤',type:'1'},
                {stepname:'攻击步骤攻击步骤',type:'1'},
                {stepname:'攻击步骤攻击步骤',type:'1'},
                {stepname:'攻击步骤攻击步骤',type:'1'},
            ],
            stepIndex:0,
        }
    },
    methods:{
    },
    mounted(){
    }
})
Vue.component("b-view", {
    template: '#item-template5',
    name: "b-view",
    data(){
        return {
        }
    },
    methods:{
    },
    mounted(){
    }
})


let VM = new Vue({
    el: "#app",
    data() {
        return {
            list:[1,2]
        }
    },
    created() {
    },
    mounted() {


    },


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