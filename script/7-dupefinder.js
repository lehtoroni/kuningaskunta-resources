(function(){
    
    var Util = Java.type('ga.lehto.xenoframework.Util');
    var File = Java.type('java.io.File');
    var JSONObject = Java.type('org.json.JSONObject');
    var ChatColor = Java.type('org.bukkit.ChatColor');
    var CitizensAPI = Java.type('net.citizensnpcs.api.CitizensAPI');
    var XLogger = Java.type('ga.lehto.xenoessentials.utils.Logger');
    
    var checkMaterials = [
        'DIAMOND',
        'BEACON',
        'DIAMOND_BLOCK',
        'GOLD_NUGGET'
    ];
    
    Events.on(Java.type('org.bukkit.event.inventory.InventoryOpenEvent'), function(e){
        
        var inv = e.getView().getTopInventory();
        
        checkInventory(e.getView().getTopInventory(), e.getPlayer(), 'top');
        checkInventory(e.getView().getBottomInventory(), e.getPlayer(), 'bottom');
        
    });
    
    Events.on(Java.type('org.bukkit.event.inventory.InventoryClickEvent'), function(e){
        if (e.getClickedInventory() != null)
            checkInventory(e.getClickedInventory(), e.getWhoClicked(), ''+e.getClickedInventory().getType().toString());
    });
    
    function checkInventory(inv, player, viewSide) {
        
        var items = inv.getContents();
        var counts = {};
        
        for (var i = 0; i < items.length; i++) {
            
            var is = items[i];
            
            if (is == null)
                continue;
            
            if (checkMaterials.indexOf(is.getType().toString()) > -1) {
                
                if (counts[is.getType().toString()] == null) {
                    counts[is.getType().toString()] = 0;
                }
                
                counts[is.getType().toString()] += is.getAmount();
                
            }
            
        }
        
        var ks = Object.keys(counts);
        for (var i = 0; i < ks.length; i++) {
            if (counts[ks[i]] > 4*64) {
                
                Plugin.getLogger().info('[DUPECHECK] Player ' + player.getName() + ' has ' + counts[ks[i]] + ' of ' + ks[i] + ' at ' + Util.locationToReadable(player.getLocation()) + '  json=' + JSON.stringify(counts));
                
                /*
                if (Bukkit.getOfflinePlayer('tapsatapio').isOnline()){
                    Bukkit.getPlayer('tapsatapio').sendMessage(Util.INFO_PREFIX + '' +ChatColor.RED + '' + player.getName() + ': ' + ChatColor.YELLOW + '' + counts[ks[i]] + ' x ' + ks[i] + '' + ChatColor.RED + ' at '  + ChatColor.YELLOW + '' + Util.locationToReadable(player.getLocation()) + ' ('+viewSide+')');
                }
                */
                
                XLogger.logAction("SUSPICIOUS_ITEMS", player, Util.parseLocation(Util.locationToReadable(player.getLocation())), "§ctype=§e"+viewSide+"§c,item=§e"+ks[i]+"§c,amount=§e"+counts[ks[i]]+"§c");
                
            }
        }
        
    }
    
})();
