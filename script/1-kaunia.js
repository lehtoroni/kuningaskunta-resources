/* */

var Util = Java.type('ga.lehto.xenoframework.Util');
var File = Java.type('java.io.File');
var JSONObject = Java.type('org.json.JSONObject');
var ChatColor = Java.type('org.bukkit.ChatColor');
var CitizensAPI = Java.type('net.citizensnpcs.api.CitizensAPI');
var ItemStack = Java.type('org.bukkit.inventory.ItemStack');

/*
 quest stages:
 0 = not started, talk to NPC id 3
*/

(function(){
    
    var storageFolder = new File(Plugin.getDataFolder().getAbsolutePath() + '/storage/');
    if (!storageFolder.exists())
        storageFolder.mkdirs();

    var storageFile = new File(storageFolder.getAbsolutePath() + '/kauniaquest.json');
    var states = {};

    if (storageFile.exists()) {
        states = JSON.parse(Util.readFile(storageFile));
    }
    var playerStorage = XenoFramework.getPlayerStorage();
    
    var npcs = {
        kainovieno: 27,
        pormestari: 28,
        seppa: 20,
        pankinjohtaja: 24
    };
    var thisQuestNpcs = [];
    var npcKeys = Object.keys(npcs);
    for (var i = 0; i < npcKeys.length; i++) {
        thisQuestNpcs.push(npcs[npcKeys[i]]);
    }
    
    var reg = CitizensAPI.getNPCRegistry();
    var talkStage = {};
    var lastTalk = {};
    
    var _colorName = ChatColor.BOLD;
    var _colorReset = ChatColor.RESET + '' + ChatColor.AQUA;
    
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
    
    function interactNpc(npc, player){
        
        var _qs = getQuestStage(player);
        var qs = _qs.questStage;
        var pid = player.getUniqueId().toString();
        var npcId = npc.getId();
        
        if (player.getInventory().getItemInMainHand() != null && player.getInventory().getItemInMainHand().getType().toString() == 'MILK_BUCKET') {
            if (npcId == npcs.kainovieno) {
                player.sendMessage(Util.INFO_PREFIX + 'Kaino-Vienon tehtävä on resetoitu sinulta.');
                getQuestStage(player)['questStage'] = 0;
                return;
            }
        }
        
        if (talkStage[pid] == null)
            talkStage[pid] = 0;
        
        if (qs == 0) {
            
            if (npcId == npcs.kainovieno) {
                switch (talkStage[pid]){
                    case 0:
                        npcMessage('1/3', player, npc.getName(), 'Kappas, mistä sinä siihen tupsahdit?');
                        talkStage[pid]++;
                        break;
                    case 1:
                        npcMessage('2/3', player, npc.getName(), 'Täällä tapahtuu ilmeisesti kummia. Kauniaan tulee uutta väkeä kuin toisesta ulottuvuudesta, hih!');
                        talkStage[pid]++;
                        break;
                    case 2:
                        npcMessage('3/3', player, npc.getName(), 'Sinä ressukka olet aivan puilla paljailla. Sinun kannattaa jututtaa Kaunian ' + _colorName + 'Pormestaria' + _colorReset + '. Löydät hänet varmaankin ' + _colorName + 'Rauhantalolta' + _colorReset + '.');
                        talkStage[pid] = 0;
                        getQuestStage(player)['questStage']++;
                        break;
                }
            } else {
                if (thisQuestNpcs.indexOf(npcId) > -1) {
                    npcMessage('1/1', player, npc.getName(), 'Oho, muukalainen! Etsi ' + _colorName + 'Kaino-Vieno' + _colorReset + ', hän osaa auttaa sinut alkuun.');
                }
            }
            
        } else if (qs == 1) {
            
            if (npcId == npcs.pormestari) {
                switch (talkStage[pid]){
                    case 0:
                        npcMessage('1/9', player, npc.getName(), 'Sitten vielä D#-molli...hmm...');
                        talkStage[pid]++;
                        break;
                    case 1:
                        npcMessage('2/9', player, npc.getName(), 'Hm..?');
                        talkStage[pid]++;
                        break;
                    case 2:
                        npcMessage('3/9', player, npc.getName(), 'Öhm... Päivää! Minä olen Kaunian Pormestari, ja suoritan täällä...öh... virallista turvallisuustarkastusta!');
                        talkStage[pid]++;
                        break;
                    case 3:
                        npcMessage('4/9', player, npc.getName(), 'Mitä? Ehei, en minä soittanut, eihän se olisi lainkaan sopivaa.');
                        talkStage[pid]++;
                        break;
                    case 4:
                        npcMessage('5/9', player, npc.getName(), 'Mutta hetkonen, sinua en olekaan aiemmin nähnyt. Kuka sanoitkaan olevasi?');
                        talkStage[pid]++;
                        break;
                    case 5:
                        npcMessage('6/9', player, npc.getName(), 'Ah, terve vaan, ' + player.getName() + '. Minä olen...ai niin, minähän esittelin jo itseni!');
                        talkStage[pid]++;
                        break;
                    case 6:
                        npcMessage('7/9', player, npc.getName(), 'Olet ilmeisesti tavannut Kaino-Vienon? Kyllä vaan, voisimme auttaa sinut alkuun. Muukalaiset ovat aina tervetulleita!');
                        talkStage[pid]++;
                        break;
                    case 7:
                        npcMessage('8/9', player, npc.getName(), 'Et ilmeisesti ole vielä Kuningaskunnan kansalainen. Sinun pitää anoa kansalaisuutta julkishallinnon virastosta.');
                        talkStage[pid]++;
                        break;
                    case 8:
                        npcMessage('9/9', player, npc.getName(), 'Ai, tiesit sen jo? Hyvä! Tarvitset varmaankin näin aluksi hieman rahaa ja työkaluja. Käy '+_colorName+'Kaunian sepän'+_colorReset+' juttusilla. Hän auttaa varmasti mielellään.');
                        talkStage[pid] = 0;
                        getQuestStage(player)['questStage']++;
                        break;
                }
            } else {
                if (thisQuestNpcs.indexOf(npcId) > -1) {
                    npcMessage('1/1', player, npc.getName(), 'Oletko jo puhunut Pormestarille?');
                }
            }
            
        } else if (qs == 2) {
            
            if (npcId == npcs.seppa) {
                switch (talkStage[pid]){
                    case 0:
                        npcMessage('1/6', player, npc.getName(), '*kröh* Therve. Minä olen *kröh* Kaunian seppä. Kukas sinä olet?');
                        talkStage[pid]++;
                        break;
                    case 1:
                        npcMessage('2/6', player, npc.getName(), 'Hauska thavata, ' + player.getName() + '. Olet ilmeisesti uusi täällä?');
                        talkStage[pid]++;
                        break;
                    case 2:
                        npcMessage('3/6', player, npc.getName(), 'Varsin erikoista tosiaan. Tarvitset varmaankin hieman alkuvälineitä.');
                        talkStage[pid]++;
                        break;
                    case 3:
                        npcMessage('4/6', player, npc.getName(), 'Minulla on tässä pari ylimääräistä työkalua... Voisin lahjoittaa ne sinulle, jos se vain sopii.');
                        talkStage[pid]++;
                        break;
                    case 4:
                        npcMessage('5/6', player, npc.getName(), 'Jes. Tässä on sinulle ainakin kirves ja hakku. Muuta minulla ei ole antaa.');
                        player.getInventory().addItem(new ItemStack(Java.type('org.bukkit.Material').IRON_PICKAXE));
                        player.getInventory().addItem(new ItemStack(Java.type('org.bukkit.Material').IRON_AXE));
                        talkStage[pid]++;
                        break;
                    case 5:
                        npcMessage('6/6', player, npc.getName(), 'Toivottavasti näistä on apua. '+_colorName+'Pankinjohtajalla'+_colorReset+' voisi olla sinulle myös jotain annettavaa.');
                        talkStage[pid]++;
                        talkStage[pid] = 0;
                        getQuestStage(player)['questStage']++;
                        break;
                }
            } else {
                if (thisQuestNpcs.indexOf(npcId) > -1) {
                    npcMessage('1/1', player, npc.getName(), 'Oletko jo puhunut Sepälle?');
                }
            }
            
        } else if (qs == 3) {
            
            if (npcId == npcs.pankinjohtaja) {
                switch (talkStage[pid]){
                    case 0:
                        npcMessage('1/6', player, npc.getName(), 'Hei, ja tervetuloa Kaunian pankkiin! Miten voin auttaa?');
                        talkStage[pid]++;
                        break;
                    case 1:
                        npcMessage('2/6', player, npc.getName(), 'Ah, eräs asiakkaamme kertoikin, että tänne on päätynyt joku muukalainen. Miten loistavaa.');
                        talkStage[pid]++;
                        break;
                    case 2:
                        npcMessage('3/6', player, npc.getName(), 'Haluaisitko avata pankkitilin? Mahtavaa! Pääset tallettamaan ja nostamaan rahaa ' + _colorName + 'Pankkiirien' + _colorReset + ' avulla.');
                        talkStage[pid]++;
                        break;
                    case 3:
                        npcMessage('4/6', player, npc.getName(), 'Tässä on sinulle jokunen lati ihan tilin pohjan täytteeksi. Ainahan meidän pankillamme nyt on hieman antaa.');
                        var xeni = Util.xeni(30, player);
                        player.getInventory().addItem(xeni);
                        talkStage[pid]++;
                        break;
                    case 4:
                        npcMessage('5/6', player, npc.getName(), 'Mitä? Ei, ei tarvitse maksaa takaisin. Sanottakoon, että tämä on tilinavauslahja.');
                        talkStage[pid]++;
                        break;
                    case 5:
                        npcMessage('6/6', player, npc.getName(), 'Noh, nyt palaan muiden tehtävieni pariin. Toivotan sinulle onnea ja menestystä! Palaa nyt ' + _colorName + 'Pormestarin' + _colorReset + ' luo!');
                        talkStage[pid] = 0;
                        getQuestStage(player)['questStage']++;
                        break;
                }
            } else {
                if (thisQuestNpcs.indexOf(npcId) > -1) {
                    npcMessage('1/1', player, npc.getName(), 'Oletko jo puhunut Pankinjohtajalle?');
                }
            }
            
        } else if (qs == 4) {
            
            if (npcId == npcs.pormestari) {
                switch (talkStage[pid]){
                    case 0:
                        npcMessage('1/4', player, npc.getName(), 'Hienoa, olet päässyt hyvin alkuun!');
                        talkStage[pid]++;
                        break;
                    case 1:
                        npcMessage('2/4', player, npc.getName(), 'Seuraava askel voisi olla kansalaisuuden hakeminen. Mutta sitä varten sinun tulee viettää Kuningaskunnassa vähintään seitsemän pelipäivää.');
                        talkStage[pid]++;
                        break;
                    case 2:
                        npcMessage('3/4', player, npc.getName(), 'Käy kunnantalolla virkailijan juttusilla, hän auttaa sinua anomuksen kanssa!');
                        talkStage[pid]++;
                        break;
                    case 3:
                        npcMessage('4/4', player, npc.getName(), 'Nyt, jos sallit, ' + player.getName() + ', palaisin sävell... *kröh kröh* toimeni pariin!');
                        player.sendMessage(ChatColor.GRAY + '' + ChatColor.ITALIC + 'Olet nyt suorittanut alkutehtävän.');
                        playerStorage.getPlayer(player).put('kauniaQuestDone', 1);
                        talkStage[pid] = 0;
                        getQuestStage(player)['questStage']++;
                        break;
                }
            } else {
                if (thisQuestNpcs.indexOf(npcId) > -1) {
                    npcMessage('1/1', player, npc.getName(), 'Oletko palannut jo Pormestarin juttusille?');
                }
            }
            
        } else {
            
            if (npcId == npcs.kainovieno) {
                npcMessage('1/1', player, npc.getName(), 'Hei taas, ' + player.getName() + '! Miten menee?');
            } else if (npcId == npcs.seppa) {
                npcMessage('1/1', player, npc.getName(), '*krhm* Noh, päivää. Kaipaatko sepän palveluita?');
            } else if (npcId == npcs.pankinjohtaja) {
                npcMessage('1/1', player, npc.getName(), 'Jaha, sehän on..hmm..' + player.getName() + '! Heh heh, vieläkö rahat riittävät?');
            }
            
        }
        
    }
    
    Events.on(Java.type('org.bukkit.event.player.PlayerInteractEntityEvent'), function(e){
        if (reg.isNPC(e.getRightClicked())){
            
            if (e.getHand().toString() == 'HAND') {
            
                var npc = reg.getNPC(e.getRightClicked());
                
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
    
    Events.on(Java.type('org.bukkit.event.world.WorldSaveEvent'), function(e){
        if (e.getWorld().getName() == 'Kuningaskunta'){
            
            Util.writeFile(JSON.stringify(states, null, 2), storageFile.getAbsolutePath());
            
        }
    });
    
    onDisableEvents.push(function(){
        Util.writeFile(JSON.stringify(states, null, 2), storageFile.getAbsolutePath());
    });
    
})();
