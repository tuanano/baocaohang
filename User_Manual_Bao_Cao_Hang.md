# TÀI LIỆU MÔ TẢ TÍNH NĂNG
**Mô đun:** Export Báo cáo Hãng
**Phiên bản:** 1.0
**Đối tượng đọc:** Người dùng cuối (End-User / Business User)

---

## 1. TỔNG QUAN (OVERVIEW)
Màn hình **Export Báo cáo Hãng** là công cụ giúp người dùng tùy chọn các tham số và trích xuất (export) dữ liệu bán ra (Sell Through) của các hãng (Apple, Samsung, Xiaomi, v.v.) dưới dạng file Excel. 

Do lượng dữ liệu có thể rất lớn, hệ thống được thiết kế theo cơ chế **xử lý ngầm (Background Processing)**. Người dùng chỉ cần "Đặt lệnh Export", hệ thống sẽ tự động đưa vào hàng đợi và cập nhật tiến trình liên tục, giúp người dùng có thể thực hiện công việc khác trong thời gian chờ đợi.

---

## 2. CHỨC NĂNG CHÍNH (KEY FEATURES)

### 2.1. Đặt lệnh Export Báo cáo mới (Tham số Export Báo cáo)
Đây là khu vực cho phép người dùng chọn các thông số để lọc dữ liệu xuất ra file.

*   **Chọn Hãng:** Lựa chọn thương hiệu cần gom dữ liệu báo cáo (Ví dụ: Apple, Samsung, DJI...).
*   **Loại Báo cáo:** 
    *   *Báo cáo Sell Through (Số lượng):* Xuất dữ liệu tổng hợp dựa trên số lượng.
    *   *Báo cáo Sell Through (Serial):* Xuất dữ liệu chi tiết đến từng số Serial/IMEI.
*   **Nhãn hàng:** Phân loại theo dòng sản phẩm (Phone, Tablet, Smarthome...).
*   **Thời gian giao dịch:** Chọn khoảng thời gian (Từ ngày - Đến ngày) cần lấy dữ liệu.
*   **Thao tác:** Nhấn nút **[Xác nhận Export]**. Lập tức một tiến trình sẽ được khởi tạo và ghi nhận xuống bảng "Lịch sử Export báo cáo" bên dưới.

### 2.2. Lịch sử Export Báo cáo (Danh sách yêu cầu)
Khu vực này giúp người dùng quản lý, tra cứu lại các file đã đặt lệnh xuất (cả trong quá khứ và hiện tại).

*   **Bộ lọc tìm kiếm:** Hỗ trợ tìm kiếm nhanh theo mã báo cáo, người xuất, trạng thái xử lý, khoảng thời gian.
*   **Lưới dữ liệu (Grid):** Hiển thị danh sách các lệnh Export với các thông tin:
    *   *Tên báo cáo*
    *   *Hãng & Loại báo cáo*
    *   *Trạng thái* (Xem chi tiết ở mục 3)
    *   *Người export & Thời gian*
*   **Thao tác Tải xuống:** Với những báo cáo đã có trạng thái "Thành công", người dùng có thể click chọn biểu tượng **[Tải về]** ngay trên dòng tương ứng để lưu file Excel về máy.

### 2.3. Xem Tiến trình Xử lý (Tracking Progress)
Mỗi một lệnh Export đều cho phép xem "Live Tracking" trạng thái bằng cách nhấn nút **[Tiến trình]**. Màn hình sẽ hiển thị Pop-up liệt kê cụ thể các bước hệ thống đang làm:

1.  **Tiếp nhận yêu cầu:** Đưa yêu cầu vào hàng đợi.
2.  **Xác thực tham số:** Kiểm tra tính hợp lệ của dữ liệu đầu vào.
3.  **Thực thi truy vấn dữ liệu từ khóa (DB):** Quá trình lấy hàng triệu dòng dữ liệu. Đây là bước tốn thời gian nhất.
4.  **Định dạng file Excel:** Gom và format dữ liệu, tạo file.

*Khi xem tiến trình, người dùng sẽ biết chính xác hệ thống đang kẹt ở bước nào, mất bao nhiêu giây, thay vì chỉ có biểu tượng loading xoay tròn như các hệ thống cũ.*

---

## 3. QUẢN LÝ TRẠNG THÁI (STATUS DEFINITIONS)

| Trạng thái | Hiển thị (Màu sắc) | Mô tả | Thao tác khả dụng |
| :--- | :--- | :--- | :--- |
| **Đang xử lý** | Màu Xanh lam (Spinning) | Hệ thống đang chạy truy vấn và gom file ngầm. | Xem Tiến trình |
| **Thành công** | Màu Xanh lá (Hoàn tất) | Đã tạo xong file Excel, sẵn sàng tải xuống. | Tải file, Xem Tiến trình |
| **Thất bại** | Màu Đỏ (Lỗi) | Có lỗi xảy ra trong quá trình xuất (do timeout, do dữ liệu lớn, v.v.). | Xem Tiến trình chi tiết (biết lỗi gì) |

---

## 4. KỊCH BẢN XỬ LÝ LỖI (ERROR HANDLING DÀNH CHO USER)

Trong một số trường hợp, trạng thái Export sẽ báo **Thất bại**. Khi người dùng bấm vào xem **[Tiến trình]**, hệ thống sẽ cung cấp chi tiết:
*   **Bước bị lỗi:** Đánh dấu X chéo đỏ tại bước gây ra lỗi (thường là bước Truy vấn dữ liệu).
*   **Nguyên nhân cụ thể:** Ví dụ: *"Khối lượng dữ liệu truy vấn quá lớn dẫn đến Timeout tại Database"*.
*   **Hướng dẫn tự khắc phục:** Hệ thống sẽ gợi ý: *"Vui lòng thử lại bằng cách thu hẹp khoảng thời gian lấy báo cáo."* 

Nhờ tính năng này, người dùng cuối có thể tự chủ điều chỉnh số liệu (ví dụ thay vì chọn export 1 năm thì chia nhỏ ra lấy từng quý) để export thành công mà không cần chờ đợi đội ngũ IT hỗ trợ.
