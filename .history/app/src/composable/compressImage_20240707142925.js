// src/utils/compressImage.js

export const compressImage = (url, quality = 0.1) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // This is necessary for images loaded from different origins
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toDataURL('image/jpeg', quality, (compressedDataUrl) => {
          resolve(compressedDataUrl);
        });
      };
  
      img.onerror = reject;
      img.src = url;
    });
  };
  