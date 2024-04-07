<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">ĐĂNG NHẬP</div>
          <div class="card-body">
            <form @submit.prevent="login" class="login-form">
              <div class="form-group">
                <label for="username">Email</label>
                <input type="text" class="form-control" id="username" placeholder="Nhập email của bạn" v-model="email" required>
              </div>
              <div class="form-group">
                <label for="password">Mật khẩu</label>
                <input type="password" class="form-control" id="password" placeholder="Nhập mật khẩu"  v-model="password" required>
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
              <div class="social-login mt-3" @click="socialLogin('google')">
                <div class="btn btn-google">
                  <i class="fab fa-google"></i> Đăng nhập với Google
                </div>
              </div>
              <div class="register-link">
                Chưa có tài khoản?
                <router-link class="text-decoration-none" :to="{ name: 'DangKyTaiKhoan' }">
                  <button class="btn btn--large">Đăng ký</button>
                </router-link>
              </div>
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
      email: '',
      password: '',
    };
  },
  components: {
    toast,
  },
  methods: {
    async login() {
      try {
        const login = await this.$axios.post(`login`, {
          email: this.email,
          password: this.password,
        });
        if (login.status === 200) {
          // Lưu thông tin người dùng vào localStorage hoặc sessionStorage
          localStorage.setItem('user', JSON.stringify(login.data));
          localStorage.setItem('token', login.data.token);
          this.$refs.toast.showToast('Đăng nhập thành công.');
          this.$router.push({ name: 'customerIndexViews' });
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
    socialLogin(provider) {
      // Thực hiện đăng nhập bằng cách chuyển hướng đến trang đăng nhập của nhà cung cấp
      switch (provider) {
        case 'google':
          this.$router.push({ name: 'google-auth' });
          break;
        case 'facebook':
          this.$router.push({ name: 'facebook-auth' });
          break;
        default:
          break;
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
  
