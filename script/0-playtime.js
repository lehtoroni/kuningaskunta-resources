(function(){
    
    var lastTalk = {};
    
    var Util = Java.type('ga.lehto.xenoframework.Util');
    var File = Java.type('java.io.File');
    var JSONObject = Java.type('org.json.JSONObject');
    var ChatColor = Java.type('org.bukkit.ChatColor');
    
    var System = Java.type('java.lang.System');
    
    var CitizensAPI = Java.type('net.citizensnpcs.api.CitizensAPI');
    var reg = CitizensAPI.getNPCRegistry();
    var playerStorage = XenoFramework.getPlayerStorage();
    
    var playerJoinTime = {};
    
    Events.on(Java.type('org.bukkit.event.player.PlayerJoinEvent'), function(e){
        playerJoinTime[e.getPlayer().getUniqueId().toString()] = Math.round(System.currentTimeMillis()/1000);
    });
    
    Events.on(Java.type('org.bukkit.event.player.PlayerQuitEvent'), function(e){
        if (playerJoinTime[e.getPlayer().getUniqueId().toString()] == null){
            return;
        }
        var sessTime = Math.round(System.currentTimeMillis()/1000) - playerJoinTime[e.getPlayer().getUniqueId().toString()];
        if (playerStorage.getPlayer(e.getPlayer()) !=  null) {
            if (playerStorage.getPlayer(e.getPlayer()).has('playtime')) {
                playerStorage.getPlayer(e.getPlayer()).put('playtime', playerStorage.getPlayer(e.getPlayer()).getLong('playtime') + sessTime);
            } else {
                playerStorage.getPlayer(e.getPlayer()).put('playtime', sessTime);
            }
        }
        delete playerJoinTime[e.getPlayer().getUniqueId().toString()];
    });
    
    Events.on(Java.type('org.bukkit.event.player.AsyncPlayerChatEvent'), function(e){
        
        if (e.getMessage().startsWith('!peliaika')){
        
            var player = e.getPlayer();
            var pstore = playerStorage.getPlayer(player);
            
            if (pstore == null) {
                player.sendMessage(Util.INFO_PREFIX + 'Hups! Apinat epäonnistuivat laskuissa, tietojasi ei löytynyt. Yritä uudelleen.');
            } else {
                
                if (playerJoinTime[e.getPlayer().getUniqueId().toString()] == null){
                    playerJoinTime[e.getPlayer().getUniqueId().toString()] = Math.round(System.currentTimeMillis()/1000);
                }
                
                var playtime = (
                pstore.has('playtime') ?
                pstore.optLong('playtime', 0) + (Math.round(System.currentTimeMillis()/1000) - playerJoinTime[e.getPlayer().getUniqueId().toString()])
              : (Math.round(System.currentTimeMillis()/1000) - playerJoinTime[e.getPlayer().getUniqueId().toString()])
              );
              
                player.sendMessage(Util.INFO_PREFIX + 'Olet pelannut Kuningaskunnassa ' + Math.floor(playtime/(20*60)) + ' pelipäivää, eli noin ' + (Math.round((playtime)/60/60 * 10.0)/10.0) + ' tuntia (eli ' + playtime + ' sekuntia).');
                
            }
            
            e.setCancelled(true);
            
        }
        
    });
    
    onDisableEvents.push(function(){
    
        var onl = Bukkit.getOnlinePlayers();
        for (var i = 0; i < onl.length; i++){
            
            var p = onl[i];
            
            if (playerJoinTime[p.getUniqueId().toString()] == null){
                return;
            }
            
            var sessTime = Math.round(System.currentTimeMillis()/1000) - playerJoinTime[p.getUniqueId().toString()];
            
            if (playerStorage.getPlayer(p) !=  null) {
                if (playerStorage.getPlayer(p).has('playtime')) {
                    playerStorage.getPlayer(p).put('playtime', playerStorage.getPlayer(p).getLong('playtime') + sessTime);
                } else {
                    playerStorage.getPlayer(p).put('playtime', sessTime);
                }
            }
            
        }
        
    });
    
})();
