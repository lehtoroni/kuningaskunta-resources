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
    
    var validOfficers = [
        29
    ];
    
    var talkStage = {};
    
    var questNpcs = {
        jaakoppi: 32,
        pormestari: 28,
        olivia: 33,
        reino: 34
    };
    var validNpcs = [];
    var ks = Object.keys(questNpcs);
    for (var i = 0; i < ks.length; i++){
        validNpcs.push(questNpcs[ks[i]]);
    }
    
    function npcMessage(nof, player, name, message){
        player.sendMessage(ChatColor.GRAY + '['+nof+'] ' + ChatColor.DARK_AQUA + '' + name + ': ' + ChatColor.AQUA + '' + message);
    }
    
    function getQuestStage(player){
        var ps = playerStorage.getPlayer(player);
        if (ps != null && ps.has('citizenshipQuestState')) {
            return ps.optInt('citizenshipQuestState', 0);
        }
        return 0;
    }
    
    function setQuestStage(player, state){
        var ps = playerStorage.getPlayer(player);
        ps.put('citizenshipQuestState', state);
    }
    
    function createAndGiveId(player){
        var ps = playerStorage.getPlayer(player);
        if (ps == null){
            ps = playerStorage.getPlayer(player);
        }
        var itemId = Util.nameLoreItem(Java.type('org.bukkit.Material').PAPER, ChatColor.GREEN+'Henkilöllisyystodistus', ChatColor.BLACK+'item::id::' + player.getUniqueId().toString());
        if (Util.hasSpaceInInventory(player)) {
            player.getInventory().addItem(itemId);
        } else {
            player.sendMessage(ChatColor.GRAY + '' + ChatColor.ITALIC + 'Taskusi ovat täynnä, henkilöllisyystodistus putosi maahan.');
            player.getWorld().dropItem(player.getLocation(), itemId);
        }
    }
    
    function interactNpc(npc, player){
        
        var qs = getQuestStage(player);
        var pid = player.getUniqueId().toString();
        var npcId = npc.getId();
        
        if (npcId == 29){
            if (player.getInventory().getItemInMainHand() != null && player.getInventory().getItemInMainHand().getType().toString() == 'MILK_BUCKET') {
                if (validOfficers.indexOf(npcId) > -1) {
                    player.sendMessage(Util.INFO_PREFIX + 'Kansalaisuustehtävä on resetoitu sinulta.');
                    setQuestStage(player, 0);
                    return;
                }
            }
        }
        
        if (talkStage[pid + '_' + npcId] == null)
            talkStage[pid + '_' + npcId] = 0;
        
        if (playerStorage.getPlayer(player).optString('role', 'irtolainen') == 'irtolainen') {
            
            if (qs == 0) {
                
                if (validOfficers.indexOf(npcId) > -1) {
                    switch (talkStage[pid + '_' + npcId]){
                        case 0:
                            npcMessage('1/6', player, npc.getName(), 'Kas, tervehdys, muukalainen.');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 1:
                            npcMessage('2/6', player, npc.getName(), 'Haluaisit anoa Kuningaskunnan kansalaisuutta?');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 2:
                            npcMessage('3/6', player, npc.getName(), 'Jo vain passaa. Mikä sanoitkaan olevan nimesi?');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 3:
                            npcMessage('4/6', player, npc.getName(), '' + player.getName() + '? Hyvä. Anomusprosessi on käynnistetty. Nyt sinun pitää hankkia suosittelija.');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 4:
                            npcMessage('5/6', player, npc.getName(), '' + 'Kansalaisilta odotetaan luottamusta ja nuhteetonta käytöstä. Oletko kansalaisuuden arvoinen?');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 5:
                            npcMessage('6/6', player, npc.getName(), '' + 'Tässä on sinulle suosituskirja. Jos olet tutustunut '+ChatColor.BOLD+'Kaunian kyläläisiin'+ChatColor.AQUA+', joku heistä suosittelee sinua varmasti.');
                            talkStage[pid + '_' + npcId]++;
                            setQuestStage(player, getQuestStage(player) + 1);
                            talkStage[pid + '_' + npcId] = 0;
                            break;
                    }
                }
                
            } else if (qs == 1) {
                
                if (validOfficers.indexOf(npcId) > -1) {
                    npcMessage('1/1', player, npc.getName(), 'Joko olet löytänyt kylästä sopivan suosittelijan?');
                } else {
                    
                    if (npcId == questNpcs.reino) {
                        switch (talkStage[pid + '_' + npcId]){
                        case 0:
                            npcMessage('1/4', player, npc.getName(), 'Oijoi! Jopas nyt!');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 1:
                            npcMessage('2/4', player, npc.getName(), 'Mitäh? Haluat Kylä-Reijon suosituksen? No jopas.');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 2:
                            npcMessage('3/4', player, npc.getName(), 'Mitä minä siitä hyödyn?');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 3:
                            npcMessage('4/4', player, npc.getName(), 'Hmm... Tarvitsisin kyllä uuden viikatteen. Hanki minulle sellainen, niin voin harkita asiaa!');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 4:
                            if (player.getInventory().getItemInMainHand() != null
                                  && Util.hasDataString(player.getInventory().getItemInMainHand())
                                  && ChatColor.stripColor(Util.getDataString(player.getInventory().getItemInMainHand())).startsWith('item::scythe')) {
                                npcMessage('1/1', player, npc.getName(), 'Oho, siinähän se...ja miten hieno! Kyllä sinä olet kansalaisuutesi ansainnut, tässä allekirjoitukseni.');
                                player.getInventory().setItemInMainHand(null);
                                setQuestStage(player, getQuestStage(player) + 1);
                                talkStage[pid + '_' + npcId] = 0;
                            } else {
                                npcMessage('1/1', player, npc.getName(), 'Vanha viikatteenrähjäni lojuu vielä varastossa. Ehjä sellainen, kiitos.');
                            }
                            break;
                        }
                    } else if (npcId == questNpcs.pormestari) {
                        switch (talkStage[pid + '_' + npcId]){
                        case 0:
                            npcMessage('1/4', player, npc.getName(), 'Tervehdys. Miten voin auttaa?');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 1:
                            npcMessage('2/4', player, npc.getName(), 'Kansalaisuus? Suositus? Ahaa, haluaisit Kuningaskunnan kansalaisuuden?');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 2:
                            npcMessage('3/4', player, npc.getName(), 'Hmm... Mitä olisit valmis tekemään suositukseni eteen? Olen pitkään haaveillut omasta kanteleesta.');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 3:
                            npcMessage('4/4', player, npc.getName(), 'Rakenna tai etsi minulle kantele, niin voin harkita asiaa.');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 4:
                            if (player.getInventory().getItemInMainHand() != null
                                  && Util.hasDataString(player.getInventory().getItemInMainHand())
                                  && ChatColor.stripColor(Util.getDataString(player.getInventory().getItemInMainHand())) == 'item::kntl') {
                                npcMessage('1/1', player, npc.getName(), 'Kappas, tämähän on priimatavaraa! Kiitos, kyllä minä sinua suosittelen, tässä allekirjoitukseni!');
                                player.getInventory().setItemInMainHand(null);
                                setQuestStage(player, getQuestStage(player) + 1);
                                talkStage[pid + '_' + npcId] = 0;
                            } else {
                                npcMessage('1/1', player, npc.getName(), 'En malta odottaa, että saan oman kanteleen! Kai se on koivupuuta?');
                            }
                            break;
                        }
                    } else if (npcId == questNpcs.olivia) {
                        switch (talkStage[pid + '_' + npcId]){
                        case 0:
                            npcMessage('1/4', player, npc.getName(), 'Moi. Olen Olivia. Olenkin kuullut sinusta, ' + player.getName() + '.');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 1:
                            npcMessage('2/4', player, npc.getName(), 'Haluaisit hakea kansalaisuutta? Mahtavaa, olisi kiva saada uutta väkeä tänne.');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 2:
                            npcMessage('3/4', player, npc.getName(), 'Mutta oletko varmasti luottamukseni arvoinen?');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 3:
                            npcMessage('4/4', player, npc.getName(), 'Olen aina halunnut maistaa kurpitsaa. Voisitko etsiä minulle sellaisen?');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 4:
                            if (player.getInventory().getItemInMainHand() != null && player.getInventory().getItemInMainHand().getType().toString() == 'PUMPKIN') {
                                npcMessage('1/1', player, npc.getName(), 'Oi, sehän on valtava! Kiitos! Tässä allekirjoitukseni!');
                                player.getInventory().setItemInMainHand(null);
                                setQuestStage(player, getQuestStage(player) + 1);
                                talkStage[pid + '_' + npcId] = 0;
                            } else {
                                npcMessage('1/1', player, npc.getName(), 'Kurrrrr-pitsaa...kurrrr-pitsaa... joko?');
                            }
                            break;
                        }
                    } else if (npcId == questNpcs.jaakoppi) {
                        switch (talkStage[pid + '_' + npcId]){
                            case 0:
                                npcMessage('1/4', player, npc.getName(), 'Terrrrve! Meikä on Jaakoppi.');
                                talkStage[pid + '_' + npcId]++;
                                break;
                            case 1:
                                npcMessage('2/4', player, npc.getName(), 'Kansalainen, sinustako? No jopas! Suositus? Hmm...');
                                talkStage[pid + '_' + npcId]++;
                                break;
                            case 2:
                                npcMessage('3/4', player, npc.getName(), 'Mistä tiedän, että voin luottaa sinuun?');
                                talkStage[pid + '_' + npcId]++;
                                break;
                            case 3:
                                npcMessage('4/4', player, npc.getName(), 'Hmm..voisitko tehdä minulle palveluksen? Tuo minulle levysoitin. En jaksa kuunnella enää pelkkää Jokiradiota.');
                                talkStage[pid + '_' + npcId]++;
                                break;
                            case 4:
                                if (player.getInventory().getItemInMainHand() != null && player.getInventory().getItemInMainHand().getType().toString() == 'JUKEBOX') {
                                    npcMessage('1/1', player, npc.getName(), 'Vau, se on upea! Onko siinä ihan uusi neula? Kyllä, tässä on suositukseni!');
                                    player.getInventory().setItemInMainHand(null);
                                    setQuestStage(player, getQuestStage(player) + 1);
                                    talkStage[pid + '_' + npcId] = 0;
                                } else {
                                    npcMessage('1/1', player, npc.getName(), 'Jokiradiosta tulee taas lauantaitanssit...');
                                }
                                break;
                        }
                    }
                    
                }
                
            } else if (qs == 2) {
                
                if (validOfficers.indexOf(npcId) > -1) {
                    switch (talkStage[pid + '_' + npcId]){
                        case 0:
                            npcMessage('1/2', player, npc.getName(), 'No niin! Siinähän se on, suosittelijasi allekirjoitus!');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 1:
                            npcMessage('2/2', player, npc.getName(), 'Nyt hakemus on vireillä. Nyt vain annetaan postin tehdä työnsä. Palaa takaisin yhden pelipäivän kuluttua!');
                            talkStage[pid + '_' + npcId] = 0;
                            setQuestStage(player, getQuestStage(player) + 1);
                            playerStorage.getPlayer(player).put('citizenshipQuestTiming', Math.floor(System.currentTimeMillis()/1000));
                            break;
                    }
                } else {
                    if (validNpcs.indexOf(npcId) > -1) {
                        npcMessage('1/1', player, npc.getName(), 'Noh? Olet jo saanut suosituksen, palaa takaisin kunnantalolle!');
                    }
                }
                
            } else if (qs == 3) {
                
                if (validOfficers.indexOf(npcId) > -1) {
                
                    if (!playerStorage.getPlayer(player).has('citizenshipQuestTiming')) {
                        playerStorage.getPlayer(player).put('citizenshipQuestTiming', Math.floor(System.currentTimeMillis()/1000));
                    }
                    
                    var tm = System.currentTimeMillis()/1000;
                    
                    if (tm - playerStorage.getPlayer(player).optInt('citizenshipQuestTiming', tm) >= 10*60) {
                        
                        switch (talkStage[pid + '_' + npcId]){
                            case 0:
                                npcMessage('1/6', player, npc.getName(), 'Hm? Kappas, siellähän se! Postihenkilö onkin jo tuonut vastauksen. Mitäköhän se pitää sisällään?');
                                talkStage[pid + '_' + npcId] = 0;
                                setQuestStage(player, getQuestStage(player) + 1);
                                break;
                        }
                        
                    } else {
                        npcMessage('1/1', player, npc.getName(), 'Hm? Ei, vastausta anomukseesi ei ole vielä tullut.');
                        //player.sendMessage('Aika: ' + (tm - playerStorage.getPlayer(player).optInt('citizenshipQuestTiming', tm)) + ' sekuntia');
                    }
                    
                } else {
                    if (validNpcs.indexOf(npcId) > -1) {
                        npcMessage('1/1', player, npc.getName(), 'Kansalaisuutta odottaessa? Jee.');
                    }
                }
                
            } else if (qs == 4) {
                
                if (validOfficers.indexOf(npcId) > -1) {
                    switch (talkStage[pid + '_' + npcId]){
                        case 0:
                            npcMessage('2/6', player, npc.getName(), 'Hmm...jännää...');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 1:
                            npcMessage('3/6', player, npc.getName(), 'Oi, hyviä uutisia! Sinä olet nyt virallisesti Kuningaskunnan kansalainen!');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 2:
                            npcMessage('4/6', player, npc.getName(), 'Tässä on sinulle henkilöllisyystodistus. Pidä se aina mukanasi, se todistaa, että olet Kuningaskunnan täysivaltainen kansalainen.');
                            createAndGiveId(player);
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 3:
                            npcMessage('5/6', player, npc.getName(), 'Nyt sinua koskee kansalaisten lainsäädäntö ja oikeudet. Kannattaa tutustua niihin tarkemmin opaskirjasta.');
                            talkStage[pid + '_' + npcId]++;
                            break;
                        case 4:
                            npcMessage('6/6', player, npc.getName(), 'Oli ilo asioida kanssasi, ' + player.getName() + '. Muista, että voit tulla hoitamaan kunnantaloille muita tärkeitä asioita, kuten rakennuslupia.');
                            
                            playerStorage.getPlayer(player).addRole('kansalainen');
                            playerStorage.getPlayer(player).put('role', 'kansalainen');
                            playerStorage.getPlayer(player).removeRole('irtolainen');
                            
                            talkStage[pid + '_' + npcId] = 0;
                            setQuestStage(player, getQuestStage(player) + 1);
                            
                            player.sendMessage(Util.INFO_PREFIX + 'Roolisi on nyt ' + ChatColor.WHITE + 'Kansalainen');
                            playerStorage.getPlayer(player).put('citizenshipQuestTiming', Math.floor(System.currentTimeMillis()/1000));
                            
                            break;
                    }
                } else {
                    if (validNpcs.indexOf(npcId) > -1) {
                        npcMessage('1/1', player, npc.getName(), 'Oletko jo kansalainen? Juttele vielä virkailijalle!');
                    }
                }
                
            } else {
                
                playerStorage.getPlayer(player).put('role', 'kansalainen');
                
            }
            
        } else {
            
            if (npcId == questNpcs.jaakoppi) {
                    npcMessage('1/1', player, npc.getName(), 'Tervehdys. Hyvinkö on sujunut?');
            } else if (npcId == questNpcs.olivia) {
                npcMessage('1/1', player, npc.getName(), 'Moi taas! Miten sujuu?');
            } else if (npcId == questNpcs.reino) {
                npcMessage('1/1', player, npc.getName(), 'Katoppa, se on ite ' + player.getName() + '! Kuinkas kissalla pöytää pyyhkii?');
            } else if (npcId == questNpcs.pormestari) {
                npcMessage('1/1', player, npc.getName(), '...mollista seiskaan..hm? Ai, sehän on...hmm...');
            } else if (validOfficers.indexOf(npcId) > -1) {
                npcMessage('1/1', player, npc.getName(), 'Hei jälleen, ' + player.getName() + '. Miltä kansalaisuus on maistunut?');
            }
            
        }
        
    }
    
    Events.on(Java.type('org.bukkit.event.player.PlayerInteractEntityEvent'), function(e){
        if (reg.isNPC(e.getRightClicked())){
            if (e.getHand().toString() == 'HAND') {
            
                if (playerStorage.getPlayer(e.getPlayer()).optInt('kauniaQuestDone', 0) == 1){
                
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
        }
    });
    
})();
