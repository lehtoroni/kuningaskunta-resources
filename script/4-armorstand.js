(function(){
    //org.bukkit.event.entity.EntitySpawnEvent
    
    Events.on(Java.type('org.bukkit.event.entity.EntitySpawnEvent'), function(e){
        if (e.getEntity() instanceof Java.type('org.bukkit.entity.ArmorStand')) {
            e.getEntity().setArms(true);
        }
    });
    
})();
