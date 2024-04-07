<template>
  <div class="container-xxl bg-white p-0">
    <Headers style="margin-bottom: 120px;" />
    <div class="container-fluid booking pb-5 wow fadeIn" data-wow-delay="0.1s">
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
                      <span class="icon"><i class="fas fa-user"></i>{{ SoLuongNguoi }} người lớn </span>
                      <span class="icon">{{ SoLuongTreEm }} trẻ em </span>
                      <span class="icon">{{ SoLuongPhong }} phòng</span>
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
                        <label class="classnguoilon">Trẻ em</label>
                        <div class="tanggiamsoluong">
                          <span class="icon" @click.stop="decrement('SoLuongTreEm')">
                            <i class="fas fa-minus"></i>
                          </span>
                          <div class="quantity">{{ SoLuongTreEm }}</div>
                          <span class="icon" @click.stop="increment('SoLuongTreEm')">
                            <i class="fas fa-plus daucong"></i>
                          </span>
                        </div>
                      </div>
                      <div v-for="(select, index) in selectArray" :key="index" class="dropdown-list">
                        <div class="dropdown-list-item">
                          <select v-model="selectArray[index].age" :id="'ageDropdown' + index">
                            <option value="1">1 tuổi</option>
                            <option v-for="age in 17" :key="age" :value="String(age + 1)">{{ age + 1
                            }} tuổi</option>
                          </select>
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
        <!-- <h6>Chọn lọc theo:</h6> -->
        <!-- <div class="form-check">
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
        </div> -->
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
              <a class="dropdown-item" href="#" @click.prevent="locGiaTangDan">Giá tăng dần</a>
              <a class="dropdown-item" href="#" @click.prevent="locGiaGiamDan">Giá giảm dần</a>
            </div>
          </div>
        </div>
        <div class="room-type-component" v-for="hotel in paginatedResults" :key="hotel.hotelId">
          <div class="swiperwidth">
            <div class="swiper1">
              <swiper :modules="modules">
                <swiper-slide
                  v-for="image in (hotel.suitableRooms.length > 0 && hotel.suitableRooms[0].images ? hotel.suitableRooms[0].images : [])"
                  :key="image.id">
                  <div class="image-container">
                    <img :src="image.tenHinh" alt="Room Image" class="room-image">
                    <div class="heart-icon-cha">
                      <i class="bi bi-heart heart-icon" @click="toggleLike(hotel)" v-if="!hotel.like"></i>
                      <i class="bi bi-suit-heart-fill" v-if="hotel.like" @click="toggleLike(hotel)"></i>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>
            </div>
            <div class="mid-content-room">
              <h3 class="room-name">{{ hotel.hotelName }}
              </h3>
              <div class="diachilisroomsearch">{{ hotel.diaChi }}</div>
              <div v-for="room in hotel.suitableRooms" :key="room.id" class="room-info">

                <div class="d-flex">
                  <div class="sophongcanthiet">
                    {{ room.roomsNeeded }}<i class="bi bi-x"></i>
                  </div>
                  <div class="room-beds">
                    <p class="room-description">{{ room.tenLoaiPhong }}</p>
                    <div class="giuongdoidon123">
                      <div class="sogiuongdondoi" v-if="room.soGiuongDon > 0">{{ room.soGiuongDon }} giường đơn</div>
                      <div class="sogiuongdondoi" v-if="room.soGiuongDoi > 0">{{ room.soGiuongDoi }} giường đôi</div>
                      <div class="sogiuongdondoi">diện tích {{ room.dienTich }}m2</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="room-price-rating">
                <div class="tongdanhgia">
                  <div v-if="hotel.numberOfReviews === 0 || hotel.averageRating === 0.0" class="soluongdanhgia2">
                    Chưa có đánh giá
                  </div>
                  <template v-else>
                    <div class="danh-gia-container">
                      <div class="soluongdanhgia1">{{ hotel.numberOfReviews }} đánh giá</div>
                      <div class="tongdiemdanhgia ">{{ hotel.averageRating }}</div>
                    </div>
                  </template>

                </div>

                <span class="thuevapphi1111">{{ hotel.soDem }} đêm {{ hotel.nguoiLon }} người lớn {{ hotel.treEm }} trẻ em
                </span>
                <span v-if="hotel.totalPrice === hotel.discoutedRice" class="room-priceDiscount">
                  VND {{ formatCurrency(hotel.discoutedRice) }}
                </span>
                <div v-else>
                  <span class="room-price d-flex">VND {{ formatCurrency(hotel.totalPrice) }}</span>
                  <span class="room-priceDiscount">VND {{ formatCurrency(hotel.discoutedRice) }}</span>
                </div>

                <span v-if="calculateTotalDiscount(hotel) > 0" class="room-discount">
                  Tiết kiệm {{ calculateTotalDiscount(hotel) }}%
                </span>

                <span class="thuevapphi">Đã bao gồm thuế và phí</span>
                <button class="btn-primary" @click="detailRoomById(hotel)">Xem chỗ trống</button>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <a @click="goToPage(currentPage - 1)" v-if="currentPage > 1">&laquo;</a>
          <a v-for="n in totalPages" :key="n" @click="goToPage(n)" :class="{ 'active-page': n === currentPage }">
            {{ n }}
          </a>
          <a @click="goToPage(currentPage + 1)" v-if="currentPage < totalPages">&raquo;</a>
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
      currentPage: 1,
      resultsPerPage: 3,
      paginatedResults: [],
      selectedHotel: null,
      province: this.$route.query.province,
      checkInDate: '',
      checkOutDate: '',
      SoLuongNguoi: 1,
      SoLuongPhong: 1,
      SoLuongTreEm: 0,
      numberOfGuests: this.$route.query.numberOfGuests,
      groupChild: this.$route.query.groupChild,
      numberOfRoom: this.$route.query.numberOfRoom,
      showProvincesList: false,
      selectedProvince: this.$route.query.province,
      isDropdownVisible: false,
      SoLuongNguoi: this.$route.query.numberOfGuests,
      SoLuongPhong: this.$route.query.numberOfRoom,
      dropdownVisible: false,
      selectedOption: 'Giá tăng dần',
      SoLuongTreEm: this.$route.query.groupChild,
      selectArray: [],
      maxSelectCount: 10,
      showDropdown: false,
      likes: [],
      seen: [],
      dataLike: [],
    };
  },
  created() {
    if (this.$route.query.selectArray) {
      try {
        this.selectArray = JSON.parse(decodeURIComponent(this.$route.query.selectArray));
      } catch (error) {
        console.error('Lỗi khi giải mã selectArray:', error);
      }
    }
    const queryParams = this.$route.query;
    this.searchData = queryParams;
  },
  watch: {
    '$route.query'(newValue, oldValue) {
      this.LoadDataSearch(newValue);
      window.location.reload();
    },
    searchResults(newResults) {
      this.currentPage = 1; // Đặt lại trang hiện tại khi có kết quả mới
      this.paginateResults();
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.searchResults.length / this.resultsPerPage);
    }
  },
  async mounted() {
    await this.LoadDataSearch();
    await this.getProvince();
    await this.loadLikedHotels();
    this.paginateResults(); // Gọi khi có kết quả tìm kiếm ban đầu
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
            groupChild: this.searchData.groupChild,
          },
        });
        this.searchResults = response.data;
        this.checkInDate = this.$route.query.checkInDate;
        this.checkOutDate = this.$route.query.checkOutDate;

        console.log(this.searchResults)
      } catch (error) {
        console.error(error);
      }
    },
    paginateResults() {
      const startIndex = (this.currentPage - 1) * this.resultsPerPage;
      const endIndex = startIndex + this.resultsPerPage;
      this.paginatedResults = this.searchResults.slice(startIndex, endIndex);
    },
    goToPage(pageNumber) {
      this.currentPage = pageNumber;
      this.paginateResults();
    },
    formatCurrency(value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    async detailRoomById(selectedHotel) {
      await this.toggleSeen(selectedHotel);
      this.selectedHotel = selectedHotel;
      try {
        const roomDetails = [];
        this.selectedHotel.suitableRooms.forEach((room) => {
          const roomInfo = {
            idHotel: selectedHotel.hotelId,
            gia: room.roomPrice,
            roomsNeeded: room.roomsNeeded,
            soGiuongDoi: room.soGiuongDoi,
            soGiuongDon: room.soGiuongDon,
            giaDaGiam: room.roomDiscountedPrice,
            tenLoaiPhong: room.tenLoaiPhong,
            soNguoi: room.soNguoi,
          };
          roomDetails.push(roomInfo);
        });
        const detailData = {
          province: this.province,
          checkInDate: this.checkInDate,
          checkOutDate: this.checkOutDate,
          numberOfGuests: this.numberOfGuests,
          groupChild: this.SoLuongTreEm,
          numberOfRoom: this.numberOfRoom,
          lgt: this.selectedHotel.kinhdo,
          lati: this.selectedHotel.vido,
          totalPrice: this.selectedHotel.totalPrice,
          discoutedRice: this.selectedHotel.discoutedRice,
          ListBookingRoom: JSON.stringify(roomDetails),
          soDem: this.selectedHotel.soDem,
          nguoiLon: this.selectedHotel.nguoiLon,
          treEm: this.selectedHotel.treEm,
          selectArray: encodeURIComponent(JSON.stringify(this.selectArray)),

        };
        const queryString = new URLSearchParams(detailData).toString();
    const detailUrl = `${window.location.origin}/detail?${queryString}`;

    // Mở URL trong một cửa sổ/tab mới
    window.open(detailUrl, '_blank');

      } catch (error) {
        console.error(error);
      }
    },
    async getProvince() {
      try {
        const response = await this.$axios.get(`getHotelsInProvinceWithFilter`);
        this.provinces = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async SubmitFormSearch() {
      try {
        if (!this.checkInDate) {
          this.$refs.toast.showToast('chưa chọn ngày nhận phòng');
        } else if (this.selectedProvince === null) {
          this.$refs.toast.showToast('chưa chọn tỉnh thành');
          return;
        } else if (!this.checkOutDate) {
          this.$refs.toast.showToast('chưa chọn ngày trả phòng');
          return;
        } else if (this.checkOutDate <= this.checkInDate) {
          this.$refs.toast.showToast('Ngày trả phòng phải sau ngày nhận phòng');
        } else if (this.checkOutDate == this.checkInDate) {
          this.$refs.toast.showToast('Ngày nhận phòng không được trùng với ngày trả');
        } else {
          const searchData = {
            province: this.selectedProvince,
            checkInDate: this.checkInDate,
            checkOutDate: this.checkOutDate,
            numberOfGuests: this.SoLuongNguoi,
            groupChild: this.SoLuongTreEm,
            numberOfRoom: this.SoLuongPhong,
            selectArray: encodeURIComponent(JSON.stringify(this.selectArray)),
          };
          this.$router.push({
            name: 'searchresults',
            query: searchData,
          });
        }

      } catch (error) {
        console.error(error);
      }
    },
    calculateLocalDateTime() {
      const now = new Date();
      const vietnamOffset = 7 * 60;
      const vietnamTime = new Date(now.getTime() + vietnamOffset * 60 * 1000);
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
      const maxLimit = 20;

      if (item === 'SoLuongNguoi' && this.SoLuongNguoi < maxLimit) {
        this.SoLuongNguoi++;
      } else if (item === 'SoLuongPhong' && this.SoLuongPhong < maxLimit) {
        if (this.SoLuongNguoi !== this.SoLuongPhong) {
          this.SoLuongPhong++;
        } else if (this.SoLuongPhong < maxLimit) {
          this.SoLuongPhong++;
          this.SoLuongNguoi = this.SoLuongPhong;
        }
      } else if (item === 'SoLuongTreEm' && this.SoLuongTreEm < 10) {
        this.SoLuongTreEm++;
        this.showDropdown = true;
        this.$nextTick(() => {
          this.selectArray.push({ age: '1' });
        });
      }
    },
    decrement(item) {
      if (item === 'SoLuongNguoi' && this.SoLuongNguoi > 1) {
        if (this.SoLuongNguoi === this.SoLuongPhong) {
          this.SoLuongNguoi--;
          this.SoLuongPhong--;
        } else {
          this.SoLuongNguoi--;
        }
      } else if (item === 'SoLuongPhong' && this.SoLuongPhong > 1) {
        this.SoLuongPhong--;

      } else if (item === 'SoLuongTreEm') {
        this.SoLuongTreEm--;
        if (this.SoLuongTreEm < 0) {
          this.SoLuongTreEm = 0;
        }
        if (this.selectArray.length > 0) {
          this.selectArray.pop();
          this.showDropdown = false;
        }
      }
    },
    updateDropdownSelection(option) {
      document.getElementById('selectedOption').textContent = option;
    },
    createDetailUrl(selectedHotel) {
      const roomDetails = selectedHotel.suitableRooms.map(room => ({
        idHotel: selectedHotel.hotelId,
        gia: room.roomPrice,
        roomsNeeded: room.roomsNeeded,
        soGiuongDoi: room.soGiuongDoi,
        soGiuongDon: room.soGiuongDon,
        giaDaGiam: room.roomDiscountedPrice,
        tenLoaiPhong: room.tenLoaiPhong.replace(/ /g, "+"),
        idPhong: room.id,
        soNguoi: room.soNguoi,
      }));

      const detailData = {
        province: this.province.replace(/ /g, "+"),
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        numberOfGuests: this.numberOfGuests,
        groupChild: this.groupChild,
        numberOfRoom: this.numberOfRoom,
        lgt: selectedHotel.kinhdo,
        lati: selectedHotel.vido,
        totalPrice: selectedHotel.totalPrice,
        discoutedRice: selectedHotel.discoutedRice,
        ListBookingRoom: JSON.stringify(roomDetails),
        soDem: selectedHotel.soDem,
        nguoiLon: selectedHotel.nguoiLon,
        treEm: selectedHotel.treEm,
      };

      const queryString = Object.keys(detailData)
        .map(key => `${key}=${detailData[key]}`)
        .join('&');

      return `http://localhost:5173/detail?${queryString}`;
    },
    toggleLike(selectedHotel) {
      if (this.isLoggedIn()) {
        const hotelId = selectedHotel.hotelId;
        const detailUrl = this.createDetailUrl(selectedHotel);
        const likedHotels = JSON.parse(localStorage.getItem('likedHotels') || '[]');
        const hotelIndex = likedHotels.findIndex(item => item.id === hotelId);

        if (hotelIndex > -1) {
          // Hủy thích: Xóa khách sạn khỏi danh sách đã thích
          likedHotels.splice(hotelIndex, 1);
          this.unlikeHotel(selectedHotel);
        } else {
          // Thích: Thêm khách sạn vào danh sách đã thích
          likedHotels.push({ id: hotelId, url: detailUrl });
          this.likeHotel(selectedHotel);
        }

        localStorage.setItem('likedHotels', JSON.stringify(likedHotels));
      } else {
        this.$refs.toast.showToast('Vui lòng đăng nhập để thích');
      }
    },
    async toggleSeen(selectedHotel) {
      if (this.isLoggedIn()) {
        const hotelId = selectedHotel.hotelId;
        console.log(hotelId)
        const detailUrl = this.createDetailUrl(selectedHotel);

        // Lấy danh sách khách sạn đã xem từ localStorage
        const SeenHotels = JSON.parse(localStorage.getItem('SeenHotels') || '[]');

        // Kiểm tra xem khách sạn đã tồn tại trong danh sách chưa
        const hotelExists = SeenHotels.some(item => item.id === hotelId);

        // Nếu khách sạn chưa tồn tại trong danh sách, thêm vào danh sách
        if (!hotelExists) {
          SeenHotels.push({ id: hotelId, url: detailUrl });
          // Lưu danh sách mới vào localStorage
          localStorage.setItem('SeenHotels', JSON.stringify(SeenHotels));
        }

        // Gọi API để thêm vào danh sách đã xem
        await this.addseen(selectedHotel);
      }
    },

    isLiked(hotel) {
      return this.seen.some((like) => like.maKhachSan === hotel.hotelId);
    },
    async likeHotel(hotel) {
      console.log(hotel.hotelId)
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await this.$axios.post('addlike', {
          maKhachSan: hotel.hotelId,
          maKhachHang: user.id,
          status: true
        });

        const newLike = {
          maKhachSan: hotel.hotelId,
          maKhachHang: user.id,
          status: true
        };
        this.likes.push(newLike);
        hotel.like = true;
      } catch (error) {
        console.error(error);
      }
    },
    async unlikeHotel(hotel) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await this.$axios.post('addlike', {
          maKhachSan: hotel.hotelId,
          maKhachHang: user.id,
          status: false
        });

        const index = this.likes.findIndex((like) => like.maKhachSan === hotel.hotelId);
        if (index !== -1) {
          this.likes.splice(index, 1);
        }
        hotel.like = false;
      } catch (error) {
        console.error(error);
      }
    },
    isLoggedIn() {
      return !!localStorage.getItem("user");
    },
    async loadLikedHotels() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await this.$axios.get(`http://localhost:3000/api/getlike/${user.id}`);

        // Lưu danh sách khách sạn đã thích vào biến this.likes
        this.likes = response.data;
        console.log(this.likes)
        // Cập nhật trạng thái like cho các khách sạn trong searchResults
        this.searchResults.forEach((hotel) => {
          hotel.like = this.likes.some((like) => like.maKhachSan === hotel.hotelId && like.status === true);
        });
      } catch (error) {
        console.error(error);
      }
    },
    async addseen(hotel) {
      console.log(hotel.hotelId)
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await this.$axios.post('addseen', {
          maKhachSan: hotel.hotelId,
          maKhachHang: user.id,
          status: true
        });
        const newLike = {
          maKhachSan: hotel.hotelId,
          maKhachHang: user.id,
          status: true
        };
        this.seen.push(newLike);
        hotel.like = true;
      } catch (error) {
        console.error(error);
      }
    },
    calculateTotalDiscount(hotel) {
      let totalOriginalPrice = 0;
      let totalDiscountedPrice = 0;

      hotel.suitableRooms.forEach(room => {
        totalOriginalPrice += room.gia * room.roomsNeeded;
        totalDiscountedPrice += room.giaDaGiam * room.roomsNeeded;
      });

      // Tránh chia cho 0
      if (totalOriginalPrice === 0) return 0;

      return ((totalOriginalPrice - totalDiscountedPrice) / totalOriginalPrice * 100).toFixed(2);
    },
    locGiaTangDan() {
      this.searchResults.sort((a, b) => {
        return a.discoutedRice - b.discoutedRice;
      });
      this.paginateResults();
    },
    locGiaGiamDan() {
      this.searchResults.sort((a, b) => {
        return b.discoutedRice - a.discoutedRice;
      });
      this.paginateResults();
    },
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
}

.image-container {
  position: relative;
  display: inline-block;
}

.heart-icon-cha {
  border-radius: 50%;
  background-color: #FFFFFF;
  text-align: center;
  width: 30px;
  height: 30px;
  position: absolute;
  top: 30px;
  right: 30px;
}

.bi-suit-heart-fill {
  cursor: pointer;

  top: 3px;
  right: 5px;
  font-size: 20px;
  position: absolute;
  color: #D4111E;
}

.heart-icon {
  cursor: pointer;
  top: 3px;
  right: 5px;
  font-size: 20px;
  position: absolute;
}


.room-details {
  flex-grow: 1;
}

.room-name {
  font-size: 20px;
  color: #007bff;
  font-weight: 700;
  font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}

.room-description {
  color: #1A1A1A;
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}

.sophongcanthiet {
  margin-top: 2px;
  background-color: #f2f2f2;
  border-radius: 4px;
  font-size: 12px;
  padding: 2px 3px;
  cursor: pointer;
  color: #1A1A1A;
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
  font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}

.room-discount {
  background-color: #008234;
  color: #EFFFF2;
  padding: 4px;
  border-radius: 5px;
  font-size: 12px;
  font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;

}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
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

.thuevapphi1111 {
  font-size: 14px;
  color: #474747;
}

@media (max-width: 768px) {
  .filter-section {
    display: none;
    /* Hiển thị trên màn hình có chiều rộng từ 768px trở lên */
  }

  .room-list {
    flex-basis: 100%;
    /* Kích thước ban đầu của phần danh sách phòng */
  }
}

.active-page {
  cursor: pointer;
  font-weight: bold;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  padding: 8px 16px;
}

.tongdanhgia {
  align-self: flex-end;
  font-weight: bold;
  color: #333;
}

.danh-gia-container {
  display: flex;
  align-items: center;
  /* Nếu bạn muốn căn giữa các items theo chiều dọc */
  justify-content: space-between;
  /* Điều chỉnh khoảng cách giữa các items */
  margin-bottom: 20px;
}

.soluongdanhgia2 {
  margin-bottom: 40px;
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
}

.soluongdanhgia1 {
  margin-right: 10px;
}

.tongdiemdanhgia {
  color: #FFFFFF;
  background-color: #003B95;
  width: 34px;
  height: 32px;
  border-radius: 5px;
  margin-right: 10px;

  display: flex;
  justify-content: center;
  /* Căn giữa nội dung theo chiều ngang */
  align-items: center;
  /* Căn giữa nội dung theo chiều dọc */
}

.diachilisroomsearch {
  font-size: 12px;
  text-decoration: underline;
  font-weight: 600;
  color: #006CE4;
  cursor: pointer;
  font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  ;
}

.sogiuongdondoi {
  font-size: 12px;
  font-weight: 400;
  font-family: BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}
</style>

    