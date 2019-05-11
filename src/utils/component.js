import Vue from 'vue/dist/vue.js'
Vue.component("tree-item", {
    template: '#item-template',
    name: "tree-item",
    props:{
        items:Object
    },
    data() {
        return {

        }
    },
    methods:{
        cnode(item){ 
            this.$emit("clicknode",item)
        },
        clcikNode(item){
            this.$emit("clicknode",item)
        },
        itemaddnode(item){
            this.$emit("itemaddnode",item)
        },
        itemdeleteode(item){
            this.$emit("itemdeleteode",item)
        },
        add(item){
            //添加子节点  
            this.$emit('itemaddnode',item)
        },
        del(item){
            //删除当前   
            this.$emit("itemdeleteode",item.id)
        }
    }
})