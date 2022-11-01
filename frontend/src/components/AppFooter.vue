<template>
    <footer>
        <!-- cette classe rend responsive via bootstrap -->
        <div class="container">
            <div class="social">
                <a href=""><i class="fab fa-linkedin-in"></i>Linkedin</a>
            </div>
            
            <div class="social">
                <a href=""><i class="fab fa-twitter"></i>Twitter</a>
            </div>
            <div class="social">
                <a href=""><i class="fab fa-facebook"></i>Facebook</a>
            </div>
            <div class="social">
                <a href=""><i class="fab fa-instagram-square"></i>Instagram</a>
            </div>
            <div class="social">
                <a href=""><i class="fas fa-envelope"></i>groupo@contact</a>
            </div>
            <!-- <a href=""><i class="fas fa-at">groupomania@gmail.com</i></a> -->
        </div>
    </footer>
</template>


<script>
export default {
    name: 'AppFooter'
}
</script>


<style lang="sass" scoped>
    footer
        padding: 5vh
        background-color: white //#42b7b945//#4280b945
        .container
            display: flex
            justify-content: space-between
            @media screen and (max-width: 768px) 
                flex-direction: column
            a 
                font-weight: bold
                font-size: x-large
                @media screen and (max-width: 768px)
                    font-size: large
                color: #2c3e50
                padding: 1.5vh
                text-decoration: none
                cursor: pointer
                transition: 1000ms
                &:hover
                    color: royalblue
            .social
                padding: 0.5rem
            
</style>
