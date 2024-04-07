<template>
  <div class="add-intro-container">
    <h2>{{ isEditing ? 'Chỉnh sửa giới thiệu' : 'Thêm giới thiệu Mới' }}</h2>
    <form @submit.prevent="submitForm">
      <div class="row row-content">
        <div class="col-md-12">
          <label for="content">Nội dung:</label>
          <!-- Sử dụng v-model để liên kết nội dung với biến content -->
          <textarea id="content" v-model="content"></textarea>
        </div>
      </div>
      <button type="submit">{{ isEditing ? 'Cập nhật' : 'Lưu' }}</button>
      <button v-if="!isEditing" @click="editIntro">Chỉnh sửa giới thiệu</button>
    </form>
    <div v-if="currentIntro">
      <h3>Nội dung giới thiệu Hiện Tại:</h3>
      <div v-html="currentIntro.content"></div>
    </div>
  </div>
  <toast ref="toast"></toast>
</template>
<script>
import toast from '../../components/toast.vue';
export default {
async mounted() {
  this.getIntroAndSetContent();
  const self = this;
  tinymce.init({
    selector: 'textarea',
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
    setup(editor) {
      editor.on('change', () => {
        self.content = editor.getContent();
      });
    },
  });
},
data() {
    return {
      content: '',
      isEditing: false, // Thêm biến để kiểm tra xem bạn đang chỉnh sửa intro
      currentIntro: null, // Thêm biến để lưu trữ intro hiện tại
    };
  },
  components: {
    toast,
  },
  methods: {
    async submitForm() {
      if (!this.content) {
        this.$refs.toast.showToast('Chưa nhập nội dung');
        return;
      }
      try {
        if (this.isEditing) {
          // Chỉnh sửa intro hiện tại nếu đang ở chế độ chỉnh sửa
          const updatedIntro = await this.$axios.put('editIntro', { content: this.content });
          this.$refs.toast.showToast(updatedIntro.data.message);
          this.currentIntro = updatedIntro.data.intro;
        } else {
          // Thêm intro mới nếu đang ở chế độ thêm mới
          const newIntro = await this.$axios.post('addIntro', { content: this.content });
          this.$refs.toast.showToast(newIntro.data.message);
          this.currentIntro = newIntro.data.intro;
        }
        tinymce.get('content').setContent('');
        this.getIntroAndSetContent();
      } catch (error) {
        console.error('Lỗi khi thêm hoặc chỉnh sửa intro:', error);
      }
    },
    async getIntroAndSetContent() {
    try {
      const response = await this.$axios.get('getCurrentIntro'); 
      if (response.data.intro) {
        const content = response.data.intro.content;
        tinymce.get('content').setContent(content);
        this.content = content;
        this.isEditing = true;
        this.currentIntro = response.data.intro;
      }
    } catch (error) {
      console.error('Lỗi khi lấy và hiển thị intro:', error);
    }
  },
  editIntro() {
      this.isEditing = true;
      this.content = this.currentIntro ? this.currentIntro.content : '';
      tinymce.get('content').setContent(this.content);
    },
  },
};
</script>