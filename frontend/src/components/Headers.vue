<template>
    <!-- Header Start -->
    <div class="container-fluid bg-dark px-0 headerStyle">
        <div class="row gx-0">
            <div class="col-lg-3 bg-dark d-none d-lg-block">
                <a href="/" class="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center">
                    <h1 class="m-0 text-primary text-uppercase">BOOKING</h1>
                </a>
            </div>
            <div class="col-lg-9">
                <div class="row gx-0 bg-white d-none d-lg-flex">
                    <div class="col-lg-7 px-5 text-start">
                        <div class="h-100 d-inline-flex align-items-center py-2 me-4">
                            <i class="fa fa-envelope text-primary me-2"></i>
                            <p class="mb-0">booking@gmail.com</p>
                        </div>
                        <div class="h-100 d-inline-flex align-items-center py-2">
                            <i class="fa fa-phone-alt text-primary me-2"></i>
                            <p class="mb-0">0904456003</p>
                        </div>
                    </div>
                    <div class="col-lg-5 px-5 text-end">
                        <div class="d-inline-flex align-items-center py-2">
                            <a class="me-3" href=""><i class="fab fa-facebook-f"></i></a>
                            <a class="me-3" href=""><i class="fab fa-twitter"></i></a>
                            <a class="me-3" href=""><i class="fab fa-linkedin-in"></i></a>
                            <a class="me-3" href=""><i class="fab fa-instagram"></i></a>
                            <a class="" href=""><i class="fab fa-youtube"></i></a>
                        </div>
                    </div>
                </div>
                <nav class="navbar navbar-expand-lg bg-dark navbar-dark p-3 p-lg-0">
                    <a href="/" class="navbar-brand d-block d-lg-none">
                        <h1 class="m-0 text-primary text-uppercase">BOOKING</h1>
                    </a>
                    <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                        <div class="navbar-nav mr-auto py-0">
                            <a class="nav-item nav-link active"><router-link  to="/">Trang chủ</router-link></a>
                            <a  class="nav-item nav-link"><router-link  to="/DetailSeenHotel">Phòng đã xem</router-link></a>
                            <a  class="nav-item nav-link"><router-link  to="/DetailLikeHotel">Phòng đã thích</router-link></a>
                            <a  class="nav-item nav-link"><router-link  to="/DetailOrderRoom">Hóa đơn</router-link></a>
                            <a  class="nav-item nav-link"><router-link  to="/InfomationUser">Tài khoản</router-link></a>
                        </div>
                        <div v-if="isLoggedIn" class="d-lg-block">
                            <div class="dropdownTaiKhoan">
                                <div id="app" class="dropdown">
                                    <div class="dropdown-toggle dropdownTaiKhoan-item" data-bs-toggle="dropdown">
                                        <img :src="avatarUrl" alt="Avatar" class="anhDaiHienLogin">
                                        <span class="tenKhachHang">{{ this.userInfo.HoVaTen }}</span>
                                    </div>
                                    <div class="dropdown-menu" id="customDropdown">
                                        <a class="dropdown-item"> <router-link  to="/DetailSeenHotel">Phòng đã xem</router-link></a>
                                        <a class="dropdown-item"> <router-link  to="/DetailLikeHotel">Phòng đã thích</router-link></a>
                                        <a class="dropdown-item">  <router-link  to="/DetailOrderRoom">Chi tiết hóa đơn</router-link></a>
                                        <a class="dropdown-item"><router-link  to="/InfomationUser">Tài khoản</router-link></a>
                                        <a class="dropdown-item" @click="logout">Đăng xuất</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Nếu chưa đăng nhập, hiển thị nút "Đăng nhập" và "Đăng ký" -->
                        <router-link v-if="!isLoggedIn" to="/dang-nhap" class="">Đăng
                            nhập</router-link>
                            <router-link v-if="!isLoggedIn" to="/dang-ky" class="">Đăng
                            ký</router-link>
                    </div>
                </nav>
            </div>
        </div>
    </div>
    <!-- Header End -->
</template>
<script>
import toast from './toast.vue';
import imgDefault from '../assets/img/avt/default-avatar.jpg'
export default {
    components:
    {
        toast
    },
    data() {
        return {
            isLoggedIn: false,
            isDropdownOpen: false,
            userInfo : []
        }
    },
    mounted() {
        this.luuVaoLocalStorage();
        this.checkLoggedIn();
        this.getUserByLocalStorage()
    },
    computed: {
    avatarUrl() {
      // Nếu avtUrl là 'default', trả về đường dẫn mặc định, nếu không trả về giá trị của avtUrl
      return this.userInfo.avtUrl === 'default' 
        ? imgDefault 
        : this.userInfo.avtUrl;
    }
  },
    methods:
    {
        luuVaoLocalStorage() {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const token_gg = urlParams.get('token_gg');
            const user_inf_gg = urlParams.get('user_inf_gg');
            if (token_gg && user_inf_gg) {
                localStorage.setItem('token', token_gg);
                const user = JSON.parse(decodeURIComponent(user_inf_gg));
                localStorage.setItem('user', JSON.stringify(user));
            }
        },
        getUserByLocalStorage(){
            const user = JSON.parse(localStorage.getItem('user')); // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
            this.userInfo = user;
        },
        checkLoggedIn() {
            // Kiểm tra trạng thái đăng nhập từ localStorage hoặc nơi khác
            const token = localStorage.getItem('token');
            if (token) {
                // Nếu có token, người dùng đã đăng nhập
                this.isLoggedIn = true;
            } else {
                // Nếu không có token, người dùng chưa đăng nhập
                this.isLoggedIn = false;
            }
        },
        logout() {
            // Thực hiện xử lý đăng xuất ở đây (xóa token và thông tin người dùng khỏi localStorage)
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.isLoggedIn = false;
            this.$router.push('/');
        },
        handleButtonClick() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
    }
};
</script>

<style scoped>
.headerStyle {
    height: 120px;
}

.dangxuat {
    margin-top: 0;
    margin-right: 10px;
}
.dropdownTaiKhoan {
    user-select: none;
    width: 200px;
    cursor: pointer;
}

.tenKhachHang {
    margin-left: 10px;
    color: #FFFFFF;
    font-weight: 500;
}
.dropdownTaiKhoan-item{
    padding: 10px;
    border-radius: 5px;
    margin-right: 10px;
}
.dropdownTaiKhoan-item:hover{
    
    background-color: #182444;
}
</style>