<template>
  <loader-component v-if="isLoading" />
  <section class="container">
    <div class="row m-5">
      <div class="row col-md-12 mx-auto">
        <h1 class="text-center">Inscription</h1>
      </div>
      <form class="row col-md-6 mx-auto shadow-lg p-3 mb-5 bg-body rounded">
        <div class="col-md-12 mb-3">
          <label class="mb-1 fw-bold" for="name">Nom Prénom:</label>
          <input
            type="text"
            name="name"
            v-model="user.name"
            placeholder="ex: John Doe"
            class="form-control"
          />
        </div>
        <div class="col-md-12 mb-3">
          <label class="mb-1 fw-bold" for="email">Email:</label>
          <input
            type="email"
            name="email"
            v-model="user.email"
            placeholder="Ex: johndoe@gmail.com"
            class="form-control"
          />
        </div>
        <div class="col-md-12 mb-3">
          <label class="mb-1 fw-bold" for="password">Password:</label>
          <input
            type="password"
            name="password"
            class="form-control"
            v-model="user.password"
          />
        </div>
        <div class="row">
          <p class="col-md-12">
            Vous avez déjà un compte ? <br />
            <router-link to="/connexion">Connectez vous</router-link>
          </p>
        </div>
        <div class="row col-md-12 mx-auto">
          <button class="btn btn-primary" @click.prevent="inscription">
            Créer mon compte
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import LoaderComponent from "@/views/LoaderComponent.vue";
import axios from "axios";

export default {
  name: "InscriptionComponent",
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
      },
      isLoading: false,
    };
  },
  components: {
    LoaderComponent,
  },
  methods: {
    inscription() {
      if (
        this.user.name == "" ||
        this.user.email == "" ||
        this.user.password == ""
      ) {
        alert("remplissez tous les champs");
      } else {
        this.isLoading = true;
        axios
          .post(`${process.env.VUE_APP_BASE_URL}/user`, {
            name: this.user.name,
            email: this.user.email,
            password: this.user.password,
          })
          .then((response) => {
            if (response.data.status) {
              this.isLoading = false;
              //toast
              //redirection
              this.$router.push("/connexion");
            } else {
              alert("fails ");
              this.isLoading = false;
              this.user.name = "";
              this.user.email = "";
              this.user.password = "";
              console.log(response.data);
            }
          })
          .catch((error) => console.log(error));
      }
    },
  },
};
</script>

<style lang="css" scoped></style>
