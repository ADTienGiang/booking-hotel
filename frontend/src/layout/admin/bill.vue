<template>
    <div class="container">
        <div class="table-wrapper">
            <div class="d-flex align-items-end justify-content-between">
                <div class="form-group">
                    <label for="product_id">Chọn loại hóa đơn:</label>
                    <select v-model="selectedOption" required @change="getAllOrders()" class="form-control">
                        <option disabled value="">Chọn loại hóa đơn:</option>
                        <option value="all">Tất cả</option>
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đã đặt phòng">Phòng đã đặt</option>
                        <option value="Đã Check-in">Phòng checkin</option>
                        <option value="Đã Check-out">Phòng checkout</option>
                        <option value="Đã hủy">Đã hủy</option>
                    </select>
                    <button type="button" class="btn btn-primary btnorder" @click="DuyetTatCaDatPhong()">duyệt tất cả đặt
                        phòng</button>
                </div>
                <div class="form-group">
                    <div class="d-flex align-items-end">
                        <div class="me-2" style="flex-grow: 1;">
                            <input type="text" class="form-control" placeholder="Nhập từ khóa tìm kiếm"
                                v-model="maHoaDonFilter">
                        </div>
                        <!-- <button class="btn btn-primary" style="height: 38px;" @click="timKiemHoaDonTheoMa">Tìm
                            kiếm</button> -->
                    </div>
                </div>
            </div>

            <div class="table-title">
                <div class="row">
                    <div class="col-sm-6">
                        <h2>Quản lý <b>đặt phòng</b></h2>
                    </div>
                </div>
            </div>
            <div class="table-container">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Tên khách sạn:</th>
                            <th>Trạng thái phòng:</th>
                            <th>Thao tác</th>
                            <th>Mã hóa đơn:</th>
                            <th>Ngày đặt phòng</th>
                            <th>Ngày nhận phòng:</th>
                            <th>Ngày trả phòng:</th>
                            <th>Trạng thái thanh toán:</th>
                            <th>Số lượng khách:</th>
                            <th>Số ngày thuê:</th>
                            
                            <th>email</th>
                            <th>Tên loại phòng:</th>
                            <th>Tên khách hàng:</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="booking in filteredOrders" :key="booking.id">
                            <td>
                                <div class="max-width-td">{{ booking.room.Hotel.tenKhachSan }}</div>
                            </td>
                            <td>{{ booking.booking.trangThaiPhong }}</td>
                            <td class="thaotac">
                                <a v-if="booking.booking.trangThaiPhong === 'Đã đặt phòng' || booking.booking.trangThaiPhong === 'Đã Check-in' || booking.booking.trangThaiPhong === 'Đã Check-out'"
                                    type="button" data-bs-toggle="modal" data-bs-target="#exampleModaledit">
                                    <i class="bi bi-pencil-square iconmomodalchinhsuasp" @click="sendata(booking)"></i>
                                    <!-- Bootstrap icon for edit -->
                                </a>
                                <a v-else-if="booking.booking.trangThaiPhong === 'Đã hủy'">
                                    <i class='bi bi-trash thungrac'
                                        @click="deleteOrder(booking.maHoaDon, booking.booking.trangThaiPhong)"></i>
                                    <!-- Bootstrap icon for delete/trash -->
                                </a>
                                <a v-else-if="booking.booking.trangThaiPhong === 'Chờ xác nhận'">
                                    <i class="bi bi-check-circle-fill"
                                        @click="confirmBooking(booking.maHoaDon, booking)">xác nhận</i>
                                    <!-- Bootstrap icon for confirm -->
                                </a>
                            </td>
                            <td>{{ booking.maHoaDon }}</td>
                            <td>{{ formatDate1(booking.booking.ngayDatPhong) }}</td>
                            <td>{{ formatDate(booking.booking.ngayBatDau) }}</td>
                            <td>{{ formatDate(booking.booking.ngayKetThuc) }}</td>
                            <td>{{ booking.booking.trangThaiThanhToan }}</td>
                            <td>{{ booking.booking.soLuongKhach }}</td>
                            <td>{{ booking.booking.soNgayThue }} ngày</td>
                          
                            <td>
                                <div class="max-width-td">{{ booking.booking.emailKhachHang }}</div>
                            </td>
                            <td>
                                <div class="max-width-td">{{ booking.room.tenLoaiPhong }}</div>
                            </td>
                            <td>
                                <div class="max-width-td">{{ booking.booking.tenKhachHang }}</div>
                            </td>


                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <toast ref="toast"></toast>
    <!-- Edit Modal HTML -->
    <div class="modal fade" id="exampleModaledit" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Chi tiết hóa đơn</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body" v-for="(order, index) in orderDetails.filter(item => item.maHoaDon == this.id)">
                    <div v-if="index === 0">
                        <div class="form-group">
                            <label><strong>Mã hóa đơn:</strong> {{ order.maHoaDon }}</label>
                        </div>
                        <div class="form-group">
                            <label><strong>Trạng thái hiện tại:</strong> {{ order.booking.trangThaiPhong }} </label>
                        </div>
                        <div class="modal-body">
                            <!-- Các phần tử khác trong modal -->
                            <div class="form-group" v-if="order.trangThaiPhong !== 'Đã hủy'">
                                <label for="status-select"><strong>Chọn trạng thái mới:</strong></label>
                                <select class="form-control" id="status-select" v-model="trangThaiPhong">
                                    <option value="Đã Check-in" v-bind:selected="trangThaiPhong === 'Đã Check-in'"
                                        v-if="currentStatus !== 'Đã Check-in'">Đã Check-in</option>
                                    <option value="Đã Check-out" v-bind:selected="trangThaiPhong === 'Đã Check-out'"
                                        v-if="currentStatus !== 'Đã Check-out'">Đã Check-out</option>
                                    <option value="Đã hủy" v-bind:selected="trangThaiPhong === 'Đã hủy'"
                                        v-if="currentStatus !== 'Đã hủy'">Đã hủy</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btnorder" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary btnorder" @click="updateStatus(id, trangThaiPhong)">Cập
                        nhập</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import toast from '../../components/toast.vue';
import axios from 'axios';
export default
    {
        data() {
            return {
                orders: [],
                id: '',
                trangThaiPhong: '',
                id_user: 0,
                quantity: '',
                status: '',
                products: [],
                orderDetails: [],
                selectedOption: 'all',
                maHoaDon: '',
                tenKH: '',
                email: '',
                maDonTimKiem: '',
                ketQuaTimKiem: '',
                maHoaDonFilter: '',
                tenKS : '',
            }
        },
        components: {
            toast
        },
        mounted() {
            this.getAllOrders();
        },
        computed: {
            filteredOrders() {
                if (!this.maHoaDonFilter) {
                    return this.orders;
                }
                const searchQuery = this.maHoaDonFilter.trim(); // Loại bỏ khoảng trắng thừa
                return this.orders.filter(order => {
                    const maHoaDonStr = String(order.maHoaDon);
                    return maHoaDonStr.includes(searchQuery);
                });
            }
        },
        methods: {
            async getAllOrders() {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL_API}/getAllRoomBookings`);
                    const allDetailBookings = response.data.allDetailBookings;
                    console.log(allDetailBookings)
                    switch (this.selectedOption) {
                        case 'all':
                            this.orders = allDetailBookings; // Tất cả các loại hóa đơn 
                            break;
                        case 'Đã đặt phòng':
                            this.orders = allDetailBookings.filter(order => order.booking.trangThaiPhong === 'Đã đặt phòng');
                            break;
                        case 'Chờ xác nhận':
                            this.orders = allDetailBookings.filter(order => order.booking.trangThaiPhong === 'Chờ xác nhận');
                            break;
                        case 'Đã Check-in':
                            this.orders = allDetailBookings.filter(order => order.booking.trangThaiPhong === 'Đã Check-in');
                            break;
                        case 'Đã Check-out':
                            this.orders = allDetailBookings.filter(order => order.booking.trangThaiPhong === 'Đã Check-out');
                            break;
                        case 'Đã hủy':
                            this.orders = allDetailBookings.filter(order => order.booking.trangThaiPhong === 'Đã hủy');
                            break;
                        default:
                            this.orders = []; // Trường hợp không hợp lệ
                            break;
                    }
                } catch (error) {
                    console.error(error);
                    // Xử lý lỗi ở đây
                }
            },
            async DuyetTatCaDatPhong() {
                try {
                    // Lọc ra các đơn đặt phòng có trạng thái "Chờ xác nhận"
                    const bookingsToConfirm = this.orders.filter(order => order.booking.trangThaiPhong === 'Chờ xác nhận');
                    // Kiểm tra nếu không có đơn nào để xác nhận
                    if (bookingsToConfirm.length === 0) {
                        this.$refs.toast.showToast('Không có đơn đặt phòng nào để xác nhận');
                        return;
                    }
                    // Dữ liệu cập nhật, bao gồm trạng thái mới và danh sách ID đặt phòng
                    const bookingIds = bookingsToConfirm.map(order => order.booking.maHoaDon);
                    const updateData = { newStatus: 'Đã đặt phòng', bookingIds: bookingIds };
                    // Gửi yêu cầu PUT để cập nhật tất cả các đơn đặt phòng
                    await axios.put(`${import.meta.env.VITE_API_BASE_URL_API}/updateBookingStatus`, updateData);
                    // Gửi email xác nhận cho mỗi khách hàng
                    for (const booking of bookingsToConfirm) {
                        const emailData = {
                            email: booking.booking.emailKhachHang,
                            name: booking.booking.tenKhachHang,
                            maHoaDon: booking.booking.maHoaDon,
                            tenKS: booking.room.Hotel.tenKhachSan,
                        };
                        console.log(emailData)
                        await this.$axios.post(`send-noti`, emailData);
                    }
                    this.$refs.toast.showToast('Tất cả đơn đặt phòng đã được xác nhận và email đã được gửi');
                    this.getAllOrders(); // Cập nhật lại danh sách đơn đặt phòng
                } catch (error) {
                    console.error(error);
                    this.$refs.toast.showToast('Lỗi khi xác nhận đơn đặt phòng');
                }
            },
            getProductImages(order, productId) {
                const images = [];
                for (let i = 0; i < order.order_details.length; i++) {
                    const orderDetail = order.order_details[i];
                    if (orderDetail.id_product === productId) {
                        const color = orderDetail.Product.colors[0];
                        if (color && color.Imgs.length > 0) {
                            images.push(...color.Imgs);
                        }
                    }
                }

                return images;
            },
            sendata(order) {
                this.id = order.booking.maHoaDon;
                console.log('ma hoa don' + this.id)
                this.getOrderDetails();
            },
            async getOrderDetails() {
                try {
                    const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL_API}/getDetailRoomBooking/` + this.id);
                    this.orderDetails = result.data.detailBookings;
                } catch (e) {
                    this.orderDetails = []
                }
            },
            confirmBooking(orderId, data) {
                console.log(data.maHoaDon)
                this.maHoaDon = data.maHoaDon;
                this.tenKH = data.booking.tenKhachHang;
                this.email = data.booking.emailKhachHang;
                this.tenKS =  data.room.Hotel.tenKhachSan,
                console.log(this.tenKS)
                this.trangThaiPhong = 'Đã đặt phòng';
                this.updateStatus(orderId);
                this.sendEmailOnce();
                this.getAllOrders();
            },
            async sendEmailOnce() {
                // Tạo dữ liệu email
                let emailData = {
                    email: this.email,
                    name: this.tenKH,
                    maHoaDon: this.maHoaDon,
                    tenKS:this.tenKS,
                };
                try {
                    await this.$axios.post(`send-noti`, emailData);
                } catch (error) {
                    if (error.response && error.response.data) {
                        const { message } = error.response.data;
                        this.$refs.toast.showToast(message);
                    } else {
                        this.$refs.toast.showToast('lỗi server');
                    }
                }
            },
            updateStatus(orderId) {
                // Gọi API để cập nhật trạng thái phòng
                axios.put(`${import.meta.env.VITE_API_BASE_URL_API}/updateRoomStatus/${orderId}`, {
                    newRoomStatus: this.trangThaiPhong,
                })
                    .then((response) => {
                        const order = this.orders.find((order) => order.id === orderId);
                        if (order) {
                            order.status = this.trangThaiPhong; // Cập nhật trạng thái cho đơn hàng
                        }

                        this.$refs.toast.showToast(`Trạng thái phòng đã chuyển thành: ${this.trangThaiPhong}`);
                        this.getOrderDetails();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            },
            formatCurrency(value) {
                let val = (value / 1).toFixed(0).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' đ'
            },
            async deleteOrder(maDon, status) {
                if (status !== 'Đã hủy') {
                    alert('hóa đơn chưa hủy, không thể xóa')
                } else {
                    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?');
                    if (isConfirmed) {
                        try {
                            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL_API}/deleteOrder/${maDon}`);
                            console.log(response.data.message)
                            this.$refs.toast.showToast(response.data.message);
                            await this.getOrderDetails();
                        } catch (error) {
                            if (error.response && error.response.data) {
                                const { message } = error.response.data;
                                this.$refs.toast.showToast(message);
                            } else {
                                this.$refs.toast.showToast('lỗi server');
                            }
                        }
                    } else {
                        console.log('Hủy xác nhận');
                    }
                }
            },
            formatDate(dateString) {
                const parts = dateString.split(' ');
                const date = parts[0].split('-');
                const year = date[0];
                const month = date[1];
                const day = date[2];

                // Định dạng lại theo ý muốn. Ví dụ: "ngày 05/01/2024"
                return `ngày ${day}/${month}/${year}`;
            },
            formatDate1(dateString) {
                const date = new Date(dateString);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
                const year = date.getFullYear();

                // Định dạng lại theo ý muốn. Ví dụ: "ngày 18/01/2024"
                return `ngày ${day}/${month}/${year}`;
            },
            async timKiemHoaDonTheoMa() {
                console.log(this.maDonTimKiem);
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL_API}/searchBookingById`, {
                        params: {
                            maHoaDon: this.maDonTimKiem,
                        }
                    });
                    console.log(response.data);
                    // Gán dữ liệu tìm kiếm vào mảng orders
                    this.orders = response.data.allDetailBookings;
                } catch (error) {
                    console.error('Lỗi:', error);
                    if (error.response && error.response.data) {
                        const { message } = error.response.data;
                        this.$refs.toast.showToast(message);
                    } else {
                        this.$refs.toast.showToast('Lỗi server');
                    }
                }
            },

        }
    }
</script>
<style>
.product-image {
    float: right;
    margin-left: 10px;
}

.form-group:after {
    content: "";
    display: table;
    clear: both;
}

.bi-check-circle-fill {
    color: rgb(17, 0, 252);
    font-style: normal;
    font-weight: 500;
    cursor: pointer;
}

* {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

}

table thead th {
    color: #1A1A1A;
    font-size: 20px;
}

tbody tr td {
    color: #1A1A1A;
    font-size: 18px;
    font-weight: 600;

}

.btn-sm {
    font-style: normal;

}

.bx.bx-message-square-x {
    font-weight: 600;
    font-style: normal;
    margin-left: auto;
    color: #ff4d4f;
    cursor: pointer;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.bx.bx-message-square-x:hover {
    color: #b1393b;
}

/* Modal Content */
.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Modal Header */
.modal-header {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.modal-title {
    color: #333;
    font-size: 24px;
    font-weight: bold;
}

/* Close Button */
.btn-close {
    background: none;
    border: none;
    color: #aaa;
    font-size: 20px;
}

/* Modal Body */
.modal-body {
    padding: 20px;
}

/* Dropdown */
select {
    width: 100%;
    padding: 8px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f8f8f8;
}

/* Upload Section */
.label {
    display: block;
    margin-bottom: 5px;
    color: #666;
}

#upload {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
}

.files ul {
    list-style: none;
    padding: 0;
}

.files li {
    margin-bottom: 10px;
    /* Khoảng cách giữa các mục */
}

.file-image {
    width: 100px;
    height: auto;
    border-radius: 4px;
    margin-right: 10px;
}

.file-size {
    font-size: 14px;
    color: #666;
}

/* Modal Footer */
.modal-footer {
    border-top: 1px solid #eee;
    padding-top: 10px;
    margin-top: 20px;
    text-align: right;
}

.btn {
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-weight: bold;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}



.bx {
    cursor: pointer;
    color: red;
    margin-left: 10px;
}

.fa-trash-can {
    color: #f70a0a;
    cursor: pointer;
}

.fa-trash-can:hover {
    color: #771111;
}

.fa-spinner {
    color: #011a6b;
    cursor: pointer;
}

.max-width-td {
    width: 150px;
    height: 100px;
    overflow-y: auto;
    white-space: normal;
}

.max-width-td1 {
    width: 50px;
    overflow-y: auto;
    white-space: normal;
}
</style>