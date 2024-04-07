<template>
    <div class="container-xxl bg-white p-0">
        <Headers style="padding-bottom: 120px;" />
        <div class="container1111">
            <!-- <div class="info-form">
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
            </div> -->
            <div class="content">
                <!-- Phần "info" -->
                <span class="thongtindatphongTitle" v-if="trangThaiPhong==='Đã đặt phòng'">Đặt phòng của bạn đã được xác nhận</span>
                <span class="thongtindatphongTitle" v-else>Đặt phòng của bạn {{ trangThaiPhong }}</span>
                <div class="info-section">
                    <div v-for="(data, index) in dataSessionStorage" :key="data.id" class="d-flex">
                        <div class="col-md-10" v-if="index === 0">
                            <div>
                                <div class="tenKSReturn">
                                    {{ data.room.Hotel.tenKhachSan }}<span class="titledetailPayemt2-item d-flex">Mã hóa đơn của bạn là {{ maHoaDon }}</span>
                                </div>
                                <div class="detailPayemt2Cha1 d-flex">
                                    <i class="bi bi-calendar"></i>
                                    <div class="detailPayemt2">
                                        <div class="checkindetailPayemt2-item1">
                                            <span class="nhanphong">Nhận phòng</span>
                                            <div class="checkindetailPayemt2">{{ formatDate(data.booking.ngayBatDau) }}
                                            </div>
                                        </div>
                                        <div class="border"></div>
                                        <div class="checkindetailPayemt2-item2">
                                            <span class="nhanphong">Trả phòng</span>
                                            <div class="checkindetailPayemt2">{{ formatDate(data.booking.ngayKetThuc) }}
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
                                        {{ data.booking.soLuongKhach }} người và {{ data.booking.soNgayThue }} ngày
                                    </div>
                                </div>
                                <div>
                                    <div class="d-flex">
                                        <i class="bi bi-key theiPaymentreturn"></i>
                                        <span class="d-flex titledetailPayemt2-item">Hướng dẫn nhận phòng</span>
                                    </div>
                                    <div class="soluongnguoivangay">Liên hệ khách sạn qua số điện thoại {{
                                        data.room.Hotel.dienThoai }}</div>
                                </div>
                                <div>
                                    <div class="d-flex theiPaymentreturn">
                                        <i class="bi bi-geo-alt"></i>
                                        <span class="d-flex titledetailPayemt2-item">Địa chỉ</span>
                                    </div>
                                    <div class="soluongnguoivangay"> {{ data.room.Hotel.diaChi }}</div>
                                </div>
                                <div>
                                    <div class="d-flex theiPaymentreturn">
                                        <i class="bi bi-person"></i>
                                        <span class="d-flex titledetailPayemt2-item">Tên khách: {{ data.booking.tenKhachHang
                                        }}</span>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div class="col-md-2">
                            <div class="img-room-detail" v-if="index === 0">
                                <img :src="data.room.images[0].tenHinh" alt="Hình ảnh phòng" class="img-fluid" />
                            </div>
                        </div>
                    </div>
                    <div v-for="(data, index) in dataSessionStorage" :key="data.id" class="d-flex soluongnguoivangay">
                        <div>{{ data.SoLuongPhong }} Phòng cho loại phòng <div class="tenLoaiPhong1">{{
                            data.room.tenLoaiPhong }}</div> giá VND {{ formatCurrency(data.room.giaDaGiam) }}</div>
                    </div>
                    <div class="thongtinThanhToanReturn">
                        <label for="ho" class="d-flex titledetailPayemt2-item111">Tổng tiền:</label>
                        <input type="text" id="ho" name="ho" class="info-input" placeholder="Nhập họ của bạn" required
                            v-model="formattedAmount" disabled>
                        <label for="email" class="d-flex titledetailPayemt2-item111">Ngân hàng:</label>
                        <input type="email" id="email" name="email" class="info-input"
                            placeholder="Nhập địa chỉ email của bạn" required v-model="vnp_BankCode" disabled>
                        <label for="soDienThoai" class="d-flex titledetailPayemt2-item111">Nội dung thanh toán:</label>
                        <input type="tel" id="soDienThoai" name="soDienThoai" class="info-input" required
                            v-model="vnp_OrderInfo" disabled>
                        <label for="soDienThoai" class="d-flex titledetailPayemt2-item111">Ngày thanh toán:</label>
                        <input type="tel" id="soDienThoai" name="soDienThoai" class="info-input"
                            :value="formatVnpPayDate(vnp_PayDate)" disabled>

                        <label for="soDienThoai" class="d-flex titledetailPayemt2-item111">Mã đơn hàng:</label>
                        <input type="tel" id="soDienThoai" name="soDienThoai" class="info-input" required v-model="maHoaDon"
                            disabled>
                    </div>
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
            vnp_Amount: this.$route.query.vnp_Amount,
            vnp_BankCode: this.$route.query.vnp_BankCode,
            vnp_OrderInfo: this.$route.query.vnp_OrderInfo,
            vnp_PayDate: this.$route.query.vnp_PayDate,
            maHoaDon: this.$route.query.vnp_TxnRef,
            vnp_TransactionStatus: this.$route.query.vnp_TransactionStatus,
            url: this.$route,
            tenKH: '',
            email: '',
            dataDetailOrderRoom: [],
            dataSessionStorage: [],
            trangThaiPhong: '',
            tenKS : '',
        };
    },
    async mounted() {
        await this.getDetailBookingRoom();
        this.getSessionStorage()
    },
    computed: {
        formattedAmount() {
            const formattedValue = this.formatCurrency(this.vnp_Amount/100);
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
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL_API}/getDetailRoomBooking/${this.maHoaDon}`,
                    {
                        params: {
                            vnp_TransactionStatus: this.vnp_TransactionStatus, // Thay '00' bằng giá trị thực tế cần gửi
                        },
                    }
                );
                this.dataDetailOrderRoom = response.data;
                if (this.dataDetailOrderRoom.detailBookings && this.dataDetailOrderRoom.detailBookings.length > 0) {
                    // Lấy thông tin tên và email khách hàng
                    const firstDetailBooking = this.dataDetailOrderRoom.detailBookings[0];
                    this.tenKH = firstDetailBooking.booking.tenKhachHang;
                    this.email = firstDetailBooking.booking.emailKhachHang;
                    this.tenKS = firstDetailBooking.room.Hotel.tenKhachSan;
                    this.trangThaiPhong = this.dataDetailOrderRoom.detailBookings[0].booking.trangThaiPhong;
                    
                    await this.sendEmailOnce(); // Gửi email một lần duy nhất
                } else {
                    console.log('Không có chi tiết đặt phòng');
                }
                sessionStorage.setItem('dataDetailOrderRoom', JSON.stringify(this.dataDetailOrderRoom));
            } catch (error) {
                console.log('Lỗi: ' + error);
            }
        },
        getSessionStorage() {
            const storedData = sessionStorage.getItem('dataDetailOrderRoom');
            if (storedData) {
                // Dữ liệu tồn tại trong sessionStorage
                const data = JSON.parse(storedData);
                this.dataSessionStorage = data.detailBookings;
                console.log(this.dataSessionStorage)
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
    }
};
</script>

      