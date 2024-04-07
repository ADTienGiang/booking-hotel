<template>
    <footer class="bg-white py-5">
        <div class="container">
            <h4 style="text-align: center;padding-bottom: 50px;">Thêm sửa footer</h4>
            <div class="row text-black g-4">
                <div class="col-md-6 col-lg-3">
                    <a class="text-uppercase text-decoration-none brand text-black" href="index.html">THÔNG TIN</a>
                    <p class="text-black text-muted mt-3">
                        <textarea v-model="formData.content2" rows="10" placeholder="nhập thông tin"></textarea>
                    </p>
                </div>
                <div class="col-md-6 col-lg-3">
                    <h5 class="fw-light mb-3">Liên hệ với chúng tôi</h5>
                    <div class="d-flex justify-content-start align-items-start my-2 text-muted">
                        <span class="me-3">
                            <i class="fas fa-map-marked-alt"></i>
                        </span>
                        <span class="fw-light">
                            <input type="text" v-model="formData.diachi" placeholder="nhập địa chỉ">
                        </span>
                    </div>
                    <div class="d-flex justify-content-start align-items-start my-2 text-muted">
                        <span class="me-3">
                            <i class="fas fa-envelope"></i>
                        </span>
                        <span class="fw-light">
                            <input type="text" v-model="formData.email" placeholder="nhập email">
                        </span>
                    </div>
                    <div class="d-flex justify-content-start align-items-start my-2 text-muted">
                        <span class="me-3">
                            <i class="fas fa-phone-alt"></i>
                        </span>
                        <span class="fw-light">
                            <input type="text" v-model="formData.sdt" placeholder="nhập số điện thoại">
                        </span>
                    </div>
                </div>

                <div class="col-md-6 col-lg-3">
                    <h5 class="fw-light mb-3">Theo dõi chúng tôi tại:</h5>
                    <div>
                        <div class="d-flex justify-content-start align-items-start my-2 text-muted">
                            <span class="me-3">
                                <i class="fab fa-facebook-f"></i>
                            </span>
                            <span class="fw-light">
                                <input type="text" placeholder="nhập link fanpage" v-model="formData.linkSocial1">
                            </span>
                        </div>
                        <div class="d-flex justify-content-start align-items-start my-2 text-muted">
                            <span class="me-3">
                                <i class="fab fa-tiktok"></i>
                            </span>
                            <span class="fw-light">
                                <input type="text" placeholder="nhập link tiktok" v-model="formData.linkSocial2">
                            </span>
                        </div>
                        <div class="d-flex justify-content-start align-items-start my-2 text-muted">
                            <span class="me-3">
                                <i class="fab fa-instagram"></i>
                            </span>
                            <span class="fw-light">
                                <input type="text" placeholder="nhập link instagram" v-model="formData.linkSocial3">
                            </span>
                        </div>
                        <div class="d-flex justify-content-start align-items-start my-2 text-muted">
                            <span class="me-3">
                                <i class="fab fa-pinterest"></i>
                            </span>
                            <span class="fw-light">
                                <input type="text" placeholder="nhập link pinterest" v-model="formData.linkSocial4">
                            </span>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-lg-3">
                    <a class="text-uppercase text-decoration-none brand text-black">THÔNG TIN THÊM</a>
                    <p class="text-black text-muted mt-3">
                        <textarea v-model="formData.content1" rows="10" placeholder="Thông tin thêm"></textarea>
                    </p>
                </div>
            </div>
        </div>
    </footer>
    <!-- footer -->
    <footer class="bg-white py-5">
        <div class="container">
            <h4 style="text-align: center;padding-bottom: 50px;">Footer hiện tại</h4>
            <div class="row text-black g-4" v-for="f in footerData">

                <div class="col-md-6 col-lg-3">
                    <a class="text-uppercase text-decoration-none brand text-black" href="index.html">THÔNG TIN</a>
                    <p class="text-black text-muted mt-3">{{ f.content2 }}</p>
                </div>

                <div class="col-md-6 col-lg-3">
                    <h5 class="fw-light mb-3">Liên hệ với chúng tôi</h5>
                    <div class="d-flex justify-content-start align-items-start my-2 text-muted">
                        <span class="me-3">
                            <i class="fas fa-map-marked-alt"></i>
                        </span>
                        <span class="fw-light">
                            {{ f.diachi }}
                        </span>
                    </div>
                    <div class="d-flex justify-content-start align-items-start my-2 text-muted">
                        <span class="me-3">
                            <i class="fas fa-envelope"></i>
                        </span>
                        <span class="fw-light">
                            {{ f.email }}
                        </span>
                    </div>
                    <div class="d-flex justify-content-start align-items-start my-2 text-muted">
                        <span class="me-3">
                            <i class="fas fa-phone-alt"></i>
                        </span>
                        <span class="fw-light">
                            {{ f.sdt }}
                        </span>
                    </div>
                </div>

                <div class="col-md-6 col-lg-3">
                    <h5 class="fw-light mb-3">Theo dõi chúng tôi tại:</h5>
                    <div>
                        <ul class="list-unstyled d-flex">
                            <li>
                                <a :href="f.linkSocial1" class="text-black text-decoration-none text-muted fs-4 me-4">
                                    <i class="fab fa-facebook-f"></i>
                                </a>
                            </li>
                            <li>
                                <a :href="f.linkSocial2" class="text-black text-decoration-none text-muted fs-4 me-4">
                                    <i class="fab fa-twitter"></i>
                                </a>
                            </li>
                            <li>
                                <a :href="f.linkSocial3" class="text-black text-decoration-none text-muted fs-4 me-4">
                                    <i class="fab fa-instagram"></i>
                                </a>
                            </li>
                            <li>
                                <a :href="f.linkSocial4" class="text-black text-decoration-none text-muted fs-4 me-4">
                                    <i class="fab fa-pinterest"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-3">
                    <a class="text-uppercase text-decoration-none brand text-black" href="index.html">THÔNG TIN THÊM</a>
                    <p class="text-black text-muted mt-3">{{ f.content1 }}</p>
                </div>
            </div>
        </div>
    </footer>
    <!-- end of footer -->

    <button @click="saveFooter">Lưu</button>
    <toast ref="toast"></toast>
</template>
<script>
import toast from '../../components/toast.vue';
export default {
    data() {
        return {
            footerData: [],
            formData: {
                content : '',
                content1 : '',
                content2 : '',
                diachi : '',
                email : '',
                sdt : '',
                linkSocial1 : '',
                linkSocial2 : '',
                linkSocial3 : '',
                linkSocial4 : '',
                linkSocial5 : '',
            }
        };
    },
    components: {
        toast,
    },
    async created() {
        await this.getFooterData();
    },
    methods: {
        async getFooterData() {
            try {
                const response = await this.$axios.get('getFooter');
                this.footerData = response.data;
            } catch (error) {
                console.error('Lỗi khi lấy thông tin footer từ server', error);
            }
        },
        async saveFooter() {
            try {
                const response = await this.$axios.post('addOrUpdateFooter', this.formData);
                this.$refs.toast.showToast(response.data.message);
                this.getFooterData();
            } catch (error) {
                console.error('Lỗi khi lưu thông tin footer', error);
            }
        },
    },
};
</script>