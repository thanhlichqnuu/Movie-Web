import { defineStore } from 'pinia';
import axios from 'axios';
import { toast } from 'vue3-toastify';

export const useMovieStore = defineStore('movieStore', {
  state: () => ({
    movies: {},
    apiUrls: {
      movies: {
        url: 'https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=1',
        dataKey: 'items', // Key dùng để truy cập vào dữ liệu trong phản hồi từ API
      },
      singleMovies: {
        url: 'https://ophim1.com/v1/api/danh-sach/phim-le?page=1',
        dataKey: 'data', // Key dùng để truy cập vào dữ liệu trong phản hồi từ API
      },
      seriesMovies: {
        url: 'https://ophim1.com/v1/api/danh-sach/phim-bo?page=1',
        dataKey: 'data', // Key dùng để truy cập vào dữ liệu trong phản hồi từ API
      },
      animes: {
        url: 'https://ophim1.com/v1/api/danh-sach/hoat-hinh?page=1',
        dataKey: 'data', // Key dùng để truy cập vào dữ liệu trong phản hồi từ API
      },
    },
  }),
  actions: {
    async getMovies(key) {
      const apiUrl = this.apiUrls[key];
      if (!apiUrl) {
        return;
      }

      try {
        const { data } = await axios.get(apiUrl.url);
        // Dùng 'dataKey' để truy cập vào dữ liệu trong phản hồi từ API
        this.movies[key] = data[apiUrl.dataKey].slice(0, 10);
      } catch (error) {
        toast.error('Không thể tải dữ liệu!');
      }
    },
  },
});
