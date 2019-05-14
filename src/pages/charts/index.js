import "./index.less";
import Vue from 'vue/dist/vue.js'
import "perfect-scrollbar/css/perfect-scrollbar.css";
import PerfectScrollbar from 'perfect-scrollbar'  
Vue.component("chart-item", {
    template: '#item-template',
    name: "chart-item",
    props: {

    },
    data() {
        return {

        }
    },
    methods: {

    }
})
let VM = new Vue({
    el: "#app",
    data() {
        return {

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