<template>
  <div class="container">
    <div class="table-wrapper">
      <div class="table-title">
        <div class="row">
          <div class="col-sm-6">
            <h2>Quản lý <b>khách hàng</b></h2>
          </div>
        </div>
      </div>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Họ và tên:</th>
            <th>Email:</th>
            <th>Địa chỉ:</th>
            <th>Số điện thoại:</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users">
            <td>{{ user.HoVaTen }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.DiaChi }}</td>
            <td>0{{ user.Sdt }}</td>
            <!-- <td>
              <a class="delete" @click="deleteUser(user.id)">
                <i class="fa-solid fa-trash-can"></i>
              </a>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <toast ref="toast"></toast>
  <!-- Edit Modal HTML -->
  <div class="modal fade" id="exampleModaledit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Sửa thông tin khách hàng</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Họ và tên:</label>
            <input type="text" class="form-control" v-model="username">
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" class="form-control" v-model="email">
          </div>
          <div class="form-group">
            <label>Địa chỉ:</label>
            <textarea class="form-control" v-model="address"></textarea>
          </div>
          <div class="form-group">
            <label>Số điện thoại:</label>
            <input type="text" class="form-control" v-model="phone">
          </div>
          <div class="form-group">
            <label>Mật khẩu mới:</label>
            <input type="text" class="form-control" v-model="password">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          <button type="button" class="btn btn-primary" @click="updateUser">Sửa</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import toast from '../../components/toast.vue';
export default {
  data() {
    return {
      users: [],

    }
  },
  components: {
    toast
  },
  async mounted() {
    await this.getAllUser();
  },
  methods: {
    async getAllUser() {
      try {
        const response = await this.$axios.get(`getall`);
        this.users = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getUserById(userId) {
      try {
        const response = await this.$axios.get(`getUserById/${userId}`);
        this.editUserData = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    created() {
      this.getUserById(this.$route.params.id);
    },
    async deleteUser(id) {
      const userConfirmed = confirm("Bạn có chắc chắn muốn xóa người dùng này?");
      if (userConfirmed) {
        try {
          const response = await this.$axios.delete(
            `deleteUser/` + id
          );
          this.$refs.toast.showToast(response.data.message);
          this.getAllUser();
        } catch (error) {
          if (error.response && error.response.data) {
            const { message } = error.response.data;
            this.$refs.toast.showToast(message);
          } else {
            this.$refs.toast.showToast('lỗi server');
          }
        }
      } else {

      }
    }
  }
}
</script>
