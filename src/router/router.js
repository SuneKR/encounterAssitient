import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            alias: "/tokens",
            name: "tokens",
            component: () => import("./components/tokensList")
        },
        {
            path: "/tokens/:id",
            name: "tokens-details",
            component: () => import("./components/token")
        },
        {
            path: "/add",
            name: "add",
            component: () => import("./components/addToken")
        }
    ]
})