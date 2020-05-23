(function(){
    
    var Util = Java.type('ga.lehto.xenoframework.Util');
    var File = Java.type('java.io.File');
    var JSONObject = Java.type('org.json.JSONObject');
    var ChatColor = Java.type('org.bukkit.ChatColor');
    var CitizensAPI = Java.type('net.citizensnpcs.api.CitizensAPI');
    
    var playerStorage = XenoFramework.getPlayerStorage();
    var requiredRole = ['kaartilainen', 'kaartinjohtaja', 'nuorempikaartilainen', 'vanhempikaartilainen', 'vtkansleri', 'valtionkansleri', 'tuomari', 'valahenkilo', 'valtiosihteeri'];
    
    var cells = {};
    
    var officeCouncellor = Util.parseLocation('Kuningaskunta/-1973.5/101.0/-1555.5/0.0/90.0');
    var officeKing = Util.parseLocation('Kuningaskunta/-1964.5/112.0/-1531.5/0.0/180.0');
    
    var storageFolder = new File(Plugin.getDataFolder().getAbsolutePath() + '/storage/');
    if (!storageFolder.exists())
        storageFolder.mkdirs();
    var storageFile = new File(storageFolder.getAbsolutePath() + '/kaarti-cells.json');
    
    function saveCells(){
        Util.writeFile(JSON.stringify(cells, null, 2), storageFile.getAbsolutePath());
        Plugin.getLogger().info('Saved prison cell locations.');
    }
    
    if (storageFile.exists())
        cells = JSON.parse(Util.readFile( storageFile.getAbsolutePath() ));
    
    
    
    
    var quickCustody = {};
    function isInCustody(player){
        
        if (quickCustody[player.getUniqueId().toString()] == null) {
            
            var ps = playerStorage.getPlayer(player);
            
            if (ps == null)
                ps = playerStorage.getPlayer(player);
            
            if (ps.has('isInCustody') && ps.optBoolean('isInCustody', false) == true) {
                quickCustody[player.getUniqueId().toString()] = true;
            } else {
                quickCustody[player.getUniqueId().toString()] = false;
            }
            
        } else {
            return quickCustody[player.getUniqueId().toString()];
        }
        
        return false;
        
    }
    
    Events.on(Java.type('org.bukkit.event.player.AsyncPlayerChatEvent'), function(e){
        
        var player = e.getPlayer();
        var pstore = playerStorage.getPlayer(player);
        
        if (pstore == null)
            pstore = playerStorage.getPlayer(player);
        
        if (e.getMessage().startsWith('!sellit')){
            
            e.setCancelled(true);
            
            if (requiredRole.indexOf(pstore.optString('role', 'irtolainen')) > -1){
                player.sendMessage(Util.INFO_PREFIX + 'Tässä lista selleistä:');
                var ks = Object.keys(cells);
                var t = -1;
                var cls = '';
                for (var i = 0; i < ks.length; i++){
                    cls += (t == -1 ? ChatColor.GRAY : ChatColor.WHITE) + ks[i] + ' ';
                    t = t * -1;
                }
                player.sendMessage(' ' + cls);
            } else {
                player.sendMessage(Util.INFO_PREFIX + 'Tämä komento toimii Kaartinjohtajalla.');
            }
            
        }
        
        if (e.getMessage().startsWith('!asetaselli')){
            
            e.setCancelled(true);
            
            if (pstore.optString('role', 'irtolainen') == 'kaartinjohtaja' || pstore.optString('role', 'irtolainen') == 'vtkansleri' || pstore.optString('role', 'irtolainen') == 'valtionkansleri' || pstore.optString('role', 'irtolainen') == 'valtiosihteeri'){
                
                var pts = e.getMessage().split(' ');
                
                if (pts.length >= 2){
                    
                    player.sendMessage(Util.INFO_PREFIX + 'Selli ' + ChatColor.BLUE + pts[1].toLowerCase() + ChatColor.GRAY + ' on nyt tässä.');
                    cells[pts[1].toLowerCase()] = Util.locationToString(e.getPlayer().getLocation());
                    
                    saveCells();
                    
                } else {
                     player.sendMessage(Util.INFO_PREFIX + 'Käytä: !asetaselli [sellinNimi]');
                }
                
            } else {
                player.sendMessage(Util.INFO_PREFIX + 'Tämä komento toimii Kaartinjohtajalla.');
            }
            
        } else if (e.getMessage().startsWith('!poistaselli')){
            
            e.setCancelled(true);
            
            if (pstore.optString('role', 'irtolainen') == 'kaartinjohtaja' || pstore.optString('role', 'irtolainen') == 'vtkansleri' || pstore.optString('role', 'irtolainen') == 'valtionkansleri' || pstore.optString('role', 'irtolainen') == 'valtiosihteeri'){
                
                var pts = e.getMessage().split(' ');
                
                if (pts.length >= 2){
                    
                    if (cells[pts[1].toLowerCase()] == null){
                        player.sendMessage(Util.INFO_PREFIX + 'Tuota selliä ei ole olemassa. Sellit:');
                        var ks = Object.keys(cells);
                        var t = -1;
                        var cls = '';
                        for (var i = 0; i < ks.length; i++){
                            cls += (t == -1 ? ChatColor.GRAY : ChatColor.WHITE) + ks[i] + ' ';
                            t = t * -1;
                        }
                        player.sendMessage(' ' + cls);
                    } else {
                        delete cells[pts[1].toLowerCase()];
                        player.sendMessage(Util.INFO_PREFIX + 'Selli poistettu');
                    }
                    
                } else {
                     player.sendMessage(Util.INFO_PREFIX + 'Käytä: !poistaselli [sellinNimi]');
                }
                
            } else {
                player.sendMessage(Util.INFO_PREFIX + 'Tämä komento toimii Kaartinjohtajalla.');
            }
            
        } else if (e.getMessage().startsWith('!vapauta')){
            
            e.setCancelled(true);
            
            if (requiredRole.indexOf(pstore.optString('role', 'irtolainen')) > -1){
                
                var msgParts = e.getMessage().split(' ');
                
                if (msgParts.length > 1) {
                    
                    var p = Bukkit.getOfflinePlayer(msgParts[1]);
                    var ps = playerStorage.getPlayer(msgParts[1]);
                    
                    if (ps == null)
                        ps = playerStorage.getPlayer(msgParts[1]);
                    
                    if (p == null || ps == null) {
                        player.sendMessage(Util.INFO_PREFIX + 'Pelaajaa "'+msgParts[1]+'" ei ole olemassa, tai hän ei ole käynyt Kuningaskunnassa.');
                    } else {
                        
                        ps.put('isInCustody', false);
                        ps.put('custody', '');
                        
                        quickCustody[p.getUniqueId().toString()] = false;
                        
                        if (p.isOnline()) {
                            
                            p.sendMessage(ChatColor.GRAY + '' + ChatColor.ITALIC + 'Kaarti on vapauttanut sinut.');
                            player.sendMessage(Util.INFO_PREFIX + 'Pelaaja ' + p.getName() + ' on nyt vapautettu.');
                            
                        } else {
                            
                            player.sendMessage(Util.INFO_PREFIX + 'Pelaaja ei ole paikalla, mutta hän on vapaa kun palaa. Pelaajat eivät pääse selleistä automaattisesti, joten avaathan sellin oven.');
                            
                        }
                        
                    }
                    
                } else {
                    player.sendMessage(Util.INFO_PREFIX + 'Käytä: !vapauta [pelaaja]');
                }
                
            } else {
                player.sendMessage(Util.INFO_PREFIX + 'Täh? Et ole kaartilainen, ei onnistu! :P');
            }
            
        } else if (e.getMessage().startsWith('!kansleri')) {
            
            e.setCancelled(true);
            return;
            if (requiredRole.indexOf(pstore.optString('role', 'irtolainen')) > -1){
                
                var msgParts = e.getMessage().split(' ');
                
                if (msgParts.length > 1) {
                    
                    var p = Bukkit.getOfflinePlayer(msgParts[1]);
                    var ps = playerStorage.getPlayer(msgParts[1]);
                    
                    if (ps == null)
                        ps = playerStorage.getPlayer(msgParts[1]);
                    
                    if (p == null || ps == null) {
                        player.sendMessage(Util.INFO_PREFIX + 'Pelaajaa "'+msgParts[1]+'" ei ole olemassa, tai hän ei ole käynyt Kuningaskunnassa.');
                    } else {
                        
                        if (ps.has('isInCustody') && ps.optBoolean('isInCustody', false)){
                            
                            if (p.isOnline()) {
                                
                                p.sendMessage(ChatColor.GRAY + '' + ChatColor.ITALIC + 'Jokin sinulle tuntematon voima toi sinut Valtionkanslerin toimistoon.');
                                player.sendMessage(Util.INFO_PREFIX + 'Pelaaja ' + p.getName() + ' on nyt tuotu valtionkanslerin luo.');
                                p.teleport(officeCouncellor);
                                
                            } else {
                                player.sendMessage(Util.INFO_PREFIX + 'Pelaaja ' + p.getName() + ' ei ole paikalla.');
                            }
                            
                        } else {
                            player.sendMessage(Util.INFO_PREFIX + 'Pelaaja ei ole vangittu. Et voi tuoda häntä kuultavaksi.');
                        }
                        
                    }
                    
                } else {
                    player.sendMessage(Util.INFO_PREFIX + 'Käytä: !kansleri [pelaaja]');
                    player.sendMessage(ChatColor.GRAY + '  Sellit: ' + ChatColor.WHITE + 'selli1-selli7');
                }
                
            } else {
                player.sendMessage(Util.INFO_PREFIX + 'Täh? Et ole kaartilainen, ei onnistu! :P');
            }
            
        } else if (e.getMessage().startsWith('!vangitse')) {
            
            e.setCancelled(true);
            
            if (requiredRole.indexOf(pstore.optString('role', 'irtolainen')) > -1){
                
                var msgParts = e.getMessage().split(' ');
                
                if (msgParts.length > 2) {
                    
                    var p = Bukkit.getOfflinePlayer(msgParts[1]);
                    var ps = playerStorage.getPlayer(msgParts[1]);
                    
                    if (ps == null)
                        ps = playerStorage.getPlayer(msgParts[1]);
                    
                    if (p == null || ps == null) {
                        player.sendMessage(Util.INFO_PREFIX + 'Pelaajaa "'+msgParts[1]+'" ei ole olemassa, tai hän ei ole käynyt Kuningaskunnassa.');
                    } else {
                        
                        if (p.isOnline()) {
                            if (!player.getWorld().equals(p.getPlayer().getWorld())) {
                                player.sendMessage(Util.INFO_PREFIX + 'Pelaaja ei ole kanssasi samassa maailmassa.');
                                return;
                            }
                            if (player.getLocation().distance(p.getPlayer().getLocation()) >= 10) {
                                player.sendMessage(Util.INFO_PREFIX + 'Pelaaja on liian kaukana.');
                                return;
                            }
                        }
                        
                        if (!(ps.has('cuffed') && ps.optBoolean('cuffed') === true)) {
                            player.sendMessage(Util.INFO_PREFIX + 'Pelaaja täytyy kahlita käsiraudoilla ennen vangitsemista.');
                            return;
                        }

                        if (cells[msgParts[2]] == null){
                            player.sendMessage(Util.INFO_PREFIX + 'Selliä "'+msgParts[2]+'" ei ole olemassa. Sellit:');
                            var ks = Object.keys(cells);
                            var t = -1;
                            var cls = '';
                            for (var i = 0; i < ks.length; i++){
                                cls += (t == -1 ? ChatColor.GRAY : ChatColor.WHITE) + ks[i] + ' ';
                                t = t * -1;
                            }
                            player.sendMessage(' ' + cls);
                            return;
                        }
                        
                        ps.put('isInCustody', true);
                        ps.put('custody', msgParts[2]);
                        
                        if (p.isOnline()) {
                            
                            p.sendMessage(ChatColor.GRAY + '' + ChatColor.ITALIC + 'Jokin sinulle tuntematon voima toi sinut tänne. Olet Kaartin kynsissä.');
                            player.sendMessage(Util.INFO_PREFIX + 'Pelaaja ' + p.getName() + ' on nyt tuotu mystisesti selliin ' + msgParts[2]);
                            
                            p.teleport(Util.parseLocation(cells[msgParts[2]]));
                            
                            quickCustody[p.getUniqueId().toString()] = true;
                            
                        } else {
                            
                            player.sendMessage(Util.INFO_PREFIX + 'Pelaaja ' + p.getName() + ' ei ole paikalla, mutta mystinen voima tuo hänet vankiselliin ' + msgParts[2] + ' kun hän palaa.');
                            
                        }
                        
                    }
                    
                } else {
                    player.sendMessage(Util.INFO_PREFIX + 'Käytä: !vangitse [pelaaja] [selli]');
                    player.sendMessage(ChatColor.GRAY + '  Sellit: ' + ChatColor.WHITE + 'selli1-selli7');
                }
                
            } else {
                player.sendMessage(Util.INFO_PREFIX + 'Täh? Et ole kaartilainen, ei onnistu! :P');
            }
            
        } else if (e.getMessage().startsWith('!pikavangit')) {
            
            e.setCancelled(true);
            
            if (player.getName() == 'tapsatapio') {
                player.sendMessage('Yhteensä ' + (Object.keys(quickCustody).length) + ' pikavankitietoa');
                Bukkit.getLogger().info(JSON.stringify(quickCustody, null, 2));
            }
            
        }
        
    });
    
    
    
    /*
     * Jos vaikuttaa siltä, että tää on paska homma, niin tän voi poistaa.
     */
    Events.on(Java.type('org.bukkit.event.player.PlayerMoveEvent'), function(e){
        
        if (isInCustody(e.getPlayer())) {
            if (e.getFrom().getWorld().equals(e.getTo().getWorld())){
                if (e.getFrom().distance(e.getTo()) > 0) {
                    e.setCancelled(true);
                }
            } else {
                e.setCancelled(true);
            }
        }
        
    });
    
    Events.on(Java.type('org.bukkit.event.player.PlayerJoinEvent'), function(e){
        
        var p = e.getPlayer();
        
        if (isInCustody(e.getPlayer())) {
            
            p.teleport(Util.parseLocation(cells[ps.optString('custody')]));
            p.sendMessage(ChatColor.GRAY + '' + ChatColor.ITALIC + 'Olet sellissä. Mystiset voimat pitävät sinua täällä. Kätesi on sidottu.');
            
        }
        
    });
    
    Events.on(Java.type('org.bukkit.event.player.PlayerInteractEvent'), function(e){
        
        var p = e.getPlayer();
        
        if (isInCustody(e.getPlayer())) {
            e.setCancelled(true)
            p.setHealth(Java.type('java.lang.Double').valueOf(20.0));
            p.setFoodLevel(Java.type('java.lang.Integer').valueOf(20.0));
        }
        
    });
    
    Events.on(Java.type('org.bukkit.event.player.PlayerInteractAtEntityEvent'), function(e){
        
        var p = e.getPlayer();
        
        if (isInCustody(e.getPlayer())) {
            e.setCancelled(true)
            p.setHealth(Java.type('java.lang.Double').valueOf(20.0));
            p.setFoodLevel(Java.type('java.lang.Integer').valueOf(20.0));
        }
        
    });
    
    Events.on(Java.type('org.bukkit.event.block.BlockPlaceEvent'), function(e){
        
        var p = e.getPlayer();
        
        if (isInCustody(e.getPlayer())) {
            e.setCancelled(true)
            p.setHealth(Java.type('java.lang.Double').valueOf(20.0));
            p.setFoodLevel(Java.type('java.lang.Integer').valueOf(20.0));
        }
        
    });
    
    Events.on(Java.type('org.bukkit.event.block.BlockBreakEvent'), function(e){
        
        var p = e.getPlayer();
        
        if (isInCustody(e.getPlayer())) {
            e.setCancelled(true);
            p.teleport(Util.parseLocation(cells[ps.optString('custody')]));
            p.setHealth(Java.type('java.lang.Double').valueOf(20.0));
            p.setFoodLevel(Java.type('java.lang.Integer').valueOf(20.0));
        }
        
    });
    
    Events.on(Java.type('org.bukkit.event.player.PlayerCommandPreprocessEvent'), function(e){
        
        var p = e.getPlayer();
        
        if (isInCustody(e.getPlayer())) {
            e.setCancelled(true);
            p.setHealth(Java.type('java.lang.Double').valueOf(20.0));
            p.setFoodLevel(Java.type('java.lang.Integer').valueOf(20.0));
        }
        
    });

    //AVARUUDEN KOODI - START
    Events.on(Java.type('org.bukkit.event.vehicle.VehicleEnterEvent'), function(e){

        var entered = e.getEntered();

        if(!(entered instanceof Java.type('org.bukkit.entity.Player'))) {
            return;
        }
        
        var p = entered;
        
        if (isInCustody(entered)) {
            e.setCancelled(true);
            p.teleport(Util.parseLocation(cells[ps.optString('custody')]));
            p.setHealth(Java.type('java.lang.Double').valueOf(20.0));
            p.setFoodLevel(Java.type('java.lang.Integer').valueOf(20.0));
        }
        
    });

    Events.on(Java.type('org.bukkit.event.player.PlayerQuitEvent'), function(e){
        
        var p = e.getPlayer();
        
        if (isInCustody(e.getPlayer())) {
            p.leaveVehicle();
        }
        
    });
    //AVARUUDEN KOODI - END
    
})();
