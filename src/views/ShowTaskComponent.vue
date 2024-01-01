<template>
  <loader-component v-if="isLoading" />
  <section class="container">
    <div class="row m-5">
      <div class="row col-md-12 mx-auto">
        <h1 class="text-center">
          <router-link to="/dashboard">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="25"
              width="23"
              viewBox="0 0 448 512"
            >
              <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.-->
              <path
                d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
              />
            </svg>
          </router-link>
          Voir {{ this.$route.params.intitule }}
        </h1>
      </div>
      <form class="row col-md-6 mx-auto shadow-lg p-3 mb-5 bg-body rounded">
        <div class="col-md-12 mb-3">
          <label class="mb-1 fw-bold" for="intitule">Intitule:</label>
          <input
            :readonly="!modifier"
            type="text"
            name="intitule"
            v-model="task.intitule"
            placeholder="ex: John Doe"
            class="form-control"
          />
        </div>
        <div class="col-md-12 mb-3">
          <label class="mb-1 fw-bold" for="description">Description:</label>
          <textarea
            :readonly="!modifier"
            type="text"
            name="description"
            v-model="task.description"
            class="form-control"
          ></textarea>
        </div>
        <div class="col-md-12 mb-3">
          <label class="mb-1 fw-bold" for="intitule">Status:</label>

          <select
            name="status"
            v-model="task.status"
            class="form-control"
            :disabled="!modifier && !changeStatus"
          >
            <option v-for="(etat, index) in status" :key="index">
              {{ etat }}
            </option>
          </select>
        </div>
        <div class="col-md-12 mb-3">
          <label class="mb-1 fw-bold" for="description">Date:</label>
          <input
            type="date"
            name="date"
            :readonly="!modifier"
            v-model="task.date_de_fin"
            class="form-control"
          />
        </div>

        <div v-if="!modifier && !changeStatus" class="row col-md-12 mx-auto">
          <button class="btn btn-primary" @click.prevent="modifier = !modifier">
            Faire des modifications
          </button>
          <button
            v-show="!changeStatus"
            class="btn btn-success mt-2"
            @click.prevent="changeStatus = !changeStatus"
          >
            Changer le status
          </button>
        </div>
        <div v-else class="row col-md-12 mx-auto">
          <button class="btn btn-warning mb-2" @click.prevent="changeSomething">
            Modifier
          </button>
          <button
            class="btn btn-primary"
            @click.prevent="modifier = changeStatus = false"
          >
            Annuler
          </button>
        </div>
        <div class="row col-md-12 mx-auto">
          <button class="btn btn-danger mt-2" @click.prevent="deleteTask">
            Supprimer
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import LoaderComponent from "./LoaderComponent.vue";
import VueCookies from "vue-cookies";
import Axios from "axios";
import Swal from "sweetalert2";
export default {
  components: {
    LoaderComponent,
  },
  data() {
    return {
      task: {
        intitule: "",
        description: "",
        date_de_fin: "",
        status: "",
      },
      status: ["a faire", "en cours", "terminee"],
      isLoading: false,
      modifier: false,
      changeStatus: false,
    };
  },
  created() {
    this.isLoading = true;
    Axios.get(`${process.env.VUE_APP_BASE_URL}/task/${this.$route.params.id}`, {
      headers: {
        Authorization: `Bearer ${VueCookies.get("token")}`,
        "ngrok-skip-browser-warning": true,
      },
    })
      .then((response) => {
        if (response.data.status) {
          this.task = response.data.data;
          this.isLoading = false;
        }
      })
      .catch((error) => {
        alert(error);
      });
  },
  methods: {
    deleteTask() {
      this.isLoading = true;
      Axios.delete(
        `${process.env.VUE_APP_BASE_URL}/task/${this.$route.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${VueCookies.get("token")}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      )
        .then((r) => {
          if (r.data.status) {
            this.isLoading = false;
            this.$router.push("/dashboard");
          } else {
            alert("une erreur s'est produite");
            console.log(r.data);
          }
        })
        .catch((e) => {
          alert("une erreur s'est produite");
          console.log(e);
        });
    },
    changeSomething() {
      this.isLoading = true;
      if (this.changeStatus) {
        // operation pour changer le status
        Axios.post(
          `${process.env.VUE_APP_BASE_URL}/task/change_status/${this.$route.params.id}`,
          {
            status: this.task.status,
          },
          {
            headers: {
              Authorization: `Bearer ${VueCookies.get("token")}`,
              "ngrok-skip-browser-warning": true,
            },
          }
        )
          .then((result) => {
            this.isLoading = false;
            if (result.data.status) {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Mise à jour effectuée",
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.push("/dashboard");
            } else {
              console.log(result.data);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        Axios.put(
          `${process.env.VUE_APP_BASE_URL}/task/${this.$route.params.id}`,
          {
            status: this.task.status,
            intitule: this.task.intitule,
            date_de_fin: this.task.date_de_fin,
            description: this.task.description,
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
                title: "Mise à jour effectuée",
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.push("/dashboard");
            } else {
              alert("une erreur s'est produite");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
