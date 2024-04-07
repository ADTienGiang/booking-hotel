<template>
    <div class="container-xxl bg-white p-0">
        <Headers style="padding-bottom: 120px;" />
        <div class="container1111">
            <div class="content">
                <!-- Phần "info" -->
                <div class="info-section noidungsectionThongTin">
                    <div class="contenttopInfoUserPayment">Thông tin cá nhân</div>
                    <div class="hoTenVaDauSao">
                        <label for="ho" class="HoVaTen">Họ và tên</label>
                        <div class="asterisk">*</div>
                    </div>
                    <input type="text" id="ho" name="ho" class="info-input" placeholder="Nhập họ của bạn" required
                        v-model="HoVaTen">

                    <div class="hoTenVaDauSao">
                        <label for="ho" class="HoVaTen">Email</label>
                        <div class="asterisk">*</div>

                    </div>
                    <input type="email" id="email" name="email" class="info-input1" placeholder="Nhập địa chỉ email của bạn"
                        required v-model="email">
                    <div class="hoTenVaDauSao">
                        <label for="ho" class="HoVaTen">Số điện thoại</label>
                        <div class="asterisk">*</div>
                    </div>
                    <input type="text" id="soDienThoai" name="soDienThoai" class="info-input"
                        placeholder="Nhập số điện thoại của bạn" required v-model="Sdt" maxlength="10">

                    <div class="hoTenVaDauSao">
                        <label for="ho" class="HoVaTen">Địa chỉ</label>
                        <div class="asterisk">*</div>
                    </div>
                    <input type="text" id="soDienThoai" name="soDienThoai" class="info-input"
                        placeholder="Nhập số điện thoại của bạn" required v-model="DiaChi">
                    <div class="hoTenVaDauSao">
                        <label for="ho" class="HoVaTen">Ngày sinh</label>
                        <div class="asterisk">*</div>
                    </div>
                    <input type="date" id="soDienThoai" name="soDienThoai" class="info-input"
                        placeholder="Nhập số điện thoại của bạn" required v-model="ngaySinh">
                    <div class="hoTenVaDauSao">
                        <label for="ho" class="HoVaTen">Mật khẩu</label>
                        <div class="asterisk">*</div>
                    </div>
                    <input type="password" id="soDienThoai" name="soDienThoai" class="info-input"
                        placeholder="Nhập số điện thoại của bạn" required v-model="Matkhau">

                </div>

                <!-- Phần "payment" -->

                <div class="button-container">
                    <button type="submit" class="class1111111" @click="SubmitForm()">
                        Cập nhật thông tin
                    </button>
                </div>

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
            HoVaTen: '',
            email: '',
            Sdt: 0,
            Matkhau: '',
            DiaChi: '',
            ngaySinh: '',
            userInfo: [],
        };
    },
    mounted() {
        this.loadUserInfo();
    },

    methods: {
        async loadUserInfo() {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const response = await this.$axios.get(`getUserById/${user.id}`);
                this.userInfo = response.data;
                this.HoVaTen = this.userInfo.HoVaTen;
                this.email = this.userInfo.email;
                this.Sdt = this.userInfo.Sdt;
                this.DiaChi = this.userInfo.DiaChi;
                this.ngaySinh = this.userInfo.ngaySinh;
                this.Matkhau = this.userInfo.Matkhau;
                console.log(this.userInfo);
            } catch (error) {
                console.error(error);
            }
        },
        async SubmitForm() {
            try {
                if (!this.HoVaTen) {
                    this.$refs.toast.showToast('chưa nhập họ tên');
                    return;
                } else if (!this.email) {
                    this.$refs.toast.showToast('chưa nhập email');
                    return;
                } else if (!this.Sdt) {
                    this.$refs.toast.showToast('chưa nhập số điện thoại');
                    return;
                } else if (!this.DiaChi) {
                    this.$refs.toast.showToast('chưa nhập địa chỉ');
                    return;
                } else if (!this.ngaySinh) {
                    this.$refs.toast.showToast('chưa nhập ngày sinh');
                    return;
                } else if (!this.Matkhau) {
                    this.$refs.toast.showToast('chưa nhập mật khẩu');
                    return;
                }

                const user = JSON.parse(localStorage.getItem("user"));
                const response = await this.$axios.put(`updateUserById/${user.id}`, {
                    HoVaTen: this.HoVaTen,
                    email: this.email,
                    Sdt: this.Sdt,
                    DiaChi: this.DiaChi,
                    ngaySinh: this.ngaySinh,
                    Matkhau: this.Matkhau,
                });

                if (response && response.data) {
                    this.$refs.toast.showToast(response.data.message);
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    const { message } = error.response.data;
                    this.$refs.toast.showToast(message);
                } else {
                    this.$refs.toast.showToast('lỗi server');
                }
            }
        },
        checkPhone() {
            if (this.Sdt.length > 10) {
                this.Sdt = this.Sdt.slice(0, 10);
            }
        },
    }
};
</script>
<style scoped>
.noidungsectionThongTin {
    margin-left: 25%;
}

.class1111111 {
    margin-right: 40%;
    background-color: #007bff;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    height: 48px;
    width: 200px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.class1111111:hover {
    background-color: #0450a1;

}
</style>