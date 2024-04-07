import {
  createRouter,
  createWebHistory
} from 'vue-router'
import customerIndexViews from '../views/customer/index.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'customerIndexViews',
      component: customerIndexViews
    },
    {
      path: '/admin_login',
      name: 'admin_login',
      component: () => import('../views/manager/loginadmin.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/manager/admin.vue'),
      beforeEnter: (to, from, next) => {
        const adminInfo = localStorage.getItem('admin');
        if (adminInfo) {
          // Nếu thông tin admin đã tồn tại trong localStorage, cho phép truy cập vào trang admin.
          next();
        } else {
          // Nếu không tìm thấy thông tin admin, chuyển hướng đến trang đăng nhập admin.
          next('/admin_login');
        }
      },
      children: [{
          path: 'user',
          component: () => import('../layout/admin/user.vue'),
          name: 'user'
        },
    
        {
          path: 'bill',
          component: () => import('../layout/admin/bill.vue'),
          name: 'bill'
        },
        {
          path: 'room',
          component: () => import('../layout/admin/room.vue'),
          name: 'room'
        },
        {
          path: 'hotel',
          component: () => import('../layout/admin/hotel.vue'),
          name: 'hotel'
        },
        {
          path: 'province',
          component: () => import('../layout/admin/province.vue'),
          name: 'province'
        },
        {
          path: 'logo',
          component: () => import('../layout/admin/logo.vue'),
          name: 'logo'
        },
        {
          path: 'banner',
          component: () => import('../layout/admin/banner.vue'),
          name: 'banner'
        },
        {
          path: 'contact',
          component: () => import('../layout/admin/contact.vue'),
          name: 'contact'
        },
        {
          path: 'news',
          component: () => import('../layout/admin/news.vue'),
          name: 'news'
        },
        {
          path: 'introduce',
          component: () => import('../layout/admin/introduce.vue'),
          name: 'introduce'
        },
        {
          path: 'footer',
          component: () => import('../layout/admin/footer.vue'),
          name: 'footer'
        },
        {
          path: 'infomation',
          component: () => import('../layout/admin/infomation.vue'),
          name: 'infomation'
        },
        {
          path: 'thu-vien-anh',
           component: () => import('../layout/admin/thu-vien-anh.vue'),
          name: 'thu-vien-anh'
        },
        
      ],
    },
    {
      path: '/dang-nhap',
      name: 'DangNhapNguoiDung',
      component: () => import('../views/customer/LoginUser.vue')
    },
    {
      path: '/dang-ky',
      name: 'DangKyTaiKhoan',
      component: () => import('../views/customer/RegisterUser.vue')
    },

    {
      path: '/searchresults',
      name: 'searchresults',
      component: () => import('../views/customer/ListRoomForSearch.vue')
    },
    {
      path: '/detail',
      name: 'detail',
      component: () => import('../views/customer/DetailRoom.vue')
    },
    {
      path: '/DetailOrderRoom',
      name: 'DetailOrderRoom',
      component: () => import('../views/customer/DetailOrderRoom.vue')
    },
    {
      path: '/DetailLikeHotel',
      name: 'DetailLikeHotel',
      component: () => import('../views/customer/DetailLikeHotel.vue')
    },
    {
      path: '/DetailSeenHotel',
      name: 'DetailSeenHotel',
      component: () => import('../views/customer/DetailSeenHotel.vue')
    },
    {
      path: '/InfomationUser',
      name: 'InfomationUser',
      component: () => import('../views/customer/InfomationUser.vue')
    },
    {
      path: '/BookRoom',
      name: 'BookRoom',
      component: () => import('../views/customer/BookRoom.vue')
    },
    {
      path: '/thongbao',
      name: 'thongbao',
      component: () => import('../components/toat-message.vue')
    },
    {
      path: '/BookRoom/Return',
      name: 'BookRoomReturn',
      component: () => import('../views/customer/BookRoom.Return.vue')
    },
    {
      path: '/BookRoom/Return/DatTruoc',
      name: 'BookRoomReserve',
      component: () => import('../views/customer/BookRoom.return.Reserve.vue')
    },
    {
      path: '/auth/google',
      name: 'google-auth',
      beforeEnter() {
        // redirect đến trang xác thực Google
        window.location.href = 'http://localhost:3000/auth/google'
      }
    },
  ]
})

export default router;
