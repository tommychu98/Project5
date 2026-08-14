# T1 Site Renewal — Project Instructions

> 이 문서는 T1 사이트 리뉴얼 프로젝트를 구현·수정·리뷰하는 모든 사람과 에이전트가 따라야 하는 최상위 프로젝트 지침이다.  
> 디자인 기준은 Figma `T1 REMAKE PROJECT`의 `69:59`이며, 재사용 컴포넌트 기준은 `T1 / Compositions`의 `146:275`이다.

## 1. 프로젝트 기준 정보

- 디자인 원본: `https://www.figma.com/design/WkLCKsKeACMD5SO9jnfcoN/?node-id=69-59&m=dev`
- Composition 라이브러리: `https://www.figma.com/design/WkLCKsKeACMD5SO9jnfcoN/?node-id=146-275&m=dev`
- 기준 캔버스: 1920px desktop
- 기본 언어: 한국어와 영어 혼용
- 비주얼 방향: 프리미엄 이스포츠, 시네마틱, 강한 편집 디자인, 제한된 T1 컬러, 대형 영문 타이포그래피
- 현재 Figma 감사 기준:
  - 최상위 화면 10개
  - 텍스트 노드 65개
  - 컴포넌트 인스턴스 43개
  - 이미지 fill 사용 노드 56개
  - 프로토타입 reaction 0개
  - 화면 노드에 연결된 variable binding 0개

이 수치는 디자인 구조를 이해하기 위한 감사 정보다. 구현 구조를 Figma 노드 수와 일대일로 복제하지 않는다.

## 2. 지침 우선순위

충돌이 생기면 다음 순서로 판단한다.

1. 이 `PROJECT.md`의 명시적 규칙
2. 현재 저장소의 검증된 기술 스택, 아키텍처, 테스트, lint·format 규칙
3. Figma의 실제 렌더 결과와 노드별 디자인 문맥
4. Figma의 named Paint Style과 Text Style
5. Figma의 semantic variable
6. 개인 취향 또는 일반적인 관례

중요: 현재 Figma의 일부 primitive variable 값은 실제 화면 Paint Style 값과 다르다. 픽셀 정확도가 필요한 구현에서는 실제 화면과 named Paint Style을 우선한다. variable을 그대로 복사해 색상을 바꾸지 않는다.

## 3. 작업 시작 전 필수 절차

구현이나 수정 전에 반드시 다음을 수행한다.

1. 저장소의 패키지 매니저, 프레임워크, 라우팅, 스타일링 방식, 컴포넌트 패턴, 테스트 환경을 확인한다.
2. 기존 토큰, 폰트 로딩, 이미지 파이프라인, animation dependency를 먼저 검색한다.
3. 대상 Figma node를 확인하고 스크린샷과 구조를 함께 읽는다.
4. 새 dependency를 추가하기 전에 기존 도구로 해결 가능한지 확인한다.
5. 변경 범위를 섹션·컴포넌트 단위로 작게 나누고 각 단계 후 시각 검증한다.
6. 저장소의 기존 패턴과 이 문서가 충돌하면 임의로 결정하지 말고 충돌 내용과 영향을 보고한다.

Figma가 React+Tailwind 형태의 참고 코드를 반환하더라도 그것은 디자인 설명일 뿐이다. 대상 저장소가 React 또는 Tailwind라고 가정하지 않는다. Tailwind, GSAP, Framer Motion, carousel library 등을 자동 설치하지 않는다.

## 4. 프로젝트 목표

이 프로젝트의 목표는 T1의 역사, 성취, 브랜드 영향력, 파트너십, 어패럴, 멤버십을 하나의 시네마틱한 스크롤 경험으로 전달하는 것이다.

구현은 다음을 동시에 만족해야 한다.

- 1920px 기준 디자인의 구성, 비율, 타이포 위계, 이미지 crop을 충실히 재현한다.
- 시각적 배치와 무관하게 문서 구조는 의미론적이고 접근 가능해야 한다.
- 작은 화면에서는 데스크톱 캔버스를 축소하지 않고 콘텐츠를 재배치한다.
- 반복 요소는 데이터와 재사용 컴포넌트로 구현한다.
- 장식과 반사 레이어는 접근성 트리에서 제거한다.
- 이미지가 많은 페이지이므로 초기 렌더와 스크롤 성능을 우선한다.
- 모션이 없어도 콘텐츠와 내비게이션이 완전하게 동작해야 한다.

## 5. 비목표와 금지 사항

- Figma의 absolute 좌표를 전체 페이지 DOM에 그대로 복사하지 않는다.
- 1920px 전체 페이지를 `transform: scale()`로 반응형 처리하지 않는다.
- 텍스트를 이미지나 canvas로 렌더링하지 않는다.
- Figma MCP의 임시 asset URL을 production 코드에 남기지 않는다.
- 화면에 보이지 않는 Figma layer를 이유 없이 구현하지 않는다.
- 동일한 카드, 통계, 버튼, 스폰서 항목을 복사·붙여넣기한 JSX/HTML로 반복하지 않는다.
- 실제 링크, 통계, 파트너, 법적 문구를 추측해 추가하거나 수정하지 않는다.
- 디자인에 명세되지 않은 자동재생, scroll hijacking, 과도한 parallax를 임의로 만들지 않는다.
- 접근성을 이유로 비주얼을 무시하거나, 비주얼을 이유로 접근성을 포기하지 않는다.

## 6. 화면 순서와 Figma node map

DOM과 사용자 경험의 기본 순서는 다음과 같다.

| 순서 | 화면 | Figma node | 기준 크기 | 역할 |
|---:|---|---|---:|---|
| 1 | Loading | `89:136` | 1920×1080 | 초기 브랜드 로고 상태 |
| 2 | Opening | `103:195` | 1920×1080 | 시네마틱 오프닝 이미지 |
| 3 | Hero | `69:156` | 1920×1080 | 핵심 브랜드 메시지와 상단 액션 |
| 4 | History Timeline | `69:136` | 1920×1080 | 역사 3단계와 이미지 6개 |
| 5 | Career Achievements | `69:72` | 1920×3240 | 3개 성취 패널과 대형 숫자 |
| 6 | Brand Impact | `69:109` | 1920×2000 | 핵심 통계, 이미지 콜라주, 브랜드 소개 |
| 7 | Global Partners | `69:184` | 1920×1080 | 파트너 메시지와 16개 스폰서 트랙 |
| 8 | Apparel | `69:203` | 3240×1080 | 가로 이미지 콜라주와 CTA |
| 9 | Membership | `99:120` | 1920×1468 | 멤버십 소개와 카드 콜라주·반사 |
| 10 | Footer | `103:196` | 1920×933 | 브랜드, 링크, 법적 정보, 배경 이미지 |

Loading과 Opening이 실제 route 전환인지, 첫 진입 animation의 두 상태인지 현재 Figma에는 명시되어 있지 않다. 구현 전에 결정한다. 별도 결정이 없다면 같은 페이지의 점진적 초기 상태로 취급하고, 사용자를 인위적으로 기다리게 하지 않는다.

## 7. 디자인 소스 오브 트루스

### 7.1 화면용 canonical color

현재 화면에서 실제로 사용된 아래 값을 canonical visual color로 취급한다.

| 의미 | 이름 | 값 | 기본 용도 |
|---|---|---|---|
| Brand accent | T1 Signature Red | `#E2011A` | 강조 텍스트, 로고, active accent |
| Light canvas | Titanium White | `#F5F5F7` | 밝은 배경, 어두운 배경의 주 텍스트 |
| Dark canvas | Obsidian Black | `#0B0B0D` | 주 dark section 배경 |
| Dark surface | Charcoal Gray | `#1A1A1E` | 버튼, 카드, 구역 분리 |
| Subtle dark | Cyber Silver | `#3A3A40` | 비활성 타이포, border, 메뉴 보조색 |
| Secondary text | Muted Gray | `#8E8E93` | 본문 보조색, caption, footer link |

화면 감사에서 `#414040`도 1회 확인됐지만 핵심 palette로 확장하지 않는다. 사용 위치를 확인한 후 가장 가까운 semantic token으로 정리한다.

### 7.2 기존 Figma variable의 차이

Figma에는 아래 primitive variable이 있으나 실제 화면값과 다르다.

| Variable | 현재 값 | 실제 화면 기준 | 처리 규칙 |
|---|---:|---:|---|
| `arena-black` | `#070708` | `#0B0B0D` | 화면 구현에 직접 사용 금지 |
| `gunmetal` | `#1A1C20` | `#1A1A1E` | 화면 구현에 직접 사용 금지 |
| `t1-red` | `#E2012D` | `#E2011A` | 브랜드 레드로 직접 사용 금지 |
| `archive-white` | `#F3F2EE` | `#F5F5F7` | 화면 canvas로 직접 사용 금지 |
| `secondary-text` | `#979BA3` | `#8E8E93` | 본문 보조색으로 직접 사용 금지 |

토큰 정합화가 승인되기 전까지 production 토큰은 실제 화면값을 기준으로 정의한다. Figma variable을 수정할 경우 화면과 코드를 함께 migration하고 시각 회귀 테스트를 통과해야 한다.

### 7.3 권장 semantic token

기존 저장소에 동등한 토큰이 있으면 새 이름을 만들지 말고 기존 토큰에 매핑한다. 없을 때만 다음 의미 체계를 사용한다.

```css
:root {
  --color-bg-dark: #0b0b0d;
  --color-bg-light: #f5f5f7;
  --color-surface-dark: #1a1a1e;
  --color-text-on-dark: #f5f5f7;
  --color-text-on-light: #1a1a1e;
  --color-text-muted: #8e8e93;
  --color-text-subtle: #3a3a40;
  --color-accent: #e2011a;
  --color-border-subtle: #3a3a40;
}
```

컴포넌트 코드에서 hex literal을 반복하지 않는다. 시각 실험용 값을 production semantic token에 섞지 않는다.

## 8. 간격, radius, grid

### 8.1 Dimension token

프로젝트의 기본 spacing scale은 `4, 8, 12, 16, 24, 32, 48, 80`이다.

기본 radius는 다음과 같다.

- `0`: 각진 대형 구조
- `8`: 일반 card 또는 media frame
- `20`: 큰 surface
- `999`: pill button

Figma의 일부 이미지 인스턴스는 4px radius를 사용한다. 이미지 thumbnail용 `4px`를 예외 token으로 추가할 수 있지만, 임의의 radius를 계속 늘리지 않는다.

### 8.2 Desktop grid

Figma의 `10 columns for t1` grid를 기본 desktop alignment 기준으로 사용한다.

- canvas: 1920px
- column count: 10
- side offset: 50px
- gutter: 20px
- stretch column
- 계산상 column width: 164px

대부분의 주요 제목과 이미지 경계는 이 grid를 기준으로 맞춘다. Footer는 의도적으로 좌우 80px inset을 사용하므로 별도 container variant로 취급한다.

### 8.3 Layout 구현 원칙

- 페이지의 큰 흐름은 normal document flow를 사용한다.
- 섹션 내부의 편집적 겹침은 제한된 `position: absolute`로 구현할 수 있다.
- absolute child의 기준은 반드시 section 내부의 명시적 artboard container다.
- 텍스트의 의미 순서와 keyboard focus 순서는 시각 좌표와 분리한다.
- 반복 grid와 row는 CSS Grid/Flex를 사용한다.
- 이미지 crop은 `object-fit`, `object-position`, `aspect-ratio` 또는 명시적 mask로 재현한다.
- fixed pixel은 기준 desktop의 아트 디렉션에 사용하되 `clamp()`, `%`, `vw`, container query로 유연성을 확보한다.

## 9. 반응형 규칙

현재 Figma에는 desktop 디자인만 있다. 따라서 mobile·tablet은 임의 축소가 아니라 다음 원칙에 따라 재구성한다.

저장소에 기존 breakpoint가 있으면 그것을 우선한다. 없을 때의 권장 시작점은 다음과 같다.

- Large desktop: `>= 1440px`
- Desktop/tablet landscape: `1024–1439px`
- Tablet: `768–1023px`
- Mobile: `< 768px`

필수 규칙:

1. 1920px 캔버스 전체를 비율 축소하지 않는다.
2. 대형 heading은 `clamp()`를 사용하되 최소 크기에서도 위계가 유지되어야 한다.
3. 본문은 mobile에서 읽을 수 있는 폭과 줄 길이로 제한한다.
4. desktop의 좌우 배치를 mobile에서는 의미 순서에 맞춰 세로로 쌓는다.
5. 이미지 콜라주는 핵심 이미지 우선순위를 정하고, 필요하면 horizontal overflow 또는 snap을 사용한다.
6. 가로 스크롤을 쓰더라도 페이지 전체의 세로 스크롤과 keyboard 탐색을 방해하지 않는다.
7. hover에만 의존하는 정보나 액션을 만들지 않는다.
8. 최소 320px viewport에서 가로 overflow, 잘린 텍스트, 겹친 CTA가 없어야 한다.

모바일 아트 디렉션을 확정하기 전에는 desktop fidelity 작업과 mobile 재구성 작업을 별도 단계로 관리한다.

## 10. Typography

### 10.1 폰트 역할

| 폰트 | 스타일 | 용도 |
|---|---|---|
| Integral CF | Regular, Italic, Demi Bold, Medium, Heavy | 대형 영문 제목, 숫자, 브랜드 문구 |
| Kallisto | Heavy | 통계 숫자, history entry heading, 강한 display |
| Pretendard | Regular, SemiBold | 한국어 본문, label, button, navigation |
| Paperlogy | 5 Medium | Global Partners 괄호 symbol |

폰트 라이선스와 webfont 제공 가능 여부를 구현 전에 확인한다. 라이선스가 불명확한 폰트를 production bundle에 포함하지 않는다. 대체 폰트가 필요하면 시각 영향과 글자 폭 차이를 먼저 보고하고 승인받는다.

### 10.2 Named text style

| Figma style | 실제 값 | 권장 역할 |
|---|---|---|
| `H1_H_120_110%_-3` | Kallisto Heavy, 120px, 110%, -3% | 통계 display |
| `H2_R_100_100%_-3` | Integral CF Demi Bold, 100px, 100%, -3% | section heading |
| `B1_R_70_100%_0` | Integral CF Regular, 70px, 100% | large statement |
| `B2_R_34_40px_0` | 실제 font size 32px, line-height 40px | intro heading |
| `B3_R_16_24px_0` | Pretendard Regular, 16px, 24px | body copy |

`B2_R_34_40px_0`는 style 이름과 실제 size가 다르다. 구현에서는 실제 렌더인 32px을 사용하고, 추후 Figma style 이름을 정리할 때 별도 migration한다.

### 10.3 추가 관찰 크기

화면에는 `8, 11, 12, 14, 15, 16, 30, 32, 50, 60, 70, 80, 100, 120, 150, 400px`가 사용된다. 이 값을 그대로 임의 조합하지 말고 역할별 token으로 제한한다.

- 8–15px: micro label, caption, footer metadata
- 16px/24px: 기본 본문
- 30–32px: card heading 또는 intro copy
- 50–120px: section heading과 statement
- 150px: 장식 symbol
- 400px: 성취 숫자 전용 display

영문 display는 원본의 uppercase와 줄바꿈을 보존한다. 한국어 본문은 임의 번역·요약하지 않는다. `word-break: keep-all`과 적절한 line break를 검토한다.

### 10.4 Webfont 성능

- critical heading에 필요한 최소 font file만 preload한다.
- 나머지는 지연 로딩한다.
- `font-display` 정책은 콘텐츠 가시성과 layout shift를 함께 고려한다.
- fallback font의 metrics 차이로 큰 heading이 이동하지 않도록 size-adjust 또는 metric-compatible fallback을 검토한다.
- 사용하지 않는 weight와 character subset을 bundle하지 않는다.

## 11. 공통 컴포넌트 규칙

### 11.1 Figma Composition 기준

다음 local composition을 코드의 재사용 단위로 매핑한다.

| Figma composition | 코드 역할 |
|---|---|
| `T1 / Button` | 공통 pill button |
| `T1 / History Entry` | history title + copy |
| `T1 / Stat Item` | metric label + value |
| `T1 / Section Intro / Left` | 좌측 정렬 intro + optional CTA |
| `T1 / Section Intro / Center` | 중앙 정렬 intro + optional CTA |
| `T1 / Alliance Formula` | 파트너십 formula display |

### 11.2 Button variants

Figma의 Button variant는 다음 세 가지다.

| Style | Size | Width | 기준 크기 | 용도 |
|---|---|---|---:|---|
| Dark | M | Compact | 120×40 | 밝은 배경의 짧은 CTA |
| Dark | M | Wide | 173×40 | 밝은 배경의 긴 CTA |
| Light | L | Compact | 123×55 | Hero의 강조 액션 |

구현 시 `style`, `size`, `width`를 무조건 세 개의 독립 prop으로 복제할 필요는 없다. 저장소의 컴포넌트 API에 맞춰 semantic variant로 단순화할 수 있지만 결과와 사용 범위는 위 세 상태를 보존한다.

40px 버튼은 터치 권장치 44px보다 작다. 시각 높이는 40px로 유지할 수 있으나 실제 hit target은 pseudo-element, padding wrapper 또는 최소 block size로 44px 이상 확보한다. focus ring은 pill 외곽에서 명확히 보여야 한다.

### 11.3 추가 권장 컴포넌트

중복이 확인될 때 다음 단위를 만든다.

- `SectionShell`: dark/light canvas와 section anchor 관리
- `SectionIntro`: alignment, eyebrow, heading, copy, action
- `MediaFrame`: radius, crop, decorative frame, alt policy
- `StatItem`: label, value, suffix
- `HistoryEntry`: heading, copy
- `FooterLinkGroup`: heading과 link list
- `SponsorTrack`: sponsor data와 visual track
- `AchievementPanel`: 배경 image, value, label
- `MembershipCard`: card visual과 optional content

한 번만 쓰이고 변화 가능성이 낮은 장식 wrapper까지 억지로 컴포넌트화하지 않는다. 반복 데이터는 배열로 관리하고 stable key를 사용한다.

## 12. 섹션별 구현 계약

### 12.1 Loading

- full viewport Obsidian Black 배경과 중앙 T1 logo를 유지한다.
- 실제 asset·font·route 준비 상태와 연결하지 않는 가짜 지연을 만들지 않는다.
- logo animation이 필요하면 opacity·scale 정도의 짧은 전환으로 제한한다.
- `prefers-reduced-motion`에서는 즉시 최종 상태를 보여준다.
- 로딩 상태가 길어질 수 있는 실제 비동기 작업이라면 진행 상태 또는 대체 콘텐츠를 제공한다.

### 12.2 Opening

- 1920×1080 full-bleed scene을 유지한다.
- 이미지는 `cover`를 기본으로 하고 핵심 피사체가 잘리지 않도록 breakpoint별 focal point를 정의한다.
- Loading에서 Opening, Opening에서 Hero로의 전환은 현재 Figma에 명세가 없으므로 승인 전 추정 구현하지 않는다.

### 12.3 Hero

- background photograph는 full-bleed이며 grayscale·shadow mood를 보존한다.
- red T1 wordmark는 좌상단, external/menu action은 우상단, body statement는 좌하단, main slogan은 우측에 배치한다.
- headline의 gray/white/italic 대비와 의도된 줄바꿈을 유지한다.
- logo SVG는 raster로 대체하지 않는다.
- Menu와 external link는 의미에 맞는 `<button>` 또는 `<a>`를 사용한다.
- external link에는 사용자에게 새 창 여부를 명확히 전달하고 보안 속성을 적용한다.

### 12.4 History Timeline

- dark canvas 위에 3개 `HistoryEntry`와 6개 media를 편집적으로 배치한다.
- desktop의 DOM 순서는 heading, intro, Entry 01, 관련 media, Entry 02, 관련 media, Entry 03, 관련 media 순으로 의미 있게 구성한다.
- mobile에서는 각 entry와 관련 이미지를 하나의 narrative block으로 묶어 세로 배치한다.
- 한국어 본문은 실제 텍스트 DOM으로 유지한다.
- image crop과 4px radius를 보존한다.

### 12.5 Career Achievements

- 1080px 높이 panel 3개로 구성된 장면이며 전체 desktop 기준 높이는 3240px이다.
- 각 panel은 `AchievementPanel` 데이터로 구성한다.
- 숫자 `10`, `2`, `6`의 400px outline display가 핵심 비주얼이다.
- 숫자를 SVG 이미지로 굳히지 말고 가능하면 텍스트와 stroke effect로 구현한다.
- scroll-linked animation을 쓰지 않아도 정적 panel이 완전하게 읽혀야 한다.
- 성취 수치는 launch 전 최신 사실과 맞는지 별도 검증한다. 디자인 값을 임의 수정하지 않는다.

### 12.6 Brand Impact

- 상단 4개 Stat은 데이터 배열과 `StatItem`으로 구현한다.
- 값과 suffix를 분리해 `25 + m+`, `40 + +`, `100 + %`, `200 + m+`처럼 스타일링 가능하게 한다.
- 중단의 6개 이미지 콜라주 비율과 연결감을 보존한다.
- 하단 intro, CTA, 우측 statement는 desktop에서 넓은 negative space를 유지한다.
- mobile에서는 Stat을 2열 또는 1열로 재구성하고 이미지를 우선순위에 따라 배치한다.
- 브랜드 통계는 변동 가능한 콘텐츠이므로 component 내부에 하드코딩하지 않는다.

### 12.7 Global Partners

- 좌측 `GLOBAL ALLIANCE`, 중앙 formula, 우측 `THE T1 PARTNERS`의 균형을 유지한다.
- 16개 sponsor item은 데이터 배열로 관리한다.
- 중앙 sponsor track은 desktop에서 세로 흐름을 표현할 수 있으나, 현재 Figma에 animation reaction은 없다.
- motion 승인이 없으면 접근 가능한 정적 list 또는 수동 scroll track으로 구현한다.
- 무한 loop를 구현할 경우 복제 항목은 `aria-hidden="true"` 처리하고 focusable link를 복제하지 않는다.
- sponsor logo에는 파트너명을 포함한 대체 텍스트를 제공한다.
- Figma의 hidden `Media / Background`는 실제 디자인에 보이지 않으므로 구현하지 않는다.

### 12.8 Apparel

- Figma 원본은 3240×1080의 가로 artboard이며 intro와 13개 media instance로 구성된다.
- desktop에서는 pinned horizontal scene 또는 overflow track으로 해석할 수 있다.
- 해당 동작은 모션 승인 후 구현한다. 승인 전에는 정상적인 horizontal overflow 또는 responsive collage를 사용한다.
- 이미지마다 원본 crop, aspect ratio, decorative frame을 보존한다.
- mobile에서는 모든 이미지를 13개 절대 좌표로 축소하지 않는다. 1–2열 editorial grid 또는 snap gallery로 재배치한다.
- CTA는 최초 viewport에서 발견 가능해야 한다.
- 장식 프레임 SVG와 실제 사진은 별도 asset으로 관리한다.

### 12.9 Membership

- 밝은 배경의 centered intro와 5개 card collage가 핵심이다.
- `T1` 단어의 red accent를 유지한다.
- Primary card와 Reflection card는 의미상 같은 콘텐츠다.
- reflection은 별도 인터랙티브 DOM을 복제하지 말고 CSS transform, mask, pseudo-element 또는 비접근성 visual layer로 처리한다.
- horizon glow와 reflection fade는 장식이며 `aria-hidden="true"` 대상이다.
- card가 겹치는 순서와 rotation을 명시적 data로 관리한다.
- mobile에서는 겹침을 줄이고 card가 읽히는 carousel 또는 stack으로 재구성한다.

### 12.10 Footer

- 상단 390px dark content와 하단 620px image 영역의 대비를 유지한다.
- desktop content inset은 좌우 80px이다.
- Brand, Explore, Legal, Inquiries, Bottom 영역을 의미 있게 분리한다.
- 링크 목록은 실제 `<nav>`와 `<ul>` 구조를 사용한다.
- 이메일은 `mailto:`, 외부 T1 링크는 유효한 URL을 사용한다.
- copyright year, legal links, contact 주소는 launch 전 확인한다.
- footer background image는 content image가 아니므로 빈 alt 또는 CSS background로 처리한다.

## 13. Asset 규칙

Figma가 반환하는 asset URL은 임시이며 약 7일 후 만료될 수 있다.

필수 규칙:

1. production 구현에 필요한 모든 asset은 즉시 저장소의 공식 asset 경로로 가져온다.
2. source Figma node id와 의미를 asset manifest 또는 파일명에 기록한다.
3. SVG logo와 장식 frame은 SVG로 보존한다.
4. 사진은 원본 품질을 확인한 후 AVIF/WebP 등 저장소 정책에 맞는 파생본을 만든다.
5. 반응형 이미지는 `srcset`/image component를 사용한다.
6. Hero와 Opening의 LCP 후보만 eager/preload하고 나머지는 lazy load한다.
7. Figma crop은 이미지 자체를 잘라 저장하기보다 `object-position` metadata로 재현하는 것을 우선한다.
8. 같은 source image를 여러 crop에 사용하면 원본 파일 하나와 crop configuration을 공유한다.
9. decorative image는 빈 alt, 정보 전달 image는 구체적 alt를 사용한다.
10. base64와 임시 URL을 source control에 넣지 않는다.

권장 파일명 예:

```text
hero-faker-shadow.webp
history-skt-t1-founding.webp
history-boxer.webp
history-faker-trophy.webp
partner-samsung-odyssey.svg
apparel-01-hoodie.webp
membership-card-inside-t1.webp
```

번호만 있는 파일명은 manifest와 함께 사용하고, 의미를 알 수 있는 slug를 우선한다.

## 14. Motion과 scroll interaction

현재 대상 Figma에는 prototype reaction이 없다. 따라서 모든 motion은 디자인에서 확정된 사실이 아니라 구현 제안이다.

### 14.1 승인 없이 가능한 motion

- 150–300ms 범위의 button hover/focus transition
- opacity와 작은 translate를 이용한 비필수 reveal
- 사용자 조작에 따른 정상적인 carousel/scroll feedback
- Loading logo의 짧은 진입·퇴장

### 14.2 별도 승인이 필요한 motion

- Opening에서 Hero로 이어지는 시네마틱 전환
- Career의 pinned panel 또는 scroll-scrub
- Global Partners의 자동 세로 loop
- Apparel의 pinned horizontal scroll
- Membership card fan-out와 reflection animation
- 큰 parallax, cursor effect, scroll hijacking

### 14.3 Motion 공통 규칙

- `prefers-reduced-motion: reduce`에서 정지하거나 즉시 최종 상태로 전환한다.
- animation이 콘텐츠 읽기, keyboard 이동, 링크 클릭을 막지 않아야 한다.
- 지속적인 autoplay는 pause 수단을 검토한다.
- 기존 dependency가 없으면 animation library를 추가하지 않는다.
- CSS 또는 Web Animations API로 충분하면 새 library를 사용하지 않는다.
- scroll listener는 passive 또는 observer 기반으로 구성하고 layout thrashing을 피한다.
- transform과 opacity를 우선하고 큰 blur·filter animation을 남용하지 않는다.

## 15. 접근성

최소 WCAG 2.2 AA를 목표로 한다.

- 페이지에는 하나의 명확한 `<h1>`이 있어야 한다.
- 각 주요 화면은 `<section>`과 접근 가능한 이름을 가진다.
- heading level을 시각 크기로 결정하지 않는다.
- navigation, button, link의 의미를 올바른 element로 표현한다.
- 모든 interactive element는 keyboard로 접근 가능해야 한다.
- focus indicator를 제거하지 않는다.
- 40px visual button은 최소 44px hit target을 확보한다.
- gray text의 실제 contrast를 dark/light 배경별로 검증한다.
- red는 강조 수단이지만 red만으로 상태를 전달하지 않는다.
- 장식·reflection·복제 sponsor는 accessibility tree에서 제외한다.
- 자동 움직임은 reduced motion과 pause 요구사항을 적용한다.
- 이미지 alt는 장면의 의미를 전달하되 보이는 모든 것을 장황하게 나열하지 않는다.
- 한국어와 영어가 섞인 긴 문장은 필요한 경우 `lang` 속성을 구분한다.
- 가로 gallery는 keyboard 이동, focus visibility, 현재 위치 인지를 지원한다.

## 16. 성능

이 페이지는 이미지 56개 수준의 미디어 중심 디자인이므로 성능을 기능 요구사항으로 취급한다.

- LCP 목표: 2.5초 이하
- CLS 목표: 0.1 이하
- INP 목표: 200ms 이하
- 초기 viewport에 필요하지 않은 이미지와 섹션 코드는 지연 로딩한다.
- 이미지 width/height 또는 aspect ratio를 미리 선언한다.
- Hero/Opening 외 이미지는 기본 lazy load를 검토한다.
- 큰 section에 `content-visibility: auto`를 검토하되 anchor/focus 동작을 테스트한다.
- 반복 card의 reflection 때문에 대형 image DOM을 이중 다운로드하지 않는다.
- 성취 숫자와 heading을 이미지로 만들지 않는다.
- scroll animation은 main thread 점유와 memory 사용을 프로파일링한다.
- resize/scroll마다 강제 reflow를 만드는 코드를 금지한다.
- 새 runtime dependency는 bundle 영향과 대안 비교 없이 추가하지 않는다.

## 17. 콘텐츠와 데이터

반복 콘텐츠는 code에서 데이터로 분리한다.

권장 데이터 단위:

- history entries 3개
- achievement panels 3개
- brand stats 4개
- sponsors 16개
- apparel media 13개
- membership cards 5개
- footer link groups 3개

각 항목은 가능한 범위에서 `id`, `title`, `copy`, `image`, `alt`, `href`, `crop`, `order`를 명시한다.

통계와 성취 숫자, 파트너 목록, copyright, legal URL은 시간이 지나면 바뀔 수 있다. launch 전에 공식 source로 검증한다. Figma 문구와 공식 정보가 다르면 임의 수정하지 말고 변경 승인과 디자인 반영을 함께 요청한다.

## 18. 코드 구조와 품질

- 저장소의 기존 naming, module boundary, import style을 따른다.
- TypeScript 저장소라면 `any` 대신 명시적 content·variant type을 사용한다.
- section component는 데이터와 presentation을 분리한다.
- 페이지 component 하나에 모든 섹션 구현을 몰아넣지 않는다.
- style value는 token과 section-local custom property로 관리한다.
- 시각 순서를 만들기 위해 DOM 순서를 뒤집지 않는다.
- 반복 key로 array index를 사용하지 않는다. 디자인 순서가 바뀌어도 안정적인 id를 사용한다.
- 불필요한 client component와 hydration을 만들지 않는다.
- browser 전용 API는 SSR 환경에서 안전하게 접근한다.
- DOM ref와 animation cleanup을 확실히 처리한다.
- section anchor와 route hash가 필요하면 안정적인 영문 slug를 사용한다.

권장 section slug:

```text
hero
history
achievements
impact
partners
apparel
membership
footer
```

## 19. SEO와 metadata

- 실제 프로젝트의 SEO 정책이 있으면 그것을 우선한다.
- 한 페이지 사이트라면 title, description, canonical, Open Graph image를 반드시 정의한다.
- Organization 또는 SportsTeam structured data 적용 가능성을 검토한다.
- 화면에 보이지 않는 keyword text를 추가하지 않는다.
- social image는 Hero의 핵심 구도와 브랜드 로고 가독성을 기준으로 별도 crop한다.
- 내부 section heading은 검색 엔진이 이해할 수 있는 실제 텍스트로 유지한다.

## 20. 테스트와 검증

### 20.1 필수 자동 검증

- typecheck
- lint
- unit/component test
- production build
- 주요 route smoke test
- 접근성 자동 검사
- 가능하면 주요 viewport visual regression

### 20.2 기준 viewport

저장소에 별도 matrix가 없으면 최소 다음을 검증한다.

- 1920×1080: Figma desktop 기준
- 1440×900: 일반 desktop
- 1024×768: tablet landscape
- 768×1024: tablet portrait
- 390×844: mobile
- 320×568: 최소 폭 안전성

### 20.3 섹션별 시각 QA

- 배경색과 text color가 canonical 값과 일치하는가
- heading의 줄바꿈과 tracking이 의도와 일치하는가
- image crop과 focal point가 일치하는가
- 4px/8px/20px/pill radius가 혼용되지 않았는가
- 콜라주 z-index와 겹침 순서가 맞는가
- text가 잘리거나 한 글자씩 wrap되지 않는가
- CTA가 이미지나 fixed layer 뒤에 가려지지 않는가
- horizontal section이 페이지 전체 overflow를 만들지 않는가
- reflection과 복제 콘텐츠가 keyboard·screen reader에 노출되지 않는가
- reduced motion에서 모든 콘텐츠가 보이는가

## 21. 시각 회귀 기준

1920px에서는 각 Figma section을 독립적으로 비교한다. 페이지 전체 long screenshot 하나만으로 판정하지 않는다.

우선순위:

1. section bounds와 background
2. 주요 heading baseline과 line break
3. image bounds, crop, focal point
4. CTA 위치와 크기
5. 색상과 typography
6. 작은 장식 detail

자동 pixel diff만으로 승인하지 않는다. font rasterization과 image compression 차이는 허용할 수 있지만, layout shift, crop 변화, 잘못된 줄바꿈은 허용하지 않는다.

## 22. 변경 관리

- Figma node id는 구현 주석 또는 mapping 문서에서 추적할 수 있게 한다.
- 디자인과 코드 중 한쪽의 token을 바꾸면 다른 쪽에 미치는 영향을 기록한다.
- 기존 화면의 픽셀값을 semantic token으로 치환할 때 before/after screenshot을 남긴다.
- 재사용 컴포넌트 API를 변경하면 모든 section 사용처를 함께 검증한다.
- 원본 asset을 교체할 때 crop metadata와 alt도 검토한다.
- 프로젝트와 무관한 파일, dependency, format 변경을 섞지 않는다.

## 23. 미확정 사항과 승인 게이트

다음 항목은 현재 Figma만으로 확정할 수 없다. 구현 전에 확인하거나 명시적 가정을 남긴다.

1. 대상 production framework와 styling system
2. mobile·tablet의 최종 art direction
3. Loading과 Opening의 실제 상태 흐름
4. Career, Partners, Apparel, Membership의 scroll motion
5. Integral CF, Kallisto, Pretendard, Paperlogy의 webfont 라이선스와 배포 방식
6. 현재 Figma primitive variable과 실제 Paint Style 중 장기 canonical 값
7. T1.GG, contact, legal, privacy, cookie URL
8. 통계·성취 숫자·파트너 목록의 launch 시점 최신성
9. sponsor와 apparel 이미지 사용 권한
10. analytics, consent, cookie banner 요구사항

미확정 사항을 임의로 영구 결정하지 않는다. reversible한 기본값을 사용하고 코드와 PR 설명에 가정을 기록한다.

## 24. Definition of Done

작업은 다음 조건을 모두 만족해야 완료다.

- 대상 Figma section과 1920px 시각 결과가 합의된 수준으로 일치한다.
- desktop 외 기준 viewport에서 overflow와 읽기 문제 없이 재배치된다.
- semantic HTML, keyboard, focus, alt, reduced motion이 검증됐다.
- asset이 영구적인 프로젝트 경로에 저장되고 임시 Figma URL이 없다.
- 반복 콘텐츠가 데이터와 재사용 컴포넌트로 정리됐다.
- 실제 화면 색상과 token 간 불일치가 해결되거나 명시적으로 격리됐다.
- typecheck, lint, tests, production build가 통과한다.
- LCP/CLS/INP 목표를 심각하게 훼손하는 문제가 없다.
- 모션 없이도 콘텐츠와 기능이 완전하다.
- 변경 범위, 남은 가정, 미확정 링크·콘텐츠가 handoff에 기록됐다.

## 25. 에이전트용 최종 체크리스트

작업 전:

- [ ] 저장소 stack과 기존 패턴을 확인했다.
- [ ] 대상 Figma node와 screenshot을 확인했다.
- [ ] canonical color와 variable 불일치를 이해했다.
- [ ] 필요한 asset과 font 라이선스를 확인했다.
- [ ] motion 승인 범위를 확인했다.

작업 중:

- [ ] 기존 token과 component를 우선 재사용했다.
- [ ] 절대 좌표를 section-local art direction으로 제한했다.
- [ ] 반복 항목을 데이터화했다.
- [ ] 임시 Figma asset URL을 남기지 않았다.
- [ ] mobile을 단순 scale 처리하지 않았다.
- [ ] 접근성과 reduced motion을 함께 구현했다.

작업 후:

- [ ] section별 Figma 비교를 완료했다.
- [ ] 1920, 1440, 1024, 768, 390, 320 viewport를 확인했다.
- [ ] keyboard와 screen reader 노출 순서를 확인했다.
- [ ] typecheck, lint, test, build를 실행했다.
- [ ] 남은 가정과 승인 필요 항목을 보고했다.

