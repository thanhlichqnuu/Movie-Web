// src/utils.js
export const addTapPrefixIfNeeded = (text) => {
    return /^\d+$/.test(text) ? `Tập ${text}` : text;
  };
  