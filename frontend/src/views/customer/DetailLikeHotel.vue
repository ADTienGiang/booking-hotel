<template>
    <div class="container-xxl bg-white p-0">
        <Headers />

        <div class="breadcrumb">
            <span class="breadcrumb-part">Trang chủ</span>
            <span class="breadcrumb-part"><i class='bi bi-chevron-right'></i></span>
            <span class="breadcrumb-part">Chi tiết Khách sạn đã thích</span>

        </div>
        <div class="flex-container">

            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div v-for="(hotel, index) in dataLike" :key="index"
                        class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300 border-solid">

                        <!-- Kiểm tra xem hotel hiện tại có phải là hotel đã xóa tạm thời không -->
                        <div v-if="!temporaryDeleted || temporaryDeleted.maKhachSan !== hotel.maKhachSan">
                            <img class="w-full custom-size object-cover" :src="hotel.hotels.ImgHotel[0].duongDan"
                                :alt="hotel.hotels.tenKhachSan + ' hotel exterior view'">
                            <div class="p-4">
                                <h5 class="text-lg font-semibold text-ellipsis">{{ hotel.hotels.tenKhachSan }}</h5>
                                <div class="flex items-center mb-4">
                                    <span class="text-yellow-400 mr-1" v-for="n in 5" :key="n">
                                        <i
                                            :class="getStarType(n, calculateAverageRatingForHotel(hotel.hotels.Evaluate))"></i>
                                    </span>
                                    <div v-if="getHotelData(hotel.hotels.id)">
                                        <div>
                                            {{ getHotelData(hotel.hotels.id).totalDays }} đêm
                                            {{ getHotelData(hotel.hotels.id).numberOfGuests }} người lớn
                                            {{ getHotelData(hotel.hotels.id).numberOfGuests }} trẻ em
                                        </div>
                                        <div>
                                            <span class="giaBookingTable">VND {{
                                                formatCurrency(getHotelData(hotel.hotels.id).totalRoomPrice) }}</span> <span
                                                class="giaDaGiamBookingTable">VND {{
                                                    formatCurrency(getHotelData(hotel.hotels.id).discoutedRice) }} </span>
                                        </div>
                                    </div>

                                    <div class="text-gray-600 text-sm">
                                        <template v-if="calculateAverageRatingForHotel(hotel.hotels.Evaluate) > 0">
                                            {{ calculateAverageRatingForHotel(hotel.hotels.Evaluate).toFixed(1) }} / 10
                                            <span v-if="hotel.hotels.Evaluate.length > 0">
                                                ({{ hotel.hotels.Evaluate.length }} đánh giá)
                                            </span>
                                        </template>
                                        <template v-else>
                                            Chưa có đánh giá
                                        </template>
                                    </div>

                                </div>
                                <div class="flex justify-between items-center">
                                    <!-- <div class="text-lg font-semibold">VND {{ hotel.hotels.CategoryRoom[0].giaDaGiam }}</div> -->
                                    <button @click="DetailHotel(hotel)" class="xemchonghi">Xem
                                        chỗ nghỉ</button>
                                    <button @click="deleteHotel(hotel)" class="xoaChoNghiDaXem">
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="flex justify-center items-center h-screen" v-if="temporaryDeleted">
                        <button
                            class="bg-blue-200 border border-blue-300 text-blue-700 px-4 py-2 rounded shadow btn-capitalize-first"
                            @click="undoDelete">
                            Hoàn tác
                        </button>
                    </div>

                </div>

            </div>
        </div>


        <a href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>
        <Footer1 />
    </div>
    <toast ref="toast"></toast>
</template>
<script>
import Headers from '../../components/Headers.vue';
import Booking from '../../components/Booking.vue';
import Footer1 from '../../components/Footer.vue';
import toast from '../../components/toast.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import axios from 'axios'
import 'swiper/css';
import 'swiper/css/pagination';
export default {
    components: {
        Headers,
        Booking,
        Swiper,
        SwiperSlide,
        toast,
        Footer1,
    },
    data() {
        return {
            userInfo: [],
            dataLike: [],
            tongSoHoaDon: 0,
            maHoaDon: '',
            temporaryDeleted: null,
            deleteTimeout: null,
            maKhachSan: '',
            checkInDate: '',
            checkOutDate: '',
            totalDays: 0,
            hotelDataArray: [],
        };
    },
    async mounted() {
        await this.getUserByLocalStorage();
        await this.getDetailUserLike();
        await this.getDataLikeLocalStorage();
        await this.calculateTotalDays();
    },
    methods: {
        getHotelData(hotelId) {
            return this.hotelDataArray.find(hotel => hotel.idHotel === hotelId);
        },
        async getDetailUserLike() {
            try {
                const response = await this.$axios.get(`getlike/${this.userInfo.id}`);
                this.dataLike = response.data;
                console.log(this.dataLike);
            } catch (error) {
                console.log('Lỗi: ' + error);
            }
        },
        getUserByLocalStorage() {
            const user = JSON.parse(localStorage.getItem('user')); // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
            this.userInfo = user;
        },
        async deleteHotel(hotel) {
            console.log(hotel.maKhachSan)
            this.temporaryDeleted = hotel; // Lưu trữ thông tin phần tử bị xóa tạm thời
            this.deleteTimeout = setTimeout(() => {
                this.confirmDelete(hotel.maKhachSan);
                this.temporaryDeleted = null; // Xóa thông tin tạm thời sau 5 giây
            }, 5000); // Xóa sau 5 giây nếu không hoàn tác
            this.dataLike = this.dataLike.filter(h => h.maKhachSan !== hotel.maKhachSan);
        },
        confirmDelete(id) {
            try {
                this.$axios.post(`addlike`, {
                    maKhachHang: this.userInfo.id,
                    maKhachSan: id,
                    status: false,
                });
            } catch (error) {
                console.log('Error deleting like: ', error);
            }
        },
        undoDelete() {
            clearTimeout(this.deleteTimeout); // Hủy timeout
            this.dataLike.push(this.temporaryDeleted); // Thêm lại phần tử vào danh sách
            this.temporaryDeleted = null; // Xóa thông tin tạm thời
        },
        getDataLikeLocalStorage() {
            const likedHotels = JSON.parse(localStorage.getItem('likedHotels')) || [];
            likedHotels.forEach((hotel) => {
                const url = hotel.url;
                const urlParams = new URLSearchParams(url.split('?')[1]);
                const ListBookingRoom = urlParams.get('ListBookingRoom');
                const bookingRooms = JSON.parse(decodeURIComponent(ListBookingRoom));

                const hotelData = {
                    idHotel: bookingRooms[0].idHotel,
                    province: urlParams.get('province'),
                    checkInDate: urlParams.get('checkInDate'),
                    checkOutDate: urlParams.get('checkOutDate'),
                    numberOfGuests: urlParams.get('numberOfGuests'),
                    totalRoomPrice: urlParams.get('totalPrice'),
                    discoutedRice: urlParams.get('discoutedRice'),
                    groupChild: urlParams.get('groupChild'),
                    numberOfRoom: urlParams.get('numberOfRoom'),
                    totalDays: this.calculateTotalDays(urlParams.get('checkInDate'), urlParams.get('checkOutDate'))
                };
                this.hotelDataArray.push(hotelData);
            });
            console.log(this.hotelDataArray)
        },
        convertDateString(dateStr) {
            return dateStr.replace(' sa', '').replace(' ch', '').replace(' ', 'T') + ':00';
        },
        calculateTotalDays(checkInDate, checkOutDate) {
            let inDate = new Date(this.convertDateString(checkInDate));
            let outDate = new Date(this.convertDateString(checkOutDate));
            let differenceInTime = outDate.getTime() - inDate.getTime();
            return Math.round(differenceInTime / (1000 * 3600 * 24));
        },
        DetailHotel(hotel) {
            console.log(hotel.maKhachSan);
            const likedHotels = JSON.parse(localStorage.getItem('likedHotels') || '[]');
            const hotelData = likedHotels.find(item => item.id === hotel.maKhachSan);
            if (hotelData && hotelData.url) {
                window.location.href = hotelData.url;
            } else {
                console.log('Không tìm thấy URL cho khách sạn này.');
            }
        },
        formatDate(dateTimeString) {
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            };
            const formattedDate = new Date(dateTimeString).toLocaleString('en-US', options);
            return formattedDate;
        },
        calculateAverageRatingForHotel(evaluations) {
            if (!evaluations || evaluations.length === 0) return 0;
            const totalStars = evaluations.reduce((sum, review) => sum + review.sosao, 0);
            return (totalStars / evaluations.length) * 2; // Chuyển sang thang điểm 10
        },
        getStarType(index, rating) {
            const ratingOutOfFive = rating / 2; // Since 5 stars represent a 10/10 rating
            const fullStarThreshold = Math.floor(ratingOutOfFive);
            const halfStarThreshold = ratingOutOfFive - fullStarThreshold >= 0.5 ? 1 : 0;
            if (index <= fullStarThreshold) {
                return 'fas fa-star'; // full star
            } else if (index === fullStarThreshold + halfStarThreshold) {
                return 'fas fa-star-half-alt'; // half star
            } else {
                return 'far fa-star'; // empty star
            }
        },
        starWidth(rating) {
            return (rating / 10) * 100;
        },
        formatCurrency(value) {
            let val = (value / 1).toFixed(0).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
    }
};
</script>
<style scoped>
body {
    font-family: 'Open+Sans', sans-serif;
}

.fas.fa-star,
.fas.fa-star-half-alt {
    color: #FFB700;
    /* Màu vàng cho ngôi sao đầy đủ và nửa ngôi sao */
}

.btn-no-uppercase::first-letter {
    text-transform: lowercase;
}

/* Ensure the button text 'Hoàn tác' has the first letter capitalized */
.btn-capitalize-first::first-letter {
    text-transform: uppercase;
}

.far.fa-star {
    color: #ccc;
    /* Màu xám hoặc màu sắc khác tùy bạn chọn cho ngôi sao trống */
}

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
    justify-content: center;
    align-items: center;
}

.grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    /* Adjust as needed */
}

/* Adjust the width based on your layout needs */
.grid>.bg-white {
    margin-bottom: 24px;
    margin-left: 10px;
    /* Set the bottom margin to create gap between items */
}


.table {
    width: 80%;
    border-collapse: collapse;
    margin: 0 auto;
}

th,
td {
    padding: 8px;
    border: 1px solid #ccc;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

.custom-size {
    width: 265px;
    height: 195px;
}

.text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    /* Adjust as needed */
}</style>
  
      