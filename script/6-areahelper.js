(function(){
    
    var ComponentSerializer = Java.type('net.md_5.bungee.chat.ComponentSerializer');
    var ComponentBuilder = Java.type('net.md_5.bungee.api.chat.ComponentBuilder');
    var TextComponent = Java.type('net.md_5.bungee.api.chat.TextComponent');
    
    var CoreProtect = Java.type('net.coreprotect.CoreProtect');
    
    function jc(obj){
        return ComponentSerializer.parse(JSON.stringify(obj));
    }
    function txts(arr){
        var _cb = new ComponentBuilder('');
        for (var i = 0; i < arr.length; i++){
            if (typeof arr[i] === 'string') {
                _cb.append(arr[i]);
            } else {
                _cb.append(jc(arr[i]));
            }
        }
        return _cb;
    }
    function getSinceTime(t){
        return Math.ceil((Date.now() - t*1000)/1000/60/60) + 'h';
    }
    
    var Util = Java.type('ga.lehto.xenoframework.Util');
    var File = Java.type('java.io.File');
    var JSONObject = Java.type('org.json.JSONObject');
    var ChatColor = Java.type('org.bukkit.ChatColor');
    
    var WorldEdit = Bukkit.getServer().getPluginManager().getPlugin("WorldEdit");
    var BlockVector2D = Java.type('com.sk89q.worldedit.BlockVector2D');
    var Polygonal2DSelection = Java.type('com.sk89q.worldedit.bukkit.selections.Polygonal2DSelection');
    
    var bankerSkins = [
        'https://www.minecraftskins.com/uploads/skins/2020/04/03/old-traveler-14050741.png?v167',
        'https://www.minecraftskins.com/uploads/skins/2020/04/01/old-frontiersman-14038500.png?v167',
        'https://www.minecraftskins.com/uploads/skins/2020/03/20/wanderer-with-a-mustache-13972309.png?v167',
        'https://www.minecraftskins.com/uploads/skins/2020/04/04/blonde-business-14058547.png?v167',
        'https://www.minecraftskins.com/uploads/skins/2020/03/31/its-time-for-business-14030183.png?v167',
        'https://www.minecraftskins.com/uploads/skins/2020/02/26/business-women-13897286.png?v167',
        'https://www.minecraftskins.com/uploads/skins/2020/04/04/business-baby-14054326.png?v167',
        'https://www.minecraftskins.com/uploads/skins/2019/10/18/val---business-13571921.png?v167',
        'https://www.minecraftskins.com/uploads/skins/2019/06/28/marika-13125550.png?v167',
        'https://www.minecraftskins.com/uploads/skins/2019/08/04/fortuna-13285675.png?v167'
    ];
    
    
    var leaksUrl = 'https://mcleaks.themrgong.xyz/api/v3/isnamemcleaks/';
    var leaksCache = {};
    
    
    var autoFinder = {};
    
    
    function isLeaksAccount(name) {
        
        if (leaksCache[name] != null) {
            return leaksCache[name];
        }
        
        var resp = Util.postUrl(leaksUrl + '' + name, '');
        
        if (resp != null) {
            
            var obj = JSON.parse(resp);
            
            if (obj.error) {
                return false;
            }
            
            if (obj.isMcleaks != null) {
                leaksCache[name] = obj.isMcleaks;
                return obj.isMcleaks;
            }
            
        }
        
        return false;
        
    }
    
    function getRandomBankerSkin(){
        return bankerSkins[Math.floor(Math.random()*bankerSkins.length)];
    }
    
    function cp(){
        return Bukkit.getServer().getPluginManager().getPlugin('CoreProtect').getAPI();
    }
    
    function handleBlockCheck(player, block, lookupTime){
        
        player.sendMessage(Util.INFO_PREFIX + 'Haetaan tietoja...');
        
        var rarr = cp().blockLookup(block, lookupTime);
        
        for (var ln = 0; ln < rarr.length; ln++) {
            
            var r = cp().parseResult(rarr[ln]);
            
            player.spigot().sendMessage(txts([
                {
                    "text": ChatColor.GRAY + "* " + r.getPlayer() + ': ' + r.getActionString() + ' ('+r.getType().toString()+') ('+(r.isRolledBack() ? ChatColor.RED+'x' : '-')+') ' + r.getTime(),
                    "hoverEvent": {
                        "action": "show_text",
                        "value": "Klikkaa pikakomentoa varten"
                    },
                    "clickEvent": {
                        "action": "suggest_command",
                        "value": "/ban " + r.getPlayer() + " 3 days Grieffaus (Kuningaskunta)"
                    }
                },
                {
                    "text": " [HIST]",
                    "hoverEvent": {
                        "action": "show_text",
                        "value": "HISTORY"
                    },
                    "clickEvent": {
                        "action": "run_command",
                        "value": "/history " + r.getPlayer() + ""
                    }
                },
                {
                    "text": " [RB]",
                    "hoverEvent": {
                        "action": "show_text",
                        "value": "ROLLBACK"
                    },
                    "clickEvent": {
                        "action": "suggest_command",
                        "value": "/co rollback u:" + r.getPlayer() + " t:" + getSinceTime(r.getTime()) + ' r:15'
                    }
                }
            ]).create());
            
        }
        
        if (rarr.length == 0 && lookupTime < 60*60*24*7*2){
            handleBlockCheck(player, block, 60*60*24*7 * 4);
        } else if (rarr.length == 0 && lookupTime < 60*60*24*7*8){
            handleBlockCheck(player, block, 60*60*24*7 * 20);
        } else if (rarr.length == 0 && lookupTime > 60*60*24*7*9){
            player.sendMessage(Util.INFO_PREFIX + 'Ei tietoja edes 20 viikon ajalta :(');
        }
        
        /*
        player.spigot().sendMessage(txts([
            {
                "text": "[kliks]",
                "hoverEvent": {
                    "action": "show_text",
                    "value": "tee asioita"
                },
                "clickEvent": {
                    "action": "suggest_command",
                    "value": "/msg tapsatapio moI1!11"
                }
            },
            ChatColor.RED + " joo asdf"
        ]).create());
        */
        
    }
    
    Events.on(Java.type('org.bukkit.event.block.BlockPlaceEvent'), function(e){
        if (autoFinder[e.getPlayer().getUniqueId().toString()] != null) {
            handleBlockCheck(e.getPlayer(), e.getBlock(), 60*60*24*7);
            e.setCancelled(true);
        }
    });
    
     Events.on(Java.type('org.bukkit.event.block.BlockBreakEvent'), function(e){
        if (autoFinder[e.getPlayer().getUniqueId().toString()] != null) {
            handleBlockCheck(e.getPlayer(), e.getBlock(), 60*60*24*7);
            e.setCancelled(true);
        }
    });
    
    
    
    Events.on(Java.type('org.bukkit.event.player.AsyncPlayerChatEvent'), function(e){
        
        var player = e.getPlayer();
        
        if (e.getMessage().startsWith('.!')){
            if (player.hasPermission('xess.admin') || player.isOp()) {
                
                var pts = e.getMessage().split(' ');
                
                e.setMessage('');
                e.setCancelled(true);
                //8GMbypih5w7frPOs
                if (pts[0] == '.!'){
                    player.sendMessage(Util.INFO_PREFIX + 'Tervetuloa pikatoimintoihin!');
                    player.sendMessage(ChatColor.GRAY + '  .!alue [alueString]  - polygonin valinta pisteistä');
                    player.sendMessage(ChatColor.GRAY + '  .!aluepaste [url]  - polygonin valinta tietokannasta');
                    player.sendMessage(ChatColor.GRAY + '  .!kunta [rgName] [rgOwner] [rgGreeting]  - kuntaregionmakro');
                    player.sendMessage(ChatColor.GRAY + '  .!velho  - luo siirtäjä');
                    player.sendMessage(ChatColor.GRAY + '  .!velhoskin  - vaihda npc:lle velhoskini');
                    player.sendMessage(ChatColor.GRAY + '  .!pankkiiri  - luo pankkiiri');
                    player.sendMessage(ChatColor.GRAY + '  .!pankkiiriskin  - vaihda npc:lle pankkiiriskin');
                    player.sendMessage(ChatColor.GRAY + '  .!leak [pelaaja]  - tsekkaa josko olis MCLeaks-altti');
                } else if (pts[0] == '.!ratsu') {
                    
                    setTimeout(function(){
                        if (pts.length > 2) {
                            
                            var p1 = Bukkit.getPlayer(pts[1]);
                            var p2 = Bukkit.getPlayer(pts[2]);
                            
                            p2.addPassenger(p1);
                            
                        }
                    }, 100);
                    
                } else if (pts[0] == '.!eiratsu') {
                    
                    setTimeout(function(){
                        if (pts.length > 1) {
                            
                            var p1 = Bukkit.getPlayer(pts[1]);
                            
                            p1.leaveVehicle();
                            
                        }
                    }, 100);
                    
                } else if (pts[0] == '.!leak') {
                    
                    if (pts.length > 1) {
                        
                        var pname = pts[1];
                        
                        if (isLeaksAccount(pname)) {
                            player.sendMessage(Util.INFO_PREFIX + '' + ChatColor.RED + 'Kyllä!' + ChatColor.GRAY + ' Käyttäjätili on julkinen, t: MCLeaks');
                        } else {
                            player.sendMessage(Util.INFO_PREFIX + 'Tiliä ei löydy MCLeaks-apista (tai käyttökerrat ovat täynnä)');
                        }
                        
                    }
                    
                    
                } else if (pts[0] == '.!alue') {
                    
                    if (pts.length > 1) {
                        
                        var points = pts[1].split(';');
                        var bvs = [];
                        
                        for (var i = 0; i < points.length; i++) {
                            
                            var ppts = points[i].split(',');
                            var pX = parseInt(ppts[0]);
                            var pZ = parseInt(ppts[1]);
                            
                            bvs.push(new BlockVector2D(pX, pZ));
                            
                        }
                        
                        setTimeout(function(){
                            
                            WorldEdit.setSelection(player, new Polygonal2DSelection( player.getWorld(), bvs, 0, 255 ));
                            player.sendMessage(Util.INFO_PREFIX + 'Alue valittu! Yhteensä ' + points.length + ' pistettä.');
                            
                        }, 100);
                        
                    }
                    
                } else if (pts[0] == '.!aluepaste') {
                    
                    if (pts.length > 1) {
                        
                        player.sendMessage(Util.INFO_PREFIX + 'Haetaan...');
                        Plugin.getLogger().info('Fetching area paste: ' + pts[1]);
                        
                        var ptdata = JSON.parse(Util.postUrl('https://api.lehtodigital.fi/xeno/pastemap.php?q=getArea&areaId='+pts[1], ''));
                        
                        if (ptdata != null && ptdata.success) {
                            
                            var ptstr = ptdata.area;
                            
                            if (ptstr != null) {
                                
                                var points = ptstr.split(';');
                                var bvs = [];
                                
                                for (var i = 0; i < points.length; i++) {
                                    
                                    var ppts = points[i].split(',');
                                    var pX = parseInt(ppts[0]);
                                    var pZ = parseInt(ppts[1]);
                                    
                                    bvs.push(new BlockVector2D(pX, pZ));
                                    
                                }
                                
                                setTimeout(function(){
                                    
                                    WorldEdit.setSelection(player, new Polygonal2DSelection( player.getWorld(), bvs, 0, 255 ));
                                    player.sendMessage(Util.INFO_PREFIX + 'Alue valittu! Yhteensä ' + points.length + ' pistettä.');
                                    
                                }, 100);
                            
                        }
                            
                        } else {
                            player.sendMessage(Util.INFO_PREFIX + 'Virhe! Aluetta ei löytynyt.');
                        }
                        
                    }
                    
                } else if (pts[0] == '.!kunta') {
                    
                    if (pts.length > 3) {
                        
                        setTimeout(function(){
                            
                            var rgName = pts[1].toLowerCase();
                            var rgOwner = pts[2].toLowerCase();
                            var rgGreeting = '';
                            
                            for (var i = 3; i < pts.length; i++) {
                                rgGreeting += pts[i] + ' ';
                            }
                            
                            player.chat('/rg define ' + rgName);
                            
                            setTimeout(function(){
                            
                                player.chat('/rg addowner ' + rgName + ' ' + rgOwner);
                                player.chat('/rg flag ' + rgName + ' use allow');
                                player.chat('/rg flag ' + rgName + ' interact allow');
                                player.chat('/rg flag ' + rgName + ' vehicle-place allow');
                                player.chat('/rg flag ' + rgName + ' vehicle-destroy allow');
                                player.chat('/rg flag ' + rgName + ' greeting '+rgGreeting);
                                
                                player.chat('/xess saferegion ' + rgName);
                                
                                setTimeout(function(){
                                    player.sendMessage(Util.INFO_PREFIX + 'Alue suojattu!');
                                }, 500);
                                
                            }, 500);
                            
                        }, 100);
                        
                        
                        
                    }
                    
                } else if (pts[0] == '.!velho') {
                    
                    setTimeout(function(){
                    
                        player.chat('/tpo ' + player.getName());
                        player.chat('/npc create Siirtäjävelho');
                        
                        setTimeout(function(){
                            
                            player.chat('/npc look');
                            player.chat('/npc gravity');
                            
                            setTimeout(function(){
                                player.chat('/npc skin --url https://kk.motimaa.net/wiki/images/b/b9/Skini.png');
                            }, 500);
                            
                        }, 500);
                        
                    }, 100);
                    
                } else if (pts[0] == '.!pankkiiri') {
                    
                    setTimeout(function(){
                        
                        player.chat('/tpo ' + player.getName());
                        player.chat('/npc create Pankkiiri');
                        
                        setTimeout(function(){
                            
                            player.chat('/npc look');
                            player.chat('/npc gravity');
                            
                            setTimeout(function(){
                                player.chat('/npc skin --url ' + getRandomBankerSkin());
                            }, 500);
                            
                        }, 500);
                        
                    }, 100);
                    
                } else if (pts[0] == '.!velhoskin') {
                    setTimeout(function(){
                        player.chat('/npc skin --url https://kk.motimaa.net/wiki/images/b/b9/Skini.png');
                    }, 100);
                } else if (pts[0] == '.!pankkiiriskin') {
                    setTimeout(function(){
                        player.chat('/npc skin --url ' + getRandomBankerSkin());
                    }, 100);
                } else if (pts[0] == '.!test') {
                    setTimeout(function(){
                        
                        player.spigot().sendMessage(txts([
                            {
                                "text": "[kliks]",
                                "hoverEvent": {
                                    "action": "show_text",
                                    "value": "tee asioita"
                                },
                                "clickEvent": {
                                    "action": "suggest_command",
                                    "value": "/msg tapsatapio moI1!11"
                                }
                            },
                            ChatColor.RED + " joo asdf"
                        ]).create());
                        
                    }, 100);
                } else if (pts[0] == '.!lookup') {
                    setTimeout(function(){
                        if (autoFinder[player.getUniqueId().toString()] != null) {
                            delete autoFinder[player.getUniqueId().toString()];
                            player.sendMessage(Util.INFO_PREFIX + 'Fiksu lookup-toiminto POIS päältä');
                        } else {
                            autoFinder[player.getUniqueId().toString()] = true;
                            player.sendMessage(Util.INFO_PREFIX + 'Fiksu lookup-toiminto päällä');
                        }
                    }, 100);
                }
                
            } else {
                player.sendMessage(Util.INFO_PREFIX + 'Sinulla ei ole riittäviä oikeuksia käyttää pikatoimintoja.');
            }
        }
        
    });
    
    
})();
