import projectsRouter from "./Projects/index.js"
import usersRouter from "./Users/index.js";

const routes = {
    products : {
        path: "/projects",
        router: projectsRouter,
    },
    users : {
        path:"/profile",
        router: usersRouter,
    }
}

export default routes;