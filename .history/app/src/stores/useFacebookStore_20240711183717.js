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
        } else if (window.FB) {
          this.fbSDKLoaded = true;
          window.FB.init({
            appId: '973607627550804',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v10.0',
          });
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

          ((d, s, id) => {
            let js,
              fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
          })(document, 'script', 'facebook-jssdk');
        }
      });
    },
    async initFacebookComments() {
      await this.initFacebookSDK();
      window.FB.XFBML.parse();
    },
  },
});
