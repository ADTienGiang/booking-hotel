<template>
    <div class="container">
        <div class="table-wrapper">
            <div class="table-title">
                <div class="row">
                    <h2>Quản lý <b>Tỉnh thành</b></h2>
                    <a type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"><i
                            class="fa-solid fa-circle-plus"></i> <span>Thêm tỉnh thành</span></a>
                </div>
            </div>
            <table class="table table-striped table-hover">
                <thead >
                    <tr>
                        <th>Tên tỉnh thành</th>
                        <th>Hình ảnh</th>
                        <th>Sự kiện</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in province" :key="item.id">
                        <td>{{ item.tenTinhThanh }}</td>
                        <td>
                            <div class="image-container">
                                <div class="image-list">
                                    <div class="image-item">
                                        <img :src="item.hinhAnh" alt="Tỉnh thành">
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <a type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModaledit">
                                <i class="fa-solid fa-spinner" @click="setDataForEdit(item)"></i>
                                
                            </a>
                            <a class="delete"><i class="fa-solid fa-trash-can" @click="deleteProvince(item)"></i></a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <toast ref="toast"></toast>
    <!-- Add Modal HTML -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm tỉnh thành </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <select v-model="selectedProvince">
                        <option disabled>Chọn tỉnh thành</option>
                        <option v-for="province in provinces" :key="province.code" :value="province">
                            {{ province.name }}
                        </option>
                    </select>
                    <div class="form-group">
                        <div class="row row-content">
                            <div class="col-md-12">
                                <label>Hình ảnh</label>
                                <div>
                                    <label for="upload">
                                        <input type="file" id="upload" @change="handleFileChange" accept="image/*">
                                    </label>
                                </div>
                                <div class="files">
                                    <h6>Hình đã chọn</h6>
                                    <ul>
                                        <li v-for="(file, index) in filesArr" :key="index">
                                            <img :src="file.url" alt="Selected File" class="file-image"
                                                style="width: 100px;" />
                                            <i class='btn btn-danger btn-sm' @click="removeFile(index)">Xóa ảnh</i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" @click="addNewProvince">Thêm</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Edit Modal HTML -->
    <div class="modal fade" id="exampleModaledit" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <select v-model="selectedProvince" disabled>
                        <option value="" disabled>Chọn tỉnh thành</option>
                        <option v-for="province in provinces" :key="province.code" :value="province" disabled>
                            {{ province.name }}
                        </option>
                    </select>

                    <div class="form-group">
                        <div class="row row-content">
                            <div class="col-md-12">
                                <div v-if="selectedProduct && selectedProduct.hinhAnh" class="current-images">
                                    <h6>Hình Ảnh Hiện Tại</h6>
                                    <ul>
                                        <li>
                                            <img :src="selectedProduct.hinhAnh" alt="Hình ảnh tỉnh thành" class="file-image"
                                                style="width: 100px;" />
                                            <button @click="confirmRemoveImage(selectedProduct.id)"
                                                class="btn btn-danger btn-sm">Xóa ảnh</button>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <label for="upload">
                                        <input type="file" id="upload" multiple @change="handleFileChange" accept="image/*">

                                    </label>
                                </div>
                                <div class="files">
                                    <h6>Hình đã chọn</h6>
                                    <ul>
                                        <li v-for="(file, index) in filesArr" :key="index">
                                            <img :src="file.url" alt="Selected File" class="file-image"
                                                style="width: 100px;" />
                                            <span class="file-size">{{ getFileSize(file.size) }}</span>
                                            <i class='bx bx-message-square-x' @click="removeFile(index)"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" @click="updateProvince">Cập nhập</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import toast from '../../components/toast.vue';
import axios from 'axios'
export default {
    data() {
        return {
            id: '',
            provinces: [],
            province: [],
            selectedProvince: null,
            files: [],
            filesArr: [],
            selectedProduct: null,
            hinhAnh: '',
            code: '',
        };
    },
    components: {
        toast
    },
    created() {
        this.fetchProvinces();
    },
    async mounted() {
        await this.getProvince();
    },
    methods: {
        async getProvince() {
            try {
                const response = await this.$axios.get(`getProvince`);
                this.province = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        fetchProvinces() {
            axios.get("https://provinces.open-api.vn/api/?depth=1").then((response) => {
                this.provinces = response.data;
            });
        },
        async CheckDataProvince() {
            if (!this.selectedProvince) {
                this.$refs.toast.showToast('chưa chọn tỉnh thành');
                return false;
            } else if (this.filesArr.length === 0) {
                this.$refs.toast.showToast('vui lòng chọn hình ảnh tỉnh thành');
                return false;
            } else if (this.filesArr.length > 1) {
                this.$refs.toast.showToast('chỉnh được chọn 1 hình ảnh');
                return false;
            }
            return true;// Trả về true nếu tất cả các điều kiện đều đúng
        },
        async addNewProvince() {
            try {
                if (await this.CheckDataProvince() == true) {
                    const formData = new FormData();
                    for (let i = 0; i < this.hinhAnh.length; i++) {
                        const file = this.hinhAnh[i];
                        formData.append('hinhAnh', file);
                    }
                    formData.append('tenTinhThanh', this.selectedProvince.name);
                    formData.append('code', this.selectedProvince.code);

                    try {
                        const response = await this.$axios.post(
                            'addProvince',
                            formData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                },
                            }
                        );

                        if (response.status === 201 || response.status === 200) {
                            this.$refs.toast.showToast(response.data.message);
                            this.getProvince(); // Làm mới danh sách tỉnh thành
                            this.resetForm();
                        } else {
                            this.$refs.toast.showToast(response.data.message, 'error');
                        }
                    } catch (error) {
                        // Xử lý khi server trả về thông báo lỗi (tỉnh thành đã tồn tại)
                        if (error.response && error.response.data) {
                            this.$refs.toast.showToast(error.response.data.message, 'error');
                        } else {
                            console.error('Lỗi khi thêm tỉnh thành: ', error);
                        }
                    }
                }
            } catch (error) {
                console.log(error)
            }
        },
        async deleteProvince(province) {
            const confirmed = window.confirm("Bạn có chắc muốn xóa tỉnh thành này?");

            if (confirmed) {
                try {
                    const response = await this.$axios.delete(`deleteProvince/` + province.id);
                    this.$refs.toast.showToast(response.data.message);

                    // Xác định xóa thành công trước khi gọi getProvince()
                    if (response.status === 200) {
                        this.getProvince();
                    }
                } catch (error) {
                    if (error.response && error.response.data) {
                        const { message } = error.response.data;
                        this.$refs.toast.showToast(message);
                    } else {
                        this.$refs.toast.showToast('lỗi server');
                    }
                }
            }
        },

        async updateProvince() {
            try {
                if (!this.selectedProvince) {
                    this.$refs.toast.showToast('chưa chọn tỉnh thành');
                    return;
                }
                const formData = new FormData();

                for (let i = 0; i < this.hinhAnh.length; i++) {
                    const file = this.hinhAnh[i];
                    formData.append('hinhAnh', file);
                }
                formData.append('code', this.selectedProvince.code);
                formData.append('tenTinhThanh', this.selectedProvince.name);

                const response = await this.$axios.put(
                    `updateProvince/${this.id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                    }
                );

                // Kiểm tra phản hồi từ server và xử lý
                if (response.data.message) {
                    this.$refs.toast.showToast(response.data.message);
                    if (response.status === 200 || response.status === 201) {
                        // Nếu cập nhật thành công hoặc thêm mới thành công
                        this.getProvince();
                    }
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    // Hiển thị thông báo lỗi từ phản hồi server
                    this.$refs.toast.showToast(error.response.data.message, 'error');
                } else {
                    console.error('Lỗi khi cập nhật tỉnh thành: ', error);
                    this.$refs.toast.showToast('Có lỗi xảy ra khi cập nhật tỉnh thành', 'error');
                }
            }
        },
        async setDataForEdit(item) {
            this.selectedProduct = item;
            this.id = item.id;
            this.tenTinhThanh = item.tenTinhThanh;
            this.hinhAnh = item.hinhAnh;
            $('#exampleModaledit').modal('show');

            // Tìm kiếm tỉnh thành dựa trên tên tỉnh thành
            const selectedProvince = this.provinces.find(province => province.name === item.tenTinhThanh);
            if (selectedProvince) {
                this.selectedProvince = selectedProvince;
            } else {
                console.log('Province not found for editing');
            }
        },
        async confirmRemoveImage(provinceId) {
            const confirmation = await confirm('Bạn có muốn xóa hình ảnh này không?');
            if (confirmation) {
                this.removeImage(provinceId);
            }
        },
        async removeImage(provinceId) {
            console.log(provinceId);
            try {
                const response = await this.$axios.delete(`deleteImageProvince/${provinceId}`);
                console.log(response.data.message);

                // Tìm index của đối tượng trong mảng province
                const index = this.province.findIndex(item => item.id === provinceId);

                if (index !== -1) {
                    // Cập nhật hình ảnh của đối tượng đó thành null hoặc loại bỏ đối tượng khỏi mảng
                    this.province[index].hinhAnh = null;
                }
            } catch (error) {
                console.error('Lỗi khi xóa hình ảnh:', error);
            }
        },
        resetForm() {
            this.selectedProvince = null; // Reset lựa chọn tỉnh thành
            this.filesArr = []; // Xóa danh sách các file đã chọn
            this.hinhAnh = ''; // Xóa biến hình ảnh
            if (this.$refs.upload) {
                this.$refs.upload.value = ''; // Xóa input file nếu có
            }
        },
        handleFileChange(event) {
            const files = event.target.files;
            this.hinhAnh = files;

            const filesArr = Array.from(files);

            // Lặp qua danh sách các tệp để tạo URL cho từng tệp
            for (let i = 0; i < filesArr.length; i++) {
                const file = filesArr[i];
                file.url = URL.createObjectURL(file); // Thêm thuộc tính url vào tệp
            }

            this.filesArr = filesArr;
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
        removeFile(index) {
            URL.revokeObjectURL(this.getFileUrl(this.filesArr[index])); // Giải phóng URL
            this.filesArr.splice(index, 1);
        },
        getFileUrl(file) {
            return URL.createObjectURL(file);
        },
    },
};
</script>
<style scoped>
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
</style>



