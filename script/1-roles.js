(function(){
    
    var Util = Java.type('ga.lehto.xenoframework.Util');
    var File = Java.type('java.io.File');
    var JSONObject = Java.type('org.json.JSONObject');
    var ChatColor = Java.type('org.bukkit.ChatColor');
    var CitizensAPI = Java.type('net.citizensnpcs.api.CitizensAPI');
    
    var ignoreGlobalChat = [];
    
    var playerStorage = XenoFramework.getPlayerStorage();
    
    var roleStyle = {
        
        tubaaja: ChatColor.WHITE + '郁 ' + ChatColor.GRAY + '§0§kK§7a§0§kn§7s§4§ka§r§7laine§4§kn§r§7',
    
        irtolainen: ChatColor.DARK_GRAY + 'Irtolainen',
        kansalainen: ChatColor.WHITE + '铂 ' + ChatColor.GRAY + 'Kansalainen',
        karkotettu: ChatColor.WHITE + '鏤 ' + ChatColor.DARK_GRAY + 'Karkotettu',
        lainsuojaton: ChatColor.WHITE + '鏡 ' + ChatColor.DARK_GRAY + 'Lainsuojaton',
        kaartinjaakari: ChatColor.WHITE + '鏠 ' + ChatColor.GRAY + 'Kaartinjääkäri',	
        vapaahenkilo: ChatColor.WHITE + '鏠 ' + ChatColor.GRAY + 'Vapaahenkilö',	
        virkahenkilo: ChatColor.WHITE + '铂 ' + ChatColor.GRAY + 'Virkahenkilö',	
        
        pankkiiri: ChatColor.WHITE + '万 ' + ChatColor.GRAY + 'Pankkiiri',
        seppa: ChatColor.WHITE + '丠 ' + ChatColor.GRAY + 'Seppä',
        kaartilainen: ChatColor.GOLD + '✯ ' + ChatColor.GRAY + 'Kaartilainen',
        nuorempikaartilainen: ChatColor.GOLD + '★ ' + ChatColor.GRAY + 'Nuor. kaartilainen',
        vanhempikaartilainen: ChatColor.GOLD + '✪ ' + ChatColor.GRAY + 'Vanh. kaartilainen',
        kaartinjohtaja: ChatColor.GOLD + '❂ ' + ChatColor.GRAY + 'Kaartinjohtaja',
        selliasukas: ChatColor.WHITE + '鏡 ' + ChatColor.DARK_GRAY + 'Selliasukas',

        arkistokansleri: ChatColor.WHITE + '遡 ' + ChatColor.GRAY + 'Arkistokansleri' + ChatColor.GRAY,
        arkistoija: ChatColor.WHITE + '遥 ' + ChatColor.GRAY + 'Arkistoija' + ChatColor.GRAY,
        
        valtionkansleri: ChatColor.WHITE + '遢 ' + ChatColor.YELLOW + 'Valtionkansleri' + ChatColor.GRAY,
	    vtkansleri: ChatColor.WHITE + '遢 ' + ChatColor.YELLOW + 'Vt. Valtionkansleri' + ChatColor.GRAY,
	    valtiosihteeri: ChatColor.WHITE + '遢 ' + ChatColor.YELLOW + 'Valtiosihteeri' + ChatColor.GRAY,
	    tuomari: ChatColor.GOLD + '✢ ' + ChatColor.YELLOW + 'Tuomari' + ChatColor.GRAY,
	    valahenkilo: ChatColor.WHITE + '✢ ' + ChatColor.YELLOW + 'Valahenkilö' + ChatColor.GRAY,
        laaninvaltias: ChatColor.WHITE + '遢 ' + ChatColor.GRAY + 'Lääninvaltias',
        kuningas: ChatColor.WHITE + '邷 ' + ChatColor.GOLD + 'Kuningas',	
        
        kunnanjohtaja: ChatColor.WHITE + '铃 ' + ChatColor.GRAY + 'Kunnanjohtaja',
        varakunnanjohtaja: ChatColor.WHITE + '铂 ' + ChatColor.GRAY + 'Varakunnanjohtaja',
        pormestari: ChatColor.WHITE + '铃 ' + ChatColor.GRAY + 'Pormestari',
        varapormestari: ChatColor.WHITE + '铂 ' + ChatColor.GRAY + 'Varapormestari',
        kaavoittaja: ChatColor.WHITE + '釠 ' + ChatColor.GRAY + 'Kaavoittaja',
        puutarhuri: ChatColor.WHITE + '釐 ' + ChatColor.GRAY + 'Puutarhuri',
        asukas: ChatColor.WHITE + '铂 ' + ChatColor.GRAY + 'Asukas',
        porvari: ChatColor.WHITE + '铂 ' + ChatColor.GRAY + 'Porvari',
        mainari: ChatColor.WHITE + '逑 ' + ChatColor.GRAY + 'Mainari',
        metsuri: ChatColor.WHITE + '逓 ' + ChatColor.GRAY + 'Metsuri',
        vartija: ChatColor.WHITE + '逰 ' + ChatColor.GRAY + 'Vartija',
        maanviljelija: ChatColor.WHITE + '丘 ' + ChatColor.GRAY + 'Maanviljelijä',
        leipuri: ChatColor.WHITE + '丛 ' + ChatColor.GRAY + 'Leipuri',
        rakentaja: ChatColor.WHITE + '邤 ' + ChatColor.GRAY + 'Rakentaja',
        tyolainen: ChatColor.WHITE + '递 ' + ChatColor.GRAY + 'Työläinen',
        apulainen: ChatColor.WHITE + '递 ' + ChatColor.GRAY + 'Apulainen',
        seppa: ChatColor.WHITE + '逑 ' + ChatColor.GRAY + 'Seppä',
        
        kalastaja: ChatColor.WHITE + '郤 ' + ChatColor.GRAY + 'Kalastaja',
        insinoori: ChatColor.WHITE + '邬 ' + ChatColor.GRAY + 'Insinööri',
        kasityolainen: ChatColor.WHITE + '那 ' + ChatColor.GRAY + 'Käsityöläinen',
        taiteilija: ChatColor.WHITE + '邡 ' + ChatColor.GRAY + 'Taiteilija',
        muusikko: ChatColor.LIGHT_PURPLE + '♫ ' + ChatColor.GRAY + 'Muusikko',
        kauppias: ChatColor.WHITE + '鋹 ' + ChatColor.GRAY + 'Kauppias',
        paatoimittaja: ChatColor.WHITE + '郌 ' + ChatColor.GRAY + 'Päätoimittaja',
        toimittaja: ChatColor.WHITE + '郋 ' + ChatColor.GRAY + 'Toimittaja',
        
        
        seikkailija: ChatColor.WHITE + '仡 ' + ChatColor.GRAY + 'Seikkailija',
        hovinarri: ChatColor.WHITE + '铂 ' + ChatColor.GRAY + 'Hovinarri',
        
        edustaja: ChatColor.WHITE + '遤 ' + ChatColor.GRAY + 'Ktk.edustaja',
        puheenjohtaja: ChatColor.WHITE + '遤 ' + ChatColor.GRAY + 'Ktk.puheenjohtaja'
        
    };
    
    var _roleWeight = {};
    var _rKeys = Object.keys(roleStyle);
    for (var i = 0; i < _rKeys.length; i++) {
        var _rk = _rKeys[i];
        _roleWeight[_rk] = 0;
    }
    
    _roleWeight['kaartinjaakari'] = 10001;
    _roleWeight['vapaahenkilo'] = 10000;
    _roleWeight['valtionkansleri'] = 1000;
    _roleWeight['vtkansleri'] = 999;
    _roleWeight['valtiosihteeri'] = 998;
    
    _roleWeight['tuomari'] = 52;
    _roleWeight['karkotettu'] = 51;
    
    _roleWeight['pormestari'] = 50;
    _roleWeight['kunnanjohtaja'] = 50;
    _roleWeight['varakunnanjohtaja'] = 49;
    _roleWeight['varapormestari'] = 49;
    _roleWeight['laaninvaltias'] = 40;

    _roleWeight['arkistokansleri'] = 39;
    _roleWeight['arkistoija'] = 38;
    
    _roleWeight['kaartinjohtaja'] = 37;
    _roleWeight['vanhempikaartilainen'] = 36;
    _roleWeight['kaartilainen'] = 35;
    _roleWeight['nuorempikaartilainen'] = 10;
    
    _roleWeight['paatoimittaja'] = 2;
    _roleWeight['toimittaja'] = 1;
    
    _roleWeight['pankkiiri'] = 1;
    _roleWeight['kaavoittaja'] = 1;
    _roleWeight['seppa'] = 1;
    
    
    
    var allowedRoleChanges = {
        pankkiiri: ['apulainen', 'kansalainen'],
        seppa: ['apulainen', 'kansalainen'],
        kaartinjohtaja: ['kaartilainen', 'kansalainen', 'nuorempikaartilainen', 'vanhempikaartilainen'],
        kunnanjohtaja: [
            'virkahenkilo',
            'kaavoittaja',
            'puutarhuri',
            'pankkiiri',
            'kansalainen', 
            'asukas',
            'porvari',
            'mainari',
            'metsuri',
            'vartija',
            'maanviljelija',
            'leipuri',
            'seikkailija',
            'rakentaja',
            'tyolainen',
            'apulainen',
            'kalastaja',
            'insinoori',
            'kasityolainen',
            'taiteilija',
            'muusikko',
            'kauppias',
            'seppa'
        ],
        pormestari: [
            'virkahenkilo',
            'kaavoittaja',
            'puutarhuri',
            'pankkiiri',
            'kansalainen', 
            'asukas',
            'porvari',
            'mainari',
            'metsuri',
            'vartija',
            'maanviljelija',
            'leipuri',
            'seikkailija',
            'rakentaja',
            'tyolainen',
            'apulainen',
            'kalastaja',
            'insinoori',
            'kasityolainen',
            'taiteilija',
            'muusikko',
            'kauppias',
            'seppa'
        ],
        laaninvaltias: ['kunnanjohtaja', 'pormestari', 'apulainen', 'pankkiiri', 'kaavoittaja', 'virkahenkilo', 'kansalainen'],
        arkistokansleri: [
            'arkistoija',
            'kansalainen'
        ],
        tuomari: [
            'karkotettu',
            'kansalainen'
        ],
        puheenjohtaja: ['edustaja', 'kansalainen'],
        paatoimittaja: ['toimittaja', 'kansalainen', 'apulainen']
    };
    
    Events.on(Java.type('org.bukkit.event.player.AsyncPlayerChatEvent'), function(e){
        
        var player = e.getPlayer();
        var pstore = playerStorage.getPlayer(player);
        
        e.setMessage(e.getMessage().replace(/(fingy)|(finky)|(finpy)|(finguy)/gmi, 'Finqy'));
        
        var ch = 'global';
        if (pstore.has('chatChannel')){
            ch = pstore.getString('chatChannel');
        }
        Bukkit.getLogger().info('[CHAT] ' + player.getName() + ', w=' + e.getPlayer().getWorld().getName() + ', c=' + ch + ', msg=' + e.getMessage());
        
        if (e.getMessage().startsWith('!')) {
            e.setCancelled(true);
            if (e.getMessage().startsWith('!mute')){
                e.setCancelled(true);
                if (ignoreGlobalChat.indexOf(e.getPlayer().getUniqueId().toString()) > -1){
                    ignoreGlobalChat.splice(ignoreGlobalChat.indexOf(e.getPlayer().getUniqueId().toString()), 1);
                    player.sendMessage(Util.INFO_PREFIX + 'Kuulet nyt yleisen keskustelun.');
                } else {
                    ignoreGlobalChat.push(e.getPlayer().getUniqueId().toString());
                    player.sendMessage(Util.INFO_PREFIX + 'Et kuule yleistä keskustelua.');
                }
            } else if (e.getMessage().startsWith('!rooli')) {
                e.setCancelled(true);
                var pts = e.getMessage().split(' ');
                if (pts.length > 2) {
                    var ps = playerStorage.getPlayer(pts[1]);
                    if (player.hasPermission('xess.admin') || pstore.optString('role', 'irtolainen') == 'valtionkansleri' || pstore.optString('role', 'irtolainen') == 'vtkansleri' || pstore.optString('role', 'irtolainen') == 'valtiosihteeri') {
                        if (ps != null) {
                            var plc = pts[2].toLowerCase();
                            if (!player.hasPermission('xess.admin') && (plc == 'valtionkansleri' || plc == 'vtkansleri' || plc == 'vapaahenkilo' || plc == 'valtiosihteeri')) {
                                player.sendMessage(Util.INFO_PREFIX + 'Et voi antaa tuota roolia.');
                                return;
                            }
                            if (pts[2] == 'kuningas' && player.getName() != 'tapsatapio') {
                                player.sendMessage(Util.INFO_PREFIX + 'Perkele.');
                            }
                            ps.put('role', pts[2]);
                            player.sendMessage(Util.INFO_PREFIX + 'Pelaajan ' + pts[1] + ' rooli on nyt ' + ChatColor.RESET + '' + roleStyle[ps.optString('role', 'irtolainen')]);
                                        Bukkit.getLogger().info('' + player.getName() + ' changed role of ' + pts[1] + ' to ' + pts[2]);
                        } else {
                            player.sendMessage(Util.INFO_PREFIX + 'Pelaajaa ei löytynyt. Kirjoititko nimen varmasti oikein?');
                        }
                    } else {
                        if (pstore.has('role')) {
                            var pr = pstore.optString('role', 'irtolainen');
                            if (Array.isArray(allowedRoleChanges[pr])) {
                                
                                var _ownWeight = _roleWeight[pstore.optString('role', 'irtolainen')];
                                _ownWeight = (_ownWeight === null ? 0 : _ownWeight);
                                
                                var _giveWeight = _roleWeight[pts[2]];
                                _giveWeight = (_giveWeight === null ? 0 : _giveWeight);
                                
                                var _existingWeight = 0;
                                if (ps != null) {
                                    _existingWeight = _roleWeight[ps.optString('role', 'irtolainen')];
                                    _existingWeight = (_existingWeight === null ? 0 : _existingWeight);
                                }
                                
                                if (allowedRoleChanges[pr].indexOf(pts[2]) == -1 || _ownWeight <= _giveWeight || _ownWeight <= _existingWeight) {
                                    player.sendMessage(Util.INFO_PREFIX + 'Roolia "'+pts[2]+'" ei ole olemassa, tai sinulla ei ole oikeutta antaa sitä pelaajalle ' + pts[1] + '.');
                                } else {
                                    if (ps != null) {
                                        ps.put('role', pts[2]);
                                        player.sendMessage(Util.INFO_PREFIX + 'Pelaajan ' + pts[1] + ' rooli on nyt ' + ChatColor.RESET + '' + roleStyle[ps.optString('role', 'irtolainen')]);
                                        Bukkit.getLogger().info('' + player.getName() + ' changed role of ' + pts[1] + ' to ' + pts[2]);
                                    } else {
                                        player.sendMessage(Util.INFO_PREFIX + 'Pelaajaa ei löytynyt. Kirjoititko nimen varmasti oikein?');
                                    }
                                }
                            } else {
                                player.sendMessage(Util.INFO_PREFIX + 'Roolia "'+pts[2]+'" ei ole olemassa, tai sinulla ei ole oikeutta antaa sitä muille.');
                            }
                        }
                    }
                } else if (pts.length == 2) {
                    var ps = playerStorage.getPlayer(pts[1]);
                    if (ps != null) {
                        player.sendMessage(Util.INFO_PREFIX + 'Pelaajan ' + pts[1] + ' rooli on ' + ChatColor.RESET + '' + roleStyle[ps.optString('role', 'irtolainen')]);
                    } else {
                        player.sendMessage(Util.INFO_PREFIX + 'Pelaajaa ei löytynyt. Kirjoititko nimen varmasti oikein?');
                    }
                }
            } else if (e.getMessage().startsWith('!kanava')) {
                e.setCancelled(true);
                var pts = e.getMessage().split(' ');
                if (pts.length >= 2) {
                    if (pts[1].toLowerCase() == 'yleinen' || pts[1].toLowerCase() == 'y' || pts[1].toLowerCase() == 'g' || pts[1].toLowerCase() == 'global') {
                        pstore.put('chatChannel', 'global');
                        player.sendMessage(Util.INFO_PREFIX + 'Puhut nyt yleisellä kanavalla, älä luikauta salaisuuksia!');
                    } else if (pts[1].toLowerCase() == 'lähi' || pts[1].toLowerCase() == 'puhe' || pts[1].toLowerCase() == 'lähellä' || pts[1].toLowerCase() == 'l' || pts[1].toLowerCase() == 'n' || pts[1].toLowerCase() == 'near') {
                        pstore.put('chatChannel', 'near');
                        player.sendMessage(Util.INFO_PREFIX + 'Puhut nyt lähikanavalla, sinut kuulevat vain lähellä olevat.');
                    } else if (pts[1].toLowerCase() == 'kuiskaus' || pts[1].toLowerCase() == 'k' || pts[1].toLowerCase() == 'whisper' || pts[1].toLowerCase() == 'w') {
                        pstore.put('chatChannel', 'whisper');
                        player.sendMessage(Util.INFO_PREFIX + 'Kuiskaat nyt. Vain tosi lähellä olevat kuulevat supatuksesi.');
                    }
                } else {
                    player.sendMessage(Util.INFO_PREFIX + 'Voit vaihtaa kanavaa näin:');
                    player.sendMessage(ChatColor.WHITE + '  !kanava '+ChatColor.AQUA+'y'+ChatColor.WHITE+'leinen ' + ChatColor.GRAY + '- Puhu kaikkien kuullen.');
                    player.sendMessage(ChatColor.WHITE + '  !kanava '+ChatColor.AQUA+'l'+ChatColor.WHITE+'ähi ' + ChatColor.GRAY + '- Puhu vain lähellä olevien kuullen.');
                    player.sendMessage(ChatColor.WHITE + '  !kanava '+ChatColor.AQUA+'k'+ChatColor.WHITE+'uiskaus ' + ChatColor.GRAY + '- Puhu vain vieressäsi olevien kuullen.');
                }
            } else if (e.getMessage().startsWith('!y')) {
                e.setCancelled(true);
                pstore.put('chatChannel', 'global');
                player.sendMessage(Util.INFO_PREFIX + 'Puhut nyt yleisellä kanavalla, älä luikauta salaisuuksia!');
            } else if (e.getMessage().startsWith('!l')) {
                e.setCancelled(true);
                pstore.put('chatChannel', 'near');
                player.sendMessage(Util.INFO_PREFIX + 'Puhut nyt lähikanavalla, sinut kuulevat vain lähellä olevat.');
            } else if (e.getMessage().startsWith('!k')) {
                e.setCancelled(true);
                pstore.put('chatChannel', 'whisper');
                player.sendMessage(Util.INFO_PREFIX + 'Kuiskaat nyt. Vain tosi lähellä olevat kuulevat supatuksesi.');
            }
        }
        
        if (!e.isCancelled()){
            
            var role = 'irtolainen';
            if (pstore != null && pstore.has('role')) {
                role = (roleStyle[role] == null ? 'irtolainen' : pstore.getString('role'));
            }
            
            if (pstore != null && pstore.has('isInCustody') && pstore.optBoolean('isInCustody', false) == true){
                role = 'selliasukas';
            }
            
            e.setFormat(roleStyle[role] + ' ' + e.getFormat());
            e.setCancelled(true);
            
            var w = e.getPlayer().getWorld().getName();
            
            var pl = Bukkit.getOnlinePlayers();
            for (var i = 0; i < pl.length; i++) {
                
                var p = pl[i];
                if (p != null) {
                    
                    //p.sendMessage('feikkichat --> ' + roleStyle[role] + ' ' + player.getDisplayName() + '' + ChatColor.DARK_GRAY + ' > ' + ChatColor.WHITE + e.getMessage());
                    
                    if (ch == 'global') {
                        if (ignoreGlobalChat.indexOf(p.getUniqueId().toString()) == -1){
                            if (w == 'Alku') {
                                if (p.getWorld().getName() == 'Alku') {
                                    p.sendMessage(roleStyle[role] + ' ' + player.getDisplayName() + '' + ChatColor.DARK_GRAY + ' > ' + ChatColor.WHITE + e.getMessage());
                                }
                            } else {
                                if (p.getWorld().getName() != 'Alku') {
                                    p.sendMessage(roleStyle[role] + ' ' + player.getDisplayName() + '' + ChatColor.DARK_GRAY + ' > ' + ChatColor.WHITE + e.getMessage());
                                }
                            }
                        }
                    } else if (ch == 'near') {
                        if (player.getWorld().getName() == p.getWorld().getName() && player.getLocation().distance(p.getLocation()) <= 30.0) {
                            p.sendMessage(ChatColor.DARK_GRAY + '@ ' + roleStyle[role] + ' ' + player.getDisplayName() + '' + ChatColor.DARK_GRAY + ' > ' + ChatColor.WHITE + e.getMessage());
                        }
                    } else if (ch == 'whisper') {
                        if (player.getWorld().getName() == p.getWorld().getName() && player.getLocation().distance(p.getLocation()) <= 5.0) {
                            p.sendMessage(ChatColor.DARK_GRAY + '! ' + player.getDisplayName() + '' + ChatColor.DARK_GRAY + ' > ' + ChatColor.WHITE + '' + ChatColor.ITALIC + e.getMessage());
                        }
                    }
                    
                }
                
            }
            
        }
        
    });
    
    /*
    
    Events.on(Java.type('org.bukkit.event.entity.EntityDamageByEntityEvent'), function(e){
        
        if (e.getEntity() instanceof Java.type('org.bukkit.entity.Player')
            && e.getDamager() instanceof Java.type('org.bukkit.entity.Player')) {
            
            var ps = playerStorage.getPlayer(e.getEntity().getUniqueId());
            var ps2 = playerStorage.getPlayer(e.getDamager().getUniqueId());
            
            if (ps.optString('role', 'irtolainen') == 'karkotettu' || ps2.optString('role', 'irtolainen') == 'karkotettu'){
                
            } else {
                e.setCancelled(true);
            }
            
        }
        
    });
    * 
    * */
    
    
})();
