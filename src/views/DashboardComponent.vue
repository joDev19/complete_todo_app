<template>
  <loader-component v-if="isLoading" />
  <section class="container-fluid bg-primary text-white">
    <div class="pb-4 pt-4 d-flex flex-row justify-content-around">
      <span class="">Logo</span>
      <span class="">Todo-List</span>
      <span class="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-person-circle"
          viewBox="0 0 16 16"
          style="margin-bottom: 3px"
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path
            fill-rule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
          />
        </svg>
        {{ name }}
      </span>
    </div>
  </section>
  <section class="container">
    <div v-if="tasks.length > 0">
      <div class="float-end m-3">
        <label for="" class="">Trier par: </label>
        <select
          name=""
          id=""
          class=""
          v-model="mode_filtre_status"
          @change="filtrer_status"
        >
          <option value="all">Tout ({{ getNumberOfTasks("all") }})</option>
          <option value="a faire">
            à faire ({{ getNumberOfTasks("a faire") }})
          </option>
          <option value="en cours">
            en cours ({{ getNumberOfTasks("en cours") }})
          </option>
          <option value="terminee">
            terminer ({{ getNumberOfTasks("terminee") }})
          </option>
        </select>
        <select
          name=""
          id=""
          class="ms-1"
          @change="filtrer_date"
          v-model="mode_filtre_date"
        >
          <option value="creation">Date de création</option>
          <option value="fin">Date de fin</option>
        </select>
      </div>
      <table class="table table-hover table-sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Intitule</th>
            <th scope="col">Description</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
            <th scope="col">Date de création</th>
            <th scope="col">Date de fin</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(task, el) in filteredTasks"
            :key="task.id"
            :class="{
              'bg-primary': task.status == 'a faire',
              'bg-info': task.status == 'en cours',
              'bg-success': task.status == 'terminee',
            }"
          >
            <th scope="row">{{ el + 1 }}</th>
            <td class="fw-bold">{{ task.intitule }}</td>
            <td>{{ task.description }}</td>
            <td>
              {{ task.status }}
            </td>
            <td>
              <router-link :to="`/task/${task.id}/${task.intitule}`">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="18"
                  viewBox="0 0 576 512"
                >
                  <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.-->
                  <path
                    d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
                  />
                </svg>
              </router-link>
            </td>
            <td>{{ showDate(task.created_at) }}</td>
            <td>{{ task.date_de_fin }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <h2 class="text-info text-center fw-bold mt-5" v-if="!isLoading">
        Vous n'avez pas de tâches
      </h2>
      <h2 class="text-info text-center fw-bold mt-5" v-else>Chargement...</h2>
    </div>

    <div class="float-end">
      <router-link to="/newTask" class="btn btn-default text-success"
        >Nouvelle tâche</router-link
      >
      <span class="btn btn-default text-primary" @click="deconnexion"
        >Se déconnecter</span
      >
    </div>
  </section>
</template>

<script>
import Axios from "axios";
import VueCookies from "vue-cookies";
import LoaderComponent from "./LoaderComponent.vue";
export default {
  name: "DashboardComponent",
  data() {
    return {
      tasks: [],
      filteredTasks: [],
      name: "",
      isLoading: true,
      mode_filtre_status: "all",
      mode_filtre_date: "creation",
    };
  },
  components: {
    LoaderComponent,
  },
  methods: {
    filtrer_date() {
      if (this.mode_filtre_date == "creation") {
        this.filteredTasks = this.filteredTasks.sort((a, b) => {
          if (a.created_at > b.created_at) return -1;
          else if (a.created_at < b.created_at) return 1;
          else return 0;
        });
      } else {
        // fin
        this.filteredTasks = this.filteredTasks.sort((a, b) => {
          if (a.date_de_fin > b.date_de_fin) return -1;
          else if (a.date_de_fin < b.date_de_fin) return 1;
          else return 0;
        });
      }
    },
    filtrer_status() {
      if (this.mode_filtre_status == "all") this.filteredTasks = this.tasks;
      else {
        this.filteredTasks = this.tasks.filter(
          (task) => task.status == this.mode_filtre_status
        );
      }
    },
    showDate(date) {
      return date.split("T")[0];
    },
    deconnexion() {
      this.isLoading = true;
      Axios.post(
        `${process.env.VUE_APP_BASE_URL}/user/deconnexion`,
        {},
        {
          headers: {
            Authorization: `Bearer ${VueCookies.get("token")}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      ).then((result) => {
        if (result.data.status) {
          VueCookies.remove("token");
          VueCookies.remove("user_id");
          this.isLoading = false;
          this.$router.push("/connexion");
        }
      });
    },
    getNumberOfTasks(status) {
      if (status == "all") return this.tasks.length;
      return this.tasks.filter((task) => task.status == status).length;
    },
  },
  created() {
    this.isLoading = true;
    Axios.get(
      `${process.env.VUE_APP_BASE_URL}/user/getTaskOn/${VueCookies.get(
        "user_id"
      )}`,
      {
        headers: {
          Authorization: `Bearer ${VueCookies.get("token")}`,
          "ngrok-skip-browser-warning": true,
        },
      }
    )
      .then((result) => {
        if (result.data.status) {
          this.tasks = result.data.data;
          this.filteredTasks = this.tasks;
          this.isLoading = false;
          console.log(result.data.data);
        } else {
          alert("une erreur s'est produite");
        }
      })
      .catch((error) => {
        console.log("erreur: " + error);
        alert("une erreur s'est produite");
      });
    this.isLoading = true;

    Axios.get(
      `${process.env.VUE_APP_BASE_URL}/user/${VueCookies.get("user_id")}`,
      {
        headers: {
          Authorization: `Bearer ${VueCookies.get("token")}`,
          "ngrok-skip-browser-warning": true,
        },
      }
    )
      .then((result) => {
        if (result.data.status) {
          this.name = result.data.data.name;

          this.isLoading = false;
        } else {
          alert("une erreur s'est produite");
        }
      })
      .catch((error) => {
        console.log("erreur: " + error);
        alert("une erreur s'est produite");
      });
  },
};
</script>

<style lang="css" scoped>
.bg-primary,
.bg-success {
  color: white;
}
</style>
