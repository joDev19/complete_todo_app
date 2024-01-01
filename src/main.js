import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueCookies from "vue-cookies";
import axios from "axios";

createApp(App).use(router).mount("#app");

const canUserAccess = (to) => {
  console.log(to);
  if (VueCookies.isKey("token") && VueCookies.isKey("user_id")) {
    // le token exist
    return axios.get(
      `${process.env.VUE_APP_BASE_URL}/user/getTaskOn/${VueCookies.get(
        "user_id"
      )}`,
      {
        headers: {
          Authorization: `Bearer ${VueCookies.get("token")}`,
          "ngrok-skip-browser-warning": true,
        },
      }
    );
  } else {
    return Promise.reject();
  }
};
router.beforeEach(async (to, from) => {
  // canUserAccess() returns `true` or `false`
  console.log(from);
  // canUserAccess(canUserAccess(to));
  if (!(to.name == "Connexion" || to.name == "Inscription")) {
    await canUserAccess(to)
      .then((result) => {
        if (result.data.status) {
          //
        } else {
          router.push("/connexion");
        }
      })
      .catch((error) => {
        console.log("erreur: " + error);
        router.push("/connexion");
      });
  }
});
