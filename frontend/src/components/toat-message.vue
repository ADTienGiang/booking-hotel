<template>
    <!-- Replace with your actual HTML content -->
    <div>
      <ul class="notifications" ref="notifications">
        <!-- Notifications will be added here -->
      </ul>
      <div class="buttons" ref="buttons">
        <button id="success" class="btn" @click="createToast('success')">Success</button>
        <button id="error" class="btn" @click="createToast('error')">Error</button>
        <button id="warning" class="btn" @click="createToast('warning')">Warning</button>
        <button id="info" class="btn" @click="createToast('info')">Info</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ToastNotifications',
    mounted() {
      // Ensure that the buttons are available in the DOM
      const buttons = this.$refs.buttons.querySelectorAll(".btn");
  
      buttons.forEach(btn => {
        btn.addEventListener("click", () => this.createToast(btn.id));
      });
    },
    methods: {
      createToast(id) {
        console.log('ok')
        const { icon, text } = this.toastDetails[id];
        const toast = document.createElement("li");
        toast.className = `toast ${id}`;
        toast.innerHTML = `
          <div class="column">
            <i class="fa-solid ${icon}"></i>
            <span>${text}</span>
          </div>
          <i class="fa-solid fa-xmark" @click="removeToast(toast)"></i>
        `;
        this.$refs.notifications.appendChild(toast);
        toast.timeoutId = setTimeout(() => this.removeToast(toast), this.toastDetails.timer);
      },
      removeToast(toast) {
        toast.classList.add("hide");
        if (toast.timeoutId) clearTimeout(toast.timeoutId);
        setTimeout(() => toast.remove(), 500);
      }
    },
    data() {
      return {
        toastDetails: {
          timer: 5000,
          success: {
            icon: 'fa-circle-check',
            text: 'Success: This is a success toast.',
          },
          error: {
            icon: 'fa-circle-xmark',
            text: 'Error: This is an error toast.',
          },
          warning: {
            icon: 'fa-triangle-exclamation',
            text: 'Warning: This is a warning toast.',
          },
          info: {
            icon: 'fa-circle-info',
            text: 'Info: This is an information toast.',
          }
        }
      };
    }
  }
  </script>
  
  <!-- Các phần còn lại giữ nguyên -->
  
  
  <style>
 /* Import Google font - Poppins */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
:root {
  --dark: #34495E;
  --light: #ffffff;
  --success: #0ABF30;
  --error: #E24D4C;
  --warning: #E9BD0C;
  --info: #3498DB;
}
body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--dark);
}
.notifications {
  position: fixed;
  top: 30px;
  right: 20px;
}
.notifications :where(.toast, .column) {
  display: flex;
  align-items: center;
}
.notifications .toast {
  width: 400px;
  position: relative;
  overflow: hidden;
  list-style: none;
  border-radius: 4px;
  padding: 16px 17px;
  margin-bottom: 10px;
  background: var(--light);
  justify-content: space-between;
  animation: show_toast 0.3s ease forwards;
}
@keyframes show_toast {
  0% {
    transform: translateX(100%);
  }
  40% {
    transform: translateX(-5%);
  }
  80% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-10px);
  }
}
.notifications .toast.hide {
  animation: hide_toast 0.3s ease forwards;
}
@keyframes hide_toast {
  0% {
    transform: translateX(-10px);
  }
  40% {
    transform: translateX(0%);
  }
  80% {
    transform: translateX(-5%);
  }
  100% {
    transform: translateX(calc(100% + 20px));
  }
}
.toast::before {
  position: absolute;
  content: "";
  height: 3px;
  width: 100%;
  bottom: 0px;
  left: 0px;
  animation: progress 5s linear forwards;
}
@keyframes progress {
  100% {
    width: 0%;
  }
}
.toast.success::before, .btn#success {
  background: var(--success);
}
.toast.error::before, .btn#error {
  background: var(--error);
}
.toast.warning::before, .btn#warning {
  background: var(--warning);
}
.toast.info::before, .btn#info {
  background: var(--info);
}
.toast .column i {
  font-size: 1.75rem;
}
.toast.success .column i {
  color: var(--success);
}
.toast.error .column i {
  color: var(--error);
}
.toast.warning .column i {
  color: var(--warning);
}
.toast.info .column i {
  color: var(--info);
}
.toast .column span {
  font-size: 1.07rem;
  margin-left: 12px;
}
.toast i:last-child {
  color: #aeb0d7;
  cursor: pointer;
}
.toast i:last-child:hover {
  color: var(--dark);
}
.buttons .btn {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0 5px;
  color: var(--light);
  font-size: 1.2rem;
  padding: 10px 20px;
  border-radius: 4px;
}

@media screen and (max-width: 530px) {
  .notifications {
    width: 95%;
  }
  .notifications .toast {
    width: 100%;
    font-size: 1rem;
    margin-left: 20px;
  }
  .buttons .btn {
    margin: 0 1px;
    font-size: 1.1rem;
    padding: 8px 15px;
  }
}
  </style>
  