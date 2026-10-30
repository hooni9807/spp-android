# 유럽 선수 아트 방향

2026-10-30. frontend-design 기준으로 국가별 경기복과 필살기의 형태를 분리했다.
선수는 가상 인물이며 실제 선수의 얼굴을 복제하지 않는다. 42명은 얼굴 폭·턱선·눈·눈썹·머리·안경·수염을 달리한다.

## 경기복 자료

게임의 작은 캐릭터에 맞춘 벡터 재구성이다. 사진의 원단·스폰서·세부 패턴까지 동일한 복제품은 아니다.
축구 유니폼 검색 결과는 제외했다. 과거 및 현재 탁구 경기복을 참고하며 동일 시즌 구성은 아니다.

- 독일: [Butterfly Team Germany 26](https://en.butterfly.tt/dttb26-fanshirt.html), 마젠타와 짙은 패널.
- 스웨덴: [SVT 대표팀 경기 사진](https://www.svt.se/sport/bordtennis/truls-moregardh-efter-os-succen-alla-alskar-pingis-igen), 노랑 바탕과 파랑 배색.
- 프랑스: [FFTT Osmium 경기복](https://boutiquefftt.com/549-maillot-officiel-osmium-tibhar-equipe-de-france-fftt-2025-2026.html), 남색 바탕·적백 포인트·기하 패턴.
- 루마니아: [ETTU 경기 사진](https://www.ettu.org/germany-tick-the-box-against-england-romania-bounce-back/), 노랑 바탕과 파랑 패널. [FRTM 공식 장비 안내](https://frtmromania.ro/stiri/anunt-echipament-oficial).
- 포르투갈: [WTTC 2016 경기 사진](https://commons.wikimedia.org/wiki/Category:Marcos_Freitas), 녹색·적색 배색.
- 오스트리아: [ÖTTV 2025 경기복](https://www.gosports.at/en/products/oettv-nationalteam-shirt-neu-2025), 적색·검정 배색.

## 동작과 효과

독일은 회전 기어와 직선 타격, 스웨덴은 다층 오로라 리본과 곡선 스텝,
프랑스는 시간차 3연 찌르기와 전진, 루마니아는 초승달 회전과 낮은 수비,
포르투갈은 횡방향 파도와 좌우 이동, 오스트리아는 설봉과 공중 도약이다.
국가별 필살기 도형과 선수별 광선 수를 구분한다. 기술의 실제 판정 시간과 능력치는 변경하지 않는다.
효과는 1.2초 뒤 제거하고 모션 감소 환경에서는 움직임을 생략한다. 추가 영상·외부 이미지 다운로드 없이 SVG와 Canvas로 그린다.
