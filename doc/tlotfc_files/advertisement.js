(function() {
	//Dynamically create a div call adblocker
	var s = document.getElementsByTagName('script');
    s = s[s.length - 1];
    var p = document.createElement('div');
    p.innerHTML = '<div id="adblocker" style="display:none"></div>';
    s.parentNode.insertBefore(p, s);
})();