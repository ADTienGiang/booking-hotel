<template>
  <div class="container">
    <div class="table-wrapper">
      <div class="d-flex align-items-end justify-content-between">
        <div class="form-group">
          <label for="product_id">Lọc theo khách sạn</label>
          <select class="form-control" v-model="selectedHotel">
            <option v-for="hotel in hotels" :key="hotel.id" :value="hotel">
              {{ hotel.tenKhachSan }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <div class="d-flex align-items-end">
            <div class="me-2" style="flex-grow: 1;">
              <input type="text" class="form-control" placeholder="Nhập từ khóa tìm kiếm" v-model="tuKhoaTimKiem">
            </div>
          </div>
        </div>
      </div>
      <div class="table-title">
        <div class="row">
          <h2>Quản lý <b>LOẠI PHÒNG</b></h2>
          <a type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
            @click="setDefault"><i class="fa-solid fa-circle-plus"></i> <span>Thêm loại phòng</span></a>
        </div>
      </div>
      <div class="table-container">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Tên KS</th>
              <th>Tên loại</th>
              <th>SL khách</th>
              <th>Giường đôi</th>
              <th>Giường đơn</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Giảm giá</th>
              <th>Diện tích</th>
              <th>SL</th>
              <th>Trạng thái phòng</th>
              <th>Hình ảnh</th>
              <th>Sự kiện</th>
            </tr>
          </thead>
          <tbody v-for="room in filteredRooms" :key="room.id">
            <tr>
              <td>
                <div class="max-width-td">{{ room.Hotel.tenKhachSan }}</div>
              </td>
              <td>
                <div class="max-width-td">{{ room.tenLoaiPhong }}</div>
              </td>
              <td>
                <div class="max-width-td1">{{ room.soNguoi }}</div>
              </td>
              <td>
                <div class="max-width-td1">{{ room.soGiuongDoi }}</div>
              </td>
              <td>
                <div class="max-width-td1">{{ room.soGiuongDon }}</div>
              </td>
              <td>
                <div class="max-width-td">{{ room.moTa }}</div>
              </td>
              <td>VND {{ formatCurrency(room.gia) }}</td>
              <td>{{ room.giamGia }}%</td>
              <td>{{ room.dienTich }}m2</td>
              <td>{{ room.soLuong }}</td>
              <td>{{ room.trangThaiPhong }}</td>
              <td>
                <div class="image-container">
                  <div class="image-list">
                    <div v-for="(image, index) in room.images.slice(0, 1)" :key="index" class="image-item">
                      <img :src="image.duongDan" alt="">
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <a type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModaledit">
                  <i class="fa-solid fa-spinner" @click="sendata(room)"></i>
                </a>
                <a class="delete" @click="deleteRoom(room.id)">
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
          <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm loại phòng mới</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <div class="form-group">
              <div class="row row-content">
                <div class="col-md-4">
                  <label>Tên khách sạn</label>
                  <select class="form-control" v-model="selectedHotel">
                    <option disabled value="">Chọn khách sạn</option>
                    <option v-for="hotel in hotels" :key="hotel.id" :value="hotel">
                      {{ hotel.tenKhachSan }}
                    </option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label>Tên loại phòng</label>
                  <input type="text" placeholder="Tên loại phòng" class="form-control" v-model="tenLoaiPhong">
                </div>
                <div class="col-md-4">
                  <label>Diện tích</label>
                  <input type="text" placeholder="mét vuông" class="form-control" v-model="dienTich" @input="checkNumber">
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row row-content">

                <div class="col-md-3">
                  <label>Số người</label>
                  <input type="text" min="0" placeholder="Số người" class="form-control" v-model="soNguoi"
                    @input="checkNumber">
                </div>
                <div class="col-md-3">
                  <label>Số giường đôi</label>
                  <input type="text" min="0" placeholder="Số giường đôi" class="form-control" v-model="soGiuongDoi"
                    @input="tinhToanGiuong('soGiuongDoi')">
                </div>
                <div class="col-md-3">
                  <label>Số giường đơn</label>
                  <input type="text" min="0" placeholder="Số giường đơn" class="form-control" v-model="soGiuongDon"
                    @input="tinhToanGiuong('soGiuongDon')">
                </div>
                <div class="col-md-3">
                  <label>Trạng thái phòng</label>
                  <select class="form-control" v-model="trangThaiPhong">
                    <option value="Phòng trống">Phòng trống</option>
                    <option value="Sửa chữa">Sửa chữa</option>
                  </select>
                </div>

              </div>
            </div>

            <div class="form-group">
              <div class="row row-content">
                <div class="col-md-3">
                  <label for="currency-field">Giá </label>
                  <input type="text" name="currency-field" id="currency-field" placeholder="Giá " class="form-control"
                    v-model="formattedPrice" @input="updatePrice" @blur="savePrice">
                </div>
                <div class="col-md-3">
                  <label>Giảm giá (%)</label>
                  <input type="number" min="0" name="currency-field" placeholder="%" class="form-control"
                    v-model="giamGia" @input="calculateDiscountedPrice">
                </div>
                <div class="col-md-3">
                  <label>Giá sau khi giảm</label>
                  <input type="text" placeholder="Giá đã giảm" class="form-control" v-model="discountedPrice" disabled>
                </div>
                <div class="col-md-3">
                  <label>Số lượng</label>
                  <input type="text" min="0" placeholder="Số lượng" class="form-control" v-model="soLuong"
                    @input="checkNumber">
                </div>


              </div>
            </div>
            <div class="form-group">
              <div class="col-md-12">
                <label>Mô tả</label>
                <textarea name="" id="" cols="30" rows="5" placeholder="tinymce" v-model="moTa"
                  class="form-control"></textarea>
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
          <h1 class="modal-title fs-5" id="exampleModalLabel">Chỉnh sửa loại phòng</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="updateHotel">
          <div class="modal-body">
            <div class="form-group">
              <div class="row row-content">
                <div class="col-md-4">
                  <label>Tên khách sạn</label>
                  <select class="form-control" v-model="selectedHotel">
                    <option disabled value="">Chọn tỉnh thành</option>
                    <option v-for="hotel in hotels" :key="hotel.id" :value="hotel">
                      {{ hotel.tenKhachSan }}
                    </option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label>Tên loại phòng</label>
                  <input type="text" placeholder="Tên loại phòng" class="form-control" v-model="tenLoaiPhong">
                </div>
                <div class="col-md-4">
                  <label>Diện tích</label>
                  <input type="text" placeholder="mét vuông" class="form-control" v-model="dienTich" @input="checkNumber">
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row row-content">

                <div class="col-md-4">
                  <label>Số người</label>
                  <input type="text" min="0" placeholder="Số người" class="form-control" v-model="soNguoi"
                    @input="checkNumber">
                </div>
                <div class="col-md-4">
                  <label>Số giường đôi</label>
                  <input type="text" min="0" placeholder="Số giường đôi" class="form-control" v-model="soGiuongDoi"
                    @input="tinhToanGiuong('soGiuongDoi')">
                </div>
                <div class="col-md-4">
                  <label>Số giường đơn</label>
                  <input type="text" min="0" placeholder="Số giường đơn" class="form-control" v-model="soGiuongDon"
                    @input="tinhToanGiuong('soGiuongDon')">
                </div>
                <div class="col-md-4">
                  <label>Trạng thái phòng</label>
                  <select class="form-control" v-model="trangThaiPhong">
                    <option value="Phòng trống">Phòng trống</option>
                    <option value="Sửa chữa">Sửa chữa</option>
                  </select>
                </div>

              </div>
            </div>

            <div class="form-group">
              <div class="row row-content">
                <div class="col-md-3">
                  <label for="currency-field">Giá sản phẩm</label>
                  <input type="text" name="currency-field" id="currency-field" placeholder="Giá sản phẩm"
                    class="form-control" v-model="formattedPrice" @input="updatePrice($event)" @blur="savePrice">
                </div>
                <div class="col-md-3">
                  <label>Giảm giá (%)</label>
                  <input type="text" min="0" placeholder="%" class="form-control" v-model="giamGia"
                    @input="calculateDiscountedPrice">
                </div>
                <div class="col-md-3">
                  <label>Giá sau khi giảm</label>
                  <input type="text" placeholder="Giá đã giảm" class="form-control" v-model="discountedPrice" disabled>
                </div>

                <div class="col-md-4">
                  <label>Số lượng</label>
                  <input type="text" min="0" placeholder="Số lượng" class="form-control" v-model="soLuong"
                    @input="checkNumber">
                </div>

              </div>
            </div>
            <div class="form-group">
              <div class="col-md-12">
                <label>Mô tả</label>
                <textarea name="" id="" cols="30" rows="5" placeholder="tinymce" v-model="moTa"
                  class="form-control"></textarea>
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
                  <!-- tôi chọn file mới ở đây, nhưng hàm update không thể in ra được -->
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
import toast from '../../components/toast.vue';
export default {
  async mounted() {
    await this.getRooms();
    await this.getHotels();
  },
  data() {
    return {
      id: '',
      MaKhachSan: '',
      tenLoaiPhong: '',
      DuongDanPhong: '',
      soNguoi: '',
      soGiuongDoi: '',
      soGiuongDon: '',
      trangThaiPhong: '',
      moTa: '',
      tienNghi : '',
      dienTich: '',
      gia: 0,
      giamGia: 0,
      discountedPrice: 0,
      formattedPrice: '',
      soLuong: '',
      files: [],
      filesArr: [],
      hotels: [],
      hotel: [],
      rooms: [],
      
      selectedProduct: null,
      selectedHotel: null,
      tenHinh: '',
      inputChangedByUser: true,
      tuKhoaTimKiem : '',
    };
  },
  components: {
    toast
  },
  computed: {
    duong_dan_categoryComputed() {
      return this.convertToSlug(this.tenLoaiPhong);
    },
    filteredRooms() {
        return this.rooms.filter(room => {
            const hotelMatch = !this.selectedHotel || room.Hotel.id === this.selectedHotel.id;
            const keywordMatch = !this.tuKhoaTimKiem || 
                                 room.Hotel.tenKhachSan.toLowerCase().includes(this.tuKhoaTimKiem.toLowerCase()) || 
                                 room.tenLoaiPhong.toLowerCase().includes(this.tuKhoaTimKiem.toLowerCase());

            return hotelMatch && keywordMatch;
        });
    }
  },
  methods: {
    
    async getRooms() {
      try {
        const response = await this.$axios.get(`getRooms`);
        this.rooms = response.data;
        console.log(this.rooms)
      } catch (error) {
        console.log(error);
      }
    },
    async getHotels() {
      try {
        const response = await this.$axios.get(`getHotel`);
        this.hotels = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    sendata(product) {
      this.id = product.id;
      this.selectedProduct = product;
      this.tenLoaiPhong = product.tenLoaiPhong;
      this.DuongDanPhong = product.DuongDanPhong;
      this.trangThaiPhong = product.trangThaiPhong;
      this.soNguoi = product.soNguoi;
      this.soGiuongDoi = product.soGiuongDoi;
      this.soGiuongDon = product.soGiuongDon;
      this.moTa = product.moTa;
      this.dienTich = product.dienTich;
      this.gia = parseInt(product.gia);
      this.giamGia = parseInt(product.giamGia);
      this.discountedPrice = product.giaDaGiam;
      this.formattedPrice = product.gia;
      this.soLuong = product.soLuong;
      if (this.hotels && this.hotels.length > 0) {
        const matchedHotel = this.hotels.find(hotel => hotel.id === product.MaKhachSan);
        if (matchedHotel) {
          this.selectedHotel = matchedHotel;
        }
      }
    },
    removeFile(index) {
      URL.revokeObjectURL(this.getFileUrl(this.filesArr[index])); // Giải phóng URL
      this.filesArr.splice(index, 1);
    },
    getFileUrl(file) {
      return URL.createObjectURL(file);
    },
    async submitForm() {
      try {
        if (this.filesArr.length === 0) {
          this.$refs.toast.showToast('vui lòng chọn hình ảnh khách sạn');
        } else if (!this.tenLoaiPhong) {
          this.$refs.toast.showToast('chưa nhập tên loại phòng');
          return;
        } else if (!this.duong_dan_categoryComputed) {
          this.$refs.toast.showToast('chưa nhập đường dẫn');
          return;
        } else if (!this.soNguoi) {
          this.$refs.toast.showToast('chưa nhập số lượng người');
          return;
          // soGiuongDon
        } else if (this.soGiuongDoi === undefined) {

          this.$refs.toast.showToast('chưa nhập số giường đôi');
          return;
        }
        else if (this.soGiuongDon === undefined) {
          this.$refs.toast.showToast('chưa nhập số giường đơn');
          return;
        } else if (!this.trangThaiPhong) {
          this.$refs.toast.showToast('chưa chọn trạng thái phòng');
          return;
        } else if (!this.moTa) {
          this.$refs.toast.showToast('chưa nhập mô tả');
          return;
        } else if (!this.selectedHotel) {
          this.$refs.toast.showToast('chưa chọn khách sạn');
          return;
        } else if (!this.dienTich) {
          this.$refs.toast.showToast('chưa nhập diện tích');
          return;
        } else if (!this.gia) {
          this.$refs.toast.showToast('chưa nhập giá loại phòng');
          return;
        } else if (!this.soLuong) {
          this.$refs.toast.showToast('chưa nhập số lượng');
          return;
        }

        // Kiểm tra giảm giá và gán giá trị mặc định là 0 nếu người dùng không nhập
        if (!this.giamGia) {
          this.giamGia = 0;
        }

        // Tính giá giảm
        if (parseFloat(this.giamGia) > 0) {
          const discountPercentage = parseFloat(this.giamGia);
          this.discountedPrice = this.gia - (this.gia * discountPercentage) / 100;
        } else {
          this.discountedPrice = this.gia;
        }

        const formData = new FormData();
        console.log(this.tenHinh.length);
        for (let i = 0; i < this.tenHinh.length; i++) {
          const file = this.tenHinh[i];
          formData.append('tenHinh', file);
        }
        formData.append('MaKhachSan', this.selectedHotel.id);
        formData.append('tenLoaiPhong', this.tenLoaiPhong);
        formData.append('DuongDanPhong', this.duong_dan_categoryComputed);
        formData.append('soNguoi', this.soNguoi);
        formData.append('soGiuongDoi', this.soGiuongDoi);
        formData.append('soGiuongDon', this.soGiuongDon);
        formData.append('trangThaiPhong', this.trangThaiPhong);
        formData.append('moTa', this.moTa);
        formData.append('dienTich', this.dienTich);
        formData.append('gia', this.gia);
        formData.append('giamGia', this.giamGia);
        formData.append('giaDaGiam', this.discountedPrice);
        formData.append('soLuong', this.soLuong);
        try {
          const response = await this.$axios.post(
            'addRooms',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
            }
          );

          this.$refs.toast.showToast(response.data.message);
          this.getRooms();
        } catch (error) {
          if (error.response && error.response.data) {
            const { message } = error.response.data;
            this.$refs.toast.showToast(message);
          } else {
            this.$refs.toast.showToast('lỗi server');
          }
        }
      } catch (error) {
        alert(error)
      }
    },
    async updateHotel() {
      try {
        if (!this.tenLoaiPhong) {
          this.$refs.toast.showToast('chưa nhập tên loại phòng');
          return;
        } else if (!this.soNguoi) {
          this.$refs.toast.showToast('chưa nhập số lượng người');
          return;
          // soGiuongDon
        } else if (this.soGiuongDoi === undefined) {

          this.$refs.toast.showToast('chưa nhập số giường đôi');
          return;
        }
        else if (this.soGiuongDon === undefined) {
          this.$refs.toast.showToast('chưa nhập số giường đơn');
          return;
        } else if (!this.trangThaiPhong) {
          this.$refs.toast.showToast('chưa chọn trạng thái phòng');
          return;
        } else if (!this.moTa) {
          this.$refs.toast.showToast('chưa nhập mô tả');
          return;
        } else if (!this.selectedHotel) {
          this.$refs.toast.showToast('chưa chọn tỉnh thành');
          return;
        } else if (!this.dienTich) {
          this.$refs.toast.showToast('chưa nhập diện tích');
          return;
        } else if (!this.gia) {
          this.$refs.toast.showToast('chưa nhập giá loại phòng');
          return;
        } else if (!this.soLuong) {
          this.$refs.toast.showToast('chưa nhập số lượng');
          return;
        }
        // Kiểm tra giảm giá và gán giá trị mặc định là 0 nếu người dùng không nhập
        if (!this.giamGia) {
          this.giamGia = 0;
        }

        // Tính giá giảm
        if (parseFloat(this.giamGia) > 0) {
          const discountPercentage = parseFloat(this.giamGia);
          this.discountedPrice = this.gia - (this.gia * discountPercentage) / 100;
        } else {
          this.discountedPrice = this.gia;
        }

        const formData = new FormData();
        if (this.tenHinh && this.tenHinh.length > 0) {
          for (let i = 0; i < this.tenHinh.length; i++) {
            const file = this.tenHinh[i];
            formData.append('tenHinh', file);
          }
        }
        formData.append('MaKhachSan', this.selectedHotel.id);
        formData.append('tenLoaiPhong', this.tenLoaiPhong);
        formData.append('DuongDanPhong', this.DuongDanPhong);
        formData.append('soNguoi', this.soNguoi);
        formData.append('soGiuongDoi', this.soGiuongDoi);
        formData.append('soGiuongDon', this.soGiuongDon);
        formData.append('trangThaiPhong', this.trangThaiPhong);
        formData.append('moTa', this.moTa);
        formData.append('dienTich', this.dienTich);
        formData.append('gia', this.gia);
        formData.append('giamGia', this.giamGia);
        formData.append('giaDaGiam', this.discountedPrice);
        formData.append('soLuong', this.soLuong);
        try {
          const productupdate = await this.$axios.put(
            'updateRooms/' + this.id,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          this.$refs.toast.showToast(productupdate.data.message);
          this.getRooms();
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
      this.tienich = '';
      this.filesArr = [];
      this.formattedPrice = '';
      this.discountedPrice = 0;
      this.giamGia = 0;
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
          await this.$axios.delete(`deleteImageRooms/${imageId}`)
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
    convertToSlug(text) {
      text = text.toLowerCase();
      text = text.replace(/[àáảãạăắằẳẵặâấầẩẫậ]/g, 'a');
      text = text.replace(/[èéẻẽẹêếềểễệ]/g, 'e');
      text = text.replace(/[ìíỉĩị]/g, 'i');
      text = text.replace(/[òóỏõọôốồổỗộơớờởỡợ]/g, 'o');
      text = text.replace(/[ùúủũụưứừửữự]/g, 'u');
      text = text.replace(/[ỳýỷỹỵ]/g, 'y');
      text = text.replace(/[đ]/g, 'd');
      text = text.replace(/\s+/g, '-');
      text = text.replace(/[^\w\s-]/g, '');
      return text;
    },
    formatCurrency(value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    updatePrice(event) {
      let inputVal = event.target.value;
      const originalPrice = inputVal.replace(/,/g, '');
      const formattedPrice = this.formatNumber(originalPrice);
      this.formattedPrice = formattedPrice;
      this.gia = originalPrice;
      this.gia = this.gia.replace(/[^\d]/g, '');
    },
    calculateDiscountedPrice() {
      const discountAmount = (this.giamGia / 100) * this.gia;
      this.discountedPrice = this.gia - discountAmount;
      this.discountedPrice = this.formatPriceWithComma(this.discountedPrice);
    },
    formatPriceWithComma(price) {
      return price.toLocaleString();
    },
    updatePrice(event) {
      this.gia = parseFloat(event.target.value) || 0;
      this.calculateDiscountedPrice();
    },
    savePrice() {
    },
    tinhGiaTriPriceSauKhiGiamGia() {
      const discountPercentage = parseFloat(this.giamGia);
      this.discountedPrice = this.gia - (this.gia * discountPercentage) / 100;
    },
    async deleteRoom(id) {
      const userConfirmed = confirm("Bạn có chắc chắn muốn xóa loại phòng này?");
      if (userConfirmed) {
        try {
          const response = await this.$axios.delete(
            `deleteRooms/` + id
          );
          this.$refs.toast.showToast(response.data.message);
          this.getRooms();
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
    },
    checkNumber() {
      this.soNguoi = this.soNguoi.replace(/[^\d]/g, '');
      if (this.soNguoi.length > 2) {
        this.soNguoi = this.soNguoi.slice(0, 2);
      }
      this.soGiuongDoi = this.soGiuongDoi.replace(/[^\d]/g, '');
      this.soGiuongDon = this.soGiuongDon.replace(/[^\d]/g, '');
      this.dienTich = this.dienTich.replace(/[^\d]/g, '');
      this.gia = this.gia.replace(/[^\d]/g, '');
      this.giamGia = this.giamGia.replace(/[^\d]/g, '');
      this.discountedPrice = this.discountedPrice.replace(/[^\d]/g, '');
      this.soLuong = this.soLuong.replace(/[^\d]/g, '');
    },
    tinhToanGiuong(changedBy) {
      this.inputChangedByUser = false; // Đặt là false khi bắt đầu tính toán
      this.soGiuongDoi = this.soGiuongDoi.replace(/[^\d]/g, '');
      this.soGiuongDon = this.soGiuongDon.replace(/[^\d]/g, '');
      let soNguoi = parseInt(this.soNguoi) || 0;

      if (changedBy === 'soGiuongDoi') {
        let soGiuongDoi = parseInt(this.soGiuongDoi) || 0;
        let soGiuongDon = soNguoi - 2 * soGiuongDoi;
        this.soGiuongDon = soGiuongDon >= 0 ? soGiuongDon.toString() : '0';
      } else if (changedBy === 'soGiuongDon') {
        let soGiuongDon = parseInt(this.soGiuongDon) || 0;
        let soGiuongDoi = Math.ceil((soNguoi - soGiuongDon) / 2);
        this.soGiuongDoi = soGiuongDoi >= 0 ? soGiuongDoi.toString() : '0';
      } else {
        // Xử lý khi một trong hai trường bị trống
        if (this.soGiuongDoi === '') {
          let soGiuongDon = parseInt(this.soGiuongDon) || 0;
          let soGiuongDoi = Math.ceil((soNguoi - soGiuongDon) / 2);
          this.soGiuongDoi = soGiuongDoi >= 0 ? soGiuongDoi.toString() : '0';
        } else if (this.soGiuongDon === '') {
          let soGiuongDoi = parseInt(this.soGiuongDoi) || 0;
          let soGiuongDon = soNguoi - 2 * soGiuongDoi;
          this.soGiuongDon = soGiuongDon >= 0 ? soGiuongDon.toString() : '0';
        }
      }

      this.inputChangedByUser = true; // Đặt lại thành true sau khi tính toán
    },

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

.bx.bx-message-square-x:hover {
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
  margin-bottom: 10px;
  /* Khoảng cách giữa các mục */
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

.max-width-td1 {
  width: 50px;
  overflow-y: auto;
  white-space: normal;
}</style>