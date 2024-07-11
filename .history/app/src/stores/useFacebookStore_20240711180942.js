import { defineStore } from 'pinia';

export const useFacebookStore = defineStore('facebook', {
  actions: {
    initFacebookSDK() {
      return new Promise((resolve) => {
        window.fbAsyncInit = () => {
          FB.init({
            appId: '973607627550804',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v20.0',
          });

          // Check login status after initialization
          FB.getLoginStatus((response) => {
            if (response.status === 'connected') {
              // User is logged in and authenticated
              resolve(true);
            } else {
              resolve(false);
            }
          });
        };

        ((d, s, id) => {
          let js,
            fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s);
          js.id = id;
          js.src = 'https://connect.facebook.net/en_US/sdk.js';
          fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
      });
    },
    async initFacebookComments() {
      const isLoggedIn = await this.initFacebookSDK();
      if (isLoggedIn) {
        // Reload the page if the user is logged in
        window.location.reload();
      } else {
        // Optionally, handle the case where the user is not logged in
        console.log('User is not logged in');
      }
    },
  },
});
