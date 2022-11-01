<template>
    <div class='adminDashboard'>
        <h1> Admin Dashboard</h1>
        <Admin msg='Utilisateurs du réseau social Groupomania'/>
    </div>
</template>

<script>
    
    // Import de Admin.vue pour usage dans template + export dans views
    import Admin from '../components/Admin';
    
    // export de AdminDashbaord dans views
    export default {
        name : 'AdminDashboard',
        components: {Admin},
    }
</script>