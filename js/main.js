(() => {
    'use strict';

    const STATE = Object.freeze({
        LOADING: 'loading',
        COMPLETING: 'completing',
        OPENING: 'opening',
        DIVING: 'diving',
        REVEALING_HERO: 'revealingHero',
        HERO_ENTERING: 'heroEntering',
        COMPLETE: 'complete',
    });

    const TIMING = Object.freeze({
        STAR_STAGGER_MS: 280,
        STAR_REVEAL_MS: 400,
        MIN_LOADING_MS: 2800,
        FIRST_PULSE_DELAY_MS: 320,
        PULSE_DURATION_MS: 900,
        PULSE_INTERVAL_MIN_MS: 2000,
        PULSE_INTERVAL_MAX_MS: 3000,
        COMPLETION_HOLD_MS: 200,
        OPENING_FLICKER_MIN_MS: 1100,
        OPENING_FLICKER_MAX_MS: 1350,
        OPENING_SETTLE_MIN_MS: 450,
        OPENING_SETTLE_MAX_MS: 550,
        REDUCED_COMPLETION_HOLD_MS: 0,
        REDUCED_OPENING_FADE_MS: 120,
        LOGO_HOVER_SETTLE_MS: 130,
        DIVE_DURATION_MS: 1450,
        DIVE_HERO_REVEAL_OFFSET: 0.76,
        REDUCED_TRANSITION_MS: 200,
        HERO_ENTRY_VISIBILITY_RATIO: 0.1,
        HERO_WORDMARK_MS: 760,
        HERO_LEAD_START_MS: 560,
        HERO_LEAD_MS: 380,
        HERO_MAIN_START_MS: 820,
        HERO_MAIN_MS: 400,
        HERO_INTRO_START_MS: 1100,
        HERO_CREDIT_START_MS: 1200,
        HERO_ACTION_START_MS: 1260,
        HERO_SECONDARY_MS: 400,
        HERO_ACTION_STAGGER_MS: 50,
    });

    const MONITOR_ANCHOR = Object.freeze({
        left: 0.292,
        top: 0.255,
        width: 0.442,
        height: 0.449,
        centerX: 0.513,
        centerY: 0.48,
        overscan: 1.03,
    });

    const DIVE_EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';
    const REVEAL_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const PAGE_SCROLL_DURATION_MS = 720;
    const PAGE_SCROLL_EASING = 'cubic-bezier(0.76, 0, 0.24, 1)';
    const PAGE_SCROLL_WHEEL_THRESHOLD_PX = 24;
    const PAGE_SCROLL_WHEEL_ACCUMULATION_MS = 160;
    const PAGE_SCROLL_SWIPE_THRESHOLD_PX = 48;
    const PAGE_SCROLL_BOUNDARY_TOLERANCE_PX = 2;
    const HISTORY_ENTRY_SETTLE_DELAY_MS = 70;
    const HISTORY_ENTRY_TIMELINE_MS = 1580;
    const BRAND_IMPACT_COUNT_DURATION_MS = 920;
    const SPONSOR_INITIAL_INDEX = 4;
    const SPONSOR_WHEEL_THRESHOLD_PX = 18;
    const SPONSOR_WHEEL_ACCUMULATION_MS = 160;
    const SPONSOR_BOUNDARY_RELEASE_DELAY_MS = 180;
    const SPONSOR_TRACK_DURATION_MS = 620;
    const SPONSOR_TRACK_SETTLE_MS = 150;
    const SPONSOR_TRACK_EASING = 'cubic-bezier(0.76, 0, 0.24, 1)';
    const SPONSOR_SCALE_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const SPONSOR_FRAME_INACTIVE = 'images/global-partner-frame-inactive.svg';
    const SPONSOR_FRAME_ACTIVE = 'images/global-partner-frame-active.svg';
    const SPONSORS = Object.freeze([
        {
            id: 'sponsor-01',
            name: 'ABLY',
            nodeId: '86:140',
            src: 'images/global-partner-sponsor-01.png',
            width: 1000,
            height: 421,
            crop: { width: 200.32, height: 84.33, left: -50.23, top: 7.88 },
        },
        {
            id: 'sponsor-02',
            name: 'GOALSTUDIO',
            nodeId: '86:142',
            src: 'images/global-partner-sponsor-02.png',
            width: 1000,
            height: 421,
            crop: { mode: 'cover', width: 100, height: 100, left: 0, top: 0 },
        },
        {
            id: 'sponsor-03',
            name: 'Samsung Odyssey',
            nodeId: '86:138',
            src: 'images/global-partner-sponsor-03.png',
            width: 1000,
            height: 421,
            crop: { width: 221.91, height: 93.42, left: -60.79, top: 3.44 },
        },
        {
            id: 'sponsor-04',
            name: 'Red Sea Global',
            nodeId: '86:136',
            src: 'images/global-partner-sponsor-04.png',
            width: 2500,
            height: 1440,
            crop: { width: 114.44, height: 65.92, left: -7.45, top: 17.46 },
        },
        {
            id: 'sponsor-05',
            name: 'SK telecom',
            nodeId: '69:199',
            src: 'images/global-partner-sponsor-05.png',
            width: 1000,
            height: 421,
            crop: { width: 237.53, height: 100, left: -68.76, top: 0 },
        },
        {
            id: 'sponsor-06',
            name: 'Secretlab',
            nodeId: '69:200',
            src: 'images/global-partner-sponsor-06.png',
            width: 1000,
            height: 421,
            crop: { width: 225.38, height: 94.89, left: -62.63, top: 2.47 },
        },
        {
            id: 'sponsor-07',
            name: 'Red Bull',
            nodeId: '69:198',
            src: 'images/global-partner-sponsor-07.png',
            width: 1000,
            height: 421,
            crop: { width: 307.87, height: 129.61, left: -103.89, top: -14.78 },
        },
        {
            id: 'sponsor-08',
            name: 'INSPIRE',
            nodeId: '86:144',
            src: 'images/global-partner-sponsor-08.png',
            width: 1000,
            height: 421,
            crop: { width: 206.63, height: 86.99, left: -53.41, top: 6.5 },
        },
        {
            id: 'sponsor-09',
            name: 'KLEVV',
            nodeId: '86:146',
            src: 'images/global-partner-sponsor-09.png',
            width: 1000,
            height: 421,
            crop: { width: 250.8, height: 105.59, left: -75.52, top: -2.79 },
        },
        {
            id: 'sponsor-10',
            name: 'Pulsar',
            nodeId: '69:197',
            src: 'images/global-partner-sponsor-10.png',
            width: 1000,
            height: 421,
            crop: { width: 190.12, height: 80.04, left: -44.89, top: 9.98 },
        },
        {
            id: 'sponsor-11',
            name: 'SCOP',
            nodeId: '69:201',
            src: 'images/global-partner-sponsor-11.png',
            width: 1000,
            height: 421,
            crop: { width: 253.8, height: 106.85, left: -77.06, top: -3.43 },
        },
        {
            id: 'sponsor-12',
            name: 'Spotify',
            nodeId: '86:148',
            src: 'images/global-partner-sponsor-12.png',
            width: 1000,
            height: 421,
            crop: { width: 237.53, height: 100, left: -68.81, top: 0.09 },
        },
        {
            id: 'sponsor-13',
            name: 'SteelSeries',
            nodeId: '86:150',
            src: 'images/global-partner-sponsor-13.png',
            width: 1000,
            height: 421,
            crop: { width: 216.2, height: 91.02, left: -58.29, top: 4.49 },
        },
        {
            id: 'sponsor-14',
            name: 'Kim Seung Rae with V1C Team',
            nodeId: '86:152',
            src: 'images/global-partner-sponsor-14.png',
            width: 1000,
            height: 421,
            crop: { width: 171.56, height: 72.23, left: -35.54, top: 13.93 },
        },
        {
            id: 'sponsor-15',
            name: 'Daewoong Pharmaceutical',
            nodeId: '86:154',
            src: 'images/global-partner-sponsor-15.png',
            width: 1000,
            height: 421,
            crop: { width: 203.72, height: 85.76, left: -51.88, top: 7.18 },
        },
        {
            id: 'sponsor-16',
            name: 'Woori Bank',
            nodeId: '86:156',
            src: 'images/global-partner-sponsor-16.png',
            width: 1000,
            height: 421,
            crop: { width: 226.05, height: 95.17, left: -63.12, top: 2.35 },
        },
    ]);
    const APPAREL_PAGE_TRANSITION_DURATION_MS = 1000;
    const APPAREL_MEDIA_ENTRY_DURATION_MS = 620;
    const APPAREL_CANVAS_WIDTH_PX = 3240;
    const APPAREL_ENTRY_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const MEMBERSHIP_PAGE_TRANSITION_DURATION_MS = 850;
    const MEMBERSHIP_SETTLE_LOCK_MS = 180;
    const MEMBERSHIP_TEXT_ENTRY_DURATION_MS = 720;
    const MEMBERSHIP_CARD_ENTRY_DURATION_MS = 820;
    const MEMBERSHIP_ENTRY_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const APPAREL_MEDIA = Object.freeze([
        {
            id: 'apparel-media-01', nodeId: '69:204',
            src: 'images/apparel-media-01.png', frame: 'images/apparel-frame-612x480.svg',
            alt: '회색 T1 후디를 착용한 여성 모델', sourceWidth: 1280, sourceHeight: 1450,
            left: 682, top: 50, width: 612, height: 480, offset: 90, delay: 0,
            crop: { width: 100, height: 144.43, left: -0.02, top: -0.03 },
        },
        {
            id: 'apparel-media-02', nodeId: '69:216',
            src: 'images/apparel-media-02.png', frame: 'images/apparel-frame-191x647.svg',
            alt: '레드 T1 재킷의 뒷면을 보여주는 모델', sourceWidth: 800, sourceHeight: 1000,
            left: 1314, top: 50, width: 191, height: 647, offset: 150, delay: 80,
            crop: { width: 369.79, height: 136.46, left: -134.77, top: -14.97 },
        },
        {
            id: 'apparel-media-03', nodeId: '69:215',
            src: 'images/apparel-media-03.png', frame: 'images/apparel-frame-191x480.svg',
            alt: '화이트 캡을 착용한 남성 모델', sourceWidth: 1200, sourceHeight: 1400,
            left: 1524, top: 50, width: 191, height: 480, offset: 110, delay: 160,
            crop: { width: 215.41, height: 100, left: -38.51, top: -0.1 },
        },
        {
            id: 'apparel-media-04', nodeId: '69:210',
            src: 'images/apparel-media-04.png', frame: 'images/apparel-frame-401x480.svg',
            alt: '푸른 배경에서 회색 T1 후디를 착용한 여성 모델', sourceWidth: 400, sourceHeight: 500,
            left: 1946, top: 50, width: 401, height: 480, offset: 180, delay: 40,
            crop: { width: 100, height: 104.43, left: 0, top: -2.21 },
        },
        {
            id: 'apparel-media-05', nodeId: '69:209',
            src: 'images/apparel-media-05.png', frame: 'images/apparel-frame-612x470.svg',
            alt: '화이트 셋업과 레드 스니커즈를 착용한 모델', sourceWidth: 1080, sourceHeight: 1080,
            left: 2578, top: 60, width: 612, height: 470, offset: 120, delay: 210,
            crop: { width: 100, height: 130.21, left: 0, top: -30.25 },
        },
        {
            id: 'apparel-media-06', nodeId: '69:206',
            src: 'images/apparel-media-06.png', frame: 'images/apparel-frame-191x313.svg',
            alt: '블랙 T1 티셔츠를 착용한 남성 모델', sourceWidth: 400, sourceHeight: 600,
            left: 682, top: 550, width: 191, height: 313, offset: 140, delay: 120,
            crop: { width: 109.25, height: 100, left: -4.62, top: 0 },
        },
        {
            id: 'apparel-media-07', nodeId: '69:205',
            src: 'images/apparel-media-07.png', frame: 'images/apparel-frame-401x480.svg',
            alt: 'T1 의상을 입고 의자에 앉은 모델', sourceWidth: 567, sourceHeight: 850,
            left: 1525, top: 550, width: 401, height: 480, offset: 80, delay: 240,
            crop: { width: 100, height: 125.24, left: 0.15, top: -0.01 },
        },
        {
            id: 'apparel-media-08', nodeId: '69:212',
            src: 'images/apparel-media-08.png', frame: 'images/apparel-frame-191x230.svg',
            alt: '핑크 포인트가 있는 회색 T1 캡 디테일', sourceWidth: 941, sourceHeight: 1672,
            left: 1946, top: 550, width: 191, height: 230, offset: 170, delay: 180,
            crop: { width: 100, height: 147.55, left: 0, top: -23.78 },
        },
        {
            id: 'apparel-media-09', nodeId: '69:208',
            src: 'images/apparel-media-09.png', frame: 'images/apparel-frame-316x480.svg',
            alt: '블랙 트랙 재킷을 착용한 남성 모델', sourceWidth: 960, sourceHeight: 1200,
            left: 2305, top: 550, width: 316, height: 480, offset: 105, delay: 290,
            crop: { width: 121.52, height: 100, left: -10.76, top: 0 },
        },
        {
            id: 'apparel-media-10', nodeId: '69:214',
            src: 'images/apparel-media-10.png', frame: 'images/apparel-frame-191x313.svg',
            alt: '블랙 T1 후디의 뒷면을 보여주는 모델', sourceWidth: 400, sourceHeight: 500,
            left: 2999, top: 550, width: 191, height: 313, offset: 155, delay: 330,
            crop: { width: 131.1, height: 100, left: -15.55, top: 0 },
        },
        {
            id: 'apparel-media-11', nodeId: '69:207',
            src: 'images/apparel-media-11.png', frame: 'images/apparel-frame-191x313.svg',
            alt: '화이트와 레드 투톤 T1 캡', sourceWidth: 1400, sourceHeight: 2100,
            left: 1103, top: 717, width: 191, height: 313, offset: 125, delay: 260,
            crop: { mode: 'cover', width: 100, height: 100, left: 0, top: 0 },
        },
        {
            id: 'apparel-media-12', nodeId: '69:213',
            src: 'images/apparel-media-12.png', frame: 'images/apparel-frame-191x313.svg',
            alt: '회색 T1 후디를 착용한 모델', sourceWidth: 1600, sourceHeight: 2400,
            left: 2789, top: 717, width: 191, height: 313, offset: 190, delay: 370,
            crop: { width: 109.25, height: 100, left: -4.62, top: 0 },
        },
        {
            id: 'apparel-media-13', nodeId: '69:211',
            src: 'images/apparel-media-13.png', frame: 'images/apparel-frame-191x230.svg',
            alt: '회색 T1 비니를 착용한 모델', sourceWidth: 960, sourceHeight: 1200,
            left: 1946, top: 800, width: 191, height: 230, offset: 95, delay: 310,
            crop: { width: 100, height: 103.8, left: 0, top: -1.9 },
        },
    ]);
    const MEMBERSHIP_CARDS = Object.freeze([
        {
            id: 'membership-card-01',
            nodeId: '102:143',
            name: 'Inside T1 Featured Video',
            ariaLabel: 'Inside T1 Featured Video 멤버십 카드',
            href: null,
            featured: true,
            rotation: -16.37,
            left: 0,
            top: 144,
            slotWidth: 524.675,
            slotHeight: 592.447,
            zIndex: 3,
            entryOffset: 220,
            entryDelay: 0,
        },
        {
            id: 'membership-card-02',
            nodeId: '102:145',
            name: 'T1 팝업 이벤트 초대장',
            ariaLabel: 'T1 팝업 이벤트 초대장 멤버십 카드',
            href: null,
            src: 'images/membership-card-02.png',
            alt: 'T1 팝업 이벤트 초대장 아트워크',
            sourceWidth: 640,
            sourceHeight: 800,
            crop: { width: 100, height: 100, left: 0, top: 0 },
            rotation: 16.88,
            left: 253,
            top: 16,
            slotWidth: 527.944,
            slotHeight: 594.601,
            zIndex: 5,
            entryOffset: 260,
            entryDelay: 80,
        },
        {
            id: 'membership-card-03',
            nodeId: '103:180',
            name: 'T1 Spotify 콘텐츠',
            ariaLabel: 'T1 Spotify 콘텐츠 멤버십 카드',
            href: null,
            src: 'images/membership-card-03.png',
            alt: 'T1 선수들과 Spotify 협업 아트워크',
            sourceWidth: 360,
            sourceHeight: 640,
            crop: { width: 100, height: 142.22, left: 0, top: -13.51 },
            rotation: -3.62,
            left: 476,
            top: 0,
            slotWidth: 430.771,
            slotHeight: 524.258,
            zIndex: 4,
            entryOffset: 190,
            entryDelay: 160,
        },
        {
            id: 'membership-card-04',
            nodeId: '102:147',
            name: 'T1 Viewing Mate',
            ariaLabel: 'T1 Viewing Mate 멤버십 카드',
            href: null,
            src: 'images/membership-card-04.png',
            alt: 'T1 Viewing Mate 캐릭터 이벤트 아트워크',
            sourceWidth: 512,
            sourceHeight: 640,
            crop: { width: 100, height: 100, left: 0, top: 0 },
            rotation: 7.93,
            left: 764,
            top: 38,
            slotWidth: 465.192,
            slotHeight: 550.43,
            zIndex: 2,
            entryOffset: 240,
            entryDelay: 240,
        },
        {
            id: 'membership-card-05',
            nodeId: '102:144',
            name: 'T1 Festival Quarterfinals',
            ariaLabel: 'T1 Festival Quarterfinals 멤버십 카드',
            href: null,
            src: 'images/membership-card-05.png',
            alt: 'T1 Festival Quarterfinals 아트워크',
            sourceWidth: 1080,
            sourceHeight: 1440,
            crop: { width: 100, height: 106.67, left: 0, top: -3.33 },
            rotation: 18.42,
            left: 960,
            top: 125,
            slotWidth: 537.479,
            slotHeight: 600.764,
            zIndex: 1,
            entryOffset: 210,
            entryDelay: 320,
        },
    ]);
    const createCubicBezierEasing = (x1, y1, x2, y2) => {
        const coefficientA = (point1, point2) => 1 - 3 * point2 + 3 * point1;
        const coefficientB = (point1, point2) => 3 * point2 - 6 * point1;
        const coefficientC = (point1) => 3 * point1;
        const sample = (time, point1, point2) => {
            return ((coefficientA(point1, point2) * time + coefficientB(point1, point2)) * time
                + coefficientC(point1)) * time;
        };
        const sampleSlope = (time, point1, point2) => {
            return 3 * coefficientA(point1, point2) * time * time
                + 2 * coefficientB(point1, point2) * time
                + coefficientC(point1);
        };

        return (progress) => {
            if (progress <= 0 || progress >= 1) {
                return progress;
            }

            let time = progress;

            for (let iteration = 0; iteration < 5; iteration += 1) {
                const slope = sampleSlope(time, x1, x2);

                if (Math.abs(slope) < 0.000001) {
                    break;
                }

                time -= (sample(time, x1, x2) - progress) / slope;
                time = Math.min(1, Math.max(0, time));
            }

            return sample(time, y1, y2);
        };
    };

    const easePageScroll = createCubicBezierEasing(0.76, 0, 0.24, 1);

    const getRandomInRange = (minimum, maximum) => minimum + Math.random() * (maximum - minimum);

    const getRandomPulseInterval = () => {
        return Math.round(getRandomInRange(TIMING.PULSE_INTERVAL_MIN_MS, TIMING.PULSE_INTERVAL_MAX_MS));
    };

    const createOpeningFlicker = () => {
        const totalDuration = Math.round(
            getRandomInRange(TIMING.OPENING_FLICKER_MIN_MS, TIMING.OPENING_FLICKER_MAX_MS),
        );
        const settleDuration = Math.round(
            getRandomInRange(TIMING.OPENING_SETTLE_MIN_MS, TIMING.OPENING_SETTLE_MAX_MS),
        );
        const flickerDuration = totalDuration - settleDuration;
        const firstPeakAt = getRandomInRange(35, 70);
        const firstDipAt = firstPeakAt + getRandomInRange(45, 80);
        const secondPeakAt = firstDipAt + getRandomInRange(90, 140);
        const secondDipAt = secondPeakAt + getRandomInRange(40, 75);
        const thirdPeakAt = Math.min(
            flickerDuration - 50,
            secondDipAt + getRandomInRange(120, 180),
        );
        const offset = (time) => Number((time / totalDuration).toFixed(4));

        return {
            totalDuration,
            settleDuration,
            keyframes: [
                {
                    offset: 0,
                    opacity: 0,
                    filter: 'brightness(0.55) contrast(0.98)',
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                },
                {
                    offset: offset(firstPeakAt),
                    opacity: getRandomInRange(0.2, 0.25),
                    filter: `brightness(${getRandomInRange(0.78, 0.9)}) contrast(${getRandomInRange(0.98, 1.01)})`,
                    easing: 'cubic-bezier(0.55, 0, 1, 0.45)',
                },
                {
                    offset: offset(firstDipAt),
                    opacity: getRandomInRange(0.04, 0.08),
                    filter: `brightness(${getRandomInRange(0.56, 0.68)}) contrast(${getRandomInRange(0.96, 0.99)})`,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                },
                {
                    offset: offset(secondPeakAt),
                    opacity: getRandomInRange(0.46, 0.55),
                    filter: `brightness(${getRandomInRange(0.88, 0.98)}) contrast(${getRandomInRange(1, 1.03)})`,
                    easing: 'cubic-bezier(0.55, 0, 1, 0.45)',
                },
                {
                    offset: offset(secondDipAt),
                    opacity: getRandomInRange(0.1, 0.17),
                    filter: `brightness(${getRandomInRange(0.62, 0.74)}) contrast(${getRandomInRange(0.98, 1.01)})`,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                },
                {
                    offset: offset(thirdPeakAt),
                    opacity: getRandomInRange(0.78, 0.85),
                    filter: `brightness(${getRandomInRange(0.97, 1.02)}) contrast(${getRandomInRange(1, 1.03)})`,
                    easing: 'cubic-bezier(0.3, 0, 0.2, 1)',
                },
                {
                    offset: offset(flickerDuration),
                    opacity: getRandomInRange(0.74, 0.82),
                    filter: `brightness(${getRandomInRange(0.95, 1)}) contrast(${getRandomInRange(1, 1.02)})`,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                },
                {
                    offset: 1,
                    opacity: 1,
                    filter: 'brightness(1) contrast(1)',
                },
            ],
        };
    };

    class OpeningHeroTransition {
        constructor(root) {
            this.root = root;
            this.cameraLayer = root.querySelector('[data-opening-camera-layer]');
            this.openingBackground = root.querySelector('.intro-sequence__background--opening');
            this.openingImage = root.querySelector('[data-opening-image]');
            this.brandMark = root.querySelector('[data-opening-brand-mark]');
            this.logoButton = root.querySelector('[data-opening-logo-button]');
            this.logoVisual = root.querySelector('[data-opening-logo-visual]');
            this.stars = Array.from(root.querySelectorAll('[data-star]'));
            this.status = root.querySelector('[data-loading-status]');
            this.introAssets = Array.from(root.querySelectorAll('[data-intro-asset]'));
            this.heroLayer = root.querySelector('[data-hero-layer]');
            this.heroStage = root.querySelector('[data-hero-stage]');
            this.heroAssets = Array.from(root.querySelectorAll('[data-hero-asset]'));
            this.heroWordmark = root.querySelector('[data-hero-wordmark]');
            this.heroHeadlineLead = root.querySelector('[data-hero-headline-lead]');
            this.heroHeadlineMain = Array.from(root.querySelectorAll('[data-hero-headline-main]'));
            this.heroSecondary = Array.from(root.querySelectorAll('[data-hero-secondary]'));
            this.heroIntroduction = root.querySelector('[data-hero-introduction]');
            this.heroCredit = root.querySelector('[data-hero-credit]');
            this.heroActions = Array.from(root.querySelectorAll('[data-hero-action]'));
            this.abortController = new AbortController();
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.starTimers = new Set();
            this.delayTimers = new Map();
            this.transitionAnimations = new Set();
            this.heroAnimations = new Set();
            this.pulseStartTimer = 0;
            this.pulseEndTimer = 0;
            this.openingAnimation = null;
            this.logoSettleAnimation = null;
            this.resolveStarsReady = null;
            this.startedAt = 0;
            this.interactionReady = false;
            this.hasTransitionStarted = false;
            this.hasHeroEntered = false;
            this.heroEntrancePromise = null;
            this.destroyed = false;
            this.handleLogoActivation = () => this.startMonitorDive();
            this.handleHeroViewportResize = () => this.updateHeroStageScale();
        }

        hasRequiredStructure() {
            return Boolean(
                this.cameraLayer
                && this.openingBackground
                && this.openingImage
                && this.brandMark
                && this.logoButton
                && this.logoVisual
                && this.stars.length === 6
                && this.status
                && this.heroLayer
                && this.heroStage
                && this.heroWordmark
                && this.heroHeadlineLead
                && this.heroHeadlineMain.length === 2
                && this.heroSecondary.length === 4
                && this.heroIntroduction
                && this.heroCredit
                && this.heroActions.length === 2
            );
        }

        async init() {
            if (!this.hasRequiredStructure()) {
                return;
            }

            this.root.dataset.motionInitialized = 'true';
            this.updateHeroStageScale();
            this.setState(STATE.LOADING);
            this.bindLifecycle();
            this.startedAt = window.performance.now();

            const introAssetsReady = this.waitForImages(this.introAssets);
            const heroReady = this.waitForHeroReady();
            const starsReady = this.reducedMotion.matches ? this.revealAllStars() : this.revealStars();

            if (!this.reducedMotion.matches) {
                this.scheduleFirstPulse();
            }

            const [introReady] = await Promise.all([introAssetsReady, starsReady]);

            if (this.destroyed || !introReady) {
                this.reportLoadingFailure();
                return;
            }

            const completionHold = this.reducedMotion.matches
                ? TIMING.REDUCED_COMPLETION_HOLD_MS
                : TIMING.COMPLETION_HOLD_MS;

            if (!this.reducedMotion.matches) {
                const elapsed = window.performance.now() - this.startedAt;
                const remainingLoadingTime = Math.max(
                    0,
                    TIMING.MIN_LOADING_MS - TIMING.COMPLETION_HOLD_MS - elapsed,
                );

                if (remainingLoadingTime > 0) {
                    await this.delay(remainingLoadingTime);
                }
            }

            if (this.destroyed) {
                return;
            }

            this.setState(STATE.COMPLETING);
            this.stopPulseScheduler();
            await this.settleGlow(completionHold);

            if (this.destroyed) {
                return;
            }

            this.setState(STATE.OPENING);
            await this.playOpeningTransition();

            if (this.destroyed) {
                return;
            }

            const heroIsReady = await heroReady;

            if (this.destroyed || !heroIsReady) {
                this.reportLoadingFailure();
                return;
            }

            this.enableOpeningInteraction();
        }

        bindLifecycle() {
            const signal = this.abortController.signal;

            window.addEventListener('pagehide', () => this.destroy(), { once: true, signal });
            window.addEventListener('resize', this.handleHeroViewportResize, {
                passive: true,
                signal,
            });
            window.addEventListener('orientationchange', this.handleHeroViewportResize, {
                passive: true,
                signal,
            });
            window.visualViewport?.addEventListener('resize', this.handleHeroViewportResize, {
                passive: true,
                signal,
            });
            this.reducedMotion.addEventListener('change', (event) => this.handleMotionPreferenceChange(event), {
                signal,
            });
            this.logoButton.addEventListener('click', this.handleLogoActivation, { signal });
        }

        updateHeroStageScale() {
            if (!this.heroLayer) {
                return;
            }

            const viewportWidth = window.visualViewport?.width || window.innerWidth;
            const viewportHeight = window.visualViewport?.height || window.innerHeight;
            const scale = Math.min(viewportWidth / 1920, viewportHeight / 1080);

            this.heroLayer.style.setProperty('--hero-scale', scale.toFixed(6));
        }

        setState(nextState) {
            this.root.dataset.state = nextState;
            this.root.dispatchEvent(
                new CustomEvent('t1:transition-state', {
                    detail: { state: nextState },
                }),
            );
        }

        handleMotionPreferenceChange(event) {
            if (!event.matches) {
                return;
            }

            if (this.root.dataset.state === STATE.LOADING) {
                this.stopPulseScheduler();
                this.revealAllStars();
            }

            if (this.root.dataset.state === STATE.OPENING && this.openingAnimation) {
                this.openingAnimation.cancel();
                this.openingAnimation = null;
                this.root.classList.remove('is-lighting');
            }

        }

        async playOpeningTransition() {
            if (typeof this.openingBackground.animate !== 'function') {
                return;
            }

            const reducedMotion = this.reducedMotion.matches;
            const flicker = reducedMotion
                ? {
                      totalDuration: TIMING.REDUCED_OPENING_FADE_MS,
                      settleDuration: TIMING.REDUCED_OPENING_FADE_MS,
                      keyframes: [
                          { opacity: 0, filter: 'brightness(1) contrast(1)' },
                          { opacity: 1, filter: 'brightness(1) contrast(1)' },
                      ],
                  }
                : createOpeningFlicker();

            this.root.classList.add('is-lighting');
            this.root.dispatchEvent(
                new CustomEvent('t1:opening-flicker', {
                    detail: {
                        totalDuration: flicker.totalDuration,
                        settleDuration: flicker.settleDuration,
                        reducedMotion,
                    },
                }),
            );

            this.openingAnimation = this.openingBackground.animate(flicker.keyframes, {
                duration: flicker.totalDuration,
                fill: 'both',
            });

            await this.waitForAnimation(this.openingAnimation);

            if (this.openingAnimation) {
                this.openingAnimation.cancel();
                this.openingAnimation = null;
            }

            this.root.classList.remove('is-lighting');
        }

        enableOpeningInteraction() {
            if (this.destroyed || this.hasTransitionStarted || this.root.dataset.state !== STATE.OPENING) {
                return;
            }

            this.interactionReady = true;
            this.logoButton.disabled = false;
            this.logoButton.setAttribute('aria-disabled', 'false');
            this.root.classList.add('is-interaction-ready');
            this.status.textContent = 'T1 로고를 눌러 경험을 시작하세요.';
            this.root.dispatchEvent(new CustomEvent('t1:opening-ready'));
        }

        startMonitorDive() {
            if (
                this.destroyed
                || !this.interactionReady
                || this.hasTransitionStarted
                || this.root.dataset.state !== STATE.OPENING
            ) {
                return;
            }

            this.hasTransitionStarted = true;
            this.interactionReady = false;
            this.stopPulseScheduler();
            this.root.classList.remove('is-interaction-ready');
            this.root.classList.add('is-diving');
            this.logoButton.disabled = true;
            this.logoButton.setAttribute('aria-disabled', 'true');
            this.status.textContent = 'T1 경험으로 이동하는 중입니다.';
            this.setState(STATE.DIVING);
            this.settleLogoHover();

            const transition = this.reducedMotion.matches
                ? this.playReducedTransition()
                : this.playMonitorDiveTransition();

            this.transitionPromise = transition.catch(() => {
                if (!this.destroyed) {
                    this.showHeroImmediately();
                }
            });
        }

        settleLogoHover() {
            if (typeof this.logoVisual.animate !== 'function') {
                return;
            }

            const computedStyle = window.getComputedStyle(this.logoVisual);
            this.logoSettleAnimation = this.logoVisual.animate(
                [
                    {
                        transform: computedStyle.transform === 'none' ? 'scale(1)' : computedStyle.transform,
                        filter: computedStyle.filter,
                    },
                    {
                        transform: 'scale(1)',
                        filter: 'none',
                    },
                ],
                {
                    duration: TIMING.LOGO_HOVER_SETTLE_MS,
                    easing: REVEAL_EASING,
                    fill: 'forwards',
                },
            );
        }

        getDiveGeometry() {
            const stageRect = this.root.getBoundingClientRect();
            const viewportWidth = Math.max(1, stageRect.width);
            const viewportHeight = Math.max(1, stageRect.height);
            const sourceWidth = this.openingImage.naturalWidth || 1920;
            const sourceHeight = this.openingImage.naturalHeight || 1080;
            const coverScale = Math.max(viewportWidth / sourceWidth, viewportHeight / sourceHeight);
            const renderedWidth = sourceWidth * coverScale;
            const renderedHeight = sourceHeight * coverScale;
            const cropOffsetX = (viewportWidth - renderedWidth) / 2;
            const cropOffsetY = (viewportHeight - renderedHeight) / 2;
            const monitorCenterX = cropOffsetX + renderedWidth * MONITOR_ANCHOR.centerX;
            const monitorCenterY = cropOffsetY + renderedHeight * MONITOR_ANCHOR.centerY;
            const monitorWidth = renderedWidth * MONITOR_ANCHOR.width;
            const monitorHeight = renderedHeight * MONITOR_ANCHOR.height;
            const finalScale = Math.max(
                viewportWidth / monitorWidth,
                viewportHeight / monitorHeight,
            ) * MONITOR_ANCHOR.overscan;

            const createTransform = (scale, alignment) => {
                const alignedCenterX = monitorCenterX + (viewportWidth / 2 - monitorCenterX) * alignment;
                const alignedCenterY = monitorCenterY + (viewportHeight / 2 - monitorCenterY) * alignment;
                const translateX = alignedCenterX - monitorCenterX * scale;
                const translateY = alignedCenterY - monitorCenterY * scale;

                return {
                    value: `translate3d(${translateX.toFixed(3)}px, ${translateY.toFixed(3)}px, 0) scale(${scale.toFixed(5)})`,
                    translateX,
                    translateY,
                };
            };

            const finalTransform = createTransform(finalScale, 1);

            return {
                viewportWidth,
                viewportHeight,
                coverScale,
                cropOffsetX,
                cropOffsetY,
                monitorCenterX,
                monitorCenterY,
                monitorWidth,
                monitorHeight,
                finalScale,
                finalTranslateX: finalTransform.translateX,
                finalTranslateY: finalTransform.translateY,
                transforms: {
                    start: createTransform(1, 0).value,
                    approach: createTransform(1.04, 0.12).value,
                    accelerate: createTransform(1.36, 0.58).value,
                    cover: createTransform(Math.max(1.78, finalScale * 0.76), 0.82).value,
                    final: finalTransform.value,
                },
            };
        }

        async playMonitorDiveTransition() {
            if (
                typeof this.cameraLayer.animate !== 'function'
                || typeof this.brandMark.animate !== 'function'
                || typeof this.heroLayer.animate !== 'function'
            ) {
                await this.playReducedTransition();
                return;
            }

            const geometry = this.getDiveGeometry();
            const duration = TIMING.DIVE_DURATION_MS;
            const revealOffset = TIMING.DIVE_HERO_REVEAL_OFFSET;

            this.heroLayer.classList.add('is-mounted', 'is-transitioning');

            const cameraAnimation = this.trackTransitionAnimation(
                this.cameraLayer.animate(
                    [
                        { offset: 0, opacity: 1, transform: geometry.transforms.start },
                        { offset: 0.2, opacity: 1, transform: geometry.transforms.approach },
                        { offset: 0.6, opacity: 1, transform: geometry.transforms.accelerate },
                        { offset: revealOffset, opacity: 1, transform: geometry.transforms.cover },
                        { offset: 1, opacity: 0, transform: geometry.transforms.final },
                    ],
                    {
                        duration,
                        easing: DIVE_EASING,
                        fill: 'both',
                    },
                ),
            );
            const brandAnimation = this.trackTransitionAnimation(
                this.brandMark.animate(
                    [
                        { offset: 0, opacity: 1 },
                        { offset: 0.17, opacity: 1 },
                        { offset: 0.45, opacity: 0 },
                        { offset: 1, opacity: 0 },
                    ],
                    {
                        duration,
                        easing: 'cubic-bezier(0.4, 0, 0.7, 1)',
                        fill: 'both',
                    },
                ),
            );
            const heroAnimation = this.trackTransitionAnimation(
                this.heroLayer.animate(
                    [
                        { offset: 0, opacity: 0 },
                        { offset: revealOffset, opacity: 0 },
                        { offset: 1, opacity: 1 },
                    ],
                    {
                        duration,
                        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                        fill: 'both',
                    },
                ),
            );

            this.root.dispatchEvent(
                new CustomEvent('t1:monitor-dive', {
                    detail: {
                        duration,
                        easing: DIVE_EASING,
                        monitorAnchor: MONITOR_ANCHOR,
                        finalScale: geometry.finalScale,
                        finalTranslateX: geometry.finalTranslateX,
                        finalTranslateY: geometry.finalTranslateY,
                        coverScale: geometry.coverScale,
                        cropOffsetX: geometry.cropOffsetX,
                        cropOffsetY: geometry.cropOffsetY,
                    },
                }),
            );

            const revealState = this.delay(duration * revealOffset).then(() => {
                if (!this.destroyed && this.root.dataset.state === STATE.DIVING) {
                    this.setState(STATE.REVEALING_HERO);
                }
            });
            const heroEntryOffset = revealOffset
                + (1 - revealOffset) * TIMING.HERO_ENTRY_VISIBILITY_RATIO;
            const heroEntryTrigger = this.delay(duration * heroEntryOffset).then(() => {
                if (!this.destroyed) {
                    this.startHeroEntranceOnce();
                }
            });

            await Promise.all([
                this.waitForAnimation(cameraAnimation),
                this.waitForAnimation(brandAnimation),
                this.waitForAnimation(heroAnimation),
                revealState,
                heroEntryTrigger,
            ]);

            if (!this.destroyed) {
                await this.finishHeroSwap();
            }
        }

        async playReducedTransition() {
            const duration = TIMING.REDUCED_TRANSITION_MS;
            this.heroLayer.classList.add('is-mounted', 'is-transitioning');

            if (
                typeof this.cameraLayer.animate !== 'function'
                || typeof this.brandMark.animate !== 'function'
                || typeof this.heroLayer.animate !== 'function'
            ) {
                this.setState(STATE.REVEALING_HERO);
                await this.finishHeroSwap();
                return;
            }

            const cameraAnimation = this.trackTransitionAnimation(
                this.cameraLayer.animate(
                    [
                        { opacity: 1 },
                        { opacity: 0 },
                    ],
                    {
                        duration,
                        easing: 'ease-out',
                        fill: 'both',
                    },
                ),
            );
            const brandAnimation = this.trackTransitionAnimation(
                this.brandMark.animate(
                    [
                        { opacity: 1 },
                        { opacity: 0 },
                    ],
                    {
                        duration,
                        easing: 'ease-out',
                        fill: 'both',
                    },
                ),
            );
            const heroAnimation = this.trackTransitionAnimation(
                this.heroLayer.animate(
                    [
                        { opacity: 0 },
                        { opacity: 1 },
                    ],
                    {
                        duration,
                        easing: 'ease-out',
                        fill: 'both',
                    },
                ),
            );

            this.setState(STATE.REVEALING_HERO);
            this.startHeroEntranceOnce();
            await Promise.all([
                this.waitForAnimation(cameraAnimation),
                this.waitForAnimation(brandAnimation),
                this.waitForAnimation(heroAnimation),
            ]);

            if (!this.destroyed) {
                await this.finishHeroSwap();
            }
        }

        async finishHeroSwap() {
            this.heroLayer.classList.add('is-visible');
            this.heroLayer.classList.remove('is-transitioning');
            this.heroLayer.removeAttribute('aria-hidden');
            this.heroLayer.removeAttribute('inert');
            this.cameraLayer.hidden = true;
            this.cancelTransitionAnimations();
            this.logoSettleAnimation?.cancel();
            this.logoSettleAnimation = null;
            this.root.classList.remove('is-diving');
            this.setState(STATE.HERO_ENTERING);
            this.startHeroEntranceOnce();

            if (this.destroyed) {
                return;
            }

            await this.heroEntrancePromise;

            if (!this.destroyed) {
                this.setState(STATE.COMPLETE);
                this.status.textContent = 'T1 Hero가 준비되었습니다.';
            }
        }

        startHeroEntranceOnce() {
            if (this.heroEntrancePromise || this.destroyed) {
                return this.heroEntrancePromise;
            }

            this.heroEntrancePromise = this.playHeroEntrance();
            this.root.dispatchEvent(
                new CustomEvent('t1:hero-entry-start', {
                    detail: {
                        visibilityRatio: TIMING.HERO_ENTRY_VISIBILITY_RATIO,
                    },
                }),
            );
            return this.heroEntrancePromise;
        }

        async playHeroEntrance() {
            if (this.hasHeroEntered) {
                return;
            }

            this.hasHeroEntered = true;
            this.heroLayer.dataset.heroState = 'entering';

            if (this.reducedMotion.matches || typeof this.heroWordmark.animate !== 'function') {
                this.showHeroFinalState();
                return;
            }

            await Promise.all(
                [
                    this.playHeroAnimation(
                        this.heroWordmark,
                        [
                            { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
                            { opacity: 1, clipPath: 'inset(0 0 0 0)' },
                        ],
                        {
                            duration: TIMING.HERO_WORDMARK_MS,
                            easing: REVEAL_EASING,
                            fill: 'both',
                        },
                    ),
                    this.playHeroAnimation(
                        this.heroHeadlineLead,
                        [
                            { opacity: 0, transform: 'translateY(16px)' },
                            { opacity: 1, transform: 'translateY(0)' },
                        ],
                        {
                            duration: TIMING.HERO_LEAD_MS,
                            delay: TIMING.HERO_LEAD_START_MS,
                            easing: REVEAL_EASING,
                            fill: 'both',
                        },
                    ),
                    ...this.heroHeadlineMain.map((line) => {
                        return this.playHeroAnimation(
                            line,
                            [
                                {
                                    color: '#3a3a40',
                                    opacity: 0,
                                    transform: 'translateY(16px)',
                                },
                                {
                                    color: '#f5f5f7',
                                    opacity: 1,
                                    transform: 'translateY(0)',
                                },
                            ],
                            {
                                duration: TIMING.HERO_MAIN_MS,
                                delay: TIMING.HERO_MAIN_START_MS,
                                easing: REVEAL_EASING,
                                fill: 'both',
                            },
                        );
                    }),
                    this.playHeroSecondary(
                        this.heroIntroduction,
                        TIMING.HERO_INTRO_START_MS,
                    ),
                    this.playHeroSecondary(
                        this.heroCredit,
                        TIMING.HERO_CREDIT_START_MS,
                    ),
                    ...this.heroActions.map((element, index) => {
                        return this.playHeroSecondary(
                            element,
                            TIMING.HERO_ACTION_START_MS + index * TIMING.HERO_ACTION_STAGGER_MS,
                        );
                    }),
                ],
            );

            this.showHeroFinalState();
        }

        playHeroSecondary(element, delay) {
            return this.playHeroAnimation(
                element,
                [
                    { opacity: 0, transform: 'translateY(12px)' },
                    { opacity: 1, transform: 'translateY(0)' },
                ],
                {
                    duration: TIMING.HERO_SECONDARY_MS,
                    delay,
                    easing: REVEAL_EASING,
                    fill: 'both',
                },
            );
        }

        async playHeroAnimation(element, keyframes, options) {
            if (this.destroyed || !element) {
                return;
            }

            if (typeof element.animate !== 'function') {
                element.classList.add('is-revealed');
                return;
            }

            const animation = element.animate(keyframes, options);
            this.heroAnimations.add(animation);
            await this.waitForAnimation(animation);

            if (!this.destroyed) {
                element.classList.add('is-revealed');
            }

            animation.cancel();
            this.heroAnimations.delete(animation);
        }

        showHeroFinalState() {
            [
                this.heroWordmark,
                this.heroHeadlineLead,
                ...this.heroHeadlineMain,
                ...this.heroSecondary,
            ].filter(Boolean).forEach((element) => element.classList.add('is-revealed'));
            this.heroLayer.dataset.heroState = 'complete';
        }

        showHeroImmediately() {
            if (!this.heroLayer || !this.cameraLayer) {
                return;
            }

            this.heroLayer.classList.add('is-mounted', 'is-visible');
            this.heroLayer.classList.remove('is-transitioning');
            this.heroLayer.removeAttribute('aria-hidden');
            this.heroLayer.removeAttribute('inert');
            this.cameraLayer.hidden = true;
            this.root.classList.remove('is-diving');
            this.cancelTransitionAnimations();
            this.cancelHeroAnimations();
            this.showHeroFinalState();
            this.setState(STATE.COMPLETE);
        }

        trackTransitionAnimation(animation) {
            this.transitionAnimations.add(animation);
            return animation;
        }

        waitForAnimation(animation) {
            if (!animation) {
                return Promise.resolve();
            }

            return animation.finished.catch(() => undefined);
        }

        cancelTransitionAnimations() {
            this.transitionAnimations.forEach((animation) => animation.cancel());
            this.transitionAnimations.clear();
        }

        cancelHeroAnimations() {
            this.heroAnimations.forEach((animation) => animation.cancel());
            this.heroAnimations.clear();
        }

        waitForHeroReady() {
            return Promise.all([
                this.waitForImages(this.heroAssets),
                this.waitForFonts(),
            ]).then(([imagesReady]) => imagesReady);
        }

        waitForFonts() {
            if (!document.fonts || !document.fonts.ready) {
                return Promise.resolve();
            }

            return document.fonts.ready.catch(() => undefined);
        }

        waitForImages(images) {
            return Promise.all(images.map((image) => this.waitForImage(image))).then((results) => {
                return results.every(Boolean);
            });
        }

        waitForImage(image) {
            if (image.complete) {
                if (image.naturalWidth <= 0) {
                    return Promise.resolve(false);
                }

                return typeof image.decode === 'function'
                    ? image.decode().then(() => true).catch(() => image.naturalWidth > 0)
                    : Promise.resolve(true);
            }

            return new Promise((resolve) => {
                const finish = (ready) => {
                    image.removeEventListener('load', handleLoad);
                    image.removeEventListener('error', handleError);
                    this.abortController.signal.removeEventListener('abort', handleAbort);
                    resolve(ready);
                };
                const handleLoad = () => finish(image.naturalWidth > 0);
                const handleError = () => finish(false);
                const handleAbort = () => finish(false);

                image.addEventListener('load', handleLoad, { once: true, signal: this.abortController.signal });
                image.addEventListener('error', handleError, { once: true, signal: this.abortController.signal });
                this.abortController.signal.addEventListener('abort', handleAbort, { once: true });
            });
        }

        reportLoadingFailure() {
            if (!this.destroyed && this.status) {
                this.status.textContent = 'T1 화면을 불러오지 못했습니다.';
            }
        }

        delay(duration) {
            return new Promise((resolve) => {
                const timer = window.setTimeout(() => {
                    this.delayTimers.delete(timer);
                    resolve();
                }, Math.max(0, duration));

                this.delayTimers.set(timer, resolve);
            });
        }

        revealStars() {
            return new Promise((resolve) => {
                this.resolveStarsReady = resolve;

                this.stars.forEach((star, index) => {
                    const revealTimer = window.setTimeout(() => {
                        this.starTimers.delete(revealTimer);
                        star.classList.add('is-visible');

                        if (index === this.stars.length - 1) {
                            const completeTimer = window.setTimeout(() => {
                                this.starTimers.delete(completeTimer);
                                this.finishStarReveal();
                            }, TIMING.STAR_REVEAL_MS);

                            this.starTimers.add(completeTimer);
                        }
                    }, index * TIMING.STAR_STAGGER_MS);

                    this.starTimers.add(revealTimer);
                });
            });
        }

        revealAllStars() {
            this.clearStarTimers();
            this.stars.forEach((star) => star.classList.add('is-visible'));
            this.finishStarReveal();
            return Promise.resolve();
        }

        finishStarReveal() {
            if (!this.resolveStarsReady) {
                return;
            }

            this.resolveStarsReady();
            this.resolveStarsReady = null;
        }

        clearStarTimers() {
            this.starTimers.forEach((timer) => window.clearTimeout(timer));
            this.starTimers.clear();
        }

        scheduleFirstPulse() {
            this.pulseStartTimer = window.setTimeout(
                () => this.startPulse(),
                TIMING.FIRST_PULSE_DELAY_MS,
            );
        }

        startPulse() {
            if (this.destroyed || this.root.dataset.state !== STATE.LOADING || this.reducedMotion.matches) {
                return;
            }

            this.brandMark.classList.remove('is-pulsing');
            void this.brandMark.offsetWidth;
            this.brandMark.classList.add('is-pulsing');

            this.pulseEndTimer = window.setTimeout(() => {
                this.brandMark.classList.remove('is-pulsing');
                this.pulseEndTimer = 0;
            }, TIMING.PULSE_DURATION_MS);

            const nextInterval = getRandomPulseInterval();
            this.root.dispatchEvent(
                new CustomEvent('t1:pulse', {
                    detail: { nextInterval },
                }),
            );

            this.pulseStartTimer = window.setTimeout(() => this.startPulse(), nextInterval);
        }

        stopPulseScheduler() {
            window.clearTimeout(this.pulseStartTimer);
            window.clearTimeout(this.pulseEndTimer);
            this.pulseStartTimer = 0;
            this.pulseEndTimer = 0;
        }

        settleGlow(duration) {
            const animatedLayers = [
                {
                    element: this.root.querySelector('[data-logo-glow-close]'),
                    targetOpacity: '0',
                    targetFilter: 'blur(8px)',
                },
                {
                    element: this.root.querySelector('[data-logo-glow-wide]'),
                    targetOpacity: '0',
                    targetFilter: 'blur(24px)',
                },
            ].filter(({ element }) => element);

            animatedLayers.forEach(({ element }) => {
                const computedStyle = window.getComputedStyle(element);
                element.style.animation = 'none';
                element.style.transition = 'none';
                element.style.opacity = computedStyle.opacity;
                element.style.filter = computedStyle.filter;
                element.style.willChange = duration > 0 ? 'opacity, filter' : 'auto';
            });

            this.brandMark.classList.remove('is-pulsing');
            void this.brandMark.offsetWidth;

            animatedLayers.forEach(({ element, targetOpacity, targetFilter }) => {
                element.style.transition = duration > 0
                    ? `opacity ${duration}ms ease-out, filter ${duration}ms ease-out`
                    : 'none';
                element.style.opacity = targetOpacity;
                element.style.filter = targetFilter;
            });

            return this.delay(duration).then(() => {
                animatedLayers.forEach(({ element }) => {
                    element.style.animation = '';
                    element.style.transition = '';
                    element.style.opacity = '';
                    element.style.filter = '';
                    element.style.willChange = '';
                });
            });
        }

        destroy() {
            if (this.destroyed) {
                return;
            }

            this.destroyed = true;
            this.abortController.abort();
            this.clearStarTimers();
            this.finishStarReveal();
            this.stopPulseScheduler();
            this.delayTimers.forEach((resolve, timer) => {
                window.clearTimeout(timer);
                resolve();
            });
            this.delayTimers.clear();
            this.openingAnimation?.cancel();
            this.openingAnimation = null;
            this.logoSettleAnimation?.cancel();
            this.logoSettleAnimation = null;
            this.cancelTransitionAnimations();
            this.cancelHeroAnimations();
            this.root.classList.remove('is-lighting', 'is-diving', 'is-interaction-ready');
        }
    }

    class HistorySectionMotion {
        constructor(section) {
            this.section = section;
            this.content = section.querySelector('[data-history-content]');
            this.title = section.querySelector('.section-history__title');
            this.cards = Array.from(section.querySelectorAll('[data-history-card]'));
            this.images = Array.from(section.querySelectorAll('.history-card__media img'));
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.abortController = new AbortController();
            this.observer = null;
            this.hasHistoryEntered = section.dataset.historyEntered === 'true';
            this.isEntryScheduled = false;
            this.isInputLocked = false;
            this.fallbackVisible = false;
            this.settleTimer = 0;
            this.completionTimer = 0;
            this.destroyed = false;
            this.handlePageActive = () => this.onPageActive();
            this.handleMotionPreference = (event) => this.onMotionPreference(event);
        }

        init() {
            if (this.section.dataset.historyMotionInitialized === 'true') {
                return;
            }

            if (!this.hasRequiredElements()) {
                document.documentElement.classList.add('history-motion-fallback');
                return;
            }

            this.section.dataset.historyMotionInitialized = 'true';
            const signal = this.abortController.signal;

            if (this.hasHistoryEntered) {
                this.showImmediately();
                return;
            }

            this.section.classList.add('is-history-motion-ready');
            window.addEventListener('pagehide', () => this.destroy(), { once: true, signal });
            this.reducedMotion.addEventListener(
                'change',
                this.handleMotionPreference,
                { signal },
            );

            if (this.section.hasAttribute('data-scroll-page')) {
                this.section.addEventListener(
                    't1:scroll-page-active',
                    this.handlePageActive,
                    { signal },
                );

                if (this.section.dataset.scrollPageActive === 'true') {
                    this.onPageActive();
                }

                return;
            }

            this.observeSection();
        }

        hasRequiredElements() {
            return Boolean(
                this.content
                && this.title
                && this.cards.length === 4
                && this.images.length === 4,
            );
        }

        onPageActive() {
            if (this.section.dataset.scrollPageActive !== 'true') {
                return;
            }

            if (this.reducedMotion.matches) {
                this.showImmediately();
                return;
            }

            this.scheduleEntry();
        }

        onMotionPreference(event) {
            if (event.matches && this.isReadyToEnter()) {
                this.showImmediately();
            }
        }

        observeSection() {
            if (this.observer) {
                return;
            }

            if (typeof IntersectionObserver !== 'function') {
                this.showImmediately();
                return;
            }

            this.observer = new IntersectionObserver(
                (entries) => {
                    const visibleEntry = entries.find((entry) => {
                        return entry.isIntersecting && entry.intersectionRatio >= 0.55;
                    });

                    if (!visibleEntry) {
                        return;
                    }

                    this.fallbackVisible = true;

                    if (this.reducedMotion.matches) {
                        this.showImmediately();
                        return;
                    }

                    this.scheduleEntry();
                },
                { threshold: 0.55 },
            );
            this.observer.observe(this.section);
        }

        isReadyToEnter() {
            const introSequence = document.querySelector('[data-intro-sequence]');
            const hero = introSequence?.querySelector('[data-hero-layer]');
            const sectionTop = this.section.getBoundingClientRect().top;
            const usesPageState = this.section.hasAttribute('data-scroll-page');
            const isActive = usesPageState
                ? this.section.dataset.scrollPageActive === 'true'
                : this.fallbackVisible;

            return Boolean(
                (!introSequence || introSequence.dataset.state === STATE.COMPLETE)
                && (!hero || hero.dataset.heroState === 'complete')
                && introSequence?.dataset.pageTransitioning !== 'true'
                && isActive
                && (
                    !usesPageState
                    || Math.abs(sectionTop) <= PAGE_SCROLL_BOUNDARY_TOLERANCE_PX
                ),
            );
        }

        scheduleEntry() {
            if (
                this.destroyed
                || this.hasHistoryEntered
                || this.isEntryScheduled
                || !this.isReadyToEnter()
            ) {
                return;
            }

            this.isEntryScheduled = true;
            this.setPageInputLock(true);

            if (this.reducedMotion.matches) {
                this.showImmediately();
                return;
            }

            this.waitForImages().then(() => {
                if (this.destroyed) {
                    return;
                }

                if (!this.isReadyToEnter()) {
                    this.cancelScheduledEntry();
                    return;
                }

                this.settleTimer = window.setTimeout(
                    () => this.startEntry(),
                    HISTORY_ENTRY_SETTLE_DELAY_MS,
                );
            });
        }

        waitForImages() {
            const signal = this.abortController.signal;

            return Promise.all(this.images.map((image) => {
                if (image.complete) {
                    return Promise.resolve();
                }

                return new Promise((resolve) => {
                    const finish = () => resolve();
                    image.addEventListener('load', finish, { once: true, signal });
                    image.addEventListener('error', finish, { once: true, signal });
                    signal.addEventListener('abort', finish, { once: true });
                });
            }));
        }

        startEntry() {
            this.settleTimer = 0;

            if (this.destroyed || this.hasHistoryEntered || !this.isReadyToEnter()) {
                this.cancelScheduledEntry();
                return;
            }

            this.hasHistoryEntered = true;
            this.section.dataset.historyEntered = 'true';
            this.section.classList.add('is-history-entry-playing');
            this.completionTimer = window.setTimeout(
                () => this.completeEntry(),
                HISTORY_ENTRY_TIMELINE_MS,
            );
        }

        completeEntry() {
            this.completionTimer = 0;
            this.isEntryScheduled = false;
            this.section.classList.add('is-history-entered');
            this.section.classList.remove('is-history-motion-ready', 'is-history-entry-playing');
            this.disconnectObserver();
            this.setPageInputLock(false);
            this.section.dispatchEvent(new CustomEvent('t1:history-entry-complete'));
        }

        cancelScheduledEntry() {
            window.clearTimeout(this.settleTimer);
            this.settleTimer = 0;
            this.isEntryScheduled = false;
            this.setPageInputLock(false);
        }

        setPageInputLock(locked) {
            if (this.isInputLocked === locked) {
                return;
            }

            this.isInputLocked = locked;
            document.dispatchEvent(
                new CustomEvent('t1:page-content-lock', {
                    detail: {
                        locked,
                        page: this.section,
                        source: 'history-entry',
                    },
                }),
            );
        }

        showImmediately() {
            if (this.destroyed) {
                return;
            }

            window.clearTimeout(this.settleTimer);
            window.clearTimeout(this.completionTimer);
            this.settleTimer = 0;
            this.completionTimer = 0;
            this.hasHistoryEntered = true;
            this.isEntryScheduled = false;
            this.section.dataset.historyEntered = 'true';
            this.section.classList.add('is-history-entered');
            this.section.classList.remove('is-history-motion-ready', 'is-history-entry-playing');
            this.disconnectObserver();
            this.setPageInputLock(false);
        }

        disconnectObserver() {
            this.observer?.disconnect();
            this.observer = null;
        }

        destroy() {
            if (this.destroyed) {
                return;
            }

            this.destroyed = true;
            window.clearTimeout(this.settleTimer);
            window.clearTimeout(this.completionTimer);
            this.settleTimer = 0;
            this.completionTimer = 0;
            this.setPageInputLock(false);
            this.disconnectObserver();
            this.abortController.abort();
            this.section.classList.add('is-history-entered');
            this.section.classList.remove('is-history-motion-ready', 'is-history-entry-playing');
        }
    }

    class BrandImpactMotion {
        constructor(section) {
            this.section = section;
            this.stats = section.querySelector('.brand-impact-stats');
            this.numbers = Array.from(section.querySelectorAll('.count-number[data-target]'));
            this.revealElements = Array.from(
                section.querySelectorAll('[data-brand-impact-reveal]'),
            );
            this.mediaElements = Array.from(
                section.querySelectorAll('[data-brand-impact-reveal="media"]'),
            );
            this.initialMediaElements = this.mediaElements.slice(0, 3);
            this.deferredElements = this.revealElements.filter((element) => {
                return element !== this.stats && !this.initialMediaElements.includes(element);
            });
            this.pageRoot = document.querySelector('[data-intro-sequence]');
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.abortController = new AbortController();
            this.observer = null;
            this.revealObserver = null;
            this.animationFrameId = 0;
            this.lastObservedScrollY = window.scrollY;
            this.hasStarted = false;
            this.hasCompleted = false;
            this.destroyed = false;
            this.handlePageActive = () => this.onPageActive();
            this.handleMotionPreference = (event) => {
                if (event.matches && this.hasStarted) {
                    this.revealAllImmediately();
                    this.showFinalValues();
                }
            };
        }

        init() {
            if (
                !this.hasRequiredElements()
                || this.section.dataset.brandImpactMotionInitialized === 'true'
            ) {
                return;
            }

            this.section.dataset.brandImpactMotionInitialized = 'true';
            const signal = this.abortController.signal;

            window.addEventListener('pagehide', () => this.destroy(), { once: true, signal });
            this.reducedMotion.addEventListener('change', this.handleMotionPreference, { signal });

            if (this.section.hasAttribute('data-scroll-page')) {
                this.section.addEventListener('t1:scroll-page-active', this.handlePageActive, {
                    signal,
                });

                if (this.section.dataset.scrollPageActive === 'true') {
                    this.start();
                }

                return;
            }

            this.observeStats();
        }

        hasRequiredElements() {
            return Boolean(
                this.stats
                && this.numbers.length === 4
                && this.numbers.every((element) => Number.isFinite(Number(element.dataset.target)))
                && this.stats.dataset.brandImpactReveal === 'stats'
                && this.mediaElements.length === 6
                && this.deferredElements.length > 0,
            );
        }

        onPageActive() {
            if (this.section.dataset.scrollPageActive === 'true') {
                this.start();
            }
        }

        observeStats() {
            if (typeof IntersectionObserver !== 'function' || this.observer) {
                return;
            }

            this.observer = new IntersectionObserver(
                (entries) => {
                    const currentScrollY = window.scrollY;
                    const isScrollingTowardSection = currentScrollY >= this.lastObservedScrollY;
                    const sectionBounds = this.section.getBoundingClientRect();
                    const topTolerance = Math.max(16, window.innerHeight * 0.08);
                    const isSectionTopAligned = Math.abs(sectionBounds.top) <= topTolerance;
                    const isVisible = entries.some((entry) => {
                        return entry.isIntersecting && entry.intersectionRatio >= 0.6;
                    });
                    this.lastObservedScrollY = currentScrollY;

                    if (
                        isVisible
                        && isScrollingTowardSection
                        && isSectionTopAligned
                        && !this.isPageTransitioning()
                    ) {
                        this.start();
                    }
                },
                { threshold: 0.6 },
            );
            this.observer.observe(this.stats);
        }

        isPageTransitioning() {
            return this.pageRoot?.dataset.pageTransitioning === 'true';
        }

        start() {
            if (
                this.hasStarted
                || this.destroyed
                || this.isPageTransitioning()
            ) {
                return;
            }

            this.hasStarted = true;
            this.disconnectObserver();
            this.section.classList.add('is-brand-impact-active');

            if (this.reducedMotion.matches || typeof window.requestAnimationFrame !== 'function') {
                this.revealAllImmediately();
                this.showFinalValues();
                return;
            }

            this.revealElement(this.stats);
            this.startCountUp();
            this.revealElementsWithStagger(this.initialMediaElements, 140, 70);
            this.observeDeferredElements();
        }

        startCountUp() {
            if (this.hasCompleted || this.destroyed) {
                return;
            }

            const counters = this.numbers.map((element) => {
                const target = Number(element.dataset.target);
                const finalWidth = element.getBoundingClientRect().width;

                if (finalWidth > 0) {
                    element.style.display = 'inline-block';
                    element.style.width = `${finalWidth}px`;
                }

                element.textContent = '0';
                return { element, target };
            });
            const startedAt = window.performance.now();

            const update = (timestamp) => {
                if (this.destroyed || this.hasCompleted) {
                    return;
                }

                const progress = Math.min(
                    1,
                    Math.max(0, (timestamp - startedAt) / BRAND_IMPACT_COUNT_DURATION_MS),
                );
                const easedProgress = this.easeOutExpo(progress);

                counters.forEach(({ element, target }) => {
                    element.textContent = String(
                        progress === 1
                            ? target
                            : Math.min(target, Math.round(target * easedProgress)),
                    );
                });

                if (progress < 1) {
                    this.animationFrameId = window.requestAnimationFrame(update);
                    return;
                }

                this.animationFrameId = 0;
                this.hasCompleted = true;
            };

            this.animationFrameId = window.requestAnimationFrame(update);
        }

        revealElement(element, delay = 0) {
            if (!element || element.classList.contains('is-revealed')) {
                return;
            }

            element.style.setProperty('--brand-impact-reveal-delay', `${delay}ms`);
            element.classList.add('is-revealed');
        }

        revealElementsWithStagger(elements, initialDelay = 0, stagger = 0) {
            elements.forEach((element, index) => {
                this.revealElement(element, initialDelay + (index * stagger));
            });
        }

        observeDeferredElements() {
            if (this.deferredElements.length === 0) {
                return;
            }

            if (typeof IntersectionObserver !== 'function') {
                this.revealElementsWithStagger(this.deferredElements, 0, 70);
                return;
            }

            this.revealObserver = new IntersectionObserver(
                (entries) => {
                    const visibleEntries = entries
                        .filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.2)
                        .sort((entryA, entryB) => {
                            return entryA.boundingClientRect.top - entryB.boundingClientRect.top;
                        });

                    visibleEntries.forEach((entry, index) => {
                        this.revealElement(entry.target, index * 70);
                        this.revealObserver?.unobserve(entry.target);
                    });

                    if (this.deferredElements.every((element) => {
                        return element.classList.contains('is-revealed');
                    })) {
                        this.disconnectRevealObserver();
                    }
                },
                {
                    rootMargin: '0px 0px -12% 0px',
                    threshold: 0.2,
                },
            );

            this.deferredElements.forEach((element) => this.revealObserver.observe(element));
        }

        revealAllImmediately() {
            this.disconnectRevealObserver();
            this.revealElements.forEach((element) => {
                element.style.setProperty('--brand-impact-reveal-delay', '0ms');
                element.classList.add('is-revealed');
            });
        }

        easeOutExpo(progress) {
            return progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        }

        showFinalValues() {
            if (this.destroyed) {
                return;
            }

            window.cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = 0;
            this.hasStarted = true;
            this.hasCompleted = true;
            this.disconnectObserver();
            this.numbers.forEach((element) => {
                element.textContent = element.dataset.target;
            });
        }

        disconnectObserver() {
            this.observer?.disconnect();
            this.observer = null;
        }

        disconnectRevealObserver() {
            this.revealObserver?.disconnect();
            this.revealObserver = null;
        }

        destroy() {
            if (this.destroyed) {
                return;
            }

            this.showFinalValues();
            this.disconnectRevealObserver();
            this.abortController.abort();
            this.destroyed = true;
        }
    }

    const clampSponsorIndex = (index) => {
        return Math.min(SPONSORS.length - 1, Math.max(0, index));
    };

    const calculateSponsorTranslate = (axisCenterY, slotCenterY) => {
        return axisCenterY - slotCenterY;
    };

    class SponsorTrackController {
        constructor(section) {
            this.section = section;
            this.viewport = section.querySelector('[data-sponsor-track]');
            this.track = section.querySelector('[data-sponsor-list]');
            this.formulaAxis = section.querySelector('[data-partner-formula-axis]');
            this.status = section.querySelector('[data-sponsor-status]');
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.interactionMode = window.matchMedia(
                '(hover: hover) and (pointer: fine) and (min-width: 1280px)',
            );
            this.abortController = new AbortController();
            this.slots = [];
            this.slotCenters = [];
            this.axisCenterY = 0;
            this.activeIndex = SPONSOR_INITIAL_INDEX;
            this.targetIndex = null;
            this.currentTranslateY = 0;
            this.isAnimating = false;
            this.isSettling = false;
            this.pageInputLocked = false;
            this.trackAnimation = null;
            this.resizeFrameId = 0;
            this.settleTimer = 0;
            this.wheelResetTimer = 0;
            this.wheelDirection = 0;
            this.wheelAccumulator = 0;
            this.boundaryTimer = 0;
            this.boundaryDirection = 0;
            this.boundaryAccumulator = 0;
            this.boundaryReleaseReady = false;
            this.handleWheel = (event) => this.onWheel(event);
            this.handleKeyDown = (event) => this.onKeyDown(event);
            this.handleResize = () => this.requestLayoutSync();
            this.handleInteractionMode = () => this.onInteractionModeChange();
            this.handleMotionPreference = () => this.onMotionPreferenceChange();
        }

        init() {
            if (
                !this.viewport
                || !this.track
                || !this.formulaAxis
                || this.section.dataset.sponsorTrackInitialized === 'true'
            ) {
                return;
            }

            this.section.dataset.sponsorTrackInitialized = 'true';
            this.section.dataset.sponsorTransitioning = 'false';
            this.renderSponsors();

            const signal = this.abortController.signal;
            this.viewport.addEventListener('wheel', this.handleWheel, {
                passive: false,
                signal,
            });
            this.viewport.addEventListener('keydown', this.handleKeyDown, { signal });
            window.addEventListener('resize', this.handleResize, { passive: true, signal });
            window.addEventListener('pagehide', () => this.destroy(), { once: true, signal });
            this.interactionMode.addEventListener('change', this.handleInteractionMode, { signal });
            this.reducedMotion.addEventListener('change', this.handleMotionPreference, { signal });

            this.onInteractionModeChange();
        }

        renderSponsors() {
            const fragment = document.createDocumentFragment();

            SPONSORS.forEach((sponsor, index) => {
                const slot = document.createElement('li');
                const visual = document.createElement('div');
                const crop = document.createElement('div');
                const image = document.createElement('img');
                const inactiveFrame = document.createElement('img');
                const activeFrame = document.createElement('img');
                const slotId = `global-partner-${sponsor.id}`;

                slot.id = slotId;
                slot.className = 'global-partners-sponsor';
                slot.dataset.sponsorIndex = String(index);
                slot.dataset.nodeId = sponsor.nodeId;
                slot.setAttribute('aria-label', sponsor.name);
                slot.setAttribute('aria-posinset', String(index + 1));
                slot.setAttribute('aria-setsize', String(SPONSORS.length));

                visual.className = 'global-partners-sponsor__visual';
                crop.className = 'global-partners-sponsor__crop';
                image.className = 'global-partners-sponsor__image';
                image.src = sponsor.src;
                image.alt = `${sponsor.name} 로고`;
                image.width = sponsor.width;
                image.height = sponsor.height;
                image.loading = 'lazy';
                image.decoding = 'async';
                image.setAttribute('fetchpriority', 'low');
                image.dataset.cropMode = sponsor.crop.mode || 'positioned';
                image.style.setProperty('--sponsor-image-width', `${sponsor.crop.width}%`);
                image.style.setProperty('--sponsor-image-height', `${sponsor.crop.height}%`);
                image.style.setProperty('--sponsor-image-left', `${sponsor.crop.left}%`);
                image.style.setProperty('--sponsor-image-top', `${sponsor.crop.top}%`);

                inactiveFrame.className = 'global-partners-sponsor__frame global-partners-sponsor__frame--inactive';
                inactiveFrame.src = SPONSOR_FRAME_INACTIVE;
                inactiveFrame.alt = '';
                inactiveFrame.setAttribute('aria-hidden', 'true');

                activeFrame.className = 'global-partners-sponsor__frame global-partners-sponsor__frame--active';
                activeFrame.src = SPONSOR_FRAME_ACTIVE;
                activeFrame.alt = '';
                activeFrame.setAttribute('aria-hidden', 'true');

                crop.append(image);
                visual.append(crop, inactiveFrame, activeFrame);
                slot.append(visual);
                fragment.append(slot);
            });

            this.track.replaceChildren(fragment);
            this.slots = Array.from(this.track.children);
            this.setActiveSlot(this.activeIndex, false);
        }

        setActiveSlot(index, announce = true) {
            const clampedIndex = clampSponsorIndex(index);

            this.slots.forEach((slot, slotIndex) => {
                const isActive = slotIndex === clampedIndex;
                slot.classList.toggle('is-active', isActive);
                slot.classList.remove('is-target', 'is-leaving');

                if (isActive) {
                    slot.setAttribute('aria-current', 'true');
                } else {
                    slot.removeAttribute('aria-current');
                }
            });

            this.activeIndex = clampedIndex;
            this.section.dataset.activeSponsor = String(clampedIndex + 1);
            this.viewport.setAttribute('aria-activedescendant', this.slots[clampedIndex].id);

            if (this.status) {
                const sponsor = SPONSORS[clampedIndex];
                this.status.textContent = announce
                    ? `${sponsor.name}, ${clampedIndex + 1}/${SPONSORS.length}`
                    : '';
            }
        }

        onInteractionModeChange() {
            const isInteractive = this.interactionMode.matches;
            this.viewport.dataset.sponsorTrackInteractive = String(isInteractive);
            this.viewport.tabIndex = isInteractive ? 0 : -1;

            if (!isInteractive) {
                this.finishMoveImmediately();
                this.releasePageInput();
                this.track.style.removeProperty('transform');
                this.viewport.dataset.sponsorTrackReady = 'false';
                return;
            }

            this.requestLayoutSync();
        }

        onMotionPreferenceChange() {
            if (this.reducedMotion.matches) {
                this.finishMoveImmediately();
            }
        }

        requestLayoutSync() {
            if (!this.interactionMode.matches) {
                return;
            }

            window.cancelAnimationFrame(this.resizeFrameId);
            this.resizeFrameId = window.requestAnimationFrame(() => {
                this.resizeFrameId = 0;
                this.syncLayout();
            });
        }

        syncLayout() {
            if (!this.interactionMode.matches || this.slots.length === 0) {
                return;
            }

            this.finishMoveImmediately();

            const viewportBounds = this.viewport.getBoundingClientRect();
            const axisBounds = this.formulaAxis.getBoundingClientRect();
            this.axisCenterY = axisBounds.top + axisBounds.height / 2 - viewportBounds.top;
            this.slotCenters = this.slots.map((slot) => slot.offsetTop + slot.offsetHeight / 2);
            this.currentTranslateY = this.getTargetTranslate(this.activeIndex);
            this.setTrackTransform(this.currentTranslateY);
            this.setCenterError(0);
            this.viewport.dataset.sponsorTrackReady = 'true';
        }

        getTargetTranslate(index) {
            return calculateSponsorTranslate(this.axisCenterY, this.slotCenters[index]);
        }

        setTrackTransform(translateY) {
            const roundedTranslate = Number(translateY.toFixed(3));
            this.track.style.transform = `translate3d(-50%, ${roundedTranslate}px, 0)`;
        }

        normalizeWheelAxis(delta, deltaMode) {
            if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
                return delta * 16;
            }

            if (deltaMode === WheelEvent.DOM_DELTA_PAGE) {
                return delta * window.innerHeight;
            }

            return delta;
        }

        onWheel(event) {
            if (
                !this.interactionMode.matches
                || this.section.dataset.scrollPageActive !== 'true'
                || event.ctrlKey
            ) {
                return;
            }

            const deltaY = this.normalizeWheelAxis(event.deltaY, event.deltaMode);
            const deltaX = this.normalizeWheelAxis(event.deltaX, event.deltaMode);

            if (deltaY === 0 || Math.abs(deltaY) <= Math.abs(deltaX)) {
                this.resetWheelAccumulator();
                return;
            }

            const direction = deltaY > 0 ? 1 : -1;

            if (this.isAnimating || this.isSettling) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            if (
                this.boundaryReleaseReady
                && this.boundaryDirection === direction
                && !this.canMove(direction)
            ) {
                event.preventDefault();
                event.stopPropagation();
                this.resetBoundaryGuard();
                this.resetWheelAccumulator();
                return;
            }

            if (!this.canMove(direction)) {
                event.preventDefault();
                event.stopPropagation();
                this.accumulateBoundaryWheel(Math.abs(deltaY), direction);
                return;
            }

            this.resetBoundaryGuard();
            event.preventDefault();
            event.stopPropagation();
            this.accumulateWheel(Math.abs(deltaY), direction);

            if (this.wheelAccumulator >= SPONSOR_WHEEL_THRESHOLD_PX) {
                this.moveBy(direction, 'wheel');
            }
        }

        onKeyDown(event) {
            if (
                !this.interactionMode.matches
                || this.section.dataset.scrollPageActive !== 'true'
                || event.altKey
                || event.ctrlKey
                || event.metaKey
                || event.repeat
            ) {
                return;
            }

            const direction = event.key === 'ArrowDown'
                ? 1
                : event.key === 'ArrowUp'
                    ? -1
                    : 0;

            if (direction === 0) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            if (!this.isAnimating && !this.isSettling && this.canMove(direction)) {
                this.moveBy(direction, 'keyboard');
            }
        }

        canMove(direction) {
            const targetIndex = this.activeIndex + direction;
            return targetIndex >= 0 && targetIndex < SPONSORS.length;
        }

        accumulateWheel(delta, direction) {
            if (direction !== this.wheelDirection) {
                this.resetWheelAccumulator();
                this.wheelDirection = direction;
            }

            this.wheelAccumulator += delta;
            window.clearTimeout(this.wheelResetTimer);
            this.wheelResetTimer = window.setTimeout(
                () => this.resetWheelAccumulator(),
                SPONSOR_WHEEL_ACCUMULATION_MS,
            );
        }

        accumulateBoundaryWheel(delta, direction) {
            if (direction !== this.boundaryDirection) {
                this.resetBoundaryGuard();
                this.boundaryDirection = direction;
            }

            this.boundaryAccumulator += delta;
            window.clearTimeout(this.boundaryTimer);
            this.boundaryTimer = window.setTimeout(() => {
                if (this.boundaryAccumulator >= SPONSOR_WHEEL_THRESHOLD_PX) {
                    this.boundaryAccumulator = 0;
                    this.boundaryReleaseReady = true;
                    return;
                }

                this.resetBoundaryGuard();
            }, SPONSOR_BOUNDARY_RELEASE_DELAY_MS);
        }

        moveBy(direction, inputType) {
            return this.moveTo(this.activeIndex + direction, inputType);
        }

        moveTo(index, inputType) {
            const nextIndex = clampSponsorIndex(index);

            if (
                this.isAnimating
                || this.isSettling
                || nextIndex === this.activeIndex
                || Math.abs(nextIndex - this.activeIndex) !== 1
                || this.slotCenters.length !== this.slots.length
            ) {
                return false;
            }

            this.isAnimating = true;
            this.targetIndex = nextIndex;
            this.section.dataset.sponsorTransitioning = 'true';
            this.section.dataset.sponsorInput = inputType;
            this.resetWheelAccumulator();
            this.resetBoundaryGuard();
            this.setPageInputLock(true);

            const direction = nextIndex > this.activeIndex ? 1 : -1;
            const targetTranslate = this.getTargetTranslate(nextIndex);
            const distance = targetTranslate - this.currentTranslateY;
            const correction = direction > 0 ? -3 : 3;
            const activeSlot = this.slots[this.activeIndex];
            const targetSlot = this.slots[nextIndex];

            activeSlot.classList.add('is-leaving');
            targetSlot.classList.add('is-target');

            if (this.reducedMotion.matches || typeof this.track.animate !== 'function') {
                this.currentTranslateY = targetTranslate;
                this.setTrackTransform(targetTranslate);
                this.finishMove();
                return true;
            }

            const animation = this.track.animate(
                [
                    {
                        transform: `translate3d(-50%, ${this.currentTranslateY}px, 0)`,
                        offset: 0,
                        easing: SPONSOR_TRACK_EASING,
                    },
                    {
                        transform: `translate3d(-50%, ${this.currentTranslateY + distance * 0.96}px, 0)`,
                        offset: 0.7,
                        easing: SPONSOR_SCALE_EASING,
                    },
                    {
                        transform: `translate3d(-50%, ${targetTranslate + correction}px, 0)`,
                        offset: 0.88,
                        easing: 'ease-out',
                    },
                    {
                        transform: `translate3d(-50%, ${targetTranslate}px, 0)`,
                        offset: 1,
                    },
                ],
                {
                    duration: SPONSOR_TRACK_DURATION_MS,
                    fill: 'forwards',
                },
            );

            this.trackAnimation = animation;
            animation.finished.then(() => {
                if (this.trackAnimation === animation) {
                    this.finishMove();
                }
            }).catch(() => {});
            return true;
        }

        finishMove() {
            if (!this.isAnimating || this.targetIndex === null) {
                return;
            }

            const completedIndex = this.targetIndex;
            const completedTranslate = this.getTargetTranslate(completedIndex);
            const animation = this.trackAnimation;
            this.trackAnimation = null;
            this.currentTranslateY = completedTranslate;
            this.setTrackTransform(completedTranslate);

            if (animation) {
                animation.cancel();
            }

            this.setActiveSlot(completedIndex);
            this.targetIndex = null;
            this.isAnimating = false;
            this.isSettling = true;
            this.section.dataset.sponsorTransitioning = 'false';
            this.section.dataset.sponsorSettling = 'true';
            this.setCenterError(
                this.axisCenterY - (this.slotCenters[completedIndex] + completedTranslate),
            );

            window.clearTimeout(this.settleTimer);
            this.settleTimer = window.setTimeout(() => {
                this.isSettling = false;
                this.section.dataset.sponsorSettling = 'false';
                this.releasePageInput();
            }, SPONSOR_TRACK_SETTLE_MS);
        }

        finishMoveImmediately() {
            if (!this.isAnimating || this.targetIndex === null) {
                return;
            }

            this.finishMove();
        }

        setCenterError(error) {
            this.section.dataset.sponsorCenterError = Number(error.toFixed(3)).toString();
        }

        setPageInputLock(locked) {
            if (this.pageInputLocked === locked) {
                return;
            }

            this.pageInputLocked = locked;
            document.dispatchEvent(
                new CustomEvent('t1:page-content-lock', {
                    detail: { page: this.section, locked },
                }),
            );
        }

        releasePageInput() {
            this.setPageInputLock(false);
        }

        resetWheelAccumulator() {
            window.clearTimeout(this.wheelResetTimer);
            this.wheelResetTimer = 0;
            this.wheelDirection = 0;
            this.wheelAccumulator = 0;
        }

        resetBoundaryGuard() {
            window.clearTimeout(this.boundaryTimer);
            this.boundaryTimer = 0;
            this.boundaryDirection = 0;
            this.boundaryAccumulator = 0;
            this.boundaryReleaseReady = false;
        }

        destroy() {
            this.abortController.abort();
            this.resetWheelAccumulator();
            this.resetBoundaryGuard();
            window.clearTimeout(this.settleTimer);
            window.cancelAnimationFrame(this.resizeFrameId);
            this.trackAnimation?.cancel();
            this.trackAnimation = null;
            this.targetIndex = null;
            this.isAnimating = false;
            this.isSettling = false;
            this.releasePageInput();
            this.section.dataset.sponsorTransitioning = 'false';
            this.section.dataset.sponsorSettling = 'false';
        }
    }

    class ApparelSectionController {
        constructor(section, root) {
            this.section = section;
            this.root = root;
            this.stage = section.querySelector('[data-apparel-stage]');
            this.canvas = section.querySelector('[data-apparel-media-canvas]');
            this.list = section.querySelector('[data-apparel-media-list]');
            this.globalPartners = document.querySelector('[data-global-partners-section]');
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.abortController = new AbortController();
            this.mediaElements = [];
            this.entryAnimations = [];
            this.horizontalTravel = 0;
            this.sectionTop = 0;
            this.scrollFrameId = 0;
            this.resizeFrameId = 0;
            this.hasEntered = false;
            this.isEntering = false;
            this.destroyed = false;
            this.handleScroll = () => this.requestScrollUpdate();
            this.handleResize = () => this.requestMeasurement();
            this.handlePageStart = (event) => this.onPageStart(event);
            this.handlePageComplete = (event) => this.onPageComplete(event);
            this.handleMotionPreference = () => this.onMotionPreferenceChange();
        }

        init() {
            if (
                !this.root
                || !this.stage
                || !this.canvas
                || !this.list
                || this.section.dataset.apparelInitialized === 'true'
            ) {
                return;
            }

            this.section.dataset.apparelInitialized = 'true';
            this.section.dataset.apparelProgress = '0';
            this.renderMedia();
            this.section.classList.add('is-apparel-motion-ready');

            if (this.reducedMotion.matches) {
                this.hasEntered = true;
                this.section.classList.add('is-apparel-entered');
            }

            const signal = this.abortController.signal;
            window.addEventListener('scroll', this.handleScroll, { passive: true, signal });
            window.addEventListener('resize', this.handleResize, { passive: true, signal });
            window.addEventListener('pagehide', () => this.destroy(), { once: true, signal });
            this.root.addEventListener('t1:page-scroll-start', this.handlePageStart, { signal });
            this.root.addEventListener('t1:page-scroll-complete', this.handlePageComplete, { signal });
            this.reducedMotion.addEventListener('change', this.handleMotionPreference, { signal });
            this.requestMeasurement();
        }

        renderMedia() {
            const fragment = document.createDocumentFragment();

            APPAREL_MEDIA.forEach((media, index) => {
                const item = document.createElement('li');
                const crop = document.createElement('div');
                const image = document.createElement('img');
                const frame = document.createElement('img');

                item.className = 'apparel-media';
                item.dataset.apparelMedia = String(index + 1);
                item.dataset.nodeId = media.nodeId;
                item.style.setProperty('--apparel-media-left', `${media.left}px`);
                item.style.setProperty('--apparel-media-top', `${media.top}px`);
                item.style.setProperty('--apparel-media-width', `${media.width}px`);
                item.style.setProperty('--apparel-media-height', `${media.height}px`);
                item.style.setProperty('--apparel-media-entry-offset', `${media.offset}px`);
                item.style.setProperty('--apparel-media-entry-delay', `${media.delay}ms`);

                crop.className = 'apparel-media__crop';
                image.className = 'apparel-media__image';
                image.src = media.src;
                image.alt = media.alt;
                image.width = media.sourceWidth;
                image.height = media.sourceHeight;
                image.loading = 'lazy';
                image.decoding = 'async';
                image.setAttribute('fetchpriority', 'low');
                image.dataset.cropMode = media.crop.mode || 'positioned';
                image.style.setProperty('--apparel-image-width', `${media.crop.width}%`);
                image.style.setProperty('--apparel-image-height', `${media.crop.height}%`);
                image.style.setProperty('--apparel-image-left', `${media.crop.left}%`);
                image.style.setProperty('--apparel-image-top', `${media.crop.top}%`);

                frame.className = 'apparel-media__frame';
                frame.src = media.frame;
                frame.alt = '';
                frame.setAttribute('aria-hidden', 'true');

                crop.append(image);
                item.append(crop, frame);
                fragment.append(item);
            });

            this.list.replaceChildren(fragment);
            this.mediaElements = Array.from(this.list.children);
        }

        requestMeasurement() {
            window.cancelAnimationFrame(this.resizeFrameId);
            this.resizeFrameId = window.requestAnimationFrame(() => {
                this.resizeFrameId = 0;
                this.measureLayout();
            });
        }

        measureLayout() {
            const viewportWidth = this.stage.clientWidth;
            const canvasWidth = Math.max(APPAREL_CANVAS_WIDTH_PX, this.canvas.scrollWidth);
            this.horizontalTravel = Math.max(0, canvasWidth - viewportWidth);
            this.section.style.setProperty(
                '--apparel-horizontal-travel',
                `${this.horizontalTravel}px`,
            );
            this.sectionTop = window.scrollY + this.section.getBoundingClientRect().top;
            this.section.dataset.apparelHorizontalTravel = String(this.horizontalTravel);
            this.updateHorizontalPosition();
        }

        requestScrollUpdate() {
            if (this.scrollFrameId) {
                return;
            }

            this.scrollFrameId = window.requestAnimationFrame(() => {
                this.scrollFrameId = 0;
                this.updateHorizontalPosition();
            });
        }

        updateHorizontalPosition() {
            const progress = this.horizontalTravel > 0
                ? Math.min(1, Math.max(0, (window.scrollY - this.sectionTop) / this.horizontalTravel))
                : 0;
            const translateX = -this.horizontalTravel * progress;

            this.canvas.style.transform = `translate3d(${Number(translateX.toFixed(3))}px, 0, 0)`;
            this.section.dataset.apparelProgress = Number(progress.toFixed(4)).toString();
        }

        getPageNames(detail) {
            const pages = Array.from(document.querySelectorAll('[data-scroll-page]'));
            return {
                from: pages[detail?.fromIndex]?.dataset.scrollPage || '',
                to: pages[detail?.toIndex]?.dataset.scrollPage || '',
            };
        }

        onPageStart(event) {
            const pageNames = this.getPageNames(event.detail);

            if (pageNames.from === 'global-partners' && pageNames.to === 'apparel') {
                this.globalPartners?.classList.add('is-exiting-to-apparel');
                this.globalPartners?.removeAttribute('inert');
                this.playEntrance();
                return;
            }

            if (pageNames.from === 'apparel' && pageNames.to === 'global-partners') {
                this.globalPartners?.removeAttribute('inert');
                this.globalPartners?.classList.remove('is-exiting-to-apparel');
            }
        }

        onPageComplete(event) {
            const activePage = event.detail?.pageName;

            if (activePage === 'apparel') {
                this.globalPartners?.setAttribute('inert', '');
                return;
            }

            if (activePage === 'global-partners') {
                this.globalPartners?.removeAttribute('inert');
                this.globalPartners?.classList.remove('is-exiting-to-apparel');
            }
        }

        playEntrance() {
            if (this.hasEntered || this.isEntering) {
                this.section.classList.add('is-apparel-entered');
                return;
            }

            if (this.reducedMotion.matches || typeof Element.prototype.animate !== 'function') {
                this.finishEntrance();
                return;
            }

            this.isEntering = true;
            this.section.classList.add('is-apparel-entering');
            const animations = this.mediaElements.map((element, index) => {
                const media = APPAREL_MEDIA[index];
                return element.animate(
                    [
                        { opacity: 0, transform: `translateY(${media.offset}px)` },
                        { opacity: 1, transform: 'translateY(0)' },
                    ],
                    {
                        duration: APPAREL_MEDIA_ENTRY_DURATION_MS,
                        delay: media.delay,
                        easing: APPAREL_ENTRY_EASING,
                        fill: 'both',
                    },
                );
            });

            this.entryAnimations = animations;
            Promise.all(animations.map((animation) => animation.finished.catch(() => null)))
                .then(() => {
                    if (!this.destroyed && this.isEntering) {
                        this.finishEntrance();
                    }
                });
        }

        finishEntrance() {
            this.entryAnimations.forEach((animation) => animation.cancel());
            this.entryAnimations = [];
            this.hasEntered = true;
            this.isEntering = false;
            this.section.classList.add('is-apparel-entered');
            this.section.classList.remove('is-apparel-entering');
        }

        onMotionPreferenceChange() {
            if (this.reducedMotion.matches && !this.hasEntered) {
                this.finishEntrance();
            }
        }

        destroy() {
            if (this.destroyed) {
                return;
            }

            this.destroyed = true;
            this.abortController.abort();
            window.cancelAnimationFrame(this.scrollFrameId);
            window.cancelAnimationFrame(this.resizeFrameId);
            this.entryAnimations.forEach((animation) => animation.cancel());
            this.entryAnimations = [];
            this.globalPartners?.removeAttribute('inert');
            this.globalPartners?.classList.remove('is-exiting-to-apparel');
        }
    }

    class MembershipSectionController {
        constructor(section, root) {
            this.section = section;
            this.root = root;
            this.apparel = document.querySelector('[data-apparel-section]');
            this.primaryList = section.querySelector('[data-membership-primary-list]');
            this.reflectionList = section.querySelector('[data-membership-reflection-list]');
            this.textEntries = Array.from(section.querySelectorAll('[data-membership-text-entry]'));
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.abortController = new AbortController();
            this.entryAnimations = [];
            this.settleTimer = 0;
            this.scrollFrameId = 0;
            this.membershipTop = 0;
            this.pageInputLocked = false;
            this.hasEnteredContent = false;
            this.isEnteringContent = false;
            this.destroyed = false;
            this.handlePageStart = (event) => this.onPageStart(event);
            this.handlePageComplete = (event) => this.onPageComplete(event);
            this.handleCardActivation = (event) => this.onCardActivation(event);
            this.handleMotionPreference = () => this.onMotionPreferenceChange();
            this.handleScroll = () => this.requestVisualSync();
            this.handleResize = () => this.measureSectionTop();
        }

        init() {
            if (
                !this.root
                || !this.apparel
                || !this.primaryList
                || !this.reflectionList
                || this.section.dataset.membershipInitialized === 'true'
            ) {
                return;
            }

            this.section.dataset.membershipInitialized = 'true';
            this.section.setAttribute('inert', '');
            this.renderCards();
            this.section.classList.add('is-membership-motion-ready');

            const signal = this.abortController.signal;
            this.root.addEventListener('t1:page-scroll-start', this.handlePageStart, { signal });
            this.root.addEventListener('t1:page-scroll-complete', this.handlePageComplete, { signal });
            this.primaryList.addEventListener('click', this.handleCardActivation, { signal });
            this.reducedMotion.addEventListener('change', this.handleMotionPreference, { signal });
            window.addEventListener('scroll', this.handleScroll, { passive: true, signal });
            window.addEventListener('resize', this.handleResize, { passive: true, signal });
            window.addEventListener('pagehide', () => this.destroy(), { once: true, signal });
            this.measureSectionTop();
        }

        renderCards() {
            const primaryFragment = document.createDocumentFragment();
            const reflectionFragment = document.createDocumentFragment();

            MEMBERSHIP_CARDS.forEach((card) => {
                primaryFragment.append(this.createCardSlot(card, true));
                reflectionFragment.append(this.createCardSlot(card, false));
            });

            this.primaryList.replaceChildren(primaryFragment);
            this.reflectionList.replaceChildren(reflectionFragment);
        }

        createCardSlot(card, isInteractive) {
            const slot = document.createElement('li');
            const entry = document.createElement('div');
            const rotation = document.createElement('div');
            const interaction = document.createElement(isInteractive ? 'button' : 'div');

            slot.className = 'membership-card-slot';
            slot.dataset.membershipCard = card.id;
            slot.dataset.nodeId = card.nodeId;
            slot.style.setProperty('--membership-card-slot-left', `${card.left}px`);
            slot.style.setProperty('--membership-card-slot-top', `${card.top}px`);
            slot.style.setProperty('--membership-card-slot-width', `${card.slotWidth}px`);
            slot.style.setProperty('--membership-card-slot-height', `${card.slotHeight}px`);
            slot.style.setProperty('--membership-card-z', String(card.zIndex));
            slot.style.setProperty('--membership-card-rotation', `${card.rotation}deg`);
            slot.style.setProperty('--membership-card-entry-offset', `${card.entryOffset}px`);

            entry.className = 'membership-card-entry';
            rotation.className = 'membership-card-rotation';
            interaction.className = isInteractive
                ? 'membership-card-interaction'
                : 'membership-card-static';

            if (isInteractive) {
                interaction.type = 'button';
                interaction.dataset.membershipCardAction = card.id;
                interaction.setAttribute('aria-label', card.ariaLabel);
            } else {
                interaction.setAttribute('aria-hidden', 'true');
                interaction.tabIndex = -1;
            }

            interaction.append(this.createCardFace(card, !isInteractive));
            rotation.append(interaction);
            entry.append(rotation);
            slot.append(entry);
            return slot;
        }

        createCardFace(card, isDecorative) {
            if (card.featured) {
                return this.createFeaturedCardFace(isDecorative);
            }

            const face = document.createElement('span');
            const crop = document.createElement('span');
            const image = document.createElement('img');

            face.className = 'membership-card-face';
            crop.className = 'membership-card-image-crop';
            image.className = 'membership-card-image';
            image.src = card.src;
            image.alt = isDecorative ? '' : card.alt;
            image.width = card.sourceWidth;
            image.height = card.sourceHeight;
            image.loading = 'lazy';
            image.decoding = 'async';
            image.style.setProperty('--membership-card-image-width', `${card.crop.width}%`);
            image.style.setProperty('--membership-card-image-height', `${card.crop.height}%`);
            image.style.setProperty('--membership-card-image-left', `${card.crop.left}%`);
            image.style.setProperty('--membership-card-image-top', `${card.crop.top}%`);
            crop.append(image);
            face.append(crop);
            return face;
        }

        createFeaturedCardFace(isDecorative) {
            const face = document.createElement('span');
            face.className = 'membership-card-face membership-card-face--feature';
            face.innerHTML = `
                <span class="membership-feature-title"><span>INSIDE</span><span>T1</span></span>
                <img class="membership-feature-divider" src="images/membership-divider.svg" alt="" aria-hidden="true" />
                <span class="membership-feature-kicker">FEATURED VIDEO</span>
                <span class="membership-feature-thumbnail" aria-hidden="${isDecorative ? 'true' : 'false'}">
                    <span class="membership-feature-thumbnail__crop">
                        <img
                            src="images/membership-card-01-thumbnail.png"
                            alt="${isDecorative ? '' : 'T1 멤버십 Featured Video 썸네일'}"
                            width="480"
                            height="360"
                            loading="lazy"
                            decoding="async"
                        />
                    </span>
                </span>
                <span class="membership-feature-body">
                    <span>멤버를 위해 준비된 이벤트와 영상 콘텐츠를 확인해 보세요.</span>
                    <span>새로운 소식과 특별한 순간들이  계속 업데이트됩니다.</span>
                </span>
                <span class="membership-feature-action">
                    <span>콘텐츠 보러가기</span>
                    <img src="images/membership-arrow.svg" alt="" aria-hidden="true" />
                </span>
            `;
            return face;
        }

        getPageNames(detail) {
            const pages = Array.from(document.querySelectorAll('[data-scroll-page]'));
            return {
                from: pages[detail?.fromIndex]?.dataset.scrollPage || '',
                to: pages[detail?.toIndex]?.dataset.scrollPage || '',
            };
        }

        onPageStart(event) {
            const pageNames = this.getPageNames(event.detail);

            if (pageNames.from === 'apparel' && pageNames.to === 'membership') {
                this.releaseSettleLock();
                this.apparel.removeAttribute('inert');
                this.apparel.classList.remove('is-hidden-below-membership');
                this.apparel.classList.add('is-exiting-to-membership');
                this.section.removeAttribute('inert');
                this.section.classList.remove('is-exiting-to-apparel');
                this.section.classList.add('is-membership-transitioning-in');
                return;
            }

            if (pageNames.from === 'membership' && pageNames.to === 'apparel') {
                this.releaseSettleLock();
                this.apparel.removeAttribute('inert');
                this.apparel.classList.remove(
                    'is-hidden-below-membership',
                    'is-exiting-to-membership',
                );
                this.section.classList.remove('is-membership-transitioning-in');
                this.section.classList.add('is-exiting-to-apparel');
            }
        }

        onPageComplete(event) {
            const activePage = event.detail?.pageName;

            if (activePage === 'membership') {
                this.section.removeAttribute('inert');
                this.section.classList.add('is-membership-section-visible');
                this.section.classList.remove(
                    'is-membership-transitioning-in',
                    'is-exiting-to-apparel',
                );
                this.apparel.classList.add('is-hidden-below-membership');
                this.apparel.setAttribute('inert', '');
                this.playContentEntrance();
                this.applySettleLock();
                return;
            }

            if (activePage === 'apparel') {
                this.apparel.removeAttribute('inert');
                this.apparel.classList.remove(
                    'is-hidden-below-membership',
                    'is-exiting-to-membership',
                );
                this.section.classList.remove(
                    'is-membership-transitioning-in',
                    'is-membership-section-visible',
                    'is-exiting-to-apparel',
                );
                this.section.setAttribute('inert', '');
            }
        }

        playContentEntrance() {
            if (this.hasEnteredContent || this.isEnteringContent) {
                return;
            }

            if (this.reducedMotion.matches || typeof Element.prototype.animate !== 'function') {
                this.finishContentEntrance();
                return;
            }

            this.isEnteringContent = true;
            this.section.classList.add('is-membership-content-entering');

            const textAnimations = this.textEntries.map((element, index) => {
                const isLabel = element.classList.contains('membership-label');
                element.style.willChange = 'opacity, transform';
                return element.animate(
                    [
                        {
                            opacity: 0,
                            transform: isLabel
                                ? 'translate3d(-50%, 48px, 0)'
                                : 'translate3d(0, 48px, 0)',
                        },
                        {
                            opacity: 1,
                            transform: isLabel
                                ? 'translate3d(-50%, 0, 0)'
                                : 'translate3d(0, 0, 0)',
                        },
                    ],
                    {
                        duration: MEMBERSHIP_TEXT_ENTRY_DURATION_MS,
                        delay: index * 90,
                        easing: MEMBERSHIP_ENTRY_EASING,
                        fill: 'both',
                    },
                );
            });

            const cardAnimations = Array.from(
                this.primaryList.querySelectorAll('.membership-card-entry'),
            ).map((element, index) => {
                const card = MEMBERSHIP_CARDS[index];
                element.style.willChange = 'opacity, transform';
                return element.animate(
                    [
                        {
                            opacity: 0,
                            transform: `translate3d(0, ${card.entryOffset}px, 0) scale(0.95)`,
                            offset: 0,
                            easing: MEMBERSHIP_ENTRY_EASING,
                        },
                        {
                            opacity: 1,
                            transform: 'translate3d(0, -18px, 0) scale(1)',
                            offset: 0.82,
                            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        },
                        {
                            opacity: 1,
                            transform: 'translate3d(0, 0, 0) scale(1)',
                            offset: 1,
                        },
                    ],
                    {
                        duration: MEMBERSHIP_CARD_ENTRY_DURATION_MS,
                        delay: 120 + card.entryDelay,
                        fill: 'both',
                    },
                );
            });

            this.entryAnimations = [...textAnimations, ...cardAnimations];
            Promise.all(this.entryAnimations.map((animation) => animation.finished.catch(() => null)))
                .then(() => {
                    if (!this.destroyed && this.isEnteringContent) {
                        this.finishContentEntrance();
                    }
                });
        }

        finishContentEntrance() {
            this.hasEnteredContent = true;
            this.isEnteringContent = false;
            this.section.classList.add('is-membership-content-entered');
            this.section.classList.remove('is-membership-content-entering');
            this.entryAnimations.forEach((animation) => animation.cancel());
            this.entryAnimations = [];
            this.textEntries.forEach((element) => {
                element.style.willChange = '';
            });
            this.primaryList.querySelectorAll('.membership-card-entry').forEach((element) => {
                element.style.willChange = '';
            });
        }

        onCardActivation(event) {
            const action = event.target instanceof Element
                ? event.target.closest('[data-membership-card-action]')
                : null;

            if (!action) {
                return;
            }

            const card = MEMBERSHIP_CARDS.find(
                (item) => item.id === action.dataset.membershipCardAction,
            );

            if (!card?.href) {
                return;
            }

            window.location.assign(card.href);
        }

        applySettleLock() {
            this.setPageInputLock(true);
            window.clearTimeout(this.settleTimer);
            this.settleTimer = window.setTimeout(
                () => this.releaseSettleLock(),
                MEMBERSHIP_SETTLE_LOCK_MS,
            );
        }

        releaseSettleLock() {
            window.clearTimeout(this.settleTimer);
            this.settleTimer = 0;
            this.setPageInputLock(false);
        }

        setPageInputLock(locked) {
            if (this.pageInputLocked === locked) {
                return;
            }

            this.pageInputLocked = locked;
            document.dispatchEvent(
                new CustomEvent('t1:page-content-lock', {
                    detail: { page: this.section, locked },
                }),
            );
        }

        onMotionPreferenceChange() {
            if (this.reducedMotion.matches && this.isEnteringContent) {
                this.finishContentEntrance();
            }
        }

        measureSectionTop() {
            this.membershipTop = window.scrollY + this.section.getBoundingClientRect().top;
            this.requestVisualSync();
        }

        requestVisualSync() {
            if (this.scrollFrameId) {
                return;
            }

            this.scrollFrameId = window.requestAnimationFrame(() => {
                this.scrollFrameId = 0;
                this.syncVisualState();
            });
        }

        syncVisualState() {
            if (
                this.root.dataset.pageTransitioning === 'true'
                || window.scrollY >= this.membershipTop - PAGE_SCROLL_BOUNDARY_TOLERANCE_PX
                || !this.apparel.classList.contains('is-hidden-below-membership')
            ) {
                return;
            }

            this.releaseSettleLock();
            this.apparel.removeAttribute('inert');
            this.apparel.classList.remove(
                'is-hidden-below-membership',
                'is-exiting-to-membership',
            );
            this.section.classList.remove(
                'is-membership-transitioning-in',
                'is-membership-section-visible',
                'is-exiting-to-apparel',
            );
            this.section.setAttribute('inert', '');
        }

        destroy() {
            if (this.destroyed) {
                return;
            }

            this.destroyed = true;
            this.abortController.abort();
            this.releaseSettleLock();
            window.cancelAnimationFrame(this.scrollFrameId);
            this.scrollFrameId = 0;
            this.entryAnimations.forEach((animation) => animation.cancel());
            this.entryAnimations = [];
        }
    }

    class FooterScaleController {
        constructor(footer) {
            this.footer = footer;
            this.stage = footer.querySelector('[data-footer-stage]');
            this.frameId = 0;
            this.abortController = new AbortController();
            this.handleResize = () => this.scheduleUpdate();
        }

        init() {
            if (!this.stage || this.footer.dataset.footerScaleInitialized === 'true') {
                return;
            }

            this.footer.dataset.footerScaleInitialized = 'true';
            const signal = this.abortController.signal;

            window.addEventListener('resize', this.handleResize, { passive: true, signal });
            window.visualViewport?.addEventListener('resize', this.handleResize, {
                passive: true,
                signal,
            });
            window.addEventListener('pagehide', () => this.destroy(), { once: true, signal });
            this.update();
        }

        scheduleUpdate() {
            if (this.frameId) {
                return;
            }

            this.frameId = window.requestAnimationFrame(() => {
                this.frameId = 0;
                this.update();
            });
        }

        update() {
            const footerWidth = this.footer.clientWidth;

            if (footerWidth < 1280) {
                this.footer.style.removeProperty('--footer-scale');
                this.footer.style.removeProperty('--footer-height');
                return;
            }

            const scale = Math.min(1, footerWidth / 1920);
            this.footer.style.setProperty('--footer-scale', scale.toFixed(6));
            this.footer.style.setProperty('--footer-height', `${890 * scale}px`);
        }

        destroy() {
            this.abortController.abort();
            window.cancelAnimationFrame(this.frameId);
            this.frameId = 0;
        }
    }

    class PageScrollController {
        constructor(root) {
            this.root = root;
            this.hero = root.querySelector('[data-hero-layer]');
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.abortController = new AbortController();
            this.pages = [];
            this.currentPageIndex = 0;
            this.targetPageIndex = null;
            this.isPageTransitioning = false;
            this.wheelDirection = 0;
            this.wheelDeltaAccumulator = 0;
            this.wheelResetTimer = 0;
            this.touchStartX = null;
            this.touchStartY = null;
            this.touchGestureRejected = false;
            this.animationFrameId = 0;
            this.scrollBehaviorSnapshot = null;
            this.transitionInputType = null;
            this.transitionDuration = PAGE_SCROLL_DURATION_MS;
            this.pageContentLock = null;
            this.handleWheel = (event) => this.onWheel(event);
            this.handleTouchStart = (event) => this.onTouchStart(event);
            this.handleTouchMove = (event) => this.onTouchMove(event);
            this.handleTouchEnd = () => this.resetTouch();
            this.handleKeyDown = (event) => this.onKeyDown(event);
            this.handleResize = () => this.onResize();
            this.handleOpeningState = (event) => this.onOpeningState(event);
            this.handlePageContentLock = (event) => this.onPageContentLock(event);
        }

        init() {
            if (!this.hero || this.root.dataset.pageScrollInitialized === 'true') {
                return;
            }

            this.refreshPages();

            if (this.pages.length < 2) {
                return;
            }

            this.root.dataset.pageScrollInitialized = 'true';
            this.root.dataset.pageTransitioning = 'false';
            this.syncCurrentPageIndex();

            const signal = this.abortController.signal;
            window.addEventListener('wheel', this.handleWheel, { passive: false, signal });
            window.addEventListener('touchstart', this.handleTouchStart, { passive: true, signal });
            window.addEventListener('touchmove', this.handleTouchMove, { passive: false, signal });
            window.addEventListener('touchend', this.handleTouchEnd, { passive: true, signal });
            window.addEventListener('touchcancel', this.handleTouchEnd, { passive: true, signal });
            window.addEventListener('keydown', this.handleKeyDown, { signal });
            window.addEventListener('resize', this.handleResize, { passive: true, signal });
            window.addEventListener('pagehide', () => this.destroy(), { once: true, signal });
            this.root.addEventListener('t1:transition-state', this.handleOpeningState, { signal });
            document.addEventListener('t1:page-content-lock', this.handlePageContentLock, { signal });

            if (this.isControllerReady()) {
                this.activatePage(this.currentPageIndex, 'initial');
            }
        }

        refreshPages() {
            const currentPage = this.pages[this.currentPageIndex] || null;
            this.pages = Array.from(document.querySelectorAll('[data-scroll-page]'));

            if (currentPage && this.pages.includes(currentPage)) {
                this.currentPageIndex = this.pages.indexOf(currentPage);
            }
        }

        onOpeningState(event) {
            if (event.detail?.state !== STATE.COMPLETE || !this.isControllerReady()) {
                return;
            }

            this.syncCurrentPageIndex();
            this.activatePage(this.currentPageIndex, 'opening-complete');
        }

        isControllerReady() {
            return this.root.dataset.state === STATE.COMPLETE
                && this.hero.dataset.heroState === 'complete';
        }

        isPreHeroScrollLocked() {
            if (this.isControllerReady()) {
                return false;
            }

            const rootBounds = this.getPageDocumentBounds(this.root);
            const viewportTop = window.scrollY + this.getHeaderOffset();

            return viewportTop < rootBounds.bottom - PAGE_SCROLL_BOUNDARY_TOLERANCE_PX;
        }

        normalizeWheelAxis(delta, deltaMode) {
            if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
                return delta * 16;
            }

            if (deltaMode === WheelEvent.DOM_DELTA_PAGE) {
                return delta * window.innerHeight;
            }

            return delta;
        }

        onWheel(event) {
            if (this.isPageTransitioning || this.isPageContentInputLocked()) {
                event.preventDefault();
                return;
            }

            const deltaY = this.normalizeWheelAxis(event.deltaY, event.deltaMode);
            const deltaX = this.normalizeWheelAxis(event.deltaX, event.deltaMode);

            if (deltaY === 0 || Math.abs(deltaY) <= Math.abs(deltaX)) {
                this.resetWheelAccumulator();
                return;
            }

            const direction = deltaY > 0 ? 1 : -1;

            if (!this.isControllerReady()) {
                this.resetWheelAccumulator();

                if (direction > 0 && this.isPreHeroScrollLocked()) {
                    event.preventDefault();
                }

                return;
            }

            if (this.shouldIgnoreScrollTarget(event.target)) {
                this.resetWheelAccumulator();
                return;
            }

            this.syncCurrentPageIndex();

            if (!this.canMove(direction)) {
                this.resetWheelAccumulator();
                return;
            }

            event.preventDefault();
            this.accumulateWheel(Math.abs(deltaY), direction);

            if (this.wheelDeltaAccumulator >= PAGE_SCROLL_WHEEL_THRESHOLD_PX) {
                this.moveBy(direction, 'wheel');
            }
        }

        accumulateWheel(delta, direction) {
            if (direction !== this.wheelDirection) {
                this.resetWheelAccumulator();
                this.wheelDirection = direction;
            }

            this.wheelDeltaAccumulator += delta;
            window.clearTimeout(this.wheelResetTimer);
            this.wheelResetTimer = window.setTimeout(
                () => this.resetWheelAccumulator(),
                PAGE_SCROLL_WHEEL_ACCUMULATION_MS,
            );
        }

        onTouchStart(event) {
            if (
                event.touches.length !== 1
                || this.isPageContentInputLocked()
                || this.shouldIgnoreScrollTarget(event.target)
            ) {
                this.resetTouch();
                return;
            }

            const touch = event.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.touchGestureRejected = false;

            if (this.isControllerReady()) {
                this.syncCurrentPageIndex();
            }
        }

        onTouchMove(event) {
            if (this.isPageTransitioning || this.isPageContentInputLocked()) {
                event.preventDefault();
                return;
            }

            if (
                this.touchStartX === null
                || this.touchStartY === null
                || this.touchGestureRejected
                || event.touches.length !== 1
            ) {
                return;
            }

            const touch = event.touches[0];
            const distanceX = this.touchStartX - touch.clientX;
            const distanceY = this.touchStartY - touch.clientY;

            if (Math.abs(distanceY) <= Math.abs(distanceX)) {
                return;
            }

            const direction = distanceY > 0 ? 1 : -1;

            if (!this.isControllerReady()) {
                if (direction > 0 && this.isPreHeroScrollLocked()) {
                    event.preventDefault();
                }

                return;
            }

            if (!this.canMove(direction)) {
                this.touchGestureRejected = true;
                return;
            }

            event.preventDefault();

            if (Math.abs(distanceY) >= PAGE_SCROLL_SWIPE_THRESHOLD_PX) {
                this.moveBy(direction, 'touch');
            }
        }

        onKeyDown(event) {
            if (
                event.defaultPrevented
                || event.repeat
                || event.altKey
                || event.ctrlKey
                || event.metaKey
                || this.isKeyboardInputTarget(event.target)
                || this.shouldIgnoreScrollTarget(event.target)
            ) {
                return;
            }

            const direction = this.getKeyboardDirection(event);

            if (direction === 0) {
                return;
            }

            if (this.isPageTransitioning || this.isPageContentInputLocked()) {
                event.preventDefault();
                return;
            }

            if (!this.isControllerReady()) {
                if (direction > 0 && this.isPreHeroScrollLocked()) {
                    event.preventDefault();
                }

                return;
            }

            this.syncCurrentPageIndex();

            if (!this.canMove(direction)) {
                return;
            }

            event.preventDefault();
            this.moveBy(direction, 'keyboard');
        }

        getKeyboardDirection(event) {
            if (event.key === 'ArrowDown' || event.key === 'PageDown') {
                return 1;
            }

            if (event.key === 'ArrowUp' || event.key === 'PageUp') {
                return -1;
            }

            if (event.key === ' ') {
                return event.shiftKey ? -1 : 1;
            }

            return 0;
        }

        isKeyboardInputTarget(target) {
            return target instanceof Element
                && Boolean(
                    target.closest(
                        'input, textarea, select, button, a, summary, [contenteditable="true"], [role="button"]',
                    ),
                );
        }

        onPageContentLock(event) {
            const page = event.detail?.page;

            if (event.detail?.locked && page instanceof Element) {
                this.pageContentLock = page;
                return;
            }

            if (!page || this.pageContentLock === page) {
                this.pageContentLock = null;
            }
        }

        isPageContentInputLocked() {
            const activePage = this.pages[this.currentPageIndex] || null;

            return Boolean(
                this.pageContentLock
                && activePage === this.pageContentLock
                && activePage.dataset.scrollPageActive === 'true',
            );
        }

        shouldIgnoreScrollTarget(target) {
            if (!(target instanceof Element)) {
                return false;
            }

            if (
                target.closest(
                    'input, textarea, select, [contenteditable="true"], [role="dialog"], '
                    + '[aria-modal="true"], [data-scroll-ignore], [data-scroll-container], '
                    + '.swiper, .carousel, [class*="carousel"]',
                )
            ) {
                return true;
            }

            const activePage = this.pages[this.currentPageIndex] || null;
            let element = target;

            while (element && element !== activePage && element !== document.body) {
                const style = window.getComputedStyle(element);
                const overflowY = style.overflowY;
                const isScrollable = ['auto', 'scroll', 'overlay'].includes(overflowY)
                    && element.scrollHeight > element.clientHeight + 1;

                if (isScrollable) {
                    return true;
                }

                element = element.parentElement;
            }

            return false;
        }

        canMove(direction) {
            const targetIndex = this.currentPageIndex + direction;

            return targetIndex >= 0
                && targetIndex < this.pages.length
                && this.isAtPageBoundary(direction, this.currentPageIndex);
        }

        isAtPageBoundary(direction, pageIndex) {
            const page = this.pages[pageIndex];

            if (!page) {
                return false;
            }

            const bounds = this.getPageDocumentBounds(page);
            const headerOffset = this.getHeaderOffset();
            const viewportTop = window.scrollY + headerOffset;
            const viewportBottom = window.scrollY + window.innerHeight;
            const isFullScreenPage = bounds.height <= window.innerHeight
                + PAGE_SCROLL_BOUNDARY_TOLERANCE_PX;

            if (direction < 0) {
                return viewportTop <= bounds.top + PAGE_SCROLL_BOUNDARY_TOLERANCE_PX;
            }

            return isFullScreenPage
                || viewportBottom >= bounds.bottom - PAGE_SCROLL_BOUNDARY_TOLERANCE_PX;
        }

        moveBy(direction, inputType) {
            return this.goToPage(this.currentPageIndex + direction, inputType);
        }

        goToPage(targetIndex, inputType) {
            if (
                this.isPageTransitioning
                || !this.isControllerReady()
                || targetIndex < 0
                || targetIndex >= this.pages.length
                || Math.abs(targetIndex - this.currentPageIndex) !== 1
            ) {
                return false;
            }

            this.isPageTransitioning = true;
            this.targetPageIndex = targetIndex;
            this.transitionInputType = inputType;
            this.root.dataset.pageTransitioning = 'true';
            this.resetWheelAccumulator();
            this.disableSmoothScroll();

            const startY = window.scrollY;
            const travelDirection = targetIndex > this.currentPageIndex ? 1 : -1;
            const targetY = this.getPageTargetY(this.pages[targetIndex], travelDirection);
            const reducedMotion = this.reducedMotion.matches;
            this.transitionDuration = this.getTransitionDuration(
                this.pages[this.currentPageIndex],
                this.pages[targetIndex],
            );

            this.root.dispatchEvent(
                new CustomEvent('t1:page-scroll-start', {
                    detail: {
                        fromIndex: this.currentPageIndex,
                        toIndex: targetIndex,
                        inputType,
                        startY,
                        targetY,
                        duration: reducedMotion ? 0 : this.transitionDuration,
                        easing: reducedMotion ? 'none' : PAGE_SCROLL_EASING,
                    },
                }),
            );

            if (reducedMotion || typeof window.requestAnimationFrame !== 'function') {
                this.scrollToY(targetY);
                this.finishTransition();
                return true;
            }

            const startedAt = window.performance.now();
            const distance = targetY - startY;

            const animateScroll = (timestamp) => {
                if (!this.isPageTransitioning || this.abortController.signal.aborted) {
                    return;
                }

                const progress = Math.min(1, (timestamp - startedAt) / this.transitionDuration);
                this.scrollToY(startY + distance * easePageScroll(progress));

                if (progress < 1) {
                    this.animationFrameId = window.requestAnimationFrame(animateScroll);
                    return;
                }

                this.animationFrameId = 0;
                this.finishTransition();
            };

            this.animationFrameId = window.requestAnimationFrame(animateScroll);
            return true;
        }

        finishTransition() {
            if (!this.isPageTransitioning || this.targetPageIndex === null) {
                return;
            }

            const completedIndex = this.targetPageIndex;
            const travelDirection = completedIndex > this.currentPageIndex ? 1 : -1;
            const finalTargetY = this.getPageTargetY(
                this.pages[completedIndex],
                travelDirection,
            );
            this.scrollToY(finalTargetY);
            this.currentPageIndex = completedIndex;
            this.targetPageIndex = null;
            this.isPageTransitioning = false;
            this.pageContentLock = null;
            this.root.dataset.pageTransitioning = 'false';
            this.restoreSmoothScroll();
            this.activatePage(completedIndex, this.transitionInputType);
            this.transitionInputType = null;
            this.transitionDuration = PAGE_SCROLL_DURATION_MS;
        }

        getTransitionDuration(fromPage, toPage) {
            const fromName = fromPage?.dataset.scrollPage;
            const toName = toPage?.dataset.scrollPage;
            const isApparelBoundary = (
                fromName === 'global-partners'
                && toName === 'apparel'
            ) || (
                fromName === 'apparel'
                && toName === 'global-partners'
            );
            const isMembershipBoundary = (
                fromName === 'apparel'
                && toName === 'membership'
            ) || (
                fromName === 'membership'
                && toName === 'apparel'
            );

            if (isMembershipBoundary) {
                return MEMBERSHIP_PAGE_TRANSITION_DURATION_MS;
            }

            return isApparelBoundary
                ? APPAREL_PAGE_TRANSITION_DURATION_MS
                : PAGE_SCROLL_DURATION_MS;
        }

        activatePage(pageIndex, inputType) {
            const activePage = this.pages[pageIndex];

            if (!activePage) {
                return;
            }

            this.pages.forEach((page, index) => {
                page.dataset.scrollPageActive = index === pageIndex ? 'true' : 'false';
            });
            activePage.dispatchEvent(
                new CustomEvent('t1:scroll-page-active', {
                    detail: { pageIndex, inputType },
                }),
            );
            this.root.dispatchEvent(
                new CustomEvent('t1:page-scroll-complete', {
                    detail: {
                        pageIndex,
                        pageName: activePage.dataset.scrollPage,
                        inputType,
                        targetY: window.scrollY,
                    },
                }),
            );
        }

        syncCurrentPageIndex() {
            this.refreshPages();

            if (this.pages.length === 0) {
                this.currentPageIndex = 0;
                return;
            }

            const anchorY = window.scrollY + this.getHeaderOffset()
                + PAGE_SCROLL_BOUNDARY_TOLERANCE_PX;
            let nextIndex = 0;

            this.pages.forEach((page, index) => {
                if (this.getPageDocumentBounds(page).top <= anchorY) {
                    nextIndex = index;
                }
            });
            this.currentPageIndex = nextIndex;
        }

        getPageDocumentBounds(page) {
            const bounds = page.getBoundingClientRect();
            const top = window.scrollY + bounds.top;

            return {
                top,
                bottom: top + bounds.height,
                height: bounds.height,
            };
        }

        getPageTargetY(page, travelDirection = 1) {
            const bounds = this.getPageDocumentBounds(page);
            const maximumScrollY = Math.max(
                0,
                document.documentElement.scrollHeight - window.innerHeight,
            );
            const isLongPage = bounds.height > window.innerHeight
                + PAGE_SCROLL_BOUNDARY_TOLERANCE_PX;
            const pageTargetY = travelDirection < 0 && isLongPage
                ? bounds.bottom - window.innerHeight
                : bounds.top - this.getHeaderOffset();

            return Math.min(maximumScrollY, Math.max(0, pageTargetY));
        }

        getHeaderOffset() {
            const header = document.querySelector('[data-scroll-header], header');

            if (!header) {
                return 0;
            }

            const style = window.getComputedStyle(header);

            if (!['fixed', 'sticky'].includes(style.position)) {
                return 0;
            }

            const bounds = header.getBoundingClientRect();
            return bounds.top <= PAGE_SCROLL_BOUNDARY_TOLERANCE_PX && bounds.bottom > 0
                ? Math.max(0, bounds.height)
                : 0;
        }

        scrollToY(top) {
            window.scrollTo({ top, left: window.scrollX, behavior: 'auto' });
        }

        disableSmoothScroll() {
            const elements = [document.documentElement, document.body].filter(Boolean);
            this.scrollBehaviorSnapshot = elements.map((element) => ({
                element,
                value: element.style.getPropertyValue('scroll-behavior'),
                priority: element.style.getPropertyPriority('scroll-behavior'),
            }));
            elements.forEach((element) => {
                element.style.setProperty('scroll-behavior', 'auto', 'important');
            });
        }

        restoreSmoothScroll() {
            this.scrollBehaviorSnapshot?.forEach(({ element, value, priority }) => {
                if (value) {
                    element.style.setProperty('scroll-behavior', value, priority);
                } else {
                    element.style.removeProperty('scroll-behavior');
                }
            });
            this.scrollBehaviorSnapshot = null;
        }

        onResize() {
            if (this.isPageTransitioning) {
                return;
            }

            this.refreshPages();
            this.syncCurrentPageIndex();
        }

        resetWheelAccumulator() {
            window.clearTimeout(this.wheelResetTimer);
            this.wheelResetTimer = 0;
            this.wheelDirection = 0;
            this.wheelDeltaAccumulator = 0;
        }

        resetTouch() {
            this.touchStartX = null;
            this.touchStartY = null;
            this.touchGestureRejected = false;
        }

        destroy() {
            this.abortController.abort();
            this.resetWheelAccumulator();
            this.resetTouch();

            if (typeof window.cancelAnimationFrame === 'function') {
                window.cancelAnimationFrame(this.animationFrameId);
            }

            this.animationFrameId = 0;
            this.targetPageIndex = null;
            this.isPageTransitioning = false;
            this.root.dataset.pageTransitioning = 'false';
            this.restoreSmoothScroll();
        }
    }

    const introSequence = document.querySelector('[data-intro-sequence]');

    if (introSequence && introSequence.dataset.motionInitialized !== 'true') {
        const transition = new OpeningHeroTransition(introSequence);
        transition.init();
    }

    const historySection = document.querySelector('[data-history-section]');

    if (historySection) {
        const historyMotion = new HistorySectionMotion(historySection);
        historyMotion.init();
    }

    const brandImpactSection = document.querySelector('[data-brand-impact-section]');

    if (brandImpactSection) {
        const brandImpactMotion = new BrandImpactMotion(brandImpactSection);
        brandImpactMotion.init();
    }

    const globalPartnersSection = document.querySelector('[data-global-partners-section]');

    if (globalPartnersSection) {
        const sponsorTrack = new SponsorTrackController(globalPartnersSection);
        sponsorTrack.init();
    }

    const apparelSection = document.querySelector('[data-apparel-section]');

    if (apparelSection && introSequence) {
        const apparelController = new ApparelSectionController(apparelSection, introSequence);
        apparelController.init();
    }

    const membershipSection = document.querySelector('[data-membership-section]');

    if (membershipSection && introSequence) {
        const membershipController = new MembershipSectionController(
            membershipSection,
            introSequence,
        );
        membershipController.init();
    }

    const footer = document.querySelector('.section-footer');

    if (footer) {
        const footerScaleController = new FooterScaleController(footer);
        footerScaleController.init();
    }

    if (introSequence) {
        const pageScrollController = new PageScrollController(introSequence);
        pageScrollController.init();
    }
})();
