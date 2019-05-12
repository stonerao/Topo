import Vue from 'vue/dist/vue.js'
Vue.component("tree-item", {
    template: '#item-template',
    name: "tree-item",
    props: {
        items: Object
    },
    data() {
        return {

        }
    },
    methods: {
        cnode(item, evnet) {
            let doms = document.querySelectorAll(".cnode");
            doms.forEach(dom => {
                dom.className = "cnode";
            })
            event.target.className += " active"
            this.$emit("clicknode", item)
        },
        clcikNode(item) {
            this.$emit("clicknode", item)
        },
        itemaddnode(item) {
            this.$emit("itemaddnode", item)
        },
        itemdeleteode(item) {
            this.$emit("itemdeleteode", item)
        },
        add(item) {
            //添加子节点  
            this.$emit('itemaddnode', item)
        },
        del(item) {
            //删除当前   
            this.$emit("itemdeleteode", item.id)
        }
    }
})