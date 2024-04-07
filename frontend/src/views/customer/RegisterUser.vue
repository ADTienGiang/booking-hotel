<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">Đăng ký</div>
          <div class="card-body">
            <form @submit.prevent="login">
              <div class="form-group">
                <label for="username">Email</label>
                <input type="email" class="form-control" id="username" v-model="email" required>
              </div>
              <div class="form-group">
                <label for="username">Họ tên</label>
                <input type="text" class="form-control" id="username" v-model="username" required>
              </div>
              <div class="form-group">
                <label for="username">Số điện thoại</label>
                <input type="number" class="form-control" id="username" v-model="phone" required>
              </div>
              <div class="form-group">
                <label for="username">Địa chỉ</label>
                <input type="text" class="form-control" id="username" v-model="address" required>
              </div>
              <div class="form-group">
                <label for="username">Ngày sinh</label>
                <input type="date" class="form-control" id="username" v-model="NgaySinh" required>
              </div>
              <div class="form-group">
                <label for="password">Mật khẩu</label>
                <input type="password" class="form-control" id="password" v-model="password" required>
              </div>
              <button type="submit" class="btn btn-primary" @click="register">đăng ký</button>

              <!-- Thêm biểu tượng hình tròn và nút đăng nhập bằng Google -->
              <div class="mt-3" @click="socialLogin('google')">
                <div class="btn btn-google">
                  <i class="fab fa-google"></i>Tiếp tục với google
                </div>
              </div>
              <div>
               đã có tài khoản?
                <router-link class="text-decoration-none" :to="{ name: 'DangNhapNguoiDung' }"><button
                    class="btn btn--large">Đăng nhập</button></router-link>
              </div>
              <!-- Kết thúc phần thêm biểu tượng và nút đăng nhập Google -->
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <toast ref="toast"></toast>
</template>
<script>
import toast from '../../components/toast.vue';
export default {
  data() {
    return {
      username: '',
      password: '',
      address: '',
      phone: '',
      email: '',
      NgaySinh: '',
      Repassword: '',
    };
  },
  components: {
    toast,
  },
  methods: {
    async register() {
      if (!this.email) {
        this.$refs.toast.showToast('Email không được bỏ trống');
        return false;
      } else if (!this.username) {
        this.$refs.toast.showToast('Tên người dùng không được bỏ trống');
        return false;
      } else if (!this.phone) {
        this.$refs.toast.showToast('Số điện thoại không được bỏ trống');
        return false;
      } else if (!this.address) {
        this.$refs.toast.showToast('Địa chỉ không được bỏ trống');
        return false;
      } else if (!this.NgaySinh) {
        this.$refs.toast.showToast('Chưa nhập ngày sinh');
        return false;
      } else if (!this.password) {
        this.$refs.toast.showToast('Mật khẩu không được bỏ trống');
        return false;
      }
      try {
        const register = await this.$axios.post(
          `register`,
          {
            username: this.username,
            password: this.password,
            email: this.email,
            phone: this.phone,
            address: this.address,
            NgaySinh: this.NgaySinh
          }
        );
        if (register.status === 200) {
          this.$router.push({ name: 'DangNhapNguoiDung' });
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
  },
};
</script>
<style scoped>
* {
  font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}
.login-form {
  max-width: 400px;
  margin: 0 auto;
}

.card {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  background-color: #007bff;
  color: #fff;
  text-align: center;
  padding: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.btn-primary {
  width: 100%;
}

.btn-google {
  font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  background-color: #4285f4;
  color: #fff;
  width: 100%;
}
.btn--large{
  font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;

}
.social-login {
  text-align: center;
}

.register-link {
  margin-top: 15px;
  text-align: center;
}
</style>