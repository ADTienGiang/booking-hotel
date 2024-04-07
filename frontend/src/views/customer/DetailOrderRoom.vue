<template>
    <div class="container-xxl bg-white p-0">
        <Headers />

        <div class="breadcrumb">
            <span class="breadcrumb-part">Trang chủ</span>
            <span class="breadcrumb-part"><i class='bi bi-chevron-right'></i></span>
            <span class="breadcrumb-part">Chi tiết hóa đơn</span>

        </div>
        <div class="flex-container">
            <div v-if="tongSoHoaDon === 0">Bạn chưa có đơn hàng nào</div>
            <table v-else class="table">
                <thead>
                    <tr>
                        <th scope="col">Mã đơn</th>
                        <th scope="col">Ngày đặt</th>
                        <th scope="col">Giá tiền</th>
                        <th scope="col">Số lượng khách</th>
                        <th scope="col">Số ngày thuê</th>
                        <th scope="col">Thanh toán</th>
                        <th scope="col">Tình trạng</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(invoice, index) in dataDetailOrder.invoices" :key="index">
                        <td>{{ invoice.maHoaDon }}</td>
                        <td>{{ formatDate(invoice.ngayDatPhong) }}</td>
                        <td>{{ invoice.tongTien }}</td>
                        <td>{{ invoice.soLuongKhach }}</td>
                        <td>{{ invoice.soNgayThue }}</td>
                        <td>{{ invoice.trangThaiThanhToan }}</td>
                        <td v-if="invoice.trangThaiPhong !== 'Đã hủy' &&invoice.trangThaiPhong !== 'Đã Check-in' &&invoice.trangThaiPhong !== 'Đã Check-out'">{{ invoice.trangThaiPhong }}<i class="bi bi-arrow-clockwise" @click="CancelBookRoom(invoice.maHoaDon)"></i> </td>
                        <td v-else>{{ invoice.trangThaiPhong }} </td>
                        <!-- Thêm các ô khác nếu cần -->
                    </tr>

                </tbody>
            </table>
        </div>
        <a href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>
        <Footer1 />
    </div>
    <toast ref="toast"></toast>
</template>
<script>
import Headers from '../../components/Headers.vue';
import Booking from '../../components/Booking.vue';
import Footer1 from '../../components/Footer.vue';
import toast from '../../components/toast.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import axios from 'axios'
import 'swiper/css';
import 'swiper/css/pagination';
export default {
    components: {
        Headers,
        Booking,
        Swiper,
        SwiperSlide,
        toast,
        Footer1,
    },
    data() {
        return {
            userInfo: [],
            dataDetailOrder: [],
            tongSoHoaDon: 0,
            maHoaDon: '',
        };
    },
    created() {


    },
    watch: {

    },
    async mounted() {
        await this.getUserByLocalStorage();
        await this.getDetailBookingRoomOfUser();
    },
    methods: {
        async getDetailBookingRoomOfUser() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL_API}/getOrderByIdUser/${this.userInfo.email}`);
                this.dataDetailOrder = response.data;
                console.log(this.dataDetailOrder)
                if (this.dataDetailOrder.invoices.length == 0) {
                    this.tongSoHoaDon = 0;
                    console.log('ko co hoa don')
                } else {
                    this.tongSoHoaDon = this.dataDetailOrder.invoices.length;
                }
            } catch (error) {
                console.log('Lỗi: ' + error);
            }
        },
        getUserByLocalStorage() {
            const user = JSON.parse(localStorage.getItem('user')); // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
            this.userInfo = user;
        },

        formatDate(dateTimeString) {
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            };
            const formattedDate = new Date(dateTimeString).toLocaleString('en-US', options);
            return formattedDate;
        },
        async CancelBookRoom(id) {
            // console.log(id)
            const isConfirmed = window.confirm('Bạn có chắc chắn muốn hủy phòng?');
            if (isConfirmed) {
                try {
                    const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL_API}/updateRoomStatusBookingRoom/${id}`);
                    console.log(response.data.message)
                    this.$refs.toast.showToast(response.data.message);
                    await this.getDetailBookingRoomOfUser();
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

    }
};
</script>
<style scoped>
.container-xxl {
    display: flex;
    flex-direction: column;
}

.header {
    z-index: 10;
}

.booking {
    z-index: 5;
}

.flex-container {
    padding-bottom: 150px;
    display: flex;
    flex-wrap: wrap;
}

.flex-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.table {
    width: 80%;
    border-collapse: collapse;
    margin: 0 auto;
}

th,
td {
    padding: 8px;
    border: 1px solid #ccc;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}
</style>
  
      