import { computed } from "vue";
import { useI18n } from 'vue-i18n';

export function useFilterCriteria() {
  const { t } = useI18n();



return { statusOptions, countryOptions, genreOptions };
}
