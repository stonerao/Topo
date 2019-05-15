import Vue from 'vue/dist/vue.js'
import { icons } from '../utils/icon'
// - 组件 左侧柱状图 
let template = `
    <div class="l_chart">
		<p>{{title}}</p>
		<ul>
			<li v-for="(item,index) in items" :key="index">
				<i></i>
				<div>
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

        console.log(this.items)
    },
    methods: {
    }
})
// 组件 左侧柱状图
let template1 = `
    <div class="r_chart">
        <p>{{title}}</p>
        <ul>
            <li v-for="(item,index) in items" :key="index">
                <div>
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
                <!-- <img src="../../assets/image/4.png"> -->
            </span>
            <div>
                <span class="_code">{{rankData.code}}</span>
                <span class="_name">{{rankData.name}}</span>
            </div>
        </div>
        <div class="rank_list" v-if="rankShow">
            <ul>
                <li v-for="(item,index) in rankList" :class="index==iconIndex?'rankActive':''" @click="iconIndex=index">
                    <img :src="item.icon">
                </li>
            </ul>
        </div>
    </div>
`
// 组件 左侧威胁列表
Vue.component("t-rank", {
    template: template2,
    name: "t-rank",
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
    },
    created() {
        this.rankList = icons;
    }
})
// 左侧威胁列表
let template3 = `
    <div class="threat_list"  radomId="scroll_content">
        <p>威胁列表</p>
        <ul>
            <li v-for="(item,index) in dataList" :key="item.id" class="threat_item" :class="threatIndex==index?'activeList':''" @click="getThreat(index)">
                <span class="_time">{{item.time}}</span>
                <span class="_name">{{item.name}}</span>
                <i v-if="threatIndex!=index"></i>
            </li>
        </ul>
    </div>
`
Vue.component("l-list", {
    template: template3,
    name: "l-list",
    data() {
        return {
            dataList: [
                { time: '2019-05-06 12:00:00', name: '资源窃取', id: 1 },
                { time: '2019-05-06 12:00:00', name: '资源窃取', id: 2 },
                { time: '2019-05-06 12:00:00', name: '资源窃取', id: 3 },
                { time: '2019-05-06 12:00:00', name: '资源窃取', id: 4 },
                { time: '2019-05-06 12:00:00', name: '资源窃取', id: 5 },
                { time: '2019-05-06 12:00:00', name: '资源窃取', id: 6 },
                { time: '2019-05-06 12:00:00', name: '资源窃取', id: 7 },
                { time: '2019-05-06 12:00:00', name: '资源窃取', id: 8 },
                { time: '2019-05-06 12:00:00', name: '资源窃取', id: 9 },
                { time: '2019-05-06 12:00:00', name: '资源窃取', id: 10 },
            ],
            threatIndex: 0,
        }
    },
    methods: {
        getThreat(index) {
            this.threatIndex = index;
        }
    },
    mounted() {
    }
})

// 右侧威胁步骤
let template4 = `
		<div class="step_list"  radomId="scroll_content">
			<p>威胁步骤</p>
			<ul>
				<li v-for="(item,index) in stepList" :key="item.id" class="step_item" :class="stepIndex==index?'activeStep':''" @click="stepIndex=index">
					<span class="_num">{{index+1}}</span>
					<span class="_icon"><img src="../../assets/image/chart/4.png"></span>
					<span class="_step">{{item.stepname}}</span>
				</li>
			</ul>
		</div>
`
Vue.component("r-step", {
    template: template4,
    name: "r-step",
    data() {
        return {
            stepList: [
                { stepname: '攻击步骤攻击步骤', type: '1' },
                { stepname: '攻击步骤攻击步骤', type: '1' },
                { stepname: '攻击步骤攻击步骤', type: '1' },
                { stepname: '攻击步骤攻击步骤', type: '1' },
                { stepname: '攻击步骤攻击步骤', type: '1' },
                { stepname: '攻击步骤攻击步骤', type: '1' },
                { stepname: '攻击步骤攻击步骤', type: '1' },
                { stepname: '攻击步骤攻击步骤', type: '1' },
            ],
            stepIndex: 0,
        }
    },
    methods: {
    },
    mounted() {
    }
})
// 底部全局视角
let template5 = `
    <div class="all_view">
		<i></i>
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
				<div v-for="(item,index) in items" :key="index" :class="index==0?'High_risk':index==1?'Middle_risk':'Low_risk'">
					<div class="a_circle">
					</div>
					<div class="b_circle">21</div>
					<div class="c_title">
                        <i></i>
                        
						<p>{{item.name}}{{index}}</p>
					</div>
				</div>
			</div>
		</div>
`
Vue.component("t-circle", {
    template: template6,
    name: "t-circle",
    props: ['title', 'items'],
    data() {
        return {
            attakList: [
                { type: 1, value: 21, name: '高危' },
                { type: 2, value: 18, name: '中危' },
                { type: 3, value: 16, name: '低危' },
            ]
        }
    },
    methods: {
    },
    mounted() {
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

