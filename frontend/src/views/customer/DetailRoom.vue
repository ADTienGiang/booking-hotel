<template>
    <div class="container-xxl bg-white p-0">
        <Headers style="padding-bottom: 120px;" />
        <!-- <Booking /> -->
        <div class="breadcrumb">
            <span class="breadcrumb-part">Trang chủ</span>
            <span class="breadcrumb-part"><i class='bi bi-chevron-right'></i></span>
            <span class="breadcrumb-part">{{ tinhThanh }}</span>
            <span class="breadcrumb-part"><i class='bi bi-chevron-right'></i></span>
            <span class="breadcrumb-part111">Kết quả tìm kiếm</span>
            <span class="breadcrumb-part"><i class='bi bi-chevron-right'></i></span>
            <span class="breadcrumb-part111" v-for="DetailData in DetailData">
                Ưu đãi cho {{ DetailData.tenKhachSan }}
            </span>


        </div>
        <div class="flex-container" v-for="detail in DetailData">
            <!-- Bộ lọc -->
            <div class="filter-section">
                <div class="filter-section-item1">
                    <div class="chungtoikhopgia">
                        <span><i class="bi bi-tags"></i> Chúng tôi luôn khớp giá!</span>
                    </div>
                </div>
                <div class="filter-section-item2">
                    <span class="timkiemdetail-Left">Tìm</span>
                    <div class="inputchonTinhThanh">
                        <span class="d-flex conntenSearchDetail">Tên chỗ nghỉ/Điểm đến</span>
                        <div class="position-relative oInputTinhThanh">
                            <input type="text" class="form-control " placeholder="Bạn muốn đi đâu"
                                @focus="showProvincesList = true" @blur="scheduleHideProvincesList"
                                v-model="selectedProvince" />
                            <select v-show="showProvincesList" @change="setProvince($event.target.value)" size="5"
                                class="province-dropdown selectdetailProvince">
                                <option v-for="province in provinces" :key="province.id" :value="province.tenTinhThanh"
                                    class="optionProvince">
                                    <i class="fas fa-map-marker-alt"></i><span class="inputChonTinhThanhBooking"> {{
                                        province.tenTinhThanh }}</span>
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="chonNgayVaGioCheckInDetailFilter">
                        <div class="">
                            <span class="d-lex conntenSearchDetail">Ngày nhận phòng</span>
                        </div>
                        <div>
                            <vue-ctk-date-time-picker v-model="checkInDate" :no-time="true" :min-date="minDate"
                                format="YYYY-MM-DD hh:mm a" :locale="'vi'" label="Chọn ngày nhận phòng"
                                button-now-translation="Bây giờ"> </vue-ctk-date-time-picker>
                        </div>
                    </div>
                    <div class="chonNgayVaGioCheckOutDetailFilter">
                        <div class="">
                            <span class="d-flex conntenSearchDetail">Ngày trả phòng</span>
                        </div>
                        <div>
                            <vue-ctk-date-time-picker v-model="checkOutDate" :no-time="true" :min-date="minDate"
                                format="YYYY-MM-DD hh:mm a" :locale="'vi'" label="Chọn ngày trả phòng"
                                button-now-translation="Bây giờ"></vue-ctk-date-time-picker>
                        </div>
                    </div>
                    <div class="chonSoLuongNguoiLaSoPhong">
                        <div class="">
                            <span class="d-flex conntenSearchDetail">Nghỉ 1 đêm</span>
                        </div>
                        <div class="custom-dropdown-container">
                            <div class="hihihihihihihi" @click="toggleDropdown">
                                <span class="icon"><i class="fas fa-user"></i>{{ SoLuongNguoi }} người lớn </span>
                                <span class="icon">{{ SoLuongTreEm }} trẻ em </span>
                                <span class="icon">{{ SoLuongPhong }} phòng</span>
                            </div>
                            <div class="custom-dropdown-menu">
                                <div class="custom-dropdown-item">
                                    <label class="classnguoilon">Người lớn</label>
                                    <div class="tanggiamsoluong">
                                        <span class="icon" @click.stop="decrement('SoLuongNguoi')"><i
                                                class="fas fa-minus"></i>
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

                                        <span class="icon" @click.stop="decrement('SoLuongPhong')"><i
                                                class="fas fa-minus"></i></span>
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
                    <div class="buttonTimKiemDetailMain">
                        <button class="buttonTimKiemDetail" @click="SubmitFormSearch()">Tìm</button>
                    </div>
                </div>
                <div class="filter-section-item3">
                    <button class="HienThiTrenBanDo" data-bs-toggle="modal" data-bs-target="#exampleModaledit"
                        @click="createMarker">
                        Hiển thị trên bản đồ
                    </button>
                </div>
            </div>

            <div class="img-detail-container" id="section1">
                <div class="d-flex phiatentitle-hotel">
                    <div class=" phiatentitle-hotel-item tongquan" tabindex="0" @click="scrollToSection('section1')">Tổng
                        quan</div>
                    <div class="phiatentitle-hotel-item thongtincanho" tabindex="0" @click="scrollToSection('section2')">
                        Thông tin căn hộ & giá</div>
                    <div class="phiatentitle-hotel-item tiennghi" tabindex="0" @click="scrollToSection('section3')">Tiện
                        nghi</div>
                    <div class="phiatentitle-hotel-item quytacchung" tabindex="0">Quy tắc chung</div>
                    <div class="phiatentitle-hotel-item danhgiacuakhachhang" tabindex="0">Đánh giá của khách hàng</div>
                </div>
                <div class="tiltle-hotel-top-detail">

                    <div class="tiltle-hotel-top-detail-item">
                        <div class="star-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <span class="d-flex name-content-hotel-detail">{{ detail.tenKhachSan }}</span>
                        <div class="location-icon">
                            <i class="fas fa-map-marker-alt"></i>
                            <span class="d-flex location-text">{{ detail.diaChi }}</span>
                        </div>
                        <span class="vitrituyetvoi">Vị trí tuyệt vời - <a class="hienthibandodetial" @click="createMarker"
                                data-bs-toggle="modal" data-bs-target="#exampleModaledit">hiển thị bản đồ</a> </span>
                    </div>
                    <div class="tiltle-hotel-top-detail-item1">
                        <div class="icon-container">

                            <i class="fas fa-share-alt thin-icon"></i>
                        </div>
                        <button class="book-now-button" @click="scrollToTable">Đặt ngay</button>
                    </div>
                </div>
                <div class="img-detail-top">
                    <!-- Ví dụ: Hiển thị 3 hình ảnh đầu tiên theo cách cố định -->
                    <div class="img-detail-left">
                        <div class="img-detail-left-top" data-bs-toggle="modal" data-bs-target="#exampleModaledit1">
                            <img :src="getExtendedImages(detail)[0]" alt="Hình ảnh"
                                @click="openImageModal(getExtendedImages(detail)[0])" />
                        </div>
                        <div class="img-detail-left-bottom" data-bs-toggle="modal" data-bs-target="#exampleModaledit1">
                            <img :src="getExtendedImages(detail)[1]" alt="Hình ảnh"
                                @click="openImageModal(getExtendedImages(detail)[1])" />
                        </div>
                    </div>
                    <div class="img-detail-right" data-bs-toggle="modal" data-bs-target="#exampleModaledit1">
                        <img :src="getExtendedImages(detail)[2]" alt="Hình ảnh"
                            @click="openImageModal(getExtendedImages(detail)[2])" />
                    </div>
                </div>

                <div class="img-detail-bottom">
                    <!-- Vòng lặp v-for cho các hình ảnh còn lại -->
                    <div v-for="(image, index) in getExtendedImages(detail).slice(3)" :key="index" class="img-detail-item"
                        data-bs-toggle="modal" data-bs-target="#exampleModaledit1">
                        <img :src="image" alt="Hình ảnh" @click="openImageModal(image)" />
                    </div>
                </div>
            </div>
        </div>
        <!-- tiện ích -->
        <div class="container-tien-ich" v-for="detail in DetailData" id="section3">
            <div class="tienichdetail" v-html="detail.tienIch"></div>
        </div>

        <div class="container-table-chon-phong-dat" ref="tableContainer" id="section2">
            <span class="soDem giaDaGiamBookingTable1">Lựa chọn này có {{ totalRoomsNeeded }} phòng {{ nguoiLon }} người lớn
                {{ treEm }} trẻ
                em</span>
            <table class="table">

                <tbody>
                    <tr v-for="(room, index) in ListBookingRoom" :key="index">
                        <td class="the1">
                            <div class="soluongphongbooking">
                                <div>
                                    {{ room.roomsNeeded }}<i class="bi bi-x"></i>
                                </div>
                                <div class="tenLoaiPhongBooking1">
                                    {{ room.tenLoaiPhong }}
                                </div>
                            </div>

                            <div>
                                <div class="giuongdoidondetail" v-if="room.soGiuongDoi > 0"> {{ room.soGiuongDoi }} giường
                                    đôi </div>
                                <div class="giuongdoidondetail" v-if="room.soGiuongDon > 0">{{ room.soGiuongDon }} giường
                                    đơn </div>
                            </div>
                        </td>
                        <td class="the2">
                            <div class="giaDaGiamBookingTable" v-if="room.giaDaGiam === room.gia"> VND {{ formatCurrency(room.giaDaGiam) }}</div>
                            <template v-else>
                            <div class="giaBookingTable">{{ formatCurrency(room.gia) }}</div>
                            <div class="giaDaGiamBookingTable"> VND {{ formatCurrency(room.giaDaGiam) }}</div>
                        </template>
                        </td>
                        <td class="the3" v-if="index === 0">
                            <div>
                                <div>
                                    <span class="soDem thuePhiBookingTable">{{ soDem }} đêm {{ nguoiLon }} người lớn {{
                                        treEm }} trẻ em</span>
                                </div>
                            </div>
                            <span class="giaDaGiamBookingTable"  v-if="discoutedRiceListRoomBooking===totalListRoomBooking">VND {{ formatCurrency(discoutedRiceListRoomBooking) }}</span>
                            <templafite v-else>
                            <span class="giaBookingTable">{{ formatCurrency(totalListRoomBooking) }} </span>
                            <span class="giaDaGiamBookingTable"> VND {{ formatCurrency(discoutedRiceListRoomBooking) }}
                            </span>
                        </templafite>

                            <button class="toisedatBtn" @click="scrollToTable1">Đặt các lựa chọn của bạn</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="container-table-chon-phong-dat" ref="tableContainer" id="section2">
            <table class="table">
                <thead class="dauTable1">
                    <tr class="tableItemHead">
                        <th class="th1" style="background-color: #4C76B2;">Loại chỗ nghỉ</th>
                        <th class="th2" style="background-color: #4C76B2;">Số lượng khách</th>
                        <th class="th3" style="background-color: #003580;">Giá hôm nay</th>
                        <th class="th4" style="background-color: #4C76B2;">Các lựa chọn</th>
                        <th class="th5" style="background-color: #4C76B2;">Chọn phòng</th>
                        <th class="th6" style="background-color: #4C76B2;"></th><!-- Cột cuối trống -->
                    </tr>
                </thead>
                <tbody v-for="DetailData in DetailData">
                    <tr v-for="(room, index) in DetailData.CategoryRoom" :key="index">
                        <template v-if="room.soLuong > 0">
                            <td class="td1">
                                <div class="tenLoaiPhongBooking">{{ room.tenLoaiPhong }}</div>
                                <div class="tenLoaiPhongBooking111">{{ room.moTa }}</div>
                            </td>
                            <td class="td2 soNguoi123">{{ room.soNguoi }}</td>
                            <td class="td3">
                                <div>
                                    <template v-if="room.gia === parseInt(room.giaDaGiam)">
                                    <span class="d-flex giaDaGiamBookingTable" >VND {{ formatCurrency(room.giaDaGiam)
                                    }}</span>
                                    </template>
                                    <template v-else>
                                    <span class="d-flex giaBookingTable"> VND {{ formatCurrency(room.gia) }}</span>
                                    <span class="d-flex giaDaGiamBookingTable">VND {{ formatCurrency(room.giaDaGiam)
                                    }}</span>
                                    </template>
                                    <span class="d-flex thuePhiBookingTable">Đã bao gồm thuế và phí</span>
                                    <span class="d-flex giamGiaBookingTable" v-if="room.giamGia > 0">Tiết kiệm {{ room.giamGia }}%</span>
                                    <span class="d-flex uuDaiBookingTable">Giảm 10% nếu đã đăng nhập</span>
                                </div>
                            </td>
                            <td class="td4"> {{ cancellationPolicy }} </td>
                            <td class="td5">
    <select class="dropdownQuantityRoom" v-model="selectedValues[room.tenLoaiPhong]"
            @change="BookingRoomDetail(room.tenLoaiPhong)">
        <option class="dropdownQuantityRoomOption" value="0">0</option>
        <option class="dropdownQuantityRoomOption" v-for="n in Math.min(room.soLuong, 10)" :value="n">{{ n }}</option>
    </select>
</td>

                            <td class="td6" v-if="index===0">
                                <button class="toisedatBtn" @click="PushPaymentInfo()">Tôi sẽ đặt</button>
                                <ul>
                                    <li>Chỉ mất có 2 phút</li>
                                    <li>Xác nhận tức thời</li>
                                </ul>
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- comment start -->
        <div class="formBinhLuan">
            <button @click="toggleInvoiceForm()" class="submitbinhluan-rating">Thêm Bình Luận</button>
            <div class="invoice-form" v-if="showInvoiceForm">
                <label for="invoiceNumber">Nhập chi tiết đặt phòng của bạn</label>
                <span>Vui lòng kiểm tra email xác nhận đặt phòng để tìm mã số đặt phòng</span>
                <input type="text" id="invoiceNumber" placeholder="Mã hóa đơn" v-model="maHoaDonXacThuc">
                <button type="submit" @click="xacThucNguoiDung()">Xác Nhận Mã</button>
            </div>
            <div class="container-rating" v-if="showCommentForm">
                <div class="comment-section">
                    <div class="comment-header">
                        <div class="title_danhgiasp">có {{ getDataCommentUserByProduct.length }} đánh giá về khách sạn</div>
                        <div class="rating">
                            <!-- Đánh giá của sản phẩm -->
                            <span v-for="star in stars" :key="star.id" @click="rate(star.value)"
                                :class="{ 'filled': star.filled }">
                                &#9733;
                            </span>
                        </div>
                    </div>
                    <textarea v-model="comment" placeholder="Nhập bình luận của bạn" class="texarea-rating"></textarea>
                    <button @click="submitComment" class="submitbinhluan-rating">Gửi bình luận</button>
                    <!-- Hiển thị bình luận -->
                </div>
            </div>
        </div>
        <div class="comment-list" v-if="getDataCommentUserByProduct.length > 0">
            <div class="comment-item" v-for="(comment, index) in displayedComments" :key="comment.id">
                <div class="comment-info">
                    <div class="comment-user">
                        Tên: {{ comment.User ? comment.User.HoVaTen : 'Người dùng ẩn danh' }}
                    </div>
                    <div class="comment-date">
                        {{ formatTime(comment.createdAt) }}
                    </div>
                </div>
                <div class="comment-rating" v-html="displayRatingStars(comment.sosao)"></div>
                <div class="comment-content">{{ comment.noiDung }}</div>
            </div>
        </div>
        <!-- comment end -->


        <!-- <Footer /> -->
        <a href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>
        <Footer1 />
    </div>
    <div class="modal fade" id="exampleModaledit" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-custom">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <MapboxMap ref="mapboxRef" style="height: 800px" :access-token="mapboxToken"
                        map-style="mapbox://styles/mapbox/streets-v11" :zoom="1">
                        <MapboxMarker :lng-lat="location" />
                    </MapboxMap>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="exampleModaledit1" tabindex="-1" aria-hidden="true" v-if="isImageModalOpen">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <img :src="selectedImageSrc" alt="Hình ảnh được chọn" class="modal-img" />
                </div>
            </div>
        </div>
    </div>
    <div class="spinner-overlay" v-if="showSpinner">
        <div class="spinner"></div>
    </div>
    <toast ref="toast"></toast>
</template>
<script>
import axios from 'axios';
import { MapboxMap, MapboxMarker } from '@studiometa/vue-mapbox-gl';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import Headers from '../../components/Headers.vue';
import Booking from '../../components/Booking.vue';
import Footer1 from '../../components/Footer.vue'
import toast from '../../components/toast.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { ref } from 'vue';
import 'swiper/css';
import 'swiper/css/pagination';
export default {
    components: {
        Headers,
        Booking,
        Footer1,
        Swiper,
        SwiperSlide,
        MapboxMap,
        MapboxMarker,
        toast,
        'vue-ctk-date-time-picker': VueCtkDateTimePicker
    },
    async mounted() {
        this.LoadDataDetail();
        await this.getProvince();
        this.getComment();
        this.mapboxRef = ref(this.$refs.mapboxRef);
        this.calculateTotalDays();
        // this.cancellationPolicy();
        this.DetailData.forEach((detailData) => {
        detailData.CategoryRoom.forEach((room) => {
            // Khởi tạo giá trị mặc định là 0 cho mỗi loại phòng
            this.selectedValues[room.tenLoaiPhong] = 0;
        });
    });
    },
    computed: {
        displayedComments() {
            return this.getDataCommentUserByProduct;
        },
    },
    data() {
        return {
            kinhDo: this.$route.query.lgt,
            viDo: this.$route.query.lati,
            DetailData: [],
            provinces: [],
            minDate: this.calculateLocalDateTime(),
            checkInDate: '',
            checkOutDate: '',
            showProvincesList: false,
            selectedProvince: this.$route.query.province,
            isDropdownVisible: false,
            SoLuongNguoi: 1,
            SoLuongPhong: 1,
            SoLuongTreEm: 0,
            selectArray: [],
            maxSelectCount: 10,
            SearchResult: '',
            isButtonDisplayed: false,
            selectedValues: {},
            selectedRoomInfo: [],
            tongGiaTien: 0,
            numberOfGuests: this.$route.query.numberOfGuests,
            tinhThanh: this.$route.query.province,
            id: '',
            mapboxRef: ref(null),
            mapboxToken: import.meta.env.VITE_TOKEN_MAPBOX,
            location: [0, 0],
            selectedCategoryRoomIds: [],
            selectedRoomInfo: [],
            selectedRoomIds: [],
            totalDays: 0,
            totalListRoomBooking: this.$route.query.totalPrice,
            discoutedRiceListRoomBooking: this.$route.query.discoutedRice,
            ListBookingRoom: JSON.parse(this.$route.query.ListBookingRoom),
            soDem: this.$route.query.soDem,
            nguoiLon: this.$route.query.nguoiLon,
            treEm: this.$route.query.treEm,
            SoLuongTreEm: this.$route.query.groupChild,
            SoLuongNguoi: this.$route.query.numberOfGuests,
            SoLuongPhong: this.$route.query.numberOfRoom,
            soGiuongDoi: this.$route.query.soGiuongDoi,
            soGiuongDon: this.$route.query.soGiuongDon,
            roomsNeeded: this.$route.query.roomsNeeded,
            tenLoaiPhong: [],
            stars: [
                { id: 1, value: 1, filled: false },
                { id: 2, value: 2, filled: false },
                { id: 3, value: 3, filled: false },
                { id: 4, value: 4, filled: false },
                { id: 5, value: 5, filled: false },
            ],
            comment: "",
            products: [],
            selectedProduct: null, // Sản phẩm được chọn
            userId: null,
            getDataCommentUserByProduct: '',
            maxHeight: '200px',
            showInvoiceForm: false,
            showCommentForm: false,
            maHoaDonXacThuc: '',
            selectedImageSrc: null, // Lưu đường dẫn hình ảnh được chọn
            isImageModalOpen: false, // Trạng thái hiển thị của modal
            showSpinner: false,
        };
    },
    watch: {
        '$route.query'(newValue, oldValue) {
            this.LoadDataSearch(newValue);
            window.location.reload();
        },
        getDataCommentUserByProduct(newVal) {
            this.displayedComments = newVal;
        }
    },
    computed: {
        totalRoomsNeeded() {
            let total = 0;
            this.ListBookingRoom.forEach((room) => {
                total += room.roomsNeeded;
            });
            return total;
        },
        cancellationPolicy() {
            const ngayNhanPhongChuoi = this.$route.query.checkInDate;
            if (!ngayNhanPhongChuoi) {
                return "Thông tin ngày nhận phòng không có";
            }
            const ngayNhanPhong = new Date(this.convertDateString(ngayNhanPhongChuoi));
            const homNay = new Date();
            ngayNhanPhong.setHours(0, 0, 0, 0);
            homNay.setHours(0, 0, 0, 0);

            const chenhLechTGianMiliGiay = ngayNhanPhong.getTime() - homNay.getTime();
            const chenhLechNgay = chenhLechTGianMiliGiay / (1000 * 3600 * 24);

            if (ngayNhanPhong < homNay) {
                return "Không thể hủy (ngày đã qua)";
            } else if (chenhLechNgay === 0) {
                return "Phí hủy là toàn bộ tiền phòng";
            } else if (chenhLechNgay >= 1) {
                return "Miễn phí hủy";
            } else {
                return "Phí hủy có thể áp dụng";
            }
        }

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
    methods: {
        getExtendedImages(detail) {
            let images = detail.CategoryRoom[0].images.map(img => img.tenHinh);
            // Mở rộng mảng hình ảnh nếu cần
            while (images.length < 8) {
                images = [...images, ...detail.CategoryRoom[0].images.map(img => img.tenHinh)];
            }
            return images.slice(0, 8);
        },
        convertDateString(dateStr) {
            return dateStr.replace(' sa', '').replace(' ch', '').replace(' ', 'T') + ':00';
        },
        calculateTotalDays() {
            let inDate = new Date(this.convertDateString(this.checkInDate));
            let outDate = new Date(this.convertDateString(this.checkOutDate));
            let differenceInTime = outDate.getTime() - inDate.getTime();
            this.totalDays = Math.round(differenceInTime / (1000 * 3600 * 24));
            console.log('tong ngay: ' + this.totalDays);
            this.checkInDate = this.$route.query.checkInDate;
            this.checkOutDate = this.$route.query.checkOutDate;
        },
        async LoadDataDetail() {
            try {
                const response = await this.$axios.get('GetDataDetailRoom', {
                    params: {
                        KinhDo: this.kinhDo,
                        viDo: this.viDo,
                    },
                });
                this.DetailData = response.data;

                console.log(this.DetailData)
            } catch (error) {
                console.error(error);
            }
        },
        BookingRoomDetail(tenLoaiPhong) {
            const soLuongPhong = this.selectedValues[tenLoaiPhong];
            if (soLuongPhong >= 0) {
                console.log(`Số lượng phòng đã chọn cho loại phòng ${tenLoaiPhong}: ${soLuongPhong}`);
                // Tìm thông tin phòng dựa trên tenLoaiPhong
                const roomInfo = this.DetailData[0].CategoryRoom.find(room => room.tenLoaiPhong === tenLoaiPhong);

                if (roomInfo) {
                    const existingIndex = this.selectedRoomInfo.findIndex(room => room.id === roomInfo.id);
                    if (existingIndex !== -1) {
                        if (soLuongPhong === 0) {
                            this.selectedRoomInfo.splice(existingIndex, 1);
                        } else {
                            this.selectedRoomInfo[existingIndex].soLuongPhong = soLuongPhong;
                        }
                    } else if (soLuongPhong > 0) {
                        this.selectedRoomInfo.push({
                            ...roomInfo,
                            soLuongPhong: soLuongPhong
                        });
                    }
                }
            }
            this.selectedValues[tenLoaiPhong] = soLuongPhong;
            const selectedRooms = [];
            this.idLoaiPhong = [];
            for (let i = 0; i < this.selectedRoomInfo.length; i++) {
                const room = this.selectedRoomInfo[i];
                selectedRooms.push(room);
                this.idLoaiPhong.push(room.id);
            }
            this.tongGiaTien = 0;
            for (let i = 0; i < selectedRooms.length; i++) {
                const room = selectedRooms[i];
                const giaDaGiam = parseFloat(room.giaDaGiam.replace(',', ''));
                const giaTienPhong = giaDaGiam * parseInt(room.soLuongPhong);
                this.tongGiaTien += giaTienPhong;
            }
            console.log(`Tổng giá tiền: ${this.tongGiaTien}`);
            this.calculateTotalDays();
            this.tongGiaTien = this.tongGiaTien * this.totalDays;
            console.log(`Tổng giá tiền sau khi áp dụng số ngày: ${this.tongGiaTien}`);
            this.updateTotalPriceAndRoomIds();
        },
        PushPaymentInfo() {
            console.log()
            if (this.tongGiaTien > 0) {
                this.showSpinner = true;
                setTimeout(() => {
                    const user = JSON.parse(localStorage.getItem('user'));
                    const selectedRoomIds = this.selectedRoomIds.join(',');
                    const quantityArray = Object.entries(this.selectedValues)
                        .filter(([tenLoaiPhong, soLuong]) => soLuong > 0)
                        .map(([tenLoaiPhong, soLuong]) => {
                            return { tenLoaiPhong, soLuong };
                        });
                    const paymentInfo = {
                        checkInDate: this.checkInDate,
                        checkOutDate: this.checkOutDate,
                        numberOfGuests: this.numberOfGuests,
                        totalAmount: this.tongGiaTien,
                        NameHotel: this.DetailData[0].tenKhachSan,
                        Address: this.DetailData[0].diaChi,
                        Quantity: JSON.stringify(quantityArray),
                        idCategoryRoom: this.idLoaiPhong,
                        totalDays: this.totalDays,
                    };
                    if (user && user.id) {
                        // 0.9 là giữ lại 90% giá tiền
                        const discountedTotalAmount = this.tongGiaTien * 0.8;
                        paymentInfo.discount = discountedTotalAmount;
                    }
                    console.log(paymentInfo)
                    this.$router.push({
                        name: 'BookRoom',
                        query: paymentInfo,
                    });
                    this.showSpinner = false;
                }, 2000); // Đặt delay ở đây, ví dụ: 2000ms (2 giây)
            } else {
                this.$refs.toast.showToast('chưa chọn phòng');
            }
        },
        scrollToTable1() {
            const tableContainer = this.$refs.tableContainer;
            if (tableContainer) {
                tableContainer.scrollIntoView({ behavior: 'smooth' });
            }
            this.ListBookingRoom.forEach((room) => {
                this.selectedValues[room.tenLoaiPhong] = room.roomsNeeded;
                this.BookingRoomDetail(room.tenLoaiPhong); // Gọi để cập nhật tổng giá tiền

            });
            console.log(this.selectedValues);
        },
        updateTotalPriceAndRoomIds() {
            this.idLoaiPhong = this.selectedRoomInfo
                .filter(room => this.selectedValues[room.tenLoaiPhong] > 0)
                .map(room => room.id);
            this.tongGiaTien = this.selectedRoomInfo.reduce((total, room) => {
                const giaDaGiam = parseFloat(room.giaDaGiam.replace(',', ''));
                return total + (giaDaGiam * room.soLuongPhong);
            }, 0) * this.totalDays;

            console.log(`Tổng giá tiền: ${this.tongGiaTien}`);
        },

        createMarker() {
            const lngLat = {
                lng: this.kinhDo,
                lat: this.viDo,
            };
            this.location = [lngLat.lng, lngLat.lat];
            if (this.mapboxRef && this.mapboxRef.map) {
                setTimeout(() => {
                    this.mapboxRef.map.flyTo({
                        center: [lngLat.lng, lngLat.lat],
                        zoom: 10,
                        essential: true
                    });
                }, 500);
            }
        },
        scrollToTable() {
            const tableContainer = this.$refs.tableContainer;
            if (tableContainer) {
                tableContainer.scrollIntoView({ behavior: 'smooth' }); // Cuộn mềm mại
            }
        },
        formatCurrency(value) {
            let val = (value / 1).toFixed(0).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
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
        async getProvince() {
            console.log(this.ListBookingRoom)
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
        scrollToSection(targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        },
        rate(value) {
            this.stars.forEach((star) => {
                star.filled = star.value <= value;
            });
        },
        async submitComment() {
            this.isInvoiceSubmitted = true;
            try {
                if (!this.comment || this.stars.filter((star) => star.filled).length === 0) {
                    this.$refs.toast.showToast('Vui lòng điền nội dung và đánh giá sao');
                    return;
                }
                const response = await this.$axios.post(
                    `AddcommentHotels`,
                    {
                        maHoaDonXacThuc: this.maHoaDonXacThuc,
                        noiDung: this.comment,
                        sosao: this.stars.filter((star) => star.filled).length,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log(response.data)
                if (response.status === 200) {
                    // Thêm bình luận mới vào displayedComments
                    let newComment = {
                        // Giả sử các thuộc tính này được trả về từ server
                        User: {
                            // Thông tin người dùng hiện tại, bạn cần cập nhật nó phù hợp
                            HoVaTen: response.data.tenKH,
                        },
                        createdAt: new Date().toISOString(), // Ngày giờ hiện tại hoặc từ server
                        noiDung: this.comment,
                        sosao: this.stars.filter((star) => star.filled).length,
                        // Các thuộc tính khác nếu cần
                    };
                    this.displayedComments.push(newComment);

                    // Làm sạch form bình luận
                    this.comment = "";
                    this.stars.forEach((star) => (star.filled = false));

                    this.$refs.toast.showToast('Thêm đánh giá thành công');
                } else {
                    this.$refs.toast.showToast('Có lỗi xảy ra khi thêm đánh giá');
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    const { message } = error.response.data;
                    this.$refs.toast.showToast(message);
                    this.showInvoiceForm = true;

                } else {
                    this.$refs.toast.showToast('lỗi server');
                }
            }
        },
        toggleInvoiceForm() {
            this.showInvoiceForm = !this.showInvoiceForm;
        },
        async xacThucNguoiDung() {
            const idKhachSan = this.DetailData[0].id;
            try {
                const response = await this.$axios.post(`Verifycomments`, {
                    maHoaDon: this.maHoaDonXacThuc,
                    maKhachSan: idKhachSan,
                })
                if (response.status === 200) {
                    this.showInvoiceForm = false;
                    this.showCommentForm = true;
                }
                console.log(response.data);
            } catch (error) {
                if (error.response && error.response.data) {
                    const { message } = error.response.data;
                    this.$refs.toast.showToast(message);
                    this.showInvoiceForm = true;

                } else {
                    this.$refs.toast.showToast('lỗi server');
                }
            }
        },
        async getComment() {
            const idKhachSan = this.DetailData[0].id;
            try {
                const getComment = await this.$axios.get(`GetcommentHotels/${idKhachSan}`);
                this.getDataCommentUserByProduct = getComment.data;
                this.displayedComments = this.getDataCommentUserByProduct; // Thêm dòng này
                console.log(this.getDataCommentUserByProduct);
            } catch (error) {
                console.error(error);
            }
        },
        scrollToComment() {
            this.$nextTick(() => {
                const container = this.$refs.commentContainer;
                container.scrollTop = 0;
            });
        },
        formatTime(value) {
            return moment(value).format('DD/MM');
        },
        displayRatingStars(rate) {
            // Tạo mảng các thẻ <i> cho biểu tượng ngôi sao dựa trên số sao
            const stars = [];
            for (let i = 1; i <= 5; i++) {
                stars.push(i <= rate ? '<i class="fas fa-star" style="color:#ffe114"></i>' : '<i class="fas fa-star"></i>');
            }
            return stars.join(' '); // Kết hợp các thẻ <i> thành một chuỗi
        },
        openImageModal(imageSrc) {
            this.selectedImageSrc = imageSrc;
            this.isImageModalOpen = true;
        },
        closeImageModal() {
            this.isImageModalOpen = false;
        },
        checkCancellationPolicy() {
            // Giả định checkInDate và checkOutDate được lấy từ truy vấn URL
            var checkInDate = new Date(this.$route.query.checkInDate);
            var today = new Date();
            today.setHours(0, 0, 0, 0); // Đặt thời gian của ngày hôm nay về nửa đêm

            var differenceInTime = checkInDate.getTime() - today.getTime();
            var differenceInDays = differenceInTime / (1000 * 3600 * 24);

            if (differenceInDays < 0) {
                // Ngày đặt phòng là trong quá khứ
                return "Không thể hủy (ngày đã qua)";
            } else if (differenceInDays === 0) {
                // Ngày đặt phòng là ngày hôm nay
                return "Phí hủy là toàn bộ tiền phòng";
            } else if (differenceInDays === 1) {
                // Ngày đặt phòng cách 1 ngày
                return "Miễn phí hủy";
            } else {
                // Các trường hợp khác
                return "Phí hủy có thể áp dụng";
            }
        },

    }
};
</script>
<style scoped>
.hienthibandodetial {
    cursor: pointer;
    color: #0071CE;
}

.modal-custom {
    max-width: 96%;
}

.rating {
    font-size: 24px;
    cursor: pointer;
}

.rating span {
    margin-right: 5px;
}

.rating span.filled {
    color: gold;
}

textarea {
    width: 100%;
    height: 100px;
    margin-top: 10px;
}

.comment-section {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 100%;

}

.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
}

.comment-list {
    margin-bottom: 120px;
    max-height: 400px;
    overflow-y: auto;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.comment-list::-webkit-scrollbar {
    width: 4px;
}

.comment-list::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 2px;
}

.comment-list::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

.comment-item {
    padding: 15px;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    margin-bottom: 15px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.comment-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 0.9em;
}

.comment-user {
    font-weight: 600;
    color: #333;
}

.comment-date {
    color: #888;
    font-style: italic;
}

.comment-rating {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 10px;
}

.comment-rating i {
    color: #ffc107;
    /* Gold color for star ratings */
}

.comment-content {
    color: #444;
    line-height: 1.5;
    white-space: pre-wrap;
    font-size: 1em;
}


.toggle-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 5px 15px;
    cursor: pointer;
    font-size: 14px;
    margin-top: 10px;
}

.container-rating {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    /* Điều chỉnh căn chỉnh theo chiều dọc nếu cần */
}

.comment-section {
    flex: 1;
    /* Để phần đánh giá mở rộng ra toàn bộ không gian còn lại */
    /* Thêm CSS cho phần đánh giá tại đây */
}


.texarea-rating {
    height: 120px;
    border: 1px solid #d9d9d9;
    border-radius: 15px;
}

.submitbinhluan-rating {
    background: #1435c3;
    color: #fff;
    padding: 7px 20px;
    font-size: 15px;
    border-radius: 3px;
    -moz-border-radius: 3px;
    border: solid 1px #1435c3;
    display: inline-block;
    margin-bottom: 120px;
}

.submitbinhluan-rating:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, .5);
}

/* Responsive Styles */
@media (max-width: 768px) {
    .comment-section {
        padding: 10px;
        max-width: 100%;
    }

    .comment-header {
        font-size: 16px;
    }

    .toggle-button {
        font-size: 12px;
    }

    .title_danhgiasp {
        font-size: 14px;
    }

    .container-rating {
        display: inline-block;
    }
}

.invoice-form {
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
    text-align: center;
    margin-bottom: 120px;
}

.invoice-form label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
}

.invoice-form input[type="text"] {
    width: 100%;
    padding: 8px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.invoice-form button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.invoice-form button:hover {
    background-color: #45a049;
}


.modal-img {
    display: block;
    /* Đảm bảo hình ảnh không có khoảng trắng xung quanh */
    max-width: 100%;
    /* Giới hạn độ rộng tối đa của hình ảnh bằng độ rộng của modal */
    max-height: 80vh;
    /* Giới hạn độ cao tối đa của hình ảnh */
    margin: auto;
    /* Canh giữa hình ảnh */
    object-fit: contain;
    /* Đảm bảo hình ảnh không bị méo */
}
</style>
      