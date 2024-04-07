
<template>
  <div class="container">
    <div class="table-wrapper">
      <div class="table-title">
        <div class="row">
          <h2>Quản lý <b>KHÁCH SẠN</b></h2>
          <a type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
            @click="setDefault"><i class="fa-solid fa-circle-plus"></i> <span>Thêm khách sạn</span></a>
        </div>
      </div>
      <div class="table-container">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Tên tỉnh:</th>
            <th>Tên KS:</th>
            <th>SĐT:</th>
            <th>Địa chỉ:</th>
            <th>Tiện ích:</th>
            <th>Kinh độ:</th>
            <th>Vĩ độ:</th>
            <th>Hình ảnh:</th>
            <th>Sự kiện:</th>
          </tr>
        </thead>
        <tbody v-for="f in hotels" :key="f.id">
          <tr>
            <td><div class="max-width-td">{{ f.tinhThanh.tenTinhThanh }}</div></td>
            <td ><div class="max-width-td">{{ f.tenKhachSan }}</div></td>
            <td>{{ f.dienThoai }}</td>
            <td ><div class="max-width-td"> {{ f.diaChi }}</div></td>
            <td>
              <div class="max-width-td" v-html="f.tienIch"></div>
            </td>
            <td><div class="max-width-td">{{ f.kinhdo }}</div></td>
            <td><div class="max-width-td">{{ f.vido }}</div></td>
            <td>
              <div class="image-container">
                <div class="image-list">
                  <div v-for="(image, index) in f.images.slice(0, 1)" :key="index" class="image-item">
                    <img :src="image.duongDan" alt="">
                  </div>
                </div>
              </div>
            </td>
            <td>
              <a type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModaledit">
                <i class="fa-solid fa-spinner" @click="sendata(f)"></i>
              </a>
              <a class="delete" @click="deleteHotel(f.id)">
                <i class="fa-solid fa-trash-can"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </div>
  <toast ref="toast"></toast>
  <!-- Add Modal HTML -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm khách sạn</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <div class="form-group">
              <div class="row row-content">
                <div class="col-md-12">
                  <label>Tên khách sạn</label>
                  <input type="text" placeholder="Tên khách sạn" class="form-control" v-model="tenKS">
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row row-content">
                <div class="col-md-4">
                  <label>Địa chỉ</label>
                  <input v-model="diaChi" type="text" placeholder="Nhập địa chỉ" class="form-control">
                </div>
                <div class="col-md-4">
                  <label>Điện thoại</label>
                  <input type="text" placeholder="Điện thoại" class="form-control" v-model="sdt" @input="checkPhone"
                    pattern="\d*" maxlength="10">
                </div>
                <div class="col-md-4">
                  <label for="tinhthanh">Tỉnh thành</label>
                  <select id="tinhthanh" v-model="selectedProvince" class="form-control custom-select">
                    <option disabled value="">Chọn tỉnh thành</option>
                    <option v-for="province in provinces" :key="province.id" :value="province">
                      {{ province.tenTinhThanh }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row row-content">
                <div class="col-md-12">
                  <label for="tienIch">Tiện ích</label>
                  <textarea id="textareaAdd" v-model="tienIch"></textarea>
                </div>

              </div>
            </div>
            <div class="form-group">
              <div class="row row-content">
              </div>
            </div>
            <div class="form-group">
              <div class="row row-content">
                <div class="col-md-12">
                  <label>Hình ảnh</label>

                  <div>
                    <label for="upload">
                      <input type="file" id="upload" multiple @change="handleFileChange" accept="image/*">
                    </label>
                  </div>
                  <div class="files">
                    <h6>Hình đã chọn</h6>
                    <ul>
                      <li v-for="(file, index) in filesArr" :key="index">
                        <img :src="file.url" alt="Selected File" class="file-image" style="width: 100px;" />
                        <span class="file-size">{{ getFileSize(file.size) }}</span>
                        <i class='bx bx-message-square-x' @click="removeFile(index)">Xóa ảnh</i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          <button type="submit" class="btn btn-primary" @click="submitForm()">Thêm</button>
        </div>
      </div>

    </div>
  </div>
  <!-- Edit Modal HTML -->
  <div class="modal fade" id="exampleModaledit" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Chỉnh sửa khách sạn</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="updateHotel">
          <div class="modal-body">
            <div class="form-group">
              <div class="row row-content">
                <div class="col-md-4">
                  <label>Tên khách sạn</label>
                  <input type="text" placeholder="Tên khách sạn" class="form-control" v-model="tenKS">
                </div>
                <div class="col-md-4">
                  <label>Địa chỉ</label>
                  <input type="text" placeholder="Địa chỉ" class="form-control" v-model="diaChi">
                </div>
                <div class="col-md-2">
                  <label>Điện thoại</label>
                  <input type="text" placeholder="Điện thoại" class="form-control" v-model="sdt">
                </div>
                <div class="col-md-2">
                  <label>Tỉnh thành</label>
                  <select v-model="selectedProvince" class="form-control">
                    <option disabled value="">Chọn tỉnh thành</option>
                    <option v-for="province in provinces" :key="province.id" :value="province">
                      {{ province.tenTinhThanh }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row row-content">
                <div class="col-md-6">
                  <label>Kinh độ</label>
                  <input type="text" placeholder="Kinh độ" class="form-control" v-model="kinhDo" disabled>
                </div>
                <div class="col-md-6">
                  <label>Vĩ độ</label>
                  <input type="text" placeholder="Vĩ độ" class="form-control" v-model="viDo" disabled>
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="row row-content">
                <div class="col-md-6">
                  <label for="tienIch">Tiện ích</label>
                  <textarea id="textareaEdit" v-model="tienIch"></textarea>
                </div>
                <div class="col-md-6">
                  <div>
                    <a @click="search()">Tìm Kiếm</a>
                    <MapboxMap ref="mapboxRef" style="height: 400px" :access-token="mapboxToken"
                      map-style="mapbox://styles/mapbox/streets-v11" :zoom="1">
                      <MapboxMarker :lng-lat="location" />
                    </MapboxMap>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectedProduct" class="d-flex hinhanhadminchinhsua">
              <div v-for="(imageUrl, index) in selectedProduct.images" :key="index">
                <img :src="imageUrl.duongDan" alt="" style="width: 80px; height: 80px; margin: 10px;">
                <div class="remove_img_modal" @click="removeImage(imageUrl.id)">
                  <button>Xóa ảnh</button>
                </div>
              </div>
            </div>
            <div>
              <label for="upload">
                <input type="file" id="upload" multiple @change="handleFileChange" accept="image/*">
                Chọn hình ảnh (tối đa 20 ảnh)
              </label>
            </div>
            <div class="files">
              <h6>Hình đã chọn</h6>
              <ul>
                <li v-for="(file, index) in filesArr" :key="index">
                  <img :src="file.url" alt="Selected File" class="file-image" style="width: 100px;" />
                  <span class="file-size">{{ getFileSize(file.size) }}</span>
                  <i class='bx bx-message-square-x' @click="removeFile(index)"></i>
                </li>
              </ul>
            </div>
          </div>
        </form>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          <button type="submit" class="btn btn-primary" @click="updateHotel()">Cập nhật</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { ref } from 'vue';
import axios from 'axios';
import { MapboxMap, MapboxMarker } from '@studiometa/vue-mapbox-gl';
import toast from '../../components/toast.vue';
export default {
  async mounted() {
    await this.getHotel();
    await this.getProvince();
    const self = this;
    tinymce.init({
      selector: '#textareaAdd',
      plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
      toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
      tinycomments_mode: 'embedded',
      tinycomments_author: 'Author name',
      mergetags_list: [
        { value: 'First.Name', title: 'First Name' },
        { value: 'Email', title: 'Email' },
      ],
      ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
      // Dưới đây là danh sách tất cả các thuộc tính của TinyMCE
      branding: false, // Tắt branding
      menubar: 'file edit view insert format tools table tc help',
      height: 500, // Chiều cao của trình soạn thảo
      width: '100%', // Chiều rộng của trình soạn thảo
      language: 'vi', // Ngôn ngữ
      skin: 'oxide-dark', // Giao diện
      content_css: 'dark.css', // CSS cho nội dung
      resize: 'both', // Điều chỉnh kích thước
      branding: false, // Tắt branding TinyMCE
      autosave_ask_before_unload: true, // Hỏi trước khi thoát khi có dữ liệu không được lưu
      autosave_interval: '20s', // Khoảng thời gian tự động lưu
      paste_data_images: true, // Cho phép dán hình ảnh từ clipboard
      // ... và nhiều thuộc tính khác
      setup(editor) {
        // Xử lý sự kiện change trong TinyMCE
        editor.on('change', () => {
          // Cập nhật biến content với nội dung từ TinyMCE
          self.tienIch = editor.getContent();
        });
      },
    });
    tinymce.init({
      selector: '#textareaEdit',
      plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
      toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
      tinycomments_mode: 'embedded',
      tinycomments_author: 'Author name',
      mergetags_list: [
        { value: 'First.Name', title: 'First Name' },
        { value: 'Email', title: 'Email' },
      ],
      ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
      // Dưới đây là danh sách tất cả các thuộc tính của TinyMCE
      branding: false, // Tắt branding
      menubar: 'file edit view insert format tools table tc help',
      height: 500, // Chiều cao của trình soạn thảo
      width: '100%', // Chiều rộng của trình soạn thảo
      language: 'vi', // Ngôn ngữ
      skin: 'oxide-dark', // Giao diện
      content_css: 'dark.css', // CSS cho nội dung
      resize: 'both', // Điều chỉnh kích thước
      branding: false, // Tắt branding TinyMCE
      autosave_ask_before_unload: true, // Hỏi trước khi thoát khi có dữ liệu không được lưu
      autosave_interval: '20s', // Khoảng thời gian tự động lưu
      paste_data_images: true, // Cho phép dán hình ảnh từ clipboard
      // ... và nhiều thuộc tính khác
      setup(editor) {
        // Xử lý sự kiện change trong TinyMCE
        editor.on('change', () => {
          // Cập nhật biến content với nội dung từ TinyMCE
          self.tienIch = editor.getContent();
        });
      },
    });
    this.mapboxRef = ref(this.$refs.mapboxRef);
  },
  data() {
    return {
      id: '',
      tenKS: '',
      tenHinh: '',
      diaChi: ref(''),
      sdt: '',
      kinhDo: '',
      viDo: '',
      tienIch: '',
      files: [],
      filesArr: [],
      hotels: [],
      selectedProduct: null,
      provinces: [],
      province: [],
      selectedProvince: null,
      mapboxToken: import.meta.env.VITE_TOKEN_MAPBOX,
      location: [0, 0],
      mapboxRef: ref(null),
    };
  },
  components: {
    toast,
    MapboxMap,
    MapboxMarker,
  },
  methods: {
    
    async getHotel() {
      try {
        const response = await this.$axios.get(`getHotel`);
        this.hotels = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getProvince() {
      try {
        const response = await this.$axios.get(`getProvince`);
        this.provinces = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async sendata(product) {
      this.id = product.id;
      this.selectedProduct = product;
      this.tenKS = product.tenKhachSan;
      this.diaChi = product.diaChi;
      this.sdt = product.dienThoai;
      this.kinhDo = product.kinhdo;
      this.viDo = product.vido;
      this.tienIch = product.tienIch;
      tinymce.get('textareaEdit').setContent(this.tienIch);
      if (this.provinces && this.provinces.length > 0) {
        const matchedProvince = this.provinces.find(province => province.id === product.MaTinh);
        if (matchedProvince) {
          this.selectedProvince = matchedProvince;
        }
      }
      await this.search();
    },
    async search() {
      try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(this.diaChi)}.json?access_token=${this.mapboxToken}`);
        if (response.data.features.length > 0) {
          const firstResult = response.data.features[0];
          const lngLat = {
            lng: firstResult.center[0],
            lat: firstResult.center[1],
          };
          this.createMarker(lngLat);
        } else {
          console.error('Không tìm thấy địa chỉ');
        }
      } catch (error) {
        console.error('Lỗi geocoding: ', error);
      }
    },
    createMarker(lngLat) {
      this.location = [lngLat.lng, lngLat.lat];
      console.log(this.mapboxRef.map)
      if (this.mapboxRef && this.mapboxRef.map) {
        this.mapboxRef.map.flyTo({
          center: [lngLat.lng, lngLat.lat],
          zoom: 10,
          essential: true,
        });
      }
      this.kinhDo = lngLat.lng;
      this.viDo = lngLat.lat;
    },
  
    removeFile(index) {
      URL.revokeObjectURL(this.getFileUrl(this.filesArr[index])); // Giải phóng URL
      this.filesArr.splice(index, 1);
    },
    getFileUrl(file) {
      return URL.createObjectURL(file);
    },
    async submitForm() {
      await this.search();
      try {
        if (this.filesArr.length === 0) {
          this.$refs.toast.showToast('vui lòng chọn hình ảnh khách sạn');
        } else if (!this.tenKS) {
          this.$refs.toast.showToast('chưa nhập tên khách sạn');
          return;
        } else if (!this.diaChi) {
          this.$refs.toast.showToast('chưa nhập địa chỉ');
          return;
        } else if (!this.sdt) {
          this.$refs.toast.showToast('chưa nhập số điện thoại');
          return;
        } else if (!this.tienIch) {
          this.$refs.toast.showToast('chưa nhập tiện ích');
          return;
        } else if (!this.selectedProvince) {
          this.$refs.toast.showToast('chưa chọn tỉnh thành');
          return;
        }
        const formData = new FormData();
        console.log(this.tenHinh.length);
        for (let i = 0; i < this.tenHinh.length; i++) {
          const file = this.tenHinh[i];
          formData.append('tenHinh', file);
        }
        formData.append('tenTinh', this.selectedProvince.tenTinhThanh);
        formData.append('MaTinh', this.selectedProvince.id);
        formData.append('tenKhachSan', this.tenKS);
        formData.append('dienThoai', this.sdt);
        formData.append('tienIch', this.tienIch);
        formData.append('diaChi', this.diaChi);
        formData.append('kinhDo', this.kinhDo);
        formData.append('viDo', this.viDo);
        console.log('kinh do la : ' + this.kinhDo)

        try {
          const response = await this.$axios.post(
            'addHotel',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
            }
          );
          this.$refs.toast.showToast(response.data.message);
          this.getHotel();
        } catch (error) {
          this.$refs.toast.showToast('trùng kinh độ và vĩ độ');
        }
      } catch (error) {
        alert(error)
      }
    },
    async updateHotel() {
      try {
        if (!this.tenKS) {
          this.$refs.toast.showToast('chưa nhập tên khách sạn');
          return;
        } else if (!this.diaChi) {
          this.$refs.toast.showToast('chưa nhập địa chỉ');
          return;
        } else if (!this.sdt) {
          this.$refs.toast.showToast('chưa nhập số điện thoại');
          return;
        } else if (!this.tienIch) {
          this.$refs.toast.showToast('chưa nhập tiện ích');
          return;
        }
        const formData = new FormData();
        if (this.tenHinh && this.tenHinh.length > 0) {
          for (let i = 0; i < this.tenHinh.length; i++) {
            const file = this.tenHinh[i];
            formData.append('tenHinh', file);
          }
        }
        console.log(this.selectedProvince.tenTinhThanh)
        formData.append('tenTinh', this.selectedProvince.tenTinhThanh);
        formData.append('MaTinh', this.selectedProvince.id);
        formData.append('tenKhachSan', this.tenKS);
        formData.append('dienThoai', this.sdt);
        formData.append('tienIch', this.tienIch);
        formData.append('diaChi', this.diaChi);
        formData.append('kinhDo', this.kinhDo);
        formData.append('viDo', this.viDo);

        try {
          const productupdate = await this.$axios.put(
            'updateHotel/' + this.id,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          this.$refs.toast.showToast(productupdate.data.message);
          this.getHotel();
        } catch (error) {
          console.error('Lỗi khi cập nhật khách sạn:', error);
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật khách sạn:', error);
      }
    },
    setDefault() {
      this.id = '';
      this.selectedProduct = '';
      this.tenKS = '';
      this.diaChi = '';
      this.sdt = '';
      this.kinhDo = '';
      this.viDo = '';
      this.tienIch = '';
      this.filesArr = [];
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
    async removeImage(imageId) {
      console.log(imageId);

      if (this.selectedProduct && this.selectedProduct.images) {
        const index = this.selectedProduct.images.findIndex(image => image.id === imageId);

        if (index !== -1) {
          // Sử dụng splice để xóa hình ảnh khỏi mảng
          this.selectedProduct.images.splice(index, 1);

          // Gửi yêu cầu HTTP để xóa hình ảnh khỏi cơ sở dữ liệu
          await this.$axios.delete(`deleteImage/${imageId}`)
            .then((response) => {
              this.$refs.toast.showToast(response.data.message);
            })
            .catch((error) => {
              console.error('Lỗi khi xóa hình ảnh:', error);
            });
        }
      }
    },
    handleFileChange(event) {
      const files = event.target.files;
      this.tenHinh = files;

      const filesArr = Array.from(files);

      // Lặp qua danh sách các tệp để tạo URL cho từng tệp
      for (let i = 0; i < filesArr.length; i++) {
        const file = filesArr[i];
        file.url = URL.createObjectURL(file); // Thêm thuộc tính url vào tệp
      }

      this.filesArr = filesArr;
    },
    checkPhone() {
      this.sdt = this.sdt.replace(/[^\d]/g, '');
      if (this.sdt.length > 10) {
        this.sdt = this.sdt.slice(0, 10);
      }
    },
    async deleteHotel(id) {
      const userConfirmed = confirm("Bạn có chắc chắn muốn xóa khách sạn này?");
      if (userConfirmed) {
        try {
          const response = await this.$axios.delete(
            `deleteHotel/` + id
          );
          console.log(response.data.message)
          this.$refs.toast.showToast(response.data.message);
          this.getHotel();
        } catch (error) {
          if (error.response && error.response.data) {
            const { message } = error.response.data;
            this.$refs.toast.showToast(message);
          } else {
            this.$refs.toast.showToast('lỗi server');
          }
        }
      }else{
        
      }
    }
  },
};
</script>
<style scoped>
@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25%,
  75% {
    transform: translateX(-5px);
  }

  50% {
    transform: translateX(5px);
  }
}

.shake {
  animation: shake 0.5s ease-in-out;
}

.custom-select {
  height: auto;
  padding: 0.375rem 1.75rem 0.375rem 0.75rem;
  /* Điều chỉnh padding để phù hợp với textarea */
}

.d-flex.hinhanhadminchinhsua {
  flex-wrap: wrap;
  justify-content: start;
  gap: 10px;
  margin-bottom: 20px;
}

.d-flex.hinhanhadminchinhsua>div {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #f7f7f7;
  border-radius: 8px;
  position: relative;
}

.remove_img_modal {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #ff4d4f;
  border-radius: 7%;
  padding: 2px 6px;
  cursor: pointer;
  color: white;
  font-weight: bold;
}

.remove_img_modal button {
  border: none;
  background: none;
  color: inherit;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

.files {
  margin-top: 20px;
}

.files h2 {
  margin-bottom: 10px;
}

.files ul {
  list-style-type: none;
  padding: 0;
}

.files li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  background-color: #e6e6e6;
  padding: 5px;
  border-radius: 5px;
}

.file-image {
  max-width: 100px;
  margin-right: 10px;
  border-radius: 5px;
}

.file-size {
  font-size: 0.8rem;
  color: #555;
}

.bx.bx-message-square-x {
  margin-left: auto;
  color: #ff4d4f;
  cursor: pointer;
}

input[type="file"] {
  margin-bottom: 10px;
}
* {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

}
 table thead th {
    color: #1A1A1A;
    font-size: 20px;
}
tbody tr td {
    color: #1A1A1A;
    font-size: 18px;
    font-weight: 600;

}
.btn-sm {
    font-style: normal;

}
.bx.bx-message-square-x {
    font-weight: 600;
    font-style: normal;
  margin-left: auto;
  color: #ff4d4f;
  cursor: pointer;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.bx.bx-message-square-x:hover{
    color: #b1393b;
}
/* Modal Content */
.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Modal Header */
.modal-header {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.modal-title {
    color: #333;
    font-size: 24px;
    font-weight: bold;
}

/* Close Button */
.btn-close {
    background: none;
    border: none;
    color: #aaa;
    font-size: 20px;
}

/* Modal Body */
.modal-body {
    padding: 20px;
}

/* Dropdown */
select {
    width: 100%;
    padding: 8px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f8f8f8;
}

/* Upload Section */
.label {
    display: block;
    margin-bottom: 5px;
    color: #666;
}

#upload {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
}

.files ul {
    list-style: none;
    padding: 0;
}

.files li {
    margin-bottom: 10px; /* Khoảng cách giữa các mục */
}

.file-image {
    width: 100px;
    height: auto;
    border-radius: 4px;
    margin-right: 10px;
}

.file-size {
    font-size: 14px;
    color: #666;
}

/* Modal Footer */
.modal-footer {
    border-top: 1px solid #eee;
    padding-top: 10px;
    margin-top: 20px;
    text-align: right;
}

.btn {
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-weight: bold;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}



.bx {
    cursor: pointer;
    color: red;
    margin-left: 10px;
}
.fa-trash-can {
    color: #f70a0a;
    cursor: pointer;
}
.fa-trash-can:hover {
    color: #771111;
}
.fa-spinner {
    color: #011a6b;
    cursor: pointer;    
}
.max-width-td {
  width: 150px; 
  height: 100px; 
  overflow-y: auto; 
  white-space: normal; 
}
</style>