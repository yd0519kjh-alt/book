async function initSliders() {
    try {
        // 1. JSON 데이터 가져오기
        const response = await fetch('/static/data/banners.json');
        if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
        const data = await response.json();

        // 2. 메인 슬라이더 초기화
        const mainWrapper = document.getElementById('main-slider-wrapper');
        const mainPageInfo = document.getElementById('slider-page'); // index.html의 ID와 매칭

        if (mainWrapper && data.mainBanners) {
            mainWrapper.innerHTML = data.mainBanners.map(banner => `
                <div class="slide">
                    <img src="${banner.image}" alt="메인 배너">
                </div>
            `).join('');

            let mainIdx = 0;
            const mainCount = data.mainBanners.length;

            // 페이지 번호 초기화
            if (mainPageInfo) mainPageInfo.innerText = `1 / ${mainCount}`;

            // 메인 슬라이드 이동 함수
            const moveMain = (dir) => {
                mainIdx = (mainIdx + dir + mainCount) % mainCount;
                mainWrapper.style.transform = `translateX(-${mainIdx * 100}%)`;
                if (mainPageInfo) mainPageInfo.innerText = `${mainIdx + 1} / ${mainCount}`;
            };

            // 좌우 버튼 이벤트 (존재할 경우만)
            const nextBtn = document.getElementById('main-next');
            const prevBtn = document.getElementById('main-prev');
            if (nextBtn) nextBtn.onclick = () => moveMain(1);
            if (prevBtn) prevBtn.onclick = () => moveMain(-1);

            // 5초마다 자동 슬라이드
            setInterval(() => moveMain(1), 5000);
        }

        // 3. 서브 슬라이더 초기화
        const subContainer = document.getElementById('sub-slider-content');
        
        if (subContainer && data.subBanners) {
            // 내부 wrapper 생성 (슬라이딩 효과를 위해 필요)
            subContainer.innerHTML = `
                <div id="sub-wrapper" style="display:flex; transition: transform 0.5s ease; width:100%; height:100%;">
                    ${data.subBanners.map(sub => `
                        <div style="min-width: 100%; padding: 30px 20px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <div style="background:#f8f8f8; width:100%; height:180px; border-radius:15px; display:flex; justify-content:center; align-items:center; margin-bottom:15px; border: 1px solid #eee;">
                                <img src="${sub.image}" style="width:110px; border-radius:4px; box-shadow:0 8px 20px rgba(0,0,0,0.1);">
                            </div>
                            <div style="color:#2d81ff; font-weight:bold; font-size:12px; margin-bottom:5px;">${sub.label}</div>
                            <div style="font-weight:bold; font-size:15px; color:#333; line-height:1.4;">${sub.title}</div>
                        </div>
                    `).join('')}
                </div>
            `;

            const subWrapper = document.getElementById('sub-wrapper');
            let subIdx = 0;
            const subCount = data.subBanners.length;

            // 서브 자동 슬라이드 (3.5초마다)
            setInterval(() => {
                if (subWrapper) {
                    subIdx = (subIdx + 1) % subCount;
                    subWrapper.style.transform = `translateX(-${subIdx * 100}%)`;
                }
            }, 3500);
        }

    } catch (error) {
        console.error("슬라이더 초기화 중 오류:", error);
    }
}

// 페이지 로드 시 실행
window.addEventListener('load', initSliders);