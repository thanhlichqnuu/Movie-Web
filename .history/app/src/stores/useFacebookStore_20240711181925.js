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
          resolve();
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
      athis.initFacebookSDK();
    },
  },
});
