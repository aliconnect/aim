var version='v1';
var tasklist = [], tasks = {
    mailer: { src: '/aim/'+version+'/api/srv/mailertask.php' },
    archive: { src: '/aim/'+version+'/api/srv/archivemail.php' },
    checkbonnen: { src: '/airo/'+version+'/api/pakbon/?monitor' },
}
onload = function () {
    if (!tasklist.length) for (var name in tasks) tasklist.push(tasks[name]);
    iframe.onload=function(){setTimeout(onload, 3000);}
    iframe.src=tasklist.shift().src;
}
