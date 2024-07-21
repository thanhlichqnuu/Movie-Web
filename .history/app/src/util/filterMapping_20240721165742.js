import { statusOptions, countryOptions, genreOptions } from "@/util/filterCriteria.js";

export function getFilterText(query, t) {
  // Convert options to maps
  const mapOptions = (options) => {
    if (!options) return {}; // handle case where options might be undefined
    return options.reduce((acc, option) => {
      acc[option.value] = t(option.text);
      return acc;
    }, {});
  };

  // Use .value to access the values of computed properties
  const statusMap = mapOptions(statusOptions.value);
  const countryMap = mapOptions(countryOptions.value);
  const genreMap = mapOptions(genreOptions.value);

  const filters = [];
  if (query.category) filters.push(`${t("genre")} ${genreMap[query.category] || query.category}`);
  if (query.year) filters.push(`${t("releaseYear")} ${query.year}`);
  if (query.status) filters.push(`${t("status")} ${statusMap[query.status] || query.status}`);
  if (query.country) filters.push(`${t("country")} ${countryMap[query.country] || query.country}`);

  return filters.length ? `Danh sách ${query.name} ${filters.join(", ")}` : "";
}
