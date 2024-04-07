<template>
    <div class="container-xxl bg-white p-0">
      <Headers style="margin-bottom: 120px;" />
      <div class="container-fluid booking pb-1 wow fadeIn" data-wow-delay="0.1s">
        <div class="container">
          <div class="bg-white shadow" style="padding: 15px; border: 2px solid #FEA116;border-radius: 10px;">
            <div class="row g-2">
              <div class="col-md-10">
                <div class="row g-2">
                  <div class="col-md-3 position-relative oInputTinhThanh">
                    <input type="text" class="form-control " placeholder="Bạn muốn đi đâu" @focus="showProvincesList = true"
                      @blur="scheduleHideProvincesList" v-model="selectedProvince" />
                    <select v-show="showProvincesList" @change="setProvince($event.target.value)" size="5"
                      class="province-dropdown">
                      <option v-for="province in provinces" :key="province.id" :value="province.tenTinhThanh"
                        class="optionProvince">
                        <i class="fas fa-map-marker-alt"></i><span class="inputChonTinhThanhBooking"> {{
                          province.tenTinhThanh }}</span>
                      </option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <vue-ctk-date-time-picker v-model="checkInDate" :no-time="true" :min-date="minDate"
                      format="YYYY-MM-DD hh:mm a" :locale="'vi'" label="Chọn ngày nhận phòng"
                      button-now-translation="Bây giờ"> </vue-ctk-date-time-picker>
                  </div>
                  <div class="col-md-3">
                    <vue-ctk-date-time-picker v-model="checkOutDate" :no-time="true" :min-date="minDate"
                      format="YYYY-MM-DD hh:mm a" :locale="'vi'" label="Chọn ngày trả phòng"
                      button-now-translation="Bây giờ"></vue-ctk-date-time-picker>
                  </div>
                  <div class="col-md-3">
                    <div class="custom-dropdown-container">
                      <div class="custom-dropdown-toggle" @click="toggleDropdown">
                        <span class="icon"><i class="fas fa-user"></i>{{ SoLuongNguoi }} người lớn -</span>
                        <span class="icon"><i class="fas fa-bed"></i>{{ SoLuongPhong }} phòng</span>
                      </div>
                      <div class="custom-dropdown-menu">
                        <div class="custom-dropdown-item">
                          <label class="classnguoilon">Người lớn</label>
                          <div class="tanggiamsoluong">
                            <span class="icon" @click.stop="decrement('SoLuongNguoi')"><i class="fas fa-minus"></i>
                            </span>
                            <div class="quantity">
                              {{ SoLuongNguoi }}
                            </div>
                            <span class="icon">
                              <i class="fas fa-plus daucong" @click.stop="increment('SoLuongNguoi')"></i>
                            </span>
                          </div>
                        </div>
  
                        <div class="custom-dropdown-item">
                          <label for="" class="classphong">Phòng</label>
                          <div class="tanggiamsoluong">
  
                            <span class="icon" @click.stop="decrement('SoLuongPhong')"><i class="fas fa-minus"></i></span>
                            <div class="quantity">
                              {{ SoLuongPhong }}
                            </div>
                            <span class="icon" @click.stop="increment('SoLuongPhong')"><i
                                class="fas fa-plus daucong"></i></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-2">
                <button class="btn btn-primary w-100" @click="SubmitFormSearch()">Tìm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="breadcrumb">
        <span class="breadcrumb-part">Trang chủ</span>
        <span class="breadcrumb-part"><i class='bi bi-chevron-right'></i></span>
        <span class="breadcrumb-part">{{ province }}</span>
        <span class="breadcrumb-part"><i class='bi bi-chevron-right'></i></span>
        <span class="breadcrumb-part111">Kết quả tìm kiếm</span>
      </div>
      <div class="flex-container">
        <!-- Bộ lọc -->
        <div class="filter-section">
          <div class="ggmaplistForSearch">
  
          </div>
          <!-- Các checkbox bộ lọc -->
          <h6>Chọn lọc theo:</h6>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
            <label class="form-check-label" for="flexCheckDefault">
              Nhà khách
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked">
            <label class="form-check-label" for="flexCheckChecked">
              Nhà gỗ
            </label>
          </div>
          <!-- ... thêm các bộ lọc cụ thể khác ... -->
        </div>
        <!-- Danh sách phòng xuống dòng -->
        <div class="room-list">
          <div class="timthaychonghiContent">
            {{ province }}: tìm thấy {{ searchResults.length }} chỗ nghỉ
          </div>
          <div class="dropdownFilterHotel">
            <div id="app" class="dropdown">
              <div class="sapxeptheoListForSearch-item dropdown-toggle" data-bs-toggle="dropdown">
                <span class="icon-up-down">
                  <i class="bi bi-arrow-up"></i>
                  <i class="bi bi-arrow-down"></i>
                </span>
                <span>Sắp xếp theo: {{ selectedOption }}</span>
                <span class="icon-up-down">
                  <i class="bi bi-caret-up"></i>
                  <i class="bi bi-caret-down"></i>
                </span>
              </div>
              <div class="dropdown-menu" id="customDropdown">
                <a class="dropdown-item" href="#" @click.prevent="selectedOption = 'Ưu tiên giảm giá Genius'">Ưu tiên giảm
                  giá
                  Genius</a>
                <a class="dropdown-item" href="#" @click.prevent="selectedOption = 'Tùy chọn 1'">Tùy chọn 1</a>
                <a class="dropdown-item" href="#" @click.prevent="selectedOption = 'Tùy chọn 2'">Tùy chọn 2</a>
                <a class="dropdown-item" href="#" @click.prevent="selectedOption = 'Tùy chọn 3'">Tùy chọn 3</a>
              </div>
            </div>
          </div>
  
          <div class="room-type-component" v-for="hotel in searchResults" :key="hotel.id">
            <!-- Swiper for images và mid-content-room -->
            <div class="swiperwidth">
              <div class="swiper1">
                <swiper :modules="modules">
                  <swiper-slide v-for="(room, roomIndex) in hotel.CategoryRoom" :key="roomIndex">
                    <img :src="room.images[0].duongDan" alt="Room Image" class="room-image">
                  </swiper-slide>
                </swiper>
              </div>
              <div class="mid-content-room">
                <h3 class="room-name">{{ hotel.tenKhachSan }} <span class="room-rating">⭐️⭐️⭐️⭐️⭐️</span></h3>
                <p class="room-description">{{ hotel.diaChi }} </p>
                <!-- Chỉ hiển thị tên loại phòng của phần tử đầu tiên -->
                <div v-for="(room, roomIndex) in hotel.CategoryRoom" :key="roomIndex">
                  <p class="room-tenloaiPjpng" v-if="roomIndex === 0">{{ room.tenLoaiPhong }} </p>
                  <p class="room-Sogiuong" v-if="roomIndex === 0">{{ room.soGiuong }} giường</p>
                  <div class="room-price-rating">
                    <span class="room-price" v-if="roomIndex === 0">VND {{ formatCurrency(room.gia) }}</span>
                    <span class="room-priceDiscount" v-if="roomIndex === 0">VND {{ formatCurrency(room.giaDaGiam) }}</span>
                    <span class="room-discount" v-if="roomIndex === 0">Tiết kiệm {{ room.giamGia }}%</span>
                    <span class="thuevapphi">Đã bao gồm thuế và phí</span>
                    <!-- <router-link :to="{ name: 'detail', params: { duongDanPhong: room.DuongDanPhong } }"> -->
                    <button class="btn-primary" @click="detailRoomById(hotel)">Xem chỗ trống</button>
                    <!-- </router-link> -->
                  </div>
                </div>
              </div>
            </div>
            <!-- Phần room-price-rating -->
          </div>
          <div class="pagination">
            <a href="#">&laquo;</a>
            <a href="#">1</a>
            <a href="#" class="active">2</a>
            <a href="#">3</a>
            <a href="#">4</a>
            <a href="#">5</a>
            <a href="#">6</a>
            <a href="#">&raquo;</a>
          </div>
        </div>
      </div>
      <a href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>
      <Footer1 />
    </div>
    <toast ref="toast"></toast>
  </template>
  <script>
  import Paginate from 'vuejs-paginate'
  import Headers from '../../components/Headers.vue';
  import Booking from '../../components/Booking.vue';
  import Footer1 from '../../components/Footer.vue';
  import toast from '../../components/toast.vue';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
  import 'swiper/css';
  import 'swiper/css/pagination';
  export default {
    components: {
      'vue-ctk-date-time-picker': VueCtkDateTimePicker,
      Headers,
      Booking,
      Swiper,
      SwiperSlide,
      toast,
      Footer1,
      Paginate
    },
    data() {
      return {
        provinces: [],
        minDate: this.calculateLocalDateTime(),
        searchData: [],
        searchResults: [],
        selectedHotel: null,
        province: this.$route.query.province,
        checkInDate: this.$route.query.checkInDate,
        checkOutDate: this.$route.query.checkOutDate,
        numberOfGuests: this.$route.query.numberOfGuests,
        numberOfRoom: this.$route.query.numberOfRoom,
        showProvincesList: false,
        selectedProvince: this.$route.query.province,
        isDropdownVisible: false,
        SoLuongNguoi: this.$route.query.numberOfGuests,
        SoLuongPhong: this.$route.query.numberOfRoom,
        dropdownVisible: false,
        selectedOption: 'Ưu tiên giảm giá Genius',
      };
    },
    created() {
      const queryParams = this.$route.query;
      this.searchData = queryParams;
  
    },
    watch: {
      '$route.query'(newValue, oldValue) {
        this.LoadDataSearch(newValue);
        window.location.reload();
      },
    },
    async mounted() {
      this.LoadDataSearch();
      await this.getProvince();
    },
    methods: {
      async LoadDataSearch() {
        try {
          const response = await this.$axios.get('GetRoomByFilter', {
            params: {
              province: this.searchData.province,
              checkInDate: this.searchData.checkInDate,
              checkOutDate: this.searchData.checkOutDate,
              numberOfGuests: this.searchData.numberOfGuests,
              numberOfRoom: this.searchData.numberOfRoom,
            },
          });
          this.searchResults = response.data;
          console.log(this.searchResults)
        } catch (error) {
          console.error(error);
        }
      },
      formatCurrency(value) {
        let val = (value / 1).toFixed(0).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },
      detailRoomById(selectedHotel) {
        this.selectedHotel = selectedHotel;
        try {
          const detailData = {
            link: this.selectedHotel.DuongDanPhong,
            province: this.province,
            checkInDate: this.checkInDate,
            checkOutDate: this.checkOutDate,
            numberOfGuests: this.numberOfGuests,
            numberOfRoom: this.numberOfRoom,
            lgt: this.selectedHotel.kinhdo,
            lati: this.selectedHotel.vido,
          };
          this.$router.push({
            name: 'detail',
            query: detailData,
          });
        } catch (error) {
          console.error(error);
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
      async SubmitFormSearch() {
        try {
          if (!this.checkInDate) {
            this.$refs.toast.showToast('chưa chọn ngày nhận phòng');
          } else if (!this.selectedProvince === null) {
            this.$refs.toast.showToast('chưa chọn tỉnh thành');
            return;
          } else if (!this.checkOutDate) {
            this.$refs.toast.showToast('chưa chọn ngày trả phòng');
            return;
          } else {
            const searchData = {
              province: this.selectedProvince,
              checkInDate: this.checkInDate,
              checkOutDate: this.checkOutDate,
              numberOfGuests: this.SoLuongNguoi,
              numberOfRoom: this.SoLuongPhong,
            };
            this.$router.replace({
              name: 'searchresults', // Đổi 'searchresults' thành tên route của trang kết quả
              query: searchData,
            });
          }
        } catch (error) {
          console.error(error);
        }
      },
      calculateLocalDateTime() {
        const now = new Date();
        const vietnamOffset = -5 * 60; // Đặt offset của Việt Nam là -9 giờ (GMT+9)
  
        // Điều chỉnh thời gian bằng cách thêm hoặc trừ offset
        const vietnamTime = new Date(now.getTime() + vietnamOffset * 60 * 1000);
  
        // Lấy ngày ở định dạng YYYY-MM-DD
        const formattedDate = vietnamTime.toISOString().slice(0, 16);
  
        return formattedDate;
      },
      scheduleHideProvincesList() {
        setTimeout(() => {
          this.showProvincesList = false;
        }, 200); // Chờ 200ms trước khi ẩn danh sách
      },
      setProvince(value) {
        this.selectedProvince = value;
        this.showProvincesList = false;
      },
      toggleDropdown() {
        this.isDropdownVisible = !this.isDropdownVisible;
      },
      increment(item) {
        if (item === 'SoLuongNguoi') {
          this.SoLuongNguoi++;
        } else if (item === 'SoLuongPhong') {
          this.SoLuongPhong++;
        }
      },
      decrement(item) {
        if (item === 'SoLuongNguoi' && this.SoLuongNguoi > 1) {
          this.SoLuongNguoi--;
        } else if (item === 'SoLuongPhong' && this.SoLuongPhong > 1) {
          this.SoLuongPhong--;
        }
      },
      updateDropdownSelection(option) {
        document.getElementById('selectedOption').textContent = option;
      }
    }
  };
  </script>
  <style scoped>
  
  
  .container-xxl {
    display: flex;
    flex-direction: column;
  }
  
  .header {
    z-index: 10;
  }
  
  .booking {
    z-index: 5;
  }
  
  .flex-container {
    padding-bottom: 150px;
    display: flex;
    flex-wrap: wrap;
    /* Cho phép các thành phần xuống dòng khi không đủ không gian */
  }
  
  .filter-section {
    flex-basis: 20%;
    /* Kích thước ban đầu của phần bộ lọc */
  }
  
  .room-list {
    flex-basis: 80%;
    /* Kích thước ban đầu của phần danh sách phòng */
  }
  
  .room-type-component {
    margin-bottom: 10px;
    /* Kích thước ban đầu của phần phòng, trừ đi khoảng cách giữa các phần tử */
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 10px;
    /* Màu và độ rộng của viền */
    position: relative;
    /* height: 300px; */
  }
  
  .room-image {
    width: 200px;
    height: 200px;
    border-radius: 5px;
    margin: 20px;
    object-fit: cover;
    float: left;
  }
  
  .room-details {
    flex-grow: 1;
  }
  
  .room-name {
    font-size: 20px;
    color: #007bff;
    font-weight: 700;
    font-family: BlinkMacSystemFont,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  }
  
  .room-description {
    color: #007bff;
    text-decoration: underline;
    margin-top: 5px;
    margin-bottom: 10px;
    font-size: 13px;
    font-weight: bold;
  }
  
  .room-tenloaiPjpng {
    font-weight: bold;
    color: #000000;
    font-size: 13px;
  }
  
  .room-Sogiuong {
    font-size: 13px;
  }
  
  .room-price-rating {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    /* Đặt các phần tử ở phía dưới */
    align-items: flex-end;
    /* Đặt các phần tử ở phía bên phải */
    position: absolute;
    /* Đặt vị trí tuyệt đối để xếp chồng lên */
    top: -20px;
    right: 20px;
    bottom: 200px;
    height: 100%;
    /* Đặt chiều cao là 100% để nằm ngang bằng với swiperwidth */
    width: 200px;
    /* Đặt chiều rộng tùy chọn */
  }
  
  .room-price {
    font-weight: 200;
    color: #D4111E;
    text-decoration: line-through;
    font-size: 13px;
  }
  
  .room-priceDiscount {
    font-weight: 500;
    font-size: 20px;
    color: #000000;
    font-family: BlinkMacSystemFont,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  }
  
  .room-discount {
    background-color: #008234;
    color: #EFFFF2;
    padding: 4px;
    border-radius: 5px;
    font-size: 12px;
    font-family: BlinkMacSystemFont,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: BlinkMacSystemFont,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  }
  
  .back-to-top {
    position: fixed;
    bottom: 40px;
    right: 40px;
  }
  
  .form-check {
    margin-bottom: 10px;
  }
  
  .form-check-input {
    margin-top: 0.3rem;
    margin-left: 0;
  }
  
  .form-check-label {
    margin-left: 1.5rem;
  }
  
  .swiperwidth {
    display: flex;
  }
  
  .swiper1 {
    width: 230px;
  }
  
  .mid-content-room {
    padding-left: 10px;
    margin-top: 10px;
  }
  
  .room-rating {
    font-size: 15px;
  }
  .thuevapphi {
    font-size: 12px;
    color: #474747;
  }
  </style>
  
      