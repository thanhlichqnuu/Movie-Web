import { defineStore } from 'pinia';
import axios from 'axios';
import { toast } from 'vue3-toastify';

export const useMovieStore = defineStore('movieStore', {
  state: () => ({
    movies: {},
    apiUrls: {
      movies: 'https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=1',
      singleMovies: 'https://ophim1.com/v1/api/danh-sach/phim-le?page=1',
      seriesMovies: 'https://ophim1.com/v1/api/danh-sach/phim-bo?page=1',
      animes: 'https://ophim1.com/v1/api/danh-sach/hoat-hinh?page=1',
    },
    // Định nghĩa cấu trúc dữ liệu tương ứng với từng loại API
    dataStructures: {
      movies: 'items',
      singleMovies: 'data.items',
      seriesMovies: 'data.items',
      animes: 'data.items',
    },
  }),
  actions: {
    async getMovies(key) {
      if (!this.apiUrls[key]) {
        return;
      }

      try {
        const { data } = await axios.get(this.apiUrls[key]);
        // Lấy cấu trúc dữ liệu tương ứng từ dataStructures
        const dataStructure = this.dataStructures[key] || 'items';
        // Truy cập dữ liệu thông qua cấu trúc được xác định
        this.movies[key] = data[dataStructure].slice(0, 10);
      } catch (error) {
        toast.error('Không thể tải dữ liệu!');
      }
    },
  },
});
