export const useMovieStore = defineStore('movieStore', {
  state: () => ({
    movies: {},
    apiUrls: {
      movies: 'https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=1',
      singleMovies: 'https://ophim1.com/v1/api/danh-sach/phim-le?page=1',
      seriesMovies: 'https://ophim1.com/v1/api/danh-sach/phim-bo?page=1',
      animes: 'https://ophim1.com/v1/api/danh-sach/hoat-hinh?page=1',
    },
    // Định nghĩa các khóa tương ứng cho cấu trúc dữ liệu khác nhau
    dataKeys: {
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
        // Lấy khóa dữ liệu tương ứng từ dataKeys
        const dataKey = this.dataKeys[key] || 'items';
        // Truy cập dữ liệu thông qua khóa được xác định
        this.movies[key] = data[dataKey].slice(0, 10);
      } catch (error) {
        toast.error('Không thể tải dữ liệu!');
      }
    },
  },
});
