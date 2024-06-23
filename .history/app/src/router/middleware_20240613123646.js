import { addTapPrefixIfNeeded } from "@/utils/utils";

export const addTapPrefixToEpisode = (to, from, next) => {
  if (to.params.slugEpisode) {
    to.params.slugEpisode = addTapPrefixIfNeeded(to.params.slugEpisode);
  }
  next();
};
