(function(){
    
    var Util = Java.type('ga.lehto.xenoframework.Util');
    var File = Java.type('java.io.File');
    var JSONObject = Java.type('org.json.JSONObject');
    var ChatColor = Java.type('org.bukkit.ChatColor');
    
    var System = Java.type('java.lang.System');
    
    var CitizensAPI = Java.type('net.citizensnpcs.api.CitizensAPI');
    var reg = CitizensAPI.getNPCRegistry();
    var playerStorage = XenoFramework.getPlayerStorage();
    
    var questNpcs = {
        paapankkiiri: 47,
        paapankkiiri2: 113
    };
    var validNpcs = [];
    var ks = Object.keys(questNpcs);
    for (var i = 0; i < ks.length; i++){
        validNpcs.push(questNpcs[ks[i]]);
    }
    
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
        
        if (npc.getId() == questNpcs.paapankkiiri || npc.getId() == questNpcs.paapankkiiri2) {
            
            if (ps.optString('role', 'irtolainen') == 'kunnanjohtaja') {
                
                if (time() - ps.optLong('lastCityMoneyCollection', 0) >= 60*60*24*2) {
                    if (countFreeSlots(player) >= 64*4) {
                        npcMessage('1/1', player, 'Pääpankkiiri', 'Hei, Kunnanjohtaja ' + player.getName() + '! Tässä avustuksenne. Muista, että ne on tarkoitettu kunnan käyttöön.');
                        for (var i = 0; i < 4; i++) {
                            var xeni = Util.xeni(64, player);
                            player.getInventory().addItem(xeni);
                        }
                        ps.put('lastCityMoneyCollection', time());
                    } else {
                        npcMessage('1/1', player, 'Pääpankkiiri', 'Sinulla ei ole tilaa tavaraluettelossasi. En voi antaa avustusta turvallisesti. Tee tilaa neljälle stackille.');
                    }
                } else {
                    npcMessage('1/1', player, 'Pääpankkiiri', 'Hm? Edellisestä kerrasta ei ole vielä kulunut tarpeeksi aikaa, tukirahaa ei ole saatavilla.');
                }
                
            } else if (ps.optString('role', 'irtolainen') == 'pormestari') {
                
                if (time() - ps.optLong('lastCityMoneyCollection', 0) >= 60*60*24*2) {
                    if (countFreeSlots(player) >= 64*6) {
                        npcMessage('1/1', player, 'Pääpankkiiri', 'Hei, Pormestari ' + player.getName() + '! Tässä avustuksenne. Muista, että ne on tarkoitettu kunnan käyttöön.');
                        for (var i = 0; i < 6; i++) {
                            var xeni = Util.xeni(64, player);
                            player.getInventory().addItem(xeni);
                        }
                        ps.put('lastCityMoneyCollection', time());
                    } else {
                        npcMessage('1/1', player, 'Pääpankkiiri', 'Sinulla ei ole tilaa tavaraluettelossasi. En voi antaa avustusta turvallisesti. Tee tilaa kahdeksalle stackille.');
                    }
                } else {
                    npcMessage('1/1', player, 'Pääpankkiiri', 'Hm? Edellisestä kerrasta ei ole vielä kulunut tarpeeksi aikaa, tukirahaa ei ole saatavilla.');
                }
                
            } else if (ps.optString('role', 'irtolainen') == 'valtionkansleri' || ps.optString('role', 'irtolainen') == 'vtkansleri') {
                
                if (time() - ps.optLong('lastCityMoneyCollection', 0) >= 60*60*24*2) {
                    if (countFreeSlots(player) >= 64*12) {
                        npcMessage('1/1', player, 'Pääpankkiiri', 'Haha lol tulit hakemaan KELA-tukia? No ok, ota tästä.');
                        for (var i = 0; i < 12; i++) {
                            var xeni = Util.xeni(64, player);
                            player.getInventory().addItem(xeni);
                        }
                        ps.put('lastCityMoneyCollection', time());
                    } else {
                        npcMessage('1/1', player, 'Pääpankkiiri', 'Sinulla ei ole tilaa tavaraluettelossasi. En voi antaa avustusta turvallisesti. Tee tilaa kahdeksalle stackille.');
                    }
                } else {
                    npcMessage('1/1', player, 'Pääpankkiiri', 'Hm? Edellisestä kerrasta ei ole vielä kulunut tarpeeksi aikaa, tukirahaa ei ole saatavilla.');
                }
                
            } else {
                npcMessage('1/1', player, 'Pääpankkiiri', 'Tervehdys. Kunnanjohtajat ja pormestarit voivat hakea täältä avustuksia kunnilleen.');
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
