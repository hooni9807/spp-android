import re
# Applies the Android low-spec build changes to a fresh copy of spp's index.html (run inside spp-android).
p='index.html';s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80])
    s=s.replace(a,b)
rep("let ctx=canvas.getContext('2d');","let ctx=canvas.getContext('2d');\nconst ANDROID_LOW_SPEC=window.Capacitor?.getPlatform?.()==='android';\nconst renderPixelRatio=()=>ANDROID_LOW_SPEC?1:Math.min(devicePixelRatio||1,2);\nif(ANDROID_LOW_SPEC)document.documentElement.classList.add('low-spec');\n/* 캔버스 그림자 흐림(shadowBlur)은 안드로이드 WebView에서 가장 무거운 그리기라 저사양에서는 끈다. */if(ANDROID_LOW_SPEC){const sb=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,'shadowBlur');Object.defineProperty(CanvasRenderingContext2D.prototype,'shadowBlur',{configurable:true,get(){return 0;},set(){sb.set.call(this,0);}});}")
rep("const enhanceFxTier=()=>{const lv=","const enhanceFxTier=()=>{if(ANDROID_LOW_SPEC)return 0;const lv=")
rep("const ultMotion=()=>!prefs.ultSkip;","const ultMotion=()=>!ANDROID_LOW_SPEC&&!prefs.ultSkip;")
rep("const setShake=()=>{if(!prefs.reduceMotion)shakeT=time;};","const setShake=()=>{if(!ANDROID_LOW_SPEC&&!prefs.reduceMotion)shakeT=time;};")
rep("const d=Math.min(devicePixelRatio||1,2);canvas.width=W*d","const d=renderPixelRatio();canvas.width=W*d")
rep("function arenaBg(){const d=Math.min(devicePixelRatio||1,2);","function arenaBg(){const d=renderPixelRatio();")
# 느린 프레임에서 물리를 한 번에 많이 돌리면 공이 순간이동한다. 저사양은 한 프레임에 최대 2스텝(1/30초)만 진행해, 순간이동 대신 잠깐 느려지게 한다. 온라인은 시간 동기화 때문에 그대로.
rep("Math.min((t-last)/1000||0,.1)","Math.min((t-last)/1000||0,ANDROID_LOW_SPEC&&!net?1/30:.1)")
# low-spec CSS: no decorative looping animations, no backdrop blur, no big glows
rep("</head>","<style>html.low-spec .aug-mode-btn,html.low-spec #boss-pick [data-villain],html.low-spec #gacha-open,html.low-spec .aug-card{animation:none!important;transition:none!important}html.low-spec dialog::backdrop{backdrop-filter:none!important}html.low-spec #syn-hud div{box-shadow:none}</style>\n</head>")
open(p,'w',encoding='utf-8').write(s)
print('low-spec applied')
