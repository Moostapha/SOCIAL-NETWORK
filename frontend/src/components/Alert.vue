<template>
    <div id ="notifUser" class ="alert" v-bind:class="alertType" role="alert">
        <strong> {{ alertMsg }} </strong>
        <button 
            @click="closeNotifConnexion()"
            type="button" 
            class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</template>


<script>
export default {

    name: 'Alert',
    
    props: {
        alertType: String,
        alertMsg: String
    },
    
    methods: {
        
        closeNotifConnexion(){  
        console.log('clicked');
        document.getElementsByClassName('alert')[0].style.display='none';
        },
        
        alertFade(){
            const closed = document.getElementById('notifUser');
            setTimeout(() => {closed.style.display = 'none'}, 4000)
        }
        
        // setTimeout () {
        //     const hideAlert = document.getElementById('notifUser');
        //     hideAlert.style.display = 'none'
        // },
        
        
        // fade(){
        //     const hideAlert = document.getElementById('notifUser');
        //     hideAlert.style.display = 'none'
        // },
        
        
        // setTimeout(){
            
        // }
        
    }
}
</script>









