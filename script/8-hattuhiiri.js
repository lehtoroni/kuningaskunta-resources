(function(){
    
    var Util = Java.type('ga.lehto.xenoframework.Util');
    var File = Java.type('java.io.File');
    var JSONObject = Java.type('org.json.JSONObject');
    var ChatColor = Java.type('org.bukkit.ChatColor');
    var Sound = Java.type('org.bukkit.Sound');
    
    var System = Java.type('java.lang.System');
    var ItemCreator = Java.type('ga.lehto.xenoframework.custom.ItemCreator');
    
    var CitizensAPI = Java.type('net.citizensnpcs.api.CitizensAPI');
    var reg = CitizensAPI.getNPCRegistry();
    var playerStorage = XenoFramework.getPlayerStorage();
    
    var questNpcs = {
        hiiri: 170
    };
    var validNpcs = [];
    var ks = Object.keys(questNpcs);
    for (var i = 0; i < ks.length; i++){
        validNpcs.push(questNpcs[ks[i]]);
    }
    
    var hats = [
        ItemCreator.xenoItem('hat_propeller').item(),
        ItemCreator.xenoItem('hat_top').item(),
        ItemCreator.xenoItem('hat_summer').item(),
        ItemCreator.xenoItem('hat_derby').item()
    ];
    
    var lastHatBought = {};
    
    function npcMessage(nof, player, name, message){
        player.sendMessage(ChatColor.GRAY + '['+nof+'] ' + ChatColor.DARK_AQUA + '' + name + ': ' + ChatColor.AQUA + '' + message);
    }
    
    function time(){
        return Math.floor(System.currentTimeMillis()/1000);
    }
    
    function countFreeSlots(player){
        var inv = player.getInventory()
        var space = 0;
        var id = 0;
        var iss = inv.getContents();
        for (var i = 0; i < iss.length; i++){
            if (id < 36) {
                if (iss[i] == null)
                    space += 64;
            }
            id++;
        }
        return space;
    }
    
    
    function interactNpc(npc, player){
        
        var ps = playerStorage.getPlayer(player);
        if (ps == null)
            return;
        
        if (npc.getId() == questNpcs.hiiri) {
            
            if (lastHatBought[player.getUniqueId().toString()] != null && time() - lastHatBought[player.getUniqueId().toString()] < 60*60*2) {
                npcMessage('1/1', player, 'Hattuhiiri', 'nonnonnonno, yuu can not buy so meNi hats. come back leitar, no forget 5 coines.');
                return;
            }
            
            if (player.getInventory().getItemInMainHand() != null && player.getInventory().getItemInMainHand().getType().toString() == 'GOLD_NUGGET'){
                var itm = player.getInventory().getItemInMainHand();
                if (Util.hasDataString(itm) && Util.getDataString(itm) == ChatColor.BLACK + 'data::xeniItem') {
                    if (itm.getAmount() >= 5) {
                        
                        if (countFreeSlots(player) > 0) {
                        
                            itm.setAmount(itm.getAmount() - 5);
                            player.getInventory().addItem(hats[Math.floor(Math.random()*hats.length)].clone());
                            
                            player.playSound(player.getLocation(), Sound.ENTITY_EXPERIENCE_ORB_PICKUP, 1.0, 1.0);
                            npcMessage('1/1', player, 'Hattuhiiri', 'yAy! veri nice to haev done sales with yuu! come again later!');
                            
                            lastHatBought[player.getUniqueId().toString()] = time();
                            
                        } else {
                            player.sendMessage(Util.INFO_PREFIX + 'Tavaraluettelossasi ei ole tilaa.');
                        }
                        
                    } else {
                        npcMessage('1/1', player, 'Hattuhiiri', 'wUt? pliis bring mii 5 coines.');
                    }
                }
            } else {
                npcMessage('1/1', player, 'Hattuhiiri', 'hEllo! mii sell häts. u want sum? bring mii 5 coines for hat of today.');
            }
        }
        
    }
    
    Events.on(Java.type('org.bukkit.event.player.PlayerInteractEntityEvent'), function(e){
        if (reg.isNPC(e.getRightClicked())){
            if (e.getHand().toString() == 'HAND') {
            
                var npc = reg.getNPC(e.getRightClicked());
                interactNpc(npc, e.getPlayer());
                
            }
        }
    });
    
})();
