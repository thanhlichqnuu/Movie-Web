import { defineStore } from 'pinia';

export const useFacebookStore = defineStore('facebook', {
  state: () => ({
    isSDKLoaded: false,
  }),
  actions: {
    initFacebookSDK() {
      return new Promise((resolve) => {
        if (this.isSDKLoaded) {
          resolve();
          return;
        }

        window.fbAsyncInit = () => {
          FB.init({
            appId: '973607627550804',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v20.0',
          });
          this.isSDKLoaded = true;
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
      await this.initFacebookSDK();
      if (window.FB) {
        FB.XFBML.parse();
      }
    },
  },
});
