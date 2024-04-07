<template>
    <div class="container-xxl bg-white p-0">
        <Headers style="padding-bottom: 120px;" />
        <div class="steps">
            <div class="step active d-flex">
                <i class="tick-icon">✓</i>
                <div class="step-title">Bạn chọn</div>
            </div>
            <div class="horizontal-border"></div>
            <div class="step active d-flex">
                <div class="step-number">2</div>
                <div class="step-title">Chi tiết về bạn</div>
            </div>
            <div class="horizontal-border"></div>
            <div class="step d-flex">
                <div class="step-number">3</div>
                <div class="step-title">Bước cuối cùng</div>
            </div>
        </div>
        <div class="container1111">
            <div class="info-form">
                <div class="detailPayment1">
                    <div class="nameKSPM">{{ NameHotel }}</div>
                    <div class="addressKSPM">{{ Address }}</div>
                </div>
                <div class="detailPayemt2Cha">
                    <span class="titledetailPayemt2-item">Chi tiết đặt phòng của bạn</span>
                    <div class="detailPayemt2">
                        <div class="checkindetailPayemt2-item1">
                            <span class="nhanphong">Nhận phòng</span>
                            <div class="checkindetailPayemt2">{{ formatDate(checkInDate) }}</div>
                        </div>
                        <div class="border"></div>
                        <div class="checkindetailPayemt2-item2">
                            <span class="nhanphong">Trả phòng</span>
                            <div class="checkindetailPayemt2">{{ formatDate(checkOutDate) }}</div>
                        </div>
                    </div>
                    <div class="checkindetailPayemt2">
                        {{ totalDays }} ngày {{ totalQuantity }} phòng
                    </div>
                </div>

                <div class="detailPayemt3">
                    <span class="giaTomTatDetailPayment">Tóm tắt giá</span>
                    <div class="TienGiamGia">
                        <div class="giaGocPayment">Giá giốc</div>
                        <div class="giaGocPayment-item"> VND {{ formatCurrency(totalAmount) }}</div>

                    </div>
                    <div v-if="isUserLoggedIn" class="GiamThanhVien">
                        <div class="giaGocPayment">Giảm giá thành viên</div>
                        <div class="giaGocPayment-item">20%</div>

                    </div>
                    <div v-if="isUserLoggedIn" class="TongTienHang">
                        <div class="giaGocPayment1">Tổng cộng</div>
                        <div class="giaGocPayment-item1">VND {{ formatCurrency(discount) }}</div>

                    </div>
                    <div v-else class="TongTienHang">
                        <div class="giaGocPayment1">Tổng cộng</div>
                        <div class="giaGocPayment-item1">VND {{ formatCurrency(totalAmount) }}</div>
                    </div>
                </div>
            </div>
            <div class="content">
                <!-- Phần "info" -->
                <div v-if="isUserLoggedIn" class="info-section1">
                    <img :src="avatarUrl" alt="Avatar" class="anhDaiHienLogin1">
                    <div class="infoUserPayment">
                        <div class="bandadangnhap">Bạn đã được đăng nhập </div>
                        <span class="emailKhachHang">{{ this.userInfo.email }}</span>
                    </div>
                </div>
                <div class="info-section">
                    <div class="contenttopInfoUserPayment">Nhập thông tin chi tiết của bạn</div>
                    <div class="hoTenVaDauSao">
                        <label for="ho" class="HoVaTen">Họ và tên</label>
                        <div class="asterisk">*</div>
                    </div>
                    <input type="text" id="ho" name="ho" class="info-input" placeholder="Nhập họ của bạn" required
                        v-model="HoTen">

                    <div class="hoTenVaDauSao">
                        <label for="ho" class="HoVaTen">Email</label>
                        <div class="asterisk">*</div>

                    </div>
                    <input type="email" id="email" name="email" class="info-input1" placeholder="Nhập địa chỉ email của bạn"
                        required v-model="Email">
                    <div class="textEmailXacNhanDP">Email xác nhận đặt phòng sẽ được gửi đến địa chỉ này</div>
                    <div class="hoTenVaDauSao">
                        <label for="ho" class="HoVaTen">Số điện thoại</label>
                        <div class="asterisk">*</div>
                    </div>
                    <input type="text" id="soDienThoai" name="soDienThoai" class="info-input"
                        placeholder="Nhập số điện thoại của bạn" required v-model="SDT" @input="checkPhone" pattern="\d*"
                        maxlength="10">
                    <!-- <div class="hoTenVaDauSao">
                        <label for="ho" class="HoVaTen">Nhập mã xác thực</label>
                        <div class="asterisk">*</div>
                    </div>
                    <input type="number" id="soDienThoai" name="soDienThoai" class="info-input"
                        placeholder="Mã xác thực được gửi qua email" required v-model="OPT" @input="CheckOPT" pattern="\d*"
                        maxlength="10"> <button type="submit" class="class11111111" @click="SendOPT()">
                        Gửi mã
                    </button> -->
                </div>

                <!-- Phần "payment" -->
                <div class="payment-section">
                    <label for="paymentMethod" class="textChonpttt">Chọn phương thức thanh toán</label>
                    <select id="paymentMethod" name="paymentMethod" class="payment-input" required
                        @change="updatePaymentMethod">
                        <option value="paypal">Đặt trước - thanh toán tại chỗ nghỉ</option>
                        <option value="vnpay">VNPay</option>
                    </select>
                </div>
                <div class="button-container">
                    <button type="submit" class="class11111" @click="SubmitForm()">
                        Tiếp theo: Đến bước cuối cùng
                        <i class="bi bi-arrow-right"></i>
                    </button>
                </div>

            </div>
        </div>
        <!-- <Footer /> -->
        <a href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>
    </div>
    <div class="spinner-overlay" v-if="showSpinner">
        <div class="spinner"></div>
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
import imgDefault from '../../assets/img/avt/default-avatar.jpg'

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
            checkInDate: this.$route.query.checkInDate,
            checkOutDate: this.$route.query.checkOutDate,
            numberOfGuests: this.$route.query.numberOfGuests,
            totalAmount: this.$route.query.totalAmount,
            discount: this.$route.query.discount,
            NameHotel: this.$route.query.NameHotel,
            Address: this.$route.query.Address,
            Quantity: JSON.parse(this.$route.query.Quantity),
            idCategoryRoom: this.$route.query.idCategoryRoom,
            totalDays: this.$route.query.totalDays,
            HoTen: '',
            Email: '',
            SDT: 0,
            paymentMethod: '',
            soNgayThue: 0,
            userInfo: [],
            isUserLoggedIn: false,
            amount: 0,
            OPT: '',
            showSpinner: false,
            
        };
    },
    mounted() {
        this.loadUserInfo();
    },
    computed: {
        avatarUrl() {
            // Nếu avtUrl là 'default', trả về đường dẫn mặc định, nếu không trả về giá trị của avtUrl
            return this.userInfo.avtUrl === 'default'
                ? imgDefault
                : this.userInfo.avtUrl;
        },
        totalQuantity() {
            if (!this.Quantity || !Array.isArray(this.Quantity)) {
                return 0;
            }
            return this.Quantity.reduce((total, item) => total + Number(item.soLuong), 0);
        }
    },
    methods: {
        updatePaymentMethod(event) {
            this.paymentMethod = event.target.value;
        },
        parseDate(input) {
            let parts = input.match(/(\d{4})-(\d{2})-(\d{2})/);
            return new Date(parts[1], parts[2] - 1, parts[3]);
        },
        async sendEmail() {
            // Tạo dữ liệu email
            let emailData = {
                email: this.Email,
                name: this.HoTen,
            };
            await this.$axios.post(`send-email`, emailData)
                .then(response => {
                    console.log('Gửi email thành công:', response.data);
                })
                .catch(error => {
                    console.log('Lỗi khi gửi email:', error);
                });
        },
        async SubmitForm() {
            if (!this.HoTen) {
                this.$refs.toast.showToast('chưa nhập họ tên');
            } else if (!this.Email) {
                this.$refs.toast.showToast('chưa nhập email');
                return;
            } else if (!this.SDT) {
                this.$refs.toast.showToast('chưa nhập số điện thoại');
                return;
            } else {
                if (this.paymentMethod === 'vnpay') {
                    this.showSpinner = true;
                    let checkInDateStr = this.$route.query.checkInDate;
                    let checkOutDateStr = this.$route.query.checkOutDate;
                    let checkInDate = this.parseDate(checkInDateStr);
                    let checkOutDate = this.parseDate(checkOutDateStr);
                    let rentalDays = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
                    this.soNgayThue = rentalDays;
                    let validQuantities = [];
                    let validCategoryIds = [];
                    for (let i = 0; i < this.Quantity.length; i++) {
                        if (this.Quantity[i] != null && this.Quantity[i] !== '') {
                            validQuantities.push(this.Quantity[i]);
                        }
                    }
                    if (this.isUserLoggedIn) {
                        this.amount = this.discount;
                    } else {
                        this.amount = this.totalAmount;
                    }
                    const apiUrl = 'http://localhost:3000/create_payment_url';

                    const requestData = {
                        amount: this.amount,
                        language: 'vn',
                        tenKhachHang: this.HoTen,
                        emailKhachHang: this.Email,
                        SDTKhachHang: this.SDT,
                        ngayBatDau: this.checkInDate,
                        ngayKetThuc: this.checkOutDate,
                        soLuongKhach: this.numberOfGuests,
                        soNgayThue: this.totalDays,
                        SoLuongPhong: validQuantities,
                        idCategoryRoom: this.idCategoryRoom,
                    };
                    console.log(validQuantities)
                    this.showSpinner = true;
                    setTimeout(async () => {
                        try {
                            const response = await axios.post(apiUrl, requestData);
                            console.log(response.data);
                            if (response.data.redirectUrl) {
                                window.location.href = response.data.redirectUrl;
                            }
                            this.showSpinner = false;

                        } catch (error) {
                            if (error.response && error.response.data) {
                                const { message } = error.response.data;
                                this.$refs.toast.showToast(message);
                            } else {
                                this.$refs.toast.showToast('lỗi server');
                            }
                        } finally {
                            this.showSpinner = false;
                        }
                    }, 2000);

                } else {
                    let validQuantities = [];
                    for (let i = 0; i < this.Quantity.length; i++) {
                        if (this.Quantity[i] != null && this.Quantity[i] !== '') {
                            validQuantities.push(this.Quantity[i]);
                        }
                    }
                    console.log('thanh toán tại chỗ nghỉ')
                    const apiUrl = 'http://localhost:3000/datTruocPhong';
                    if (this.isUserLoggedIn) {
                        this.amount = this.discount;
                    } else {
                        this.amount = this.totalAmount;
                    }
                    const requestData = {
                        amount: this.amount,
                        tenKhachHang: this.HoTen,
                        emailKhachHang: this.Email,
                        SDTKhachHang: this.SDT,
                        ngayBatDau: this.checkInDate,
                        ngayKetThuc: this.checkOutDate,
                        soLuongKhach: this.numberOfGuests,
                        soNgayThue: this.totalDays,
                        SoLuongPhong: validQuantities,
                        idCategoryRoom: this.idCategoryRoom,
                    };
                    try {
                        this.showSpinner = true;
                        setTimeout(async () => {
                            try {
                                const response = await axios.post(apiUrl, requestData, { timeout: 2000 }); // Thêm cấu hình timeout cho yêu cầu HTTP
                                console.log(response.data);
                                localStorage.setItem('bookingData', JSON.stringify(response.data));
                                this.$router.push({
                                    name: 'BookRoomReserve',
                                    query: { bookingID: response.data.bookingRoom.maHoaDon },
                                });
                            } catch (error) {
                                if (error.response && error.response.data) {
                                    const { message } = error.response.data;
                                    this.$refs.toast.showToast(message);
                                } else {
                                    this.$refs.toast.showToast('lỗi server');
                                }
                            } finally {
                                this.showSpinner = false;
                            }
                        }, 2000);
                    } catch (error) {
                        // Xử lý lỗi ngoại lệ không liên quan đến axios
                    }


                }
            }
        },
        // loadUserInfo() {
        //     if (localStorage.getItem('user')) {
        //         const user = JSON.parse(localStorage.getItem('user'));
        //         this.HoTen = user.HoVaTen || '';
        //         this.Email = user.email || '';
        //         this.SDT = user.Sdt || '';
        //         console.log(user)
        //         this.userInfo = user;
        //         this.isUserLoggedIn = true;
        //     }
        // },
        
        async loadUserInfo() {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const response = await this.$axios.get(`getUserById/${user.id}`);
                this.userInfo = response.data;
                this.HoTen = this.userInfo.HoVaTen;
                this.Email = this.userInfo.email;
                this.SDT = this.userInfo.Sdt;
                console.log(this.userInfo);
                this.isUserLoggedIn = true;
            } catch (error) {
                console.error(error);
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
        formatCurrency(value) {
            let val = (value / 1).toFixed(0).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        checkPhone() {
            if (this.SDT.length > 10) {
                this.SDT = this.SDT.slice(0, 10);
            }
        },
        CheckOPT() {
            if (this.OPT.length > 10) {
                this.OPT = this.OPT.slice(0, 10);
            }
        },
        async SendOPT() {
            const requestData = {
                emailKhachHang: this.Email,
            };
            try {
                await axios.post(requestData);
            } catch (error) {
                if (error.response && error.response.data) {
                    const { message } = error.response.data;
                    this.$refs.toast.showToast(message);
                } else {
                    this.$refs.toast.showToast('lỗi server');
                }
            }
        },

    }
};
</script>

      