<template>
  <div class="container-rating">
    <div class="comment-section">
    <div class="comment-header">
      <div class="title_danhgiasp">có {{ getDataCommentUserByProduct.length }} đánh giá về sản phẩm</div>
      <div class="rating">
        <!-- Đánh giá của sản phẩm -->
        <span v-for="star in stars" :key="star.id" @click="rate(star.value)" :class="{ 'filled': star.filled }">
          &#9733;
        </span>
      </div>
    </div>
    <textarea v-model="comment" placeholder="Nhập bình luận của bạn" class="texarea-rating"></textarea>
    <button @click="submitComment" class="submitbinhluan-rating">Gửi bình luận</button>

    <!-- Hiển thị bình luận -->
    <div class="comment-list" ref="commentContainer" v-if="getDataCommentUserByProduct.length > 0">
      <div class="comment-item" v-for="(comment, index) in displayedComments" :key="comment.id">
        <div class="comment-info">
          <div class="comment-user">
            Tên: {{ comment.user ? comment.user.username : 'người dùng' }}
          </div>
          <div class="comment-date">
            {{ formatTime(comment.createdAt) }}
          </div>
        </div>
        <div class="comment-rating" v-html="displayRatingStars(comment.rate)"></div>
        <div class="comment-content">{{ comment.content }}</div>
        <div v-if="comment.user && comment.user.username" class="comment-username">
          Tên người dùng: {{ comment.user.username }}
        </div>
      </div>
    </div>

  <toast ref="toast"></toast>
  </div>
  </div>
  
</template>
<script>
import toast from '../../components/toast.vue';
import moment from 'moment';
export default {
  components:
    {
      toast,
    },
  data() {
    
    return {
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
    };
  },
  computed: {
    displayedComments() {
      // Nếu người dùng đã chọn xem tất cả, hiển thị tất cả bình luận, ngược lại hiển thị 5 bình luận ban đầu
      return this.getDataCommentUserByProduct;
    },
  },
  methods: {
    async getIdUser() {
      const user = JSON.parse(localStorage.getItem('user'));
      if(user){
        this.userId = user.id;
      }else{

      }
    },
    async getproduct() {
      try {
        const result = await this.$axios.get(`renderProduct`);
        this.products = result.data;
        const duongDanSanPhamOnURL = this.$route.params.duong_dan_san_pham;
        this.selectedProduct = this.products.find(
          (product) => product.duong_dan_san_pham === duongDanSanPhamOnURL
        );

      } catch (e) {
        console.log(e);
      }
    },
    rate(value) {
      this.stars.forEach((star) => {
        star.filled = star.value <= value;
      });
    },
    async submitComment() {
    try {
    let user = localStorage.getItem("user");
    const userData = JSON.parse(user);
    if (!userData) {
      this.$refs.toast.showToast('Vui lòng đăng nhập để bình luận');
      return;
    }
    if (!this.selectedProduct) {
      this.$refs.toast.showToast('Không tìm thấy sản phẩm');
      return;
    }
    if (!this.comment || this.stars.filter((star) => star.filled).length === 0) {
      this.$refs.toast.showToast('Vui lòng điền nội dung và đánh giá sao');
      return;
    }
    const response = await this.$axios.post(
      `AddcommentProduct`,
      {
        id_sp: this.selectedProduct.id,
        id_kh: this.userId,
        content: this.comment,
        rate: this.stars.filter((star) => star.filled).length,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 201) {
      this.comment = "";
      this.stars.forEach((star) => {
        star.filled = false;
      });
      const newComment = {
        id_sp: this.selectedProduct.id,
        id_kh: this.userId,
        content: this.comment,
        rate: this.stars.filter((star) => star.filled).length,
        createdAt: new Date().toISOString(),
      };
      this.getDataCommentUserByProduct.unshift(newComment);
      this.getIdUser();
      this.getComment();
      this.scrollToComment();
    } else {
      this.$refs.toast.showToast('Có lỗi xảy ra khi thêm đánh giá');
    }
  } catch (error) {
    this.$refs.toast.showToast('Có lỗi xảy ra');
  }
},
    async getComment() {
      try {
        const duongDanSanPham = this.$route.params.duong_dan_san_pham; 
        const getComment = await this.$axios.get(`GetcommentProduct/${duongDanSanPham}`);
        this.getDataCommentUserByProduct = getComment.data;
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
        stars.push(i <= rate ? '<i class="bx bxs-star" style="color:#ffe114"></i>' : '<i class="bx bxs-star"></i>');
      }
      return stars.join(' '); // Kết hợp các thẻ <i> thành một chuỗi
    },


  },
  mounted() {
    this.getIdUser();
    this.getComment()
    this.getproduct();
    this.getComment();
  },
};
</script>
  
<style scoped>
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
  max-width: 49%;
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
  max-height: 400px;
  overflow-y: auto;
}


.comment-list::-webkit-scrollbar {
 width: 2px;
}
.comment-list::-webkit-scrollbar-thumb {
  background-color: #888; 
}
.comment-list::-webkit-scrollbar-track {
  background-color: #f1f1f1; 
}

.comment-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.comment-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.comment-user {
  font-weight: bold;
}

.comment-date {
  color: #777;
}

.comment-rating {
  margin-bottom: 5px;
}

.comment-content {
  white-space: pre-wrap;
}

.comment-username {
  color: #777;
  font-style: italic;
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
  align-items: flex-start; /* Điều chỉnh căn chỉnh theo chiều dọc nếu cần */
}

.comment-section {
  flex: 1; /* Để phần đánh giá mở rộng ra toàn bộ không gian còn lại */
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
    margin-bottom: 10px;
}
.submitbinhluan-rating:hover {
  box-shadow: 0 0 10px rgba(0,0,0,.5);
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
</style>
  