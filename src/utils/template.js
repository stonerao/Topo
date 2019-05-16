import Vue from 'vue/dist/vue.js'
import { icons } from '../utils/icon'
import "perfect-scrollbar/css/perfect-scrollbar.css";
import PerfectScrollbar from 'perfect-scrollbar'
// - 组件 左侧柱状图 
let template = `
    <div class="l_chart">
		<p>{{title}}</p>
		<ul>
			<li :style="{'opacity':1-index*0.09}" v-for="(item,index) in items" :key="index">
				<i></i>
				<div >
					<span class="bar_value">{{item.value}}</span>
					<span class="bar_name">{{item.name}}</span>
				</div> 
			</li>
		</ul>
	</div>
`
Vue.component("l-chart", {
    template: template,
    name: "chart-item",
    props: ['items', 'title'],
    data() {
        return {

        }
    },
    mounted() {
        // :style="{'visibility':!item.name?'hidden':''}" 
    },
    methods: {
    }
})
// 组件 左侧柱状图
let template1 = `
    <div class="r_chart">
        <p>{{title}}</p>
        <ul>
            <li :style="{'opacity':1-index*0.09}" v-for="(item,index) in items" :key="index">
                <div >
                    <span class="bar_value">{{item.value}}</span>
                    <span class="bar_name">{{item.name}}</span>
                </div>
                <i></i>
            </li>
        </ul>
    </div>
`

// 组件 右侧柱状图
Vue.component("r-chart", {
    template: template1,
    name: "r-chart",
    props: ['items', 'title'],
    data() {
        return {
            attackList: [
                { name: '华大科技队', value: 121 },
                { name: '中大网按', value: 101 },
                { name: '科技大学研究所', value: 81 },
                { name: '天安网络科技', value: 61 },
                { name: '西南联合', value: 41 },
            ],
            maxValue: 1,
        }
    },
    methods: {
        // :style="{'visibility':!item.name?'hidden':''}"
    },
    mounted() {
        let arr = this.attackList.map(x => x.value);
        this.maxValue = Math.max(...arr);
    }
})
// 顶部队伍列表
let template2 = `
    <div class="rank_group">
        <div class="rank_item" @click="rankShow=!rankShow">
            <span>
                <img :data-img="obj.icon" :src="'/assets/image/'+obj.icon" v-if="obj.icon"> 
            </span>
            <div>
                <span class="_code">{{obj.name||"--"}}</span>
                <span class="_name">队伍名称</span>
            </div>
        </div>
        <div class="rank_list" v-show="rankShow">
            <ul>
                <li v-for="(item,index) in teams" :class="index==iconIndex?'rankActive':''" @click="clickTeam(item,index)">
                    <img :src="'/assets/image/'+item.small_icon">
                    <p class="team-font">{{item.name}}</p>
                </li>
            </ul>
        </div>
    </div>
`
// 组件 左侧威胁列表
Vue.component("t-rank", {
    template: template2,
    name: "t-rank",
    props: {
        teams: [Array, Object],
        obj: Object
    },
    data() {
        return {
            rankData: {
                code: '004',
                name: '队伍名称',
                icon: ''
            },
            rankList: [],
            iconIndex: 0,
            rankShow: false
        }
    },
    methods: {
        clickTeam(item, index) {
            this.iconIndex = index;
            this.$emit("clickteam", item)
            this.rankShow = false
        }
    },
    created() {
        this.rankList = icons;
    }
})
// 左侧威胁列表
let template3 = `
    <div class="threat_list"  radomId="scroll_content">
        <p>威胁列表</p>
        <ul  id="threatstep"  style="height:580px;position:relative" >
        <div class="not-data" v-if="items.length==0" >暂无数据</div>
            <li  v-for="(item,index) in items" :key="item.id" class="threat_item" :class="threat_id==item.id?'activeList':''" @click="getThreat(item,item.id)">
                <span class="_time">{{item.date}}</span>
                <span class="_name">{{item.type}}</span>
                <i v-if="threat_id!=item.id"></i>
            </li>
        </ul> 
    </div>
`
Vue.component("l-list", {
    template: template3,
    name: "l-list",
    props: ['items', 'threat_id'],
    data() {
        return {
            dataList: [
                { time: '2019-05-06 12:00:00', name: '资源窃取', id: 1 },
                { time: '2019-05-06 12:00:00', name: '资源窃取', id: 2 },

            ],
            threatIndex: 0,
        }
    },
    methods: {
        getThreat(item, index) {
            this.threatIndex = index;
            this.$emit("clickthreat", item)
        }

    },
    mounted() {
        initScroll("#threatstep")
    },
    watch: {
        threat_id(val) {
            let map = this.items.map(x => x.id)
            let num = map.indexOf(val)
            if (num > 8) {
                document.getElementById("threatstep").scrollTop = (num - 8) * 59
            } else {
                document.getElementById("threatstep").scrollTop = 0
            }
        }
    }

})

// 右侧威胁步骤
let template4 = `
		<div class="step_list"  radomId="scroll_content">
			<p>威胁步骤</p>
            <ul    id="steps" style="height:580px;position:relative">
            <div class="not-data" v-if="items.length==0" style="text-align:right">暂无数据</div>
				<li v-for="(item,index) in items" :key="item.id" class="step_item" :class="sindex-1==index?'activeStep':''" @click="stepIndex=index">
					<span class="_num">{{index+1}}</span>
					<span class="_icon"><img :src="'/assets/image/right/'+item.reference+'.png'"></span>
					<span class="_step">{{item.name}}</span>
				</li>
            </ul>
            
		</div>
`
Vue.component("r-step", {
    template: template4,
    name: "r-step",
    props: ['items', 'sindex'],
    data() {
        return {
            stepList: [

            ],
            stepIndex: 0,
        }
    },
    methods: {
    },
    mounted() {
        initScroll("#steps")
    },
    watch: {
        sindex(val) {
            if (val > 8) {
                document.getElementById("steps").scrollTop = (val - 8) * 59
            } else {
                document.getElementById("steps").scrollTop = 0
            }
        }
    }
})
// 底部全局视角
let template5 = `
    <div class="all_view">
		<i @click="full"></i>
		<span>全局视角</span> 
        <slot name="main"></slot>
    </div>
`
Vue.component("b-view", {
    template: template5,
    name: "b-view",
    data() {
        return {
        }
    },
    methods: {
        full() {
            this.$emit("full")
        }
    },
    mounted() {

    }
})
// 复杂攻击统计
let template6 =
    `
		<div class="a_statistics">
			<p>{{title}}</p>
			<div class="_back">
				<div v-for="(item,index) in attakList" :key="index" :class="index==0?'High_risk':index==1?'Middle_risk':'Low_risk'">
					<div class="a_circle">
					</div>
					<div class="b_circle">{{item.value}}</div>
					<div class="c_title">
                        <i></i>
                        
						<p>{{item.name}} </p>
					</div>
				</div>
			</div>
		</div>
`
Vue.component("t-circle", {
    template: template6,
    name: "t-circle",
    props: {
        title: String,
        items: {
            defalut: [],
            type: Array
        }
    },
    data() {
        return {
            attakList: [
                { value: "--", name: '高危' },
                { value: "--", name: '中危' },
                { value: "--", name: '低危' },
            ]
        }
    },
    methods: {
    },
    mounted() {
    },
    watch: {
        ['items'](val) {
            this.attakList = val;
        }
    }
})
// 头部
let template7 =
    `
		<div class="_header">
			<div>
				<span class="c_headname">第二届“强网”拟态防御国际精英挑战赛</span>
				<span class="e_headname">THE 2nd "QIANGWANG" INTERNATIONAL ELITE CHALLENGE ON CYBER MIMIC DEFENSE</span>
			</div>
		</div>
`
Vue.component("t-header", {
    template: template7,
    name: "t-header",
    props: {
        title: String
    },
    data() {
        return {

        }
    },
    methods: {
    },
    mounted() {
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