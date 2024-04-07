<template>
<div class="container-xxl bg-white p-0">
    <Headers/>
    <Carousel/>
    <Booking/>
    <About/>
    <Room/>
    <Videos/>
    <Service/>
    <Testimonial/>
    <Team/>
    <Newsletter/>
    <Footer1/>
    <!-- Back to Top -->
    <a href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>
</div>
</template>
<script>
import Headers from '../../components/Headers.vue';
import Carousel from '../../components/Carousel.vue';
import Booking from '../../components/Booking.vue';
import About from '../../components/About.vue';
import Room from '../../components/Room.vue';
import Videos from '../../components/Video.vue';
import Service from '../../components/Service.vue';
import Testimonial from '../../components/Testimonial.vue';
import Team from '../../components/Team.vue';
import Newsletter from '../../components/Newsletter.vue';
import Footer1 from '../../components/Footer.vue';

import '../../assets/client.css'
import '../../assets/bootstrap.min.css'
import '../../assets/style.css'
export default
    {
        components:
        {
            Headers,
            Carousel,
            Booking,
            About,
            Room,
            Videos,
            Service,
            Testimonial,
            Team,
            Newsletter,
            Footer1,


            
        }
    }
</script>
<!-- 



    for (var b in window) {
    if (window.hasOwnProperty(b)) console.log(b);
}
 -->