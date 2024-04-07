<template>
    <nav class="main-header navbar navbar-expand-lg navbar-light bg-light">
        <ul class="navbar-toggle" @click="toggleMobileSidebar">
            <li class="nav-item">
                <a class="nav-link " data-widget="pushmenu"><i class="fas fa-bars iconpc" id="sidebarToggle"></i></a>
            </li>
        </ul>
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link"><i class="fas fa-sign-out-alt mr-1"></i>Đăng xuất</a>
            </li>
        </ul>
    </nav>
    <div class="admin-container">
        <div class="sidebar"
            :class="['sidebar', sidebarCollapsed ? 'sidebar-collapsed' : '']">
            <ul class="navbar-toggle  dauxdongmenuadmin" @click="toggleMobileSidebar">
                    <li class="nav-item">
                    <a  data-widget="pushmenu">
                        <i class="fas icondauxtatmenu" :class="menuOpen ? 'fa-times' : 'fa-bars'" id="sidebarToggle"></i>
                    </a>
                    </li>
                </ul>
            <div class="sidebar-content">
             
                <ul class="lists">
                    <li class="list">
                        <a class="nav-link">
                            <router-link to="/admin/" class="nav-link" @click="highlightMenu('admin')"
                                :class="{ active: activeMenu === 'admin' }">
                                <span class="icon"><i class='bx bxs-tachometer'></i></span>
                                <span class="link">Điều khiển</span>
                            </router-link>
                        </a>
                    </li>
                    <!-- Menu cha 1 -->
               
                    <li class="list">
                        <a class="nav-link" @click="menu12Expanded = !menu12Expanded">
                            <span class="icon"><i class="bx bx-category icon"></i></span>
                            <span class="link">QL Tỉnh thành</span>
                            <i class="bx" :class="menu12Expanded ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
                        </a>
                        <ul v-show="menu12Expanded" class="sub-menu">
                            <li class="list">
                                <router-link to="/admin/province" class="nav-link" @click="highlightMenu('category')"
                                    :class="{ active: activeMenu === 'hotel' }">
                                    <span class="icon"><i class='bx bx-tag-alt'></i></span>
                                    <span class="link">Tỉnh thành</span>

                                </router-link>
                            </li>
                        </ul>
                    </li>
                    <!-- Menu cha 2 -->
                    <li class="list">
                        <a class="nav-link" @click="menu2Expanded = !menu2Expanded">
                            <span class="icon"><i class="bx bx-category icon"></i></span>
                            <span class="link">QL Khách sạn</span>
                            <i class="bx" :class="menu2Expanded ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
                        </a>
                        <ul v-show="menu2Expanded" class="sub-menu">
                            <li class="list">
                                <router-link to="/admin/hotel" class="nav-link" @click="highlightMenu('category')"
                                    :class="{ active: activeMenu === 'hotel' }">
                                    <span class="icon"><i class='bx bx-tag-alt'></i></span>
                                    <span class="link">Khách sạn</span>

                                </router-link>
                            </li>
                        </ul>
                    </li>
                 
                    <li class="list">
                        <a class="nav-link" @click="menu3Expanded = !menu3Expanded">
                            <span class="icon"><i class="bx bx-package icon"></i></span>
                            <span class="link">QL Phòng</span>
                            <i class="bx" :class="menu3Expanded ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
                        </a>
                        <ul v-show="menu3Expanded" class="sub-menu">
                            <li class="list">
                                <router-link to="/admin/room" class="nav-link" @click="highlightMenu('product')"
                                    :class="{ active: activeMenu === 'room' }">
                                    <span class="icon"><i class='bx bx-tag-alt'></i></span>
                                    <span class="link">Phòng</span>

                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <li class="list" :class="{ 'active-menu': menu1Expanded }">
                        <a class="nav-link" @click="menu1Expanded = !menu1Expanded">
                            <span class="icon"><i class="bx bx-user icon"></i></span>
                            <span class="link">QL Khách hàng</span>
                            <i class="bx" :class="menu1Expanded ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
                        </a>
                        <ul v-show="menu1Expanded" class="sub-menu">
                            <li class="list">
                                <router-link to="/admin/user" class="nav-link" @click="highlightMenu('user')"
                                    :class="{ active: activeMenu === 'user' }">
                                    <span class="icon"><i class='bx bx-tag-alt'></i></span>
                                    <span class="link">Tài khoản</span>

                                </router-link>
                            </li>
                        </ul>
                    </li>
                    <!-- <li class="list">
                        <a class="nav-link" @click="menu4Expanded = !menu4Expanded">
                            <span class="icon"><i class="bx bx-extension icon"></i></span>
                            <span class="link">Banner</span>
                            <i class="bx" :class="menu4Expanded ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
                        </a>
                        <ul v-show="menu4Expanded" class="sub-menu">
                            <li class="list">
                                <router-link to="/admin/banner" class="nav-link" @click="highlightMenu('banner')"
                                    :class="{ active: activeMenu === 'banner' }">
                                    <span class="icon"><i class='bx bx-tag-alt'></i></span>
                                    <span class="link">Hình ảnh</span>

                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <li class="list">
                        <a class="nav-link" @click="menu5Expanded = !menu5Expanded">
                            <span class="icon"><i class="bx bx-bulb icon"></i></span>
                            <span class="link">Logo</span>
                            <i class="bx" :class="menu5Expanded ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
                        </a>
                        <ul v-show="menu5Expanded" class="sub-menu">
                            <li class="list">
                                <router-link to="/admin/logo" class="nav-link" @click="highlightMenu('logo')"
                                    :class="{ active: activeMenu === 'logo' }">
                                    <span class="icon"><i class='bx bx-tag-alt'></i></span>
                                    <span class="link">Logo</span>

                                </router-link>
                            </li>
                        </ul>
                    </li> -->

                    <li class="list">
                        <a class="nav-link" @click="menu6Expanded = !menu6Expanded">
                            <span class="icon"><i class="bx bx-layer icon"></i></span>
                            <span class="link">QL Đặt phòng</span>
                            <i class="bx" :class="menu6Expanded ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
                        </a>
                        <ul v-show="menu6Expanded" class="sub-menu">
                            <li class="list">
                                <router-link to="/admin/bill" class="nav-link" @click="highlightMenu('bill')"
                                    :class="{ active: activeMenu === 'order' }">
                                    <span class="icon"><i class='bx bx-tag-alt'></i></span>
                                    <span class="link">Đặt phòng</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>
                    <li class="list">
                        <a class="nav-link" @click="menu8Expanded = !menu8Expanded">
                            <span class="icon"><i class="bx bx-layer icon"></i></span>
                            <span class="link">Xem Thống kê</span>
                            <i class="bx" :class="menu8Expanded ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
                        </a>
                        <ul v-show="menu8Expanded" class="sub-menu">
                            <li class="list">
                                <router-link to="/admin/news" class="nav-link"
                                    :class="{ active: activeMenu === 'order' }" >
                                    <span class="icon"><i class='bx bx-tag-alt'></i></span>
                                    <span class="link"  >Thống kê</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>
                    <!-- <li class="list">
                        <a class="nav-link" @click="menu10Expanded = !menu10Expanded">
                            <span class="icon"><i class="bx bx-layer icon"></i></span>
                            <span class="link">Giới thiệu</span>
                            <i class="bx" :class="menu10Expanded ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
                        </a>
                        <ul v-show="menu10Expanded" class="sub-menu">
                            <li class="list">
                                <router-link to="/admin/introduce" class="nav-link" @click="highlightMenu('introduce')"
                                    :class="{ active: activeMenu === 'order' }" >
                                    <span class="icon"><i class='bx bx-tag-alt'></i></span>
                                    <span class="link"  >Giới thiệu web</span>
                                </router-link>
                            </li>
                        </ul>
                        <ul v-show="menu10Expanded" class="sub-menu">
                            <li class="list">
                                <router-link to="/admin/footer" class="nav-link" @click="highlightMenu('introduce')"
                                    :class="{ active: activeMenu === 'order' }" >
                                    <span class="icon"><i class='bx bx-tag-alt'></i></span>
                                    <span class="link"  >footer(cuối trang)</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>
                    <li class="list">
                        <a class="nav-link" @click="menu11Expanded = !menu11Expanded">
                            <span class="icon"><i class="bx bx-layer icon"></i></span>
                            <span class="link">Thư viện ảnh</span>
                            <i class="bx" :class="menu11Expanded ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
                        </a>
                        <ul v-show="menu11Expanded" class="sub-menu">
                            <li class="list">
                                <router-link to="/admin/thu-vien-anh" class="nav-link" @click="highlightMenu('order')"
                                    :class="{ active: activeMenu === 'order' }">
                                    <span class="icon"><i class='bx bx-tag-alt'></i></span>
                                    <span class="link">Thư viện ảnh</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>
                    <li class="list">
                        <a class="nav-link" @click="menu9Expanded = !menu9Expanded">
                            <span class="icon"><i class="bx bx-layer icon"></i></span>
                            <span class="link">Thông tin admin</span>
                            <i class="bx" :class="menu9Expanded ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
                        </a>
                        <ul v-show="menu9Expanded" class="sub-menu">
                            <li class="list">
                                <router-link to="/admin/infomation" class="nav-link" @click="highlightMenu('order')"
                                    :class="{ active: activeMenu === 'order' }">
                                    <span class="icon"><i class='bx bx-tag-alt'></i></span>
                                    <span class="link">Thiết lập</span>
                                </router-link>
                            </li>
                        </ul>
                    </li> -->
                </ul>
            </div>
        </div>
        <div class="content_Admin" >
            <router-view>
            </router-view>
        </div>
    </div>
    <div class="footer_Admin">
    </div>
</template>

<script>
import '../../assets/css-admin/admin.css';

export default {

    data() {
        return {
            menu1Expanded: false, // Sử dụng để theo dõi trạng thái mở/rút menu con của menu cha 1
            menu2Expanded: false,
            menu3Expanded: false,
            menu4Expanded: false,
            menu5Expanded: false,
            menu6Expanded: false,
            menu7Expanded: false,
            menu8Expanded: false,
            menu9Expanded: false,
            menu10Expanded: false,
            menu11Expanded: false,
            menu12Expanded: false,
            sidebarCollapsed: false, // Khởi tạo trạng thái mở rộng
            activeMenu: null,
            menuOpen: false,
        };
    },
    methods: {
        reloadPage() {
            window.location.reload();
        },
        closeMobileSidebar() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                const sidebarLeft = window.getComputedStyle(sidebar).getPropertyValue('left');
                if (sidebarLeft === '0px') {
                    sidebar.style.left = '-250px'; // Ẩn sidebar bên trái
                }
            }
        },
        toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      const sidebarLeft = window.getComputedStyle(sidebar).getPropertyValue('left');
      if (sidebarLeft === '0px') {
        sidebar.style.left = '-2510px'; // Ẩn sidebar bên trái
        this.menuOpen = false; // Đặt trạng thái menu là false
      } else {
        sidebar.style.left = '0px'; // Hiển thị sidebar
        this.menuOpen = true; // Đặt trạng thái menu là true
      }
    }
  },
        highlightMenu(menuKey) {
            this.activeMenu = menuKey;
        },
        logout() {
            localStorage.removeItem('admin');
            this.$router.push('/admin_login');
        },
    },
};
</script>
