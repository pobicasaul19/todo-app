import API from "@/services/API";
import Router from "@/router";

const Auth = {
  isLoggedIn: false,
  account: null,
  postLogin: (response, user) => {
    if (response.ok) {
      Auth.isLoggedIn = true;
      Auth.account = user;
      Auth.updateStatus();
      Router.go("/account");
    } else {
      alert(response.message);
    }

    // Credential Management API Store
    // if (window.PasswordCredential && user.password) {
    //     const credentials = new PasswordCredential({
    //         id: user.email,
    //         password: user.password,
    //         name: user.name
    //     });
    //     navigator.credentials.store(credentials);
    // }
  },
  register: async (event) => {
    event.preventDefault();
    const user = {
      name: document.getElementById("register_name").value,
      email: document.getElementById("register_email").value,
      password: document.getElementById("register_password").value,
    };
    const response = await API.register(user);
    Auth.postLogin(response, user);
  },
  login: async (event) => {
    if (event) event.preventDefault();
    const credentials = {
      email: document.getElementById("login_email").value,
      password: document.getElementById("login_password").value,
    };
    const response = await API.login(credentials);
    Auth.postLogin(response, {
      ...credentials,
      name: response.name,
    });
  },
  logout: () => {
    Auth.isLoggedIn = false;
    Auth.account = null;
    Auth.updateStatus();
    Router.go("/");
    if (window.PasswordCredential) {
      navigator.credentials.preventSilentAccess();
    }
  },
};
