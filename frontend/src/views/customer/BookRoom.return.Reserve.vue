<template>
    <div class="container-xxl bg-white p-0">
        <Headers style="padding-bottom: 120px;" />
        <div class="container1111">
            <div class="info-form">
                <span class="titledetailPayemt2-item">Tất cả thông tin có đều chính xác?</span>
                <div class="detailPayemt2 d-block">
                    <div class="checkindetailPayemt2-item2">
                        <div class="checkindetailPayemt2-item11"><i
                                class="bi bi-x-circle iconthongtinTopTitlePayment"></i>Hủy đặt phòng</div>
                    </div>
                    <div class="checkindetailPayemt2-item2">
                        <div class="checkindetailPayemt2-item11"><i
                                class="bi bi-calendar iconthongtinTopTitlePayment"></i>Thay đổi ngày tháng</div>
                    </div>
                    <div class="checkindetailPayemt2-item2">
                        <div class="checkindetailPayemt2-item11"><i
                                class="bi bi-wrench iconthongtinTopTitlePayment"></i>Thay đổi loại phòng</div>
                    </div>
                </div>
                <div class="detailPayemt31">
                    <span class="giaTomTatDetailPayment">Liên hệ chỗ nghỉ</span>
                    <div class="underline-text detailPayemt31-item">
                        <i class="bi bi-telephone theilienhe"></i>điện thoại

                    </div>
                    <div class="underline-text detailPayemt31-item">
                        <i class="bi bi-chat-dots theilienhe"></i>Nhắn tin
                    </div>
                    <div class="underline-text detailPayemt31-item">
                        <i class="bi bi-envelope theilienhe"></i>Gửi mail
                    </div>
                </div>
            </div>
            <div class="content">
                <!-- Phần "info" -->
                <span class="thongtindatphongTitle" v-if="trangThaiPhong==='Đã đặt phòng'">Đặt phòng của bạn đã được xác nhận</span>
                <span class="thongtindatphongTitle" v-else>Đặt phòng của bạn {{ trangThaiPhong }}</span>
                <div class="info-section">
                    <div class="d-flex">
                        <div class="col-md-10">
                            <div>
                                <div class="tenKSReturn">
                                    {{ tenKS }}<span class="titledetailPayemt2-item d-flex">Mã hóa đơn của bạn là {{ maHoaDon }}</span>
                                </div>
                                <div class="detailPayemt2Cha1 d-flex">
                                    <i class="bi bi-calendar"></i>
                                    <div class="detailPayemt2">
                                        <div class="checkindetailPayemt2-item1">
                                            <span class="nhanphong">Nhận phòng</span>
                                            <div class="checkindetailPayemt2">{{
                                                formatDate(this.NgayNhanPhong) }}
                                            </div>
                                        </div>
                                        <div class="border"></div>
                                        <div class="checkindetailPayemt2-item2">
                                            <span class="nhanphong">Trả phòng</span>
                                            <div class="checkindetailPayemt2">{{
                                                formatDate(this.NgayTraPhong) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="d-flex">
                                        <i class="bi bi-justify theiPaymentreturn"></i>
                                        <span class="titledetailPayemt2-item d-flex">Chi tiết đặt phòng</span>
                                    </div>
                                    <div class="soluongnguoivangay">
                                        {{ this.soLuongKhach }} người và {{
                                            this.soNgayThue }} ngày
                                    </div>
                                </div>
                                <div>
                                    <div class="d-flex">
                                        <i class="bi bi-key theiPaymentreturn"></i>
                                        <span class="d-flex titledetailPayemt2-item">Hướng dẫn nhận phòng</span>
                                    </div>
                                    <div class="soluongnguoivangay">Liên hệ khách sạn qua số điện thoại : {{ sdtKS }}</div>
                                </div>
                                <div>
                                    <div class="d-flex theiPaymentreturn">
                                        <i class="bi bi-geo-alt"></i>
                                        <span class="d-flex titledetailPayemt2-item">Địa chỉ</span>
                                    </div>
                                    <div class="soluongnguoivangay">{{ diaChiKS }}</div>
                                </div>
                                <div>
                                    <div class="d-flex theiPaymentreturn">
                                        <i class="bi bi-person"></i>
                                        <span class="d-flex titledetailPayemt2-item">Tên khách: {{
                                            tenKH }}</span>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div class="col-md-2">
                            <div class="img-room-detail" >
                                <img :src="hinhAnh" alt="Hình ảnh phòng" class="img-fluid" />
                            </div>
                        </div>
                    </div>
                    <div v-for="(detail, index) in dataDetailOrderRoom.detailBookings" :key="detail.id"
                        class="d-flex soluongnguoivangay">
                        <div>{{ detail.SoLuongPhong }} Phòng cho loại phòng <div class="tenLoaiPhong1">{{
                            detail.room.tenLoaiPhong }}</div> giá VND {{ formatCurrency(detail.room.giaDaGiam) }} x
                            {{ this.soNgayThue }} đêm </div>
                    </div>
                    <div class="titledetailPayemt2-item">Tổng tiền: VND {{ formatCurrency(tongTien) }}</div>
                </div>
                <router-link :to="{ name: 'customerIndexViews' }"><button type="submit" class="buttonReturn"><i
                            class="bi bi-arrow-return-left "></i>Quay về trang
                        chủ</button></router-link>
                <button v-if="trangThaiPhong !== 'Đã hủy'" type="submit" @click="CancelBookRoom()" class="buttonCancel">
                    <i class="bi bi-x-circle huydatphongIcon"></i>hủy đặt phòng
                </button>

                <button v-else class="buttonCancel1" disabled>
                    <i class="bi bi-x-circle huydatphongIcon"></i>Đã hủy đặt phòng
                </button>



            </div>
        </div>
        <!-- <Footer /> -->
        <a href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>
    </div>
    <toast ref="toast"></toast>
</template>
<script>
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import Headers from '../../components/Headers.vue';
import Booking from '../../components/Booking.vue';
import Footer from '../../components/Footer.vue'
import toast from '../../components/toast.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import axios from 'axios'
export default {
    components: {
        Headers,
        Booking,
        Footer,
        Swiper,
        SwiperSlide,
        toast,
        'vue-ctk-date-time-picker': VueCtkDateTimePicker
    },
    data() {
        return {
            maHoaDon: '',
            url: this.$route,
            tenKH: '',
            email: '',
            dataDetailOrderRoom: [],
            dataSessionStorage: [],
            trangThaiPhong: '',
            tongTien: 0,
            diaChiKS: '',
            soLuongKhach : '',
            soNgayThue : 0,
            NgayNhanPhong : '',
            NgayTraPhong : '',
            hinhAnh : '',
            SoLuongPhong  :'',
            tenLoaiPhong : '',
            tenKS : '',
            trangThaiPhong : '',
            sdtKS : '',
        };
    },
    async mounted() {
        // this.getSessionStorage()
        // this.getDetailBookingRoom();
        this.getOrderByBookingID();
    },
    computed: {
        formattedAmount() {
            const formattedValue = this.formatCurrency(this.vnp_Amount);
            return formattedValue;
        },
    },
    methods: {
        async sendEmailOnce() {
            // Tạo dữ liệu email
            const fullURL = this.url.fullPath;
            const trimmedUrl = fullURL.substring(1);
            let emailData = {
                email: this.email,
                name: this.tenKH,
                url: trimmedUrl,
                maHoaDon: this.maHoaDon,
                tenKS : this.tenKS,
            };
            try {
                await this.$axios.post(`send-email`, emailData);
            } catch (error) {
                if (error.response && error.response.data) {
                    const { message } = error.response.data;
                    this.$refs.toast.showToast(message);
                } else {
                    this.$refs.toast.showToast('lỗi server');
                }
            }
        },
        async getDetailBookingRoom() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL_API}/getDetailRoomBooking/${this.maHoaDon}`);
                this.dataDetailOrderRoom = response.data;
                if (this.dataDetailOrderRoom.detailBookings && this.dataDetailOrderRoom.detailBookings.length > 0) {
                    // Lấy thông tin tên và email khách hàng
                    const firstDetailBooking = this.dataDetailOrderRoom.detailBookings[0];
                    this.tenKH = firstDetailBooking.booking.tenKhachHang;
                    this.email = firstDetailBooking.booking.emailKhachHang;
                    this.trangThaiPhong = this.dataDetailOrderRoom.detailBookings[0].booking.trangThaiPhong;
                    this.diaChiKS = this.dataDetailOrderRoom.detailBookings[0].room.Hotel.diaChi;
                    // await this.sendEmailOnce(); // Gửi email một lần duy nhất
                } else {
                    console.log('Không có chi tiết đặt phòng');
                }
                sessionStorage.setItem('dataDetailOrderRoom', JSON.stringify(this.dataDetailOrderRoom));
            } catch (error) {
                console.log('Lỗi: ' + error);
            }
        },
        getSessionStorage() {
            this.dataSessionStorage = {
                bookingRoom: null,
                detailBookingRooms: null
            };

            const bookingData = localStorage.getItem('bookingData');
            if (bookingData) {
                const data = JSON.parse(bookingData);
                this.dataSessionStorage.bookingRoom = data.bookingRoom;
                this.dataSessionStorage.detailBookingRooms = data.detailBookingRooms;
                this.maHoaDon = this.dataSessionStorage.detailBookingRooms[0].maHoaDon;
                this.tongTien = this.dataSessionStorage.bookingRoom.tongTien;
                console.log(this.tongTien)
            }
        },
        updatePaymentMethod(event) {
            this.paymentMethod = event.target.value;
        },
        parseDate(input) {
            let parts = input.match(/(\d{4})-(\d{2})-(\d{2})/);
            return new Date(parts[1], parts[2] - 1, parts[3]);
        },
        async SubmitForm() {
            console.log(this.url.fullPath)
            try {
                const response = await axios.post(apiUrl, requestData);
                console.log(response.data);
            } catch (error) {
                console.log('loi' + error);
            }
        },
        formatCurrency(value) {
            let val = (value / 1).toFixed(0).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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
        formatVnpPayDate(dateString) {
            if (dateString && dateString.length === 14) {
                const year = dateString.substring(0, 4);
                const month = dateString.substring(4, 6);
                const day = dateString.substring(6, 8);
                const hour = dateString.substring(8, 10);
                const minute = dateString.substring(10, 12);
                const second = dateString.substring(12, 14);
                return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
            }
            return '';
        },
        async CancelBookRoom() {
            const isConfirmed = window.confirm('Bạn có chắc chắn muốn hủy phòng?');
            if (isConfirmed) {
                try {
                    const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL_API}/updateRoomStatusBookingRoom/${this.maHoaDon}`);
                    console.log(response.data.message)
                    this.$refs.toast.showToast(response.data.message);
                    await this.getDetailBookingRoom();
                    this.trangThaiPhong = this.dataDetailOrderRoom.detailBookings[0].booking.trangThaiPhong;
                    console.log(this.trangThaiPhong)
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
        },
        async getOrderByBookingID() {
            this.maHoaDon = this.$route.query.bookingID;
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL_API}/getDetailRoomBookingReserver/${this.maHoaDon}`);
                this.dataDetailOrderRoom = response.data;
                console.log(this.dataDetailOrderRoom)
                if (this.dataDetailOrderRoom.detailBookings && this.dataDetailOrderRoom.detailBookings.length > 0) {
                    // Lấy thông tin tên và email khách hàng
                    const firstDetailBooking = this.dataDetailOrderRoom.detailBookings[0];
                    this.hinhAnh = firstDetailBooking.room.images[0].tenHinh;
                    this.NgayNhanPhong = firstDetailBooking.booking.ngayBatDau;
                    this.NgayTraPhong = firstDetailBooking.booking.ngayKetThuc;
                    this.soLuongKhach = firstDetailBooking.booking.soLuongKhach;
                    this.soNgayThue = firstDetailBooking.booking.soNgayThue;
                    this.tenKH = firstDetailBooking.booking.tenKhachHang;
                    this.tongTien = firstDetailBooking.booking.tongTien;
                    this.trangThaiPhong = firstDetailBooking.booking.trangThaiPhong;
                    this.sdtKS = this.dataDetailOrderRoom.detailBookings[0].room.Hotel.dienThoai;
                    this.email = firstDetailBooking.booking.emailKhachHang;
                    this.trangThaiPhong = this.dataDetailOrderRoom.detailBookings[0].booking.trangThaiPhong;
                    this.diaChiKS = this.dataDetailOrderRoom.detailBookings[0].room.Hotel.diaChi;
                    this.SoLuongPhong =firstDetailBooking.SoLuongPhong;
                    this.tenKS = this.dataDetailOrderRoom.detailBookings[0].room.Hotel.tenKhachSan;

                    await this.sendEmailOnce(); // Gửi email một lần duy nhất
                } else {
                    console.log('Không có chi tiết đặt phòng');
                }
                sessionStorage.setItem('dataDetailOrderRoom', JSON.stringify(this.dataDetailOrderRoom));
            } catch (error) {
                console.log('Lỗi: ' + error);
            }
        },
    }
};
</script>

      