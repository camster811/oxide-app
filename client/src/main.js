import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Panel from "primevue/panel";
import Lara from "./presets/lara";   //import preset        

const app = createApp(App);
app.component("Panel", Panel);
app.use(PrimeVue, {
    unstyled: true,
    pt: Lara                            //apply preset        
});
app.mount("#app");