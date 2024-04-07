<template>
  <p>Banner hiện tại</p>
  <div class="d-flex bannerAdmin">
    <div :class="{ active: index === 0 }" v-for="(banner, index) in banners" :key="index">
      <div class="remove_img_modal" @click="removeBanner(banner.id)">
        <i class='bx bxs-x-square'></i>
      </div>
      <img :src="banner.url" :alt="banner.provider" />
    </div>

  </div>

  <div class="container">
    <form @submit.prevent="submitForm">
      <div>
        <label for="upload">
          <input type="file" id="upload" multiple @change="handleFileChange" accept="image/*">
          Chọn hình ảnh (tối đa 20 ảnh)
        </label>
      </div>
      <div class="files">
        <h2>Hình đã chọn</h2>
        <ul>
          <li v-for="(file, index) in filesArr" :key="index">
            <img :src="getFileUrl(file)" alt="Selected File" class="file-image" style="width: 100px;" />
            <span class="file-size">{{ getFileSize(file.size) }}</span>
            <i class='bx bx-message-square-x' @click="removeFile(index)"></i>
          </li>
        </ul>
      </div>

      <input type="submit" value="Gửi" name="submit" />
    </form>
  </div>
  <toast ref="toast"></toast>
</template>

<script>
import toast from '../../components/toast.vue';
export default {
  data() {
    return {
      files: [],
      filesArr: [],
      banners: [],
    };
  },
  components: {
    toast,
  },
  async created() {
    // Gọi hàm để lấy danh sách banner từ server
    await this.getBannerData();
  },
  methods: {
    async getBannerData() {
      try {
        // Gọi API để lấy danh sách banner từ server
        const response = await this.$axios.get('getBanner');
        this.banners = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách banner từ server', error);
      }
    },



    getFileUrl(file) {
      return URL.createObjectURL(file);
    },
    handleFileChange(event) {
      const files = event.target.files;
      const filesArr = Array.from(files);
      this.files = files;
      this.filesArr = filesArr;
    },
    removeFile(index) {
      URL.revokeObjectURL(this.getFileUrl(this.filesArr[index])); // Giải phóng URL
      this.filesArr.splice(index, 1);
    },
    async removeBanner(bannerId) {
      console.log(bannerId);

      if (this.banners) {
        const index = this.banners.findIndex(banner => banner.id === bannerId);

        if (index !== -1) {
          // Sử dụng splice để xóa banner khỏi mảng
          this.banners.splice(index, 1);

          // Gửi yêu cầu HTTP để xóa banner khỏi cơ sở dữ liệu
          await this.$axios.delete(`deleteBanner/${bannerId}`)
            .then((response) => {
              this.$refs.toast.showToast(response.data.message);
            })
            .catch((error) => {
              console.error('Lỗi khi xóa banner:', error);
            });
        }
      }
    },

    async submitForm() {
      try {
        if (this.filesArr.length === 0) {
          this.$refs.toast.showToast('vui lòng chọn banner');
        } else {
          // Tạo một đối tượng FormData để chứa các tệp hình ảnh đã chọn
          const formData = new FormData();

          // Thêm từng tệp vào formData
          this.filesArr.forEach((file) => {
            formData.append('avatar', file);
          });

          // Sử dụng Axios để thực hiện POST request lên máy chủ
          const response = await this.$axios.post('addBanner', formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Đặt header cho dạng FormData
            },
          });

          // Xóa danh sách các tệp đã chọn sau khi tải lên thành công 
          this.filesArr = [];

          // In thông báo hoặc thực hiện các tác vụ khác sau khi tải lên thành công
          this.$refs.toast.showToast(response.data.message);

          // Sau khi thêm banner thành công, gọi lại hàm để cập nhật danh sách banner
          await this.getBannerData();
        }


      } catch (error) {
        console.error('Lỗi khi tải lên banner', error);
      }
    },


    getFileSize(size) {
      let suffix = "bytes";
      if (size >= 1024 && size < 1024000) {
        suffix = "KB";
        size = Math.round((size / 1024) * 100) / 100;
      } else if (size >= 1024000) {
        suffix = "MB";
        size = Math.round((size / 1024000) * 100) / 100;
      }
      return `${size} ${suffix}`;
    },
  },
};
</script>




<style scoped>
.bannerAdmin img {
  width: 200px;
  margin-right: 10px;
  height: auto;
}

.bannerAdmin {
  width: 700px;
  height: 200px;
  overflow-y: scroll;
}








* {
  box-sizing: border-box;
}

input[type=file] {
  position: absolute;
  right: -9999px;
  visibility: hidden;
  opacity: 0;
}

input[type=submit] {
  position: relative;
  padding: 1rem 3rem;
  background: #0c8fda;
  display: inline-block;
  text-align: center;
  overflow: hidden;
  border-radius: 10px;
  border: 0;
  color: #fff;
}

input[type=submit]:hover {
  background: #0b7fc2;
  color: #fff;
  cursor: pointer;
  transition: 0.2s all;
}

label {
  position: relative;
  padding: 1rem 3rem;
  background: #eee;
  display: inline-block;
  text-align: center;
  overflow: hidden;
  border-radius: 10px;
}

label:hover {
  background: #0c8fda;
  color: #fff;
  cursor: pointer;
  transition: 0.2s all;
}

div.files {
  background: #eee;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 10px;
}

div.files ul {
  list-style: none;
  padding: 0;
  max-height: 150px;
  overflow: auto;
}

div.files ul li {
  padding: 0.5rem 0;
  padding-right: 2rem;
  position: relative;
}

div.files ul li i {
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translatey(-50%);
}

div.container {
  width: 100%;
  padding: 0 2rem;
}

span.file-size {
  color: #999;
  padding-left: 0.5rem;
}
</style>