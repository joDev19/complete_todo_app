<template>
  <loader-component v-if="isLoading" />
  <section class="container">
    <div class="row m-5">
      <div class="row col-md-12 mx-auto">
        <h1 class="text-center">Nouvelle tâche</h1>
      </div>
      <form class="row col-md-6 mx-auto shadow-lg p-3 mb-5 bg-body rounded">
        <div class="col-md-12 mb-3">
          <label class="mb-1 fw-bold" for="intitule">Intitule:</label>
          <input
            type="text"
            name="intitule"
            v-model="task.intitule"
            placeholder="Ex: Faire la lessive"
            class="form-control"
          />
        </div>
        <div class="col-md-12 mb-3">
          <label class="mb-1 fw-bold" for="description">Description:</label>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="5"
            class="form-control"
            v-model="task.description"
          >
          </textarea>
        </div>
        <div class="col-md-12 mb-3">
          <label class="mb-1 fw-bold" for="password">Date de fin:</label>
          <input
            type="date"
            name="date"
            class="form-control"
            v-model="task.date_de_fin"
          />
        </div>
        <div class="row">
          <p class="col-md-12">
            <router-link to="/dashboard"
              >Voir la liste de mes tâches</router-link
            >
          </p>
        </div>
        <div class="row col-md-12 mx-auto">
          <button class="btn btn-primary" @click.prevent="creationTache">
            Créer ma tâche
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import Axios from "axios";
import VueCookies from "vue-cookies";
import Swal from "sweetalert2";
import LoaderComponent from "./LoaderComponent.vue";
export default {
  name: "NewTaskComponent",
  components: {
    LoaderComponent,
  },
  data() {
    return {
      isLoading: false,
      task: {
        intitule: "",
        description: "",
        user_id: VueCookies.get("user_id"),
        date_de_fin: "",
      },
    };
  },
  methods: {
    creationTache() {
      this.isLoading = true;
      if (
        this.task.intitule !== "" &&
        this.description != "" &&
        this.task.date_de_fin != ""
      ) {
        Axios.post(
          `${process.env.VUE_APP_BASE_URL}/task`,
          {
            intitule: this.task.intitule,
            description: this.task.description,
            user_id: this.task.user_id,
            date_de_fin: this.task.date_de_fin,
          },
          {
            headers: {
              Authorization: `Bearer ${VueCookies.get("token")}`,
              "ngrok-skip-browser-warning": true,
            },
          }
        )
          .then((response) => {
            if (response.data.status) {
              this.isLoading = false;
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Tache créer avec succes",
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.push("/dashboard");
            } else {
              console.log(response.data);
            }
          })
          .catch((error) => {
            this.isLoading = false;

            console.log(error);
          });
      } else {
        this.isLoading = false;

        alert("Remplissez tous les champs");
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
