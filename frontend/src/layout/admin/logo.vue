<template>
    <div class="d-flex">
        <p>Logo hiện tại</p>
    <div class="d-flex LogoAdmin">
      <div :class="{ active: index === 0 }" v-for="(banner, index) in logo" :key="index">
        <div class="remove_img_modal" @click="removeLogo(banner.id)">
          <i class='bx bxs-x-square'></i>
        </div>
        <img :src="banner.url" :alt="banner.logo" />
      </div>
    </div>
    <div class="containerlogo d-flex">
      <form @submit.prevent="submitForm">
        <div>
          <label for="upload">
            <input type="file" id="upload" multiple @change="handleFileChange" accept="image/*">
            Chọn logo
          </label>
        </div>
        <div class="files">
          <p>Hình đã chọn</p>
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
        logo: [],
      };
    },
    components: {
      toast,
    },
    async created() {
      await this.getLogoData();
    },
    methods: {
      async getLogoData() {
        try {
          // Gọi API để lấy danh sách banner từ server
          const response = await this.$axios.get('getLogo');
          this.logo = response.data;
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
      async removeLogo(LogoId) {
        console.log(LogoId);
  
        if (this.logo) {
          const index = this.logo.findIndex(logo => logo.id === LogoId);
  
          if (index !== -1) {
            this.logo.splice(index, 1);
            await this.$axios.delete(`deleteLogo/${LogoId}`)
              .then((response) => {
                this.$refs.toast.showToast(response.data.message);
              })
              .catch((error) => {
                console.error('Lỗi khi xóa logo:', error);
              });
          }
        }
      },
  
      async submitForm() {
      try {
        if (this.filesArr.length === 0) {
          this.$refs.toast.showToast('vui lòng chọn logo');
        } else {
          const formData = new FormData();
          this.filesArr.forEach((file) => {
            formData.append('avatar', file);
          });
          const response = await this.$axios.post('addLogo', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          this.filesArr = [];
          this.$refs.toast.showToast(response.data.message);
          await this.getLogoData();
        }

      } catch (error) {
        console.error('Lỗi khi tải lên logo', error);
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
  .LogoAdmin img {
    width: 200px;
    margin-right: 10px;
    height: auto;
  }
  
  .LogoAdmin {
    width: 300px;
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
  
  div.containerlogo {
    width: 100%;
    padding: 0 2rem;
  }
  
  span.file-size {
    color: #999;
    padding-left: 0.5rem;
  }
  </style>