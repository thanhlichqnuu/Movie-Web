import { useFilterCriteria } from "@/util/filterCriteria.js";

const { statusOptions, countryOptions, genreOptions } = useFilterCriteria();

export function getFilterText(query, t) {
  const mapOptions = (options) => {
    return options.reduce((acc, option) => {
      acc[option.value] = t(option.text);
      return acc;
    }, {});
  };

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
