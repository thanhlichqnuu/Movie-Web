// src/router/middleware.js

import { addTapPrefixIfNeeded } from "@/utils";

export const addTapPrefixToEpisode = (to, from, next) => {
  if (to.params.slugEpisode) {
    to.params.slugEpisode = addTapPrefixIfNeeded(to.params.slugEpisode);
  }
  next();
};
