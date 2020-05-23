/* */

/*
 quest stages:
 0 = not started, talk to NPC id 3
*/

(function(){
    
    var Util = Java.type('ga.lehto.xenoframework.Util');
    var File = Java.type('java.io.File');
    var JSONObject = Java.type('org.json.JSONObject');
    var ChatColor = Java.type('org.bukkit.ChatColor');
    var CitizensAPI = Java.type('net.citizensnpcs.api.CitizensAPI');
    var playerStorage = XenoFramework.getPlayerStorage();
    
    var invisiblePlayers = [];
    
    var storageFolder = new File(Plugin.getDataFolder().getAbsolutePath() + '/storage/');
    if (!storageFolder.exists())
        storageFolder.mkdirs();

    var storageFile = new File(storageFolder.getAbsolutePath() + '/kkquest.json');
    var states = {};

    if (storageFile.exists()) {
        states = JSON.parse(Util.readFile(storageFile));
    }
    
    var npcs = {
        kaivosmies: 3,
        tutkija: 4,
        kouluttaja: 5,
        kouluttaja2: 10
    };
    
    var reg = CitizensAPI.getNPCRegistry();
    var talkStage = {};
    var lastTalk = {};
    
    var _ruleTrack1 = Util.parseLocation('Alku/2.5/104.0/74.5');
    var _ruleTrack2 = Util.parseLocation('Alku/-1.5/104.0/74.5');
    var _ruleTrack = Util.parseLocation('Alku/83.5/20.0/96.5/0.0/-180.0');
    var _ruleTrackNoEnter = Util.parseLocation('Alku/0.1/104.0/61.7/4.2/-55.3');
    
    var _ruleTrackExit = Util.parseLocation('Alku/92.5/20.0/96.5');
    
    var _colorName = ChatColor.BOLD;
    var _colorReset = ChatColor.RESET + '' + ChatColor.AQUA;
    
    var _mineNoEnter = Util.parseLocation('Alku/45.5/104.0/-28.5');
    var _mineFar = Util.parseLocation('Alku/36.5/104.0/-17.5/4.4/-140.0');
    
    var _trainingEnd = Util.parseLocation('Alku/83.5/20.0/-78.5');
    var _trainingEndFar = Util.parseLocation('Alku/0.5/104.0/58.5/0.0/-180.0');
    
    var _mineEnd = Util.parseLocation('Alku/51.5/104.0/-35.5');
    var _mineEndFar = Util.parseLocation('Kuningaskunta/0.5/68.0/0.5/0.0/0.0');
    
    function npcMessage(nof, player, name, message){
        player.sendMessage(ChatColor.GRAY + '['+nof+'] ' + ChatColor.DARK_AQUA + '' + name + ': ' + ChatColor.AQUA + '' + message);
    }
    
    function getQuestStage(player){
        var pid = player.getUniqueId().toString();
        if (states[pid] != null) {
            return states[pid];
        } else {
            states[pid] = {
                playerName: player.getName(),
                questStage: 0,
                foundXenoNpcs: []
            };
            return states[pid];
        }
    }
    
    function makeInvisible(player){
    
        var pl = Bukkit.getOnlinePlayers();
        if (invisiblePlayers.indexOf(player.getUniqueId().toString()) == -1)
            invisiblePlayers.push(player.getUniqueId().toString());
            
        for (var i = 0; i < pl.length; i++) {
            var p = pl[i];
            if (p != null){
                if (!p.hasPermission('xess.admin')){
                    p.hidePlayer(player);
                }
            }
        }
        
    }
    
    function makeVisible(player){
        var pl = Bukkit.getOnlinePlayers();
        for (var i = 0; i < pl.length; i++) {
            var p = pl[i];
            if (p != null){
                p.showPlayer(player);
            }
        }
    }
    
    function interactNpc(npc, player){
        
        var _qs = getQuestStage(player);
        var qs = _qs.questStage;
        var pid = player.getUniqueId().toString();
        var npcId = npc.getId();
        
        if (player.getInventory().getItemInMainHand() != null && player.getInventory().getItemInMainHand().getType().toString() == 'STICK') {
            player.sendMessage('stage: ' + qs + ' / pid: ' + pid + ' / npcId: ' + npcId);
        }
        if (player.getInventory().getItemInMainHand() != null && player.getInventory().getItemInMainHand().getType().toString() == 'MILK_BUCKET') {
            if (npcId == npcs.kaivosmies) {
                player.sendMessage(Util.INFO_PREFIX + 'Alkutehtävä on resetoitu sinulta.');
                getQuestStage(player)['questStage'] = 0;
                return;
            }
        }
        
        if (talkStage[pid] == null)
            talkStage[pid] = 0;
        
        if (_qs.foundXenoNpcs == null)
            _qs.foundXenoNpcs = [];
        
        var xenoNpcCount = 6;
        
        function npcCookieCheck(){
            if (_qs.foundXenoNpcs.length == xenoNpcCount){
                player.sendMessage(Util.INFO_PREFIX + 'Jee, löysit kaikki vanhat Xenolaiset! Tässä keksi, ehkä?');
                player.getInventory().addItem(Util.getCustomDamagedItem(Java.type('org.bukkit.Material').COOKIE, 0));
            }
        }
        
        if (npcId == 7) {
            if (_qs.foundXenoNpcs.indexOf('tapsa') == -1) {
                _qs.foundXenoNpcs.push('tapsa');
                player.sendMessage(Util.INFO_PREFIX + 'Löysit vanhan Xenolaisen! [' + _qs.foundXenoNpcs.length + '/' + xenoNpcCount + ']');
                player.playSound(player.getLocation(), Java.type('org.bukkit.Sound').ENTITY_EXPERIENCE_ORB_PICKUP, 1.0, 1.0);
                npcCookieCheck();
            }
            if (player.getInventory().getItemInMainHand() != null && player.getInventory().getItemInMainHand().getType().toString() == 'MILK_BUCKET'){
                _qs.foundXenoNpcs = [];
                player.sendMessage(Util.INFO_PREFIX + 'Nuin ikkäästi! Xenolaistenetsintätilastosi on nyt nollattu.');
            }
            npcMessage('1/1', player, npc.getName(), 'Moi! Ooks nähny mun kuokkaa?');
        } else if (npcId == 8) {
            npcMessage('1/1', player, npc.getName(), 'Höh? Alasimen äärellä on joskus yksinäistä.');
        } else if (npcId == 9) {
            npcMessage('1/1', player, npc.getName(), 'Tämä on sotatorvi. Se on tehty puhtaasta kullasta!');
        } else if (npcId == 11) {
            if (_qs.foundXenoNpcs.indexOf('pysco') == -1) {
                _qs.foundXenoNpcs.push('pysco');
                player.sendMessage(Util.INFO_PREFIX + 'Löysit vanhan Xenolaisen! [' + _qs.foundXenoNpcs.length + '/' + xenoNpcCount + ']');
                player.playSound(player.getLocation(), Java.type('org.bukkit.Sound').ENTITY_EXPERIENCE_ORB_PICKUP, 1.0, 1.0);
                npcCookieCheck();
            }
            npcMessage('1/1', player, npc.getName(), 'Moro nääs!');
        } else if (npcId == 12) {
            if (_qs.foundXenoNpcs.indexOf('survi') == -1) {
                _qs.foundXenoNpcs.push('survi');
                player.sendMessage(Util.INFO_PREFIX + 'Löysit vanhan Xenolaisen! [' + _qs.foundXenoNpcs.length + '/' + xenoNpcCount + ']');
                player.playSound(player.getLocation(), Java.type('org.bukkit.Sound').ENTITY_EXPERIENCE_ORB_PICKUP, 1.0, 1.0);
                npcCookieCheck();
            }
            npcMessage('1/1', player, npc.getName(), 'Pottulandia tulee valtaamaan tämän paikan...');
        } else if (npcId == 13) {
            if (_qs.foundXenoNpcs.indexOf('iikoni') == -1) {
                _qs.foundXenoNpcs.push('iikoni');
                player.sendMessage(Util.INFO_PREFIX + 'Löysit vanhan Xenolaisen! [' + _qs.foundXenoNpcs.length + '/' + xenoNpcCount + ']');
                player.playSound(player.getLocation(), Java.type('org.bukkit.Sound').ENTITY_EXPERIENCE_ORB_PICKUP, 1.0, 1.0);
                npcCookieCheck();
            }
            npcMessage('1/1', player, npc.getName(), 'Klassisesta fysiikasta poiketen monet suureet saavat diskreettejä arvoja eli ne ovat kvantittuneita. Teorian nimi on peräisin siitä havainnosta, että sähkömagneettinen säteily muodostuu diskreeteistä paketeista. Täh?');
        } else if (npcId == 21) {
            if (_qs.foundXenoNpcs.indexOf('mike') == -1) {
                _qs.foundXenoNpcs.push('mike');
                player.sendMessage(Util.INFO_PREFIX + 'Löysit vanhan Xenolaisen! [' + _qs.foundXenoNpcs.length + '/' + xenoNpcCount + ']');
                player.playSound(player.getLocation(), Java.type('org.bukkit.Sound').ENTITY_EXPERIENCE_ORB_PICKUP, 1.0, 1.0);
                npcCookieCheck();
            }
            npcMessage('1/1', player, npc.getName(), 'Huh. Valmistautumassa sääntökierrokselle? Niin minäkin, tankkaan ensin kunnon eväät!');
        } else if (npcId == 25) {
            if (_qs.foundXenoNpcs.indexOf('empeet') == -1) {
                _qs.foundXenoNpcs.push('empeet');
                player.sendMessage(Util.INFO_PREFIX + 'Löysit vanhan Xenolaisen! [' + _qs.foundXenoNpcs.length + '/' + xenoNpcCount + ']');
                player.playSound(player.getLocation(), Java.type('org.bukkit.Sound').ENTITY_EXPERIENCE_ORB_PICKUP, 1.0, 1.0);
                npcCookieCheck();
            }
            npcMessage('1/1', player, npc.getName(), 'Hmm...voisinkohan vähän lainata paria kurpitsaa?');
        } else if (npcId == 39) {
            npcMessage('1/1', player, npc.getName(), 'Kuulun tänne.');
        }
        
        if (qs == 0) {
            
            if (npcId == npcs.kaivosmies) {
                switch (talkStage[pid]){
                    case 0:
                        npcMessage('1/3', player, npc.getName(), 'Ah, siinähän sinä oletkin, '+player.getName()+'! Ehdinkin jo odotella.');
                        talkStage[pid]++;
                        break;
                    case 1:
                        npcMessage('2/3', player, npc.getName(), 'Jotain suurenmoista on kehitteillä. Olemme tehneet tieteellisen läpimurron.');
                        talkStage[pid]++;
                        break;
                    case 2:
                        npcMessage('3/3', player, npc.getName(), 'Mutta minulla ei ole aikaa jäädä selittämään tätä, etsi ' + _colorName + 'Tutkija Aisamos' + _colorReset + ', hän kertoo lisää.');
                        talkStage[pid] = 0;
                        getQuestStage(player)['questStage']++;
                        break;
                }
            } else {
                if (npcId == npcs.tutkija || npcId == npcs.kouluttaja) {
                    npcMessage('1/1', player, npc.getName(), 'Hei! Etsi ' + _colorName + 'Kaivoshenkilö' + _colorReset + ', hänellä on sinulle asiaa.');
                }
            }
            
        } else if (qs == 1) {
            
            if (npcId == npcs.tutkija) {
                switch (talkStage[pid]){
                    case 0:
                        npcMessage('1/7', player, npc.getName(), 'Tervehdys, '+player.getName()+'! Ihmettelet varmaan, mitä täällä on meneillään.');
                        talkStage[pid]++;
                        break;
                    case 1:
                        npcMessage('2/7', player, npc.getName(), 'Olen Tutkija Aisamos, Kaukaisten vuorten tutkimus- ja kaivoslaitoksen pääjehu.');
                        talkStage[pid]++;
                        break;
                    case 2:
                        npcMessage('3/7', player, npc.getName(), 'Tässä on vanha louhos, jota olemme tutkineet jo viikkoja. Louhokseen liittyy vanhoja taruja, jotka yllättäen ovat osoittautuneet todeksi.');
                        talkStage[pid]++;
                        break;
                    case 3:
                        npcMessage('4/7', player, npc.getName(), 'Sanotaan, että louhoksesta pääsee ' + _colorName + 'Kuningaskuntaan' + _colorReset + ', eräänlaiseen toiseen ulottuvuuteen.');
                        talkStage[pid]++;
                        break;
                    case 4:
                        npcMessage('5/7', player, npc.getName(), 'Olemme tutkineet Kuningaskuntaa hetken aikaa, ja nyt haluaisimme lähettää jonkun uskaliaan henkilön sinne vakituisesti.');
                        talkStage[pid]++;
                        break;
                    case 5:
                        npcMessage('6/7', player, npc.getName(), 'Tässä kohtaa sinä astut mukaan kuvioon, ' + player.getName() + '. Sinä voisit olla juuri sopiva.');
                        talkStage[pid]++;
                        break;
                    case 6:
                        npcMessage('7/7', player, npc.getName(), 'Ennen kuin pääset lähtemään, sinut koulutetaan Kuningaskunnan saloihin. Käy ' + _colorName + 'Kouluttaja Raineen' + _colorReset + ' juttusilla, löydät hänet koulutuskeskuksesta.');
                        talkStage[pid] = 0;
                        getQuestStage(player)['questStage']++;
                        break;
                }
            } else {
                if (npcId == npcs.kaivosmies || npcId == npcs.kouluttaja) {
                    npcMessage('1/1', player, npc.getName(), 'Joko löysit ' + _colorName + 'Tutkija Aisamoksen' + _colorReset + '?');
                }
            }
            
        } else if (qs == 2) {
            
            if (npcId == npcs.kouluttaja) {
                switch (talkStage[pid]){
                    case 0:
                        npcMessage('1/2', player, npc.getName(), 'No jopas! Tervetuloa Kaukaisille vuorille! Minä olen Raine, tutkimuskeskuksen kouluttaja.');
                        talkStage[pid]++;
                        break;
                    case 1:
                        npcMessage('2/2', player, npc.getName(), 'Pääset koulutuskierrokselle takanani olevista ovista. Tapaan sinut kierroksen loppupäässä. Pidä hauskaa!');
                        talkStage[pid] = 0;
                        getQuestStage(player)['questStage']++;
                        break;
                }
            } else {
                if (npcId == npcs.tutkija || npcId == npcs.kaivosmies) {
                    npcMessage('1/1', player, npc.getName(), 'Joko olet käynyt koulutuksessa?');
                }
            }
            
        } else if (qs == 3) {
            
            if (npcId == npcs.kouluttaja2) {
                switch (talkStage[pid]){
                    case 0:
                        npcMessage('1/1', player, npc.getName(), 'Loistavaa, sinussa on kuin onkin ainesta! Pääset ulos takanani olevasta tunnelista. Palaa Tutkija Aisamoksen luo!');
                        talkStage[pid] = 0;
                        getQuestStage(player)['questStage']++;
                        break;
                }
            } else {
                if (npcId == npcs.kouluttaja) {
                    npcMessage('1/1', player, npc.getName(), 'Pääset koulutuskierrokselle takanani olevista ovista.');
                } else if (npcId == npcs.kaivosmies || npcId == npcs.tutkija) {
                    npcMessage('1/1', player, npc.getName(), 'Joko olet käynyt koulutuskierroksella?');
                }
            }
            
        } else if (qs == 4) {
            
            if (npcId == npcs.tutkija) {
                switch (talkStage[pid]){
                    case 0:
                        npcMessage('1/3', player, npc.getName(), 'Läpäisit siis koulutuksen? Loistavaa!');
                        talkStage[pid]++;
                        break;
                    case 1:
                        npcMessage('2/3', player, npc.getName(), 'Nyt saat lähteä kohti Kuningaskuntaa. Kun kävelet louhokseen, humahdat toiseen ulottuvuuteen. Se saattaa hieman kutittaa.');
                        talkStage[pid]++;
                        break;
                    case 2:
                        npcMessage('3/3', player, npc.getName(), 'Toivotan sinulle onnea, '+player.getName()+'. Olet osa tieteen historiaa. Palaa joskus kertomaan löydöksistäsi!');
                        talkStage[pid] = 0;
                        getQuestStage(player)['questStage']++;
                        break;
                }
            } else {
                if (npcId == npcs.kaivosmies || npcId == npcs.kouluttaja) {
                    npcMessage('1/1', player, npc.getName(), 'Tutkija Aisamos neuvoo sinut kohti seuraavia askelia.');
                } else if (npcId == npcs.kouluttaja2) {
                    npcMessage('1/1', player, npc.getName(), 'Palaa Tutkija Aisamoksen luo takanani olevaa tunnelia pitkin.');
                }
            }
            
        } else if (qs == 5) {
            if (npcId == npcs.kaivosmies || npcId == npcs.tutkija || npcId == npcs.kouluttaja2) {
                npcMessage('1/1', player, npc.getName(), 'Onnea matkaan!');
            } else if (npcId == npcs.kouluttaja) {
                npcMessage('1/1', player, npc.getName(), 'Onnea matkaan! Voit koska tahansa palata tänne lukemaan säännöt komennolla ' + ChatColor.WHITE + '/spawn');
            }
        } else if (qs > 5) {
            if (npcId == npcs.kaivosmies) {
                npcMessage('1/1', player, npc.getName(), 'Terve taas, ' + player.getName() + '! Mitä Kuningaskuntaan kuuluu?');
            } else if (npcId == npcs.kouluttaja) {
                npcMessage('1/1', player, npc.getName(), 'Moi, ' + player.getName() + '. Palasitko sääntöjä lukemaan?');
            } else if (npcId == npcs.tutkija) {
                switch (talkStage[pid]) {
                    case 0:
                        npcMessage('1/3', player, npc.getName(), 'Oi, katsopas, sehän on ' + player.getName() + '!');
                        talkStage[pid]++;
                        break;
                    case 1:
                        npcMessage('2/3', player, npc.getName(), 'Kerrohan, onko Kuningaskunnassa porkkanoita?');
                        talkStage[pid]++;
                        break;
                    case 2:
                        npcMessage('3/3', player, npc.getName(), 'Minä sitten niin pidän porkkanoista.');
                        talkStage[pid] = 0;
                        break;
                }
            }
        }
        
    }
    
    Events.on(Java.type('org.bukkit.event.player.PlayerInteractEntityEvent'), function(e){
        if (reg.isNPC(e.getRightClicked())){
            
            if (e.getHand().toString() == 'HAND') {
            
                var npc = reg.getNPC(e.getRightClicked());
                //e.getPlayer().sendMessage('npc #' + npc.getId());
                
                if (lastTalk[e.getPlayer().getUniqueId().toString()] != null) {
                    if (lastTalk[e.getPlayer().getUniqueId().toString()] != npc.getId()) {
                        talkStage[lastTalk[e.getPlayer().getUniqueId().toString()]] = 0;
                    }
                }
                
                lastTalk[e.getPlayer().getUniqueId().toString()] = npc.getId();
                interactNpc(npc, e.getPlayer());
                
            }
            
        }
    });
    
    var Double = Java.type('java.lang.Double');
    
    Events.on(Java.type('org.bukkit.event.player.PlayerMoveEvent'), function(e){
        if (e.getPlayer().getLocation().getWorld().getName() == 'Alku'){
            if (e.getPlayer().getLocation().distance(_mineNoEnter) < 5.0) {
                if (getQuestStage(e.getPlayer()).questStage < 5) {
                    npcMessage('1/1', e.getPlayer(), 'Tutkija Aisamos', 'Hei, varovasti! Et voi mennä louhokseen ennen koulutuskierrosta.');
                    e.getPlayer().teleport(_mineFar);
                }
            } else if (e.getPlayer().getLocation().distance(_ruleTrackExit) < 2.0) {
                e.getPlayer().teleport(_ruleTrackNoEnter);
            } else if (e.getPlayer().getLocation().distance(_ruleTrack1) < 3.0 || e.getPlayer().getLocation().distance(_ruleTrack2) < 3.0) {
                if (getQuestStage(e.getPlayer()).questStage < 3) {
                    npcMessage('1/1', e.getPlayer(), 'Kouluttaja Raine', 'Hetkonen, hetkonen! Meinaatko rynnätä sinne puhumatta minulle?');
                    e.getPlayer().teleport(_ruleTrackNoEnter);
                } else {
                    e.getPlayer().teleport(_ruleTrack);
                    makeInvisible(e.getPlayer());
                }
            } else if (e.getPlayer().getLocation().distance(_trainingEnd) < 2) {
                
                e.getPlayer().teleport(_trainingEndFar);
                
                if (getQuestStage(e.getPlayer())['questStage'] < 5) {
                    talkStage[e.getPlayer().getUniqueId().toString()] = 0;
                    getQuestStage(e.getPlayer())['questStage'] = 4;
                }
                
                makeVisible(e.getPlayer());
                
            } else if (e.getPlayer().getLocation().distance(_mineEnd) < 5) {
                
                npcMessage('1/1', e.getPlayer(), 'Tutkija Aisamos', 'Onnea matk--skrd-aa- *# ? ??-?');
                e.getPlayer().getWorld().spawnParticle(Java.type('org.bukkit.Particle').EXPLOSION_HUGE, e.getPlayer().getLocation(), 2, Double.parseDouble(2), Double.parseDouble(2), Double.parseDouble(10));
                e.getPlayer().playSound(e.getPlayer().getLocation(), Java.type('org.bukkit.Sound').BLOCK_FIRE_EXTINGUISH, 1.0, 0.66);
                
                e.getPlayer().sendMessage(ChatColor.GRAY + '' + ChatColor.ITALIC + 'Vatsanpohjassasi kihelmöi. Siirryit Kuningaskuntaan.');
                e.getPlayer().teleport(_mineEndFar);
                
                // reset playtime
                playerStorage.getPlayer(e.getPlayer()).put('playtime', 0);
                
                talkStage[e.getPlayer().getUniqueId().toString()] = 0;
                getQuestStage(e.getPlayer())['questStage'] = 6;
                
            }
        }
    });
    
    Events.on(Java.type('org.bukkit.event.world.WorldSaveEvent'), function(e){
        if (e.getWorld().getName() == 'Alku'){
            
            Plugin.getLogger().info('Saving progress of KKEvent');
            Util.writeFile(JSON.stringify(states, null, 2), storageFile.getAbsolutePath());
            
        }
    });
    
    Events.on(Java.type('org.bukkit.event.player.AsyncPlayerChatEvent'), function(e){
        if (e.getMessage().startsWith('!kksuorita')){
            if (e.getPlayer().hasPermission('xess.admin')){
                var pts = e.getMessage().split(' ');
                if (pts.length >= 2){
                    var pld = Bukkit.getOfflinePlayer(pts[1]);
                    if (pld != null){
                        states[pld.getUniqueId().toString()].questStage = 6;
                        e.getPlayer().sendMessage('Juuh.');
                    }
                }
            }
        }
    });
    
    onDisableEvents.push(function(){
        Plugin.getLogger().info('Saving progress of KKEvent');
        Util.writeFile(JSON.stringify(states, null, 2), storageFile.getAbsolutePath());
    });
    
})();



(function(){
    
    /*
    var Util = Java.type('ga.lehto.xenoframework.Util');
    var playerStorage = XenoFramework.getPlayerStorage();
    
    var castleNoEnter = Util.parseLocation('Kuningaskunta/6315/93/-840');
    var castleNoEnterTp = Util.parseLocation('Kuningaskunta/6308.7/93.0/-839.7/-9/-90');
    
    var kingNoEnter = Util.parseLocation('Kuningaskunta/6359.5/97.5/-840.5');
    var kingNoEnterTp = Util.parseLocation('Kuningaskunta/6352.5/95.5/-840.5/-10/-90');
    
    function npcMessage(nof, player, name, message){
        player.sendMessage(ChatColor.GRAY + '['+nof+'] ' + ChatColor.DARK_AQUA + '' + name + ': ' + ChatColor.AQUA + '' + message);
    }
    
    var allowedBuffer = [];
    var disallowedBuffer = [];
    
    Events.on(Java.type('org.bukkit.event.player.PlayerMoveEvent'), function(e){
        if (allowedBuffer.indexOf(e.getPlayer().getUniqueId()) == -1) {
            var ps = playerStorage.getPlayer(e.getPlayer());
            if (!e.getPlayer().hasPermission('xess.admin') && !(
                ps.hasRole('kuningas') || ps.hasRole('valtionkansleri') || ps.hasRole('arkistokansleri') || ps.hasRole('arkistoija')
                || ps.hasRole('kaartilainen') || ps.hasRole('kaartinjohtaja') || ps.hasRole('vanhempikaartilainen')
                || ps.hasRole('nuorempikaartilainen') || ps.hasRole('valahenkilo') || ps.hasRole('tuomari')
                || ps.hasRole('vapaahenkilo')
            )) {
                if (e.getPlayer().getLocation().getWorld().getName() == 'Kuningaskunta'){
                    if (e.getPlayer().getLocation().distance(kingNoEnter) < 2.5) {
                        e.getPlayer().teleport(kingNoEnterTp);
                        npcMessage('1/1', e.getPlayer(), 'Vartija', 'Hei! Tänne ei ole nyt tulemista.');
                    } else if (e.getPlayer().getLocation().distance(castleNoEnter) < 3) {
                        e.getPlayer().teleport(castleNoEnterTp);
                        npcMessage('1/1', e.getPlayer(), 'Vartija', 'Hoi! Linnaan ei voi tulla juuri nyt.');
                    }
                }
            }
        }
    });
    */
    
})();

