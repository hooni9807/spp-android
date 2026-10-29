# SPP — Snap Ping Pong

드래그로 스윙하는 인터랙티브 탁구 게임입니다.

**▶ [바로 플레이](https://hooni9807.github.io/spp/)**

## 패치 내역

모든 최신 소식과 이전 패치 내역은 게임 메인 메뉴의 **패치노트** 버튼에서 확인할 수 있습니다.

## 한눈에 보기

- AI 대전, 보스전, 랭크전, 복식·3인 대전, 생존 랠리, 지역 시대회
- 캐릭터 해금·스킬트리·퀘스트·업적·칭호·코디·라켓 스킨·트로피 도감
- Firebase 기반 전체 랭킹과 친구·채팅 기능

로컬에서는 저장소 파일을 함께 둔 뒤 `index.html`을 브라우저로 열면 실행됩니다. 로컬 서버로 확인하려면 `python -m http.server 8765 --bind 127.0.0.1`을 실행한 뒤 `http://127.0.0.1:8765/`로 접속하세요. 빌드나 패키지 설치는 필요하지 않습니다.

## Android APK

`main`에 푸시하면 GitHub Actions의 **Android APK** 작업이 고정 서명된 설치용 release APK와 Play Store 업로드용 AAB를 만듭니다. [최신 SPP.apk 바로 다운로드](https://github.com/hooni9807/spp/releases/download/android-latest/SPP.apk)로 ZIP 없이 바로 받을 수 있습니다. 빌드가 끝나기 전에는 직전 버전이 유지됩니다. 로컬에서는 Android Studio·SDK를 설치한 뒤 `npm ci && npm run android:apk`을 실행하면 `android/app/build/outputs/apk/debug/app-debug.apk`가 생성됩니다.

앱의 Google/Firebase 로그인에는 Firebase Authentication의 승인된 도메인에 `localhost`를 추가해야 합니다. Play Store 배포는 별도 서명 키와 release AAB 빌드가 필요합니다.

## 저사양 앱 버전 동기화

이 저장소는 웹판 [spp](https://github.com/hooni9807/spp)의 핸드폰 앱용 저사양 버전입니다. `scripts/sync-from-spp.sh ../spp`로 웹판 최신 파일을 가져온 뒤 저사양 패치(화면 배율 1 · 강화 이펙트/필살기 연출/화면 흔들림 끔 · 장식 애니메이션과 배경 흐림 끔)를 적용하고, 얼굴 사진(최대 384px)과 assets 이미지(최대 512px)를 줄입니다.

## 📚 문서

| 문서 | 내용 |
|---|---|
| [🎮 플레이 방법](docs/gameplay.md) | 스윙 · 타이밍 · 회전 · 서브 · 기술 상성 · 라켓 · 목판/러버 · 탁구대/공 |
| [🧑‍🤝‍🧑 캐릭터](docs/characters.md) | 전체 캐릭터 특성 표 · 캐릭터별 자세한 설명 · 모션 |
| [🌟 스킬트리](docs/skill-tree.md) | 30포인트 · 3개 트리 · 노드 효과 · 추천 |
| [🏓 게임 모드](docs/modes.md) | AI 대전 · 랭크전 · 보스전 · 복식 · 3인 대전 · 연습장 · 온라인 · 승리 세리머니 |
| [👕 커스터마이징 · 칭호](docs/customization.md) | 아웃핏 스튜디오 · 해금 코디 · 칭호 |
| [🏆 랭킹 · Firebase](docs/ranking.md) | 랭킹 종류 · 구글 로그인 · Firestore 컬렉션 |
| [📜 게임 안 패치노트](https://hooni9807.github.io/spp/) | 메인 메뉴의 패치노트 버튼에서 최신·이전 업데이트 확인 |
