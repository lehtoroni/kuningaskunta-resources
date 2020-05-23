/*
 * BUKKIT EVENTS
 */


var EventPriority = Java.type("org.bukkit.event.EventPriority");
var HandlerList = Java.type("org.bukkit.event.HandlerList");

var EventListener = Java.extend(org.bukkit.event.Listener, {});

var Events = {
    
    on: function(eventType, handler, priority){
        
        if (typeof priority == 'undefined') {
            priority = EventPriority.NORMAL;
        } else {
            priority = EventPriority[priority.toUpperCase().trim()];
        }
        
        var result = {};
        var eventExecutor = function(l, evt){
        
            function cancel(){
                if (evt instanceof org.bukkit.event.Cancellable) {
                    evt.setCancelled(true);
                }
            }
            
            var bound = {};
            for (var i in result) {
                bound[i] = result[i];
            }
            bound.cancel = cancel;
            handler.call(bound, evt, cancel);
            
        };
        
        var listener = new EventListener();
        
        PluginManager.registerEvent(eventType.class, listener, priority, eventExecutor, Plugin);
        
        result.unregister = function(){
            HandlerList.unregisterAll(listener);
        }
        
        return result;
        
    }
    
};




var server = Bukkit.getServer();
var __timeouts = [];
var __intervals = [];

function setTimeout(callback, delayInMillis) {
    var delay = Math.ceil(delayInMillis / 50);
    var task = server.scheduler[
        'runTaskLater(org.bukkit.plugin.Plugin, java.lang.Runnable ,long)'
    ](Plugin, callback, delay);
    __timeouts.push(task);
    return task;
}
function clearTimeout(task) {
    task.cancel();
}
function setInterval(callback, intervalInMillis) {
    var delay = Math.ceil(intervalInMillis / 50);
    var task = server.scheduler[
        'runTaskTimer(org.bukkit.plugin.Plugin, java.lang.Runnable ,long, long)'
    ](Plugin, callback, delay, delay);
    __intervals.push(task);
    return task;
}
function clearInterval(bukkitTask) {
    bukkitTask.cancel();
}


onDisableEvents.push(function(){
    for (var i = 0; i < __timeouts.length; i++) {
        clearTimeout(__timeouts[i]);
    }
    for (var i = 0; i < __intervals.length; i++) {
        clearInterval(__intervals[i]);
    }
});




