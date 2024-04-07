<template>
    <!-- Booking Start -->
    <div class="container-fluid booking pb-5 wow fadeIn" data-wow-delay="0.1s">
        <div class="container">
            <div class="bg-white shadow" style="padding: 15px; border: 2px solid #FEA116;border-radius: 10px;">
                <div class="row g-2">
                    <div class="col-md-10">
                        <div class="row g-2">
                            <div class="col-md-3 position-relative oInputTinhThanh">
                                <input type="text" class="form-control " placeholder="Bạn muốn đi đâu"
                                    @focus="showProvincesList = true" @blur="scheduleHideProvincesList"
                                    v-model="selectedProvince" />
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
                                                <span class="icon" @click.stop="decrement('SoLuongNguoi')"><i
                                                        class="fas fa-minus"></i>
                                                </span>
                                                <div class="quantity">
                                                    {{ SoLuongNguoi }}
                                                </div>
                                                <span class="icon">
                                                    <i class="fas fa-plus daucong"
                                                        @click.stop="increment('SoLuongNguoi')"></i>
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
                        </div>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-primary w-100" @click="SubmitFormSearch()">Tìm</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Booking End -->
    <toast ref="toast"></toast>
</template>
<script>
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import toast from '../components/toast.vue';
export default {
    components: {
        'vue-ctk-date-time-picker': VueCtkDateTimePicker,
        toast
    },
    data() {
        return {
            provinces: [],
            minDate: this.calculateLocalDateTime(),
            checkInDate: '',
            checkOutDate: '',
            showProvincesList: false,
            selectedProvince: null,
            isDropdownVisible: false,
            SoLuongNguoi: 1,
            SoLuongPhong: 1,
            SoLuongTreEm: 0,
            showDropdown: false,
            selectArray: [],
            maxSelectCount: 10,
        };
    },
    async mounted() {
        await this.getProvince();
    },
    methods: {
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
    },
}
</script>
<style>
.custom-dropdown-toggle {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    border: 1px solid #ccc;
    padding: 5px;
    cursor: pointer;
}

.custom-dropdown-menu {
    max-width: 200px;
    overflow: hidden;
}

.dropdown-list {
    margin-bottom: 10px;
}

.dropdown-list-item {
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 5px;
}

select {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

select:hover {
    border-color: #888;
}</style>
