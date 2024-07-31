ymaps.ready(init); 
        var map; 
        var placemark; 

        function init() {
        map = new ymaps.Map("map", {
            center: [41.0082, 28.9784], 
            zoom: 12,
            controls: ['zoomControl', 'geolocationControl', 'searchControl', 'typeSelector', 'fullscreenControl', 'routeButtonControl'] 
        });
    
        map.behaviors.enable('scrollZoom'); 
        map.behaviors.enable('drag'); 
    
        document.getElementById("findLocationButton").addEventListener("click", function() {
        var ipAddress = document.getElementById("ipAddress").value.trim(); 

        var ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/; 
        if (!ipRegex.test(ipAddress)) {
            alert("Lütfen geçerli bir IP adresi girin.");
            return;
        }

        if (ipAddress === "95.70.146.155") { 
            var latitude = 40.836368371299294; 
            var longitude = 29.358843996941182;

            var decimalLatitude = latitude.toFixed(6); 
            var decimalLongitude = longitude.toFixed(6);

            var resultText = "Koordinatlar:<br>" + decimalLatitude + ", " + decimalLongitude; 
            document.getElementById("result").innerHTML = resultText; 

            if (placemark) {
                map.geoObjects.remove(placemark); 
            }
            placemark = new ymaps.Placemark([latitude, longitude], {
                balloonContent: 'Özel Konum' 
            });
            map.geoObjects.add(placemark); 
            map.setCenter([latitude, longitude], 12); 

            document.getElementById("formContainer").classList.add("hidden"); 
            document.getElementById("floatingButton").style.display = "block";

            return; 
        }
    
        var apiUrl = "https://ipinfo.io/" + ipAddress + "/json"; 
        fetch(apiUrl) 
        .then(response => response.json()) 
        .then(data => {
            var coordinates = data.loc.split(','); 
            var latitude = parseFloat(coordinates[0]); 
            var longitude = parseFloat(coordinates[1]); 
            
            var decimalLatitude = latitude.toFixed(6); 
            var decimalLongitude = longitude.toFixed(6);
            
            var resultText = "Koordinatlar:<br>" + decimalLatitude + ", " + decimalLongitude; 
            document.getElementById("result").innerHTML = resultText; 
            
            if (placemark) {
                map.geoObjects.remove(placemark); 
            }
            placemark = new ymaps.Placemark([latitude, longitude], {
                balloonContent: 'Bulunan Konum' 
            });
            map.geoObjects.add(placemark); 
            map.setCenter([latitude, longitude], 12); 
            
            document.getElementById("formContainer").classList.add("hidden"); 
            document.getElementById("floatingButton").style.display = "block";
            
            return; 
        })
        .catch(error => {
            alert("API isteği sırasında bir hata oluştu."); 
            console.error(error); 
        });
    });

    document.getElementById("floatingButton").addEventListener("click", function() {
        
        document.getElementById("formContainer").classList.remove("hidden"); 
        document.getElementById("floatingButton").style.display = "none"; 

        
        if (placemark) {
            map.geoObjects.remove(placemark); 
        }

        
        map.setCenter([41.0082, 28.9784], 12); 

        
        document.getElementById("fileInput").style.display = "none"; 
        document.getElementById("downloadButton").innerText = "Kod Dosyası"; 
    });
    
    async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json'); 
        const data = await response.json(); 
        document.getElementById('ipAddress').value = data.ip; 
        document.getElementById('yourIpAddress').innerText = "Sizin IP Adresiniz: " + data.ip;
    } catch (error) {
        document.getElementById('yourIpAddress').innerText = 'IP adresi alınamadı.'; 
        console.error('Error fetching IP address:', error); 
    }
}

getIPAddress(); 

}