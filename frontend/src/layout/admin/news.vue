<template>
  <div>
    <toast ref="toast"></toast>
    <div>
      <select v-model="selectedFilter" @change="fetchStatistics">
        <option value="day">Ngày</option>
        <option value="week">Tuần</option>
        <option value="month">Tháng</option>
      </select>
    </div>
    <canvas id="ordersChart"></canvas>
  </div>
</template>

<script>
import axios from 'axios';
import toast from '../../components/toast.vue';
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      ordersData: [],
      selectedFilter: 'day',
      chart: null,
    };
  },
  components: {
    toast,
  },
  methods: {
    fetchStatistics() {
      axios.get(`${import.meta.env.VITE_API_BASE_URL_API}/statistics/bookings?filter=${this.selectedFilter}`)
        .then(response => {
          this.ordersData = response.data;
          this.updateChart();
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          this.$refs.toast.show('Error fetching data', 2000);
        });
    },
    updateChart() {
      const ctx = document.getElementById('ordersChart').getContext('2d');
      if (this.chart) {
        this.chart.destroy(); // Xóa biểu đồ cũ nếu có
      }
      this.chart = new Chart(ctx, {
        type: 'bar', // Thay đổi ở đây từ 'line' sang 'bar'
        data: {
          labels: this.ordersData.map(stat => stat.date),
          datasets: [{
            label: 'Orders',
            data: this.ordersData.map(stat => stat.count),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  },
  mounted() {
    this.fetchStatistics();
  }
}
</script>
