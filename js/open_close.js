$(function () {
    const $topBanner = $('.top-banner');
    const $menuButton = $('.menu-toggle-desktop');
    const $menuPopup = $('.md-pop');
    const today = new Date().toLocaleDateString();
    const hiddenDate = localStorage.getItem('topBannerHiddenDate');

    // 오늘 하루 보지 않기를 선택한 경우
    if (hiddenDate === today) {
        $topBanner.hide();
    }

    // 오늘 하루 보지 않기
    $('.banner-close').on('click', function () {
        localStorage.setItem('topBannerHiddenDate', today);
        $topBanner.hide();
    });

    // 일반 닫기: 저장하지 않음
    $('.banner-close-nomarl').on('click', function () {
        $topBanner.hide();
    });

    // 서비스 탭: 클릭한 항목 하나만 활성 상태로 변경
    const itemsPerPage = 8;
    let currentService = '민원';
    let currentPage = 0;

    // 탭 구분값만 여기서 부여
    $('.service-icons > a:not(.service-icon)').addClass('service-icon').attr('data-service', '민원');

    function renderServiceItems(direction) {
        const $items = $('.service-icons .service-icon');
        const $selectedItems = $items.filter(
            '[data-service="' + currentService + '"]'
        );

        const pageCount = Math.ceil($selectedItems.length / itemsPerPage);
        const $pageItems = $selectedItems.slice(
            currentPage * itemsPerPage,
            (currentPage + 1) * itemsPerPage
        );

        const $icons = $('.service-icons');

        const enterClass = direction === 'next'
            ? 'service-icon-enter-next'
            : 'service-icon-enter-prev';

        const exitClass = direction === 'next'
            ? 'service-icon-exit-next'
            : 'service-icon-exit-prev';

        // 이전 애니메이션 클래스 초기화
        $items.removeClass(
            'service-icon-enter-next service-icon-enter-prev ' +
            'service-icon-exit-next service-icon-exit-prev'
        );

        if (direction) {

            // 현재 화면에 보이는 아이콘만 퇴장
            const $currentItems = $items.filter(':visible');

            $currentItems.addClass(exitClass);

            setTimeout(function () {

                // 모든 아이콘 숨기기
                $items.hide();

                // 새 페이지 아이콘만 표시
                $pageItems
                    .css('display', 'block')
                    .removeClass(
                        'service-icon-enter-next service-icon-enter-prev ' +
                        'service-icon-exit-next service-icon-exit-prev'
                    )
                    .addClass(enterClass);

            }, 220);

        } else {

            // 초기 렌더링
            $items.hide();

            $pageItems
                .css('display', 'block')
                .removeClass(
                    'service-icon-enter-next service-icon-enter-prev ' +
                    'service-icon-exit-next service-icon-exit-prev'
                );
        }

        $('.service-more').toggle(currentPage < pageCount - 1);
        $('.service-prev').toggle(currentPage > 0);
    }

    $('.service-tabs li').on('click', function () {
        currentService = $.trim($(this).text());
        currentPage = 0;
        renderServiceItems();
    });

    $('.service-more').on('click', function () {
        const pageCount = Math.ceil($('.service-icons .service-icon[data-service="' + currentService + '"]').length / itemsPerPage);
        if (currentPage < pageCount - 1) {
            currentPage += 1;
            renderServiceItems('next');
        }
    });

    $('.service-prev').on('click', function () {
        if (currentPage > 0) {
            currentPage -= 1;
            renderServiceItems('prev');
        }
    });

    renderServiceItems();

    $('.service-tabs li').on('click', function () {
        const $tabs = $(this).closest('.service-tabs').find('li');

        // 기존 활성 탭의 색상과 체크 아이콘을 제거
        $tabs.removeClass('active').find('> .fa-circle-check').remove();

        // 클릭한 탭에 활성 스타일과 체크 아이콘을 적용
        $(this)
            .addClass('active')
            .prepend('<i class="fa-regular fa-circle-check" aria-hidden="true"></i>');
    });

    // 전체 메뉴 열기
    $menuButton.on('click', function () {
        // 모달을 화면 위에 표시
        $menuPopup.addClass('is-open');

        // 메뉴 버튼의 현재 열림 상태를 보조기기에 전달
        $menuButton.attr('aria-expanded', 'true');

        // 모달 뒤쪽 홈페이지의 스크롤을 잠금
        $('body').css('overflow', 'hidden');
    });

    // 전체 메뉴 닫기
    $('.md-pop-close').on('click', function () {
        // 모달을 숨김
        $menuPopup.removeClass('is-open');

        // 메뉴 버튼의 현재 닫힘 상태를 보조기기에 전달
        $menuButton.attr('aria-expanded', 'false');

        // 홈페이지 스크롤을 다시 허용
        $('body').css('overflow', '');
    });

    // 모달 바깥쪽 어두운 배경을 클릭하면 모달 닫기
    $menuPopup.on('click', function (event) {
        // 클릭한 대상이 .md-pop 자체일 때만 실행
        // 메뉴 내용(.md-pop-wrap)을 클릭하면 닫히지 않음
        if (event.target === this) {
            $menuPopup.removeClass('is-open');

            // 메뉴 버튼의 닫힘 상태를 전달
            $menuButton.attr('aria-expanded', 'false');

            // 배경 페이지의 스크롤 다시 허용
            $('body').css('overflow', '');
        }
    });
});
