# Web Xem Phim Sử Dụng Vue 3

Đây là một ứng dụng web xem phim đơn giản được xây dựng bằng Vue 3. Ứng dụng cho phép người dùng xem danh sách phim, tìm kiếm phim theo tên, xem thông tin chi tiết và xem phim theo tập.

## Chức năng chính

- Xem danh sách phim phổ biến và theo thể loại.
- Tìm kiếm phim theo tên.
- Xem thông tin phim.
- Xem trailer phim.
- Xem episode phim.

## Công nghệ sử dụng

- **Vue 3**: Framework chính để xây dựng ứng dụng.
- **Vuetify**: Library để xây dựng UI.
- **Vue Router 4**: Quản lý điều hướng giữa các trang.
- **Axios**: Library HTTP Client để thực hiện các yêu cầu API.
- **Pinia**: Library để quản lí các state.
- **Ophim API**: Nguồn dữ liệu phim.

## Cài đặt và chạy ứng dụng

### Yêu cầu hệ thống

- Node.js >= 20.x
- npm >= 10.x

### Hướng Dẫn Cài Đặt

1. Clone repository về máy:
```
git clone https://github.com/thanhlichqnuu/Movie-Web.git
```
Cài đặt các phụ thuộc:
```
cd app
npm install
```
Chạy ứng dụng:
```
npm run serve
```
Mở trình duyệt và truy cập:
```
http://localhost:8080
```
```
├── public          # Thư mục chứa các file tĩnh
├── src
│   ├── assets      # Thư mục chứa các file tài nguyên như ảnh, css
│   ├── components  # Thư mục chứa các component của ứng dụng
│   ├── pages       # Thư mục chứa các trang của ứng dụng
│   ├── router      # Cấu hình Vue Router
│   ├── stores      # Cấu hình Pinia
│   ├── App.vue     # File root component
│   ├── main.js     # File main entry point
├── package.json    # File cấu hình npm
```

## Triển khai
Build cho môi trường sản xuất:
```
npm run build
```
## Đóng góp
Nếu bạn muốn đóng góp vào dự án, vui lòng tạo một Pull Request hoặc mở một Issue mới trên GitHub.

## Liên hệ
Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào về dự án, vui lòng liên hệ qua email: thanhlich2103gg@gmail.com
