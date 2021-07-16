// In an HTML file, we would place a video element.  
// But we can also insert one using JS.
v = document.createElement("video")
Object.assign(v, { controls: 1, muted: 1, autoplay: 1 })
Object.assign(v, { width: 640, height: 480 })
document.body.insertBefore(v, document.body.firstChild)

// Move the scrollbar to see video element
window.scrollTo(0, 0)

// We create the RTCPeerConnection.
popt = { iceServers: [{ urls: 'stun:freestun.com' }] }
a = new RTCPeerConnection(popt)

// We configure two transceivers
a.addTransceiver('video', { 'direction': 'recvonly' })
a.addTransceiver('audio', { 'direction': 'recvonly' })
// On track events, we connect to the video element
a.ontrack = e => v.srcObject = e.streams[0]

// We tell the peer connection to create an offer
await a.setLocalDescription()

// We send the offer to the SFU
url = 'https://foocam.ddns5.com:8443/sub'
fopt = { method: 'POST', body: a.localDescription.sdp }
r = await fetch(url, fopt)

// We get the answer and pass it to our RTCPeerConnection
sdopt = { type: 'answer', sdp: await r.text() }
sd = new RTCSessionDescription(sdopt)
await a.setRemoteDescription(sd)
