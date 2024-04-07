<template>
    <!-- Room Start -->
    <div class="container-xxl py-5">
        <div class="container">
            <div class="text-center wow fadeInUp" data-wow-delay="0.1s">
                <h6 class="section-title text-center text-primary text-uppercase">Phòng của chúng tôi</h6>
                <h1 class="mb-5">Khám phá <span class="text-primary text-uppercase">Phòng</span></h1>
            </div>
            <swiper :slides-per-view="3" :space-between="30" class="mySwiper">
                <swiper-slide v-for="room in rooms">
                    <div class="room-item shadow rounded overflow-hidden">
                        <div class="position-relative">
                            <swiper :modules="modules">
                                <swiper-slide v-for="img in room.images" :key="img.duongDan">
                                        <div class="aspect-ratio-box">
                                            <img :src="img.duongDan" alt="" class="img-fluid" />
                                        </div>
                                </swiper-slide>
                            </swiper>
                            <small
                                class="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">VND {{ room.gia }}</small>
                        </div>
                        <div class="p-4 mt-2">
                            <div class="d-flex justify-content-between mb-3">
                                <h5 class="mb-0">Phòng nhỏ</h5>
                                <div class="ps-2">
                                    <small class="fa fa-star text-primary"></small>
                                    <small class="fa fa-star text-primary"></small>
                                    <small class="fa fa-star text-primary"></small>
                                    <small class="fa fa-star text-primary"></small>
                                    <small class="fa fa-star text-primary"></small>
                                </div>
                            </div>
                            <div class="d-flex mb-3">
                                <small class="border-end me-3 pe-3"><i class="fa fa-bed text-primary me-2"></i>3
                                    Giường</small>
                                <small class="border-end me-3 pe-3"><i class="fa fa-bath text-primary me-2"></i>2 Bồn
                                    tắm</small>
                                <small><i class="fa fa-wifi text-primary me-2"></i>Wifi</small>
                            </div>
                            <p class="text-body mb-3">Nằm tại vị trí thuận tiện ở trung tâm Hà Nội, The Sono Hanoi Hotel
                                cách Ô Quan Chưởng 7 phút đi bộ và Đền Quán Thánh 1.5 km. Khách sạn 3 sao này có máy ATM và
                                dịch vụ tiền sảnh. Chỗ nghỉ cung cấp lễ tân 24/24, dịch vụ đưa đón sân bay, dịch vụ phòng và
                                Wi-Fi miễn phí.</p>
                            <div class="d-flex justify-content-between">
                                <a class="btn btn-sm btn-primary rounded py-2 px-4" href="">Xem chi tiết</a>
                                <a class="btn btn-sm btn-dark rounded py-2 px-4" href="">Đặt ngay</a>
                            </div>
                        </div>
                    </div>
                </swiper-slide>
                <!-- Bạn có thể thêm nhiều swiper-slide tương tự ở đây cho mỗi phòng -->

            </swiper>

        </div>
    </div>

    <!-- Room End -->
    <toast ref="toast"></toast>
</template>

<script>
import toast from '../components/toast.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
export default {

    data() {
        return {
            id: '',
            MaKhachSan: '',
            tenLoaiPhong: '',
            DuongDanPhong: '',
            soNguoi: '',
            soGiuong: '',
            trangThaiPhong: '',
            moTa: '',
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
        };
    },
    components: {
        Swiper,
        SwiperSlide,
        toast
    },
    async mounted() {
        await this.getRooms();
        await this.getHotels();
    },
    methods: {
        async getRooms() {
            try {
                const response = await this.$axios.get(`getRooms`);
                this.rooms = response.data;
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
    }
}
</script>

