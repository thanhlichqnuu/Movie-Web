import { defineStore } from 'pinia';

export const useFacebookStore = defineStore('facebook', {
  state: () => ({
    fbSDKLoaded: false,
  }),
  actions: {
    initFacebookSDK() {
      return new Promise((resolve) => {
        if (this.fbSDKLoaded) {
          resolve(window.FB);
        } else {
          window.fbAsyncInit = () => {
            window.FB.init({
              appId: '973607627550804',
              autoLogAppEvents: true,
              xfbml: true,
              version: 'v10.0',
            });
            this.fbSDKLoaded = true;
            resolve(window.FB);
          };

          const loadSDK = () => {
            const d = document;
            const s = 'script';
            const id = 'facebook-jssdk';
            let js = d.createElement(s);
            js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            const fjs = d.getElementsByTagName(s)[0];
            fjs.parentNode.insertBefore(js, fjs);
          };

          if (!document.getElementById('facebook-jssdk')) {
            loadSDK();
          } else {
            window.fbAsyncInit();
          }
        }
      });
    },
    async initFacebookComments() {
      await this.initFacebookSDK();
      window.FB.XFBML.parse();
    },
  },
});
