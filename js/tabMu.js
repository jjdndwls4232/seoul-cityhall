/* 시정홍보 탭 메뉴 */
$(function () {
  // 탭별 이미지 목록
  var tabItems = [
    Array.from({ length: 11 }, function (_, index) {
      return "./img/major_news" + String(index + 1).padStart(2, "0") + ".jpg";
    }),
    [
      "./img/citizen_info01.png",
      "./img/citizen_info02.jpg",
      "./img/citizen_info03.png",
      "./img/citizen_info04.jpg",
      "./img/citizen_info05.jpg",
      "./img/citizen_info06.jpg",
      "./img/citizen_info07.jpg",
      "./img/citizen_info08.jpg",
    ],
  ];

  // 현재 선택된 탭과 각 탭의 이미지 번호를 기억
  var activeTab = 0;
  var activeIndexes = [0, 0];
  var isPlaying = true;
  var autoPlayTimer;
  var $promo = $(".promo-col");
  var $tabs = $promo.find(".promo-tabs a");
  var $content = $promo.find(".promo-content");
  var $count = $promo.find(".promo-count");
  var $playButton = $promo.find('button[aria-label="재생"]');

  // 현재 이미지, 활성 탭 스타일, 이미지 번호를 화면에 반영
  function render(direction) {
    var imageList = tabItems[activeTab];
    var imageIndex = activeIndexes[activeTab];
    var tabName = $.trim($tabs.eq(activeTab).text());

    // 기존 이미지는 반대쪽으로 밀어내고, 새 이미지를 옆에서 추가
    $content.children("img").addClass(
      direction === -1 ? "promo-slide-out-next" : "promo-slide-out-prev",
    );
    $content.append(
      $("<img>", {
        src: imageList[imageIndex],
        alt: tabName + " " + (imageIndex + 1) + "번째 이미지",
      }),
    );

    // 마지막 이미지만 이동 방향에 맞는 효과를 적용
    $content.children("img").last().addClass(
      direction === -1 ? "promo-slide-in-prev" : "promo-slide-in-next",
    );
    // 애니메이션이 끝난 이전 이미지는 제거해 콘텐츠 영역에 하나만 남기게
    setTimeout(function () {
      $content.children("img").not(":last").remove();
    }, 450);

    // 선택한 탭만 active 클래스 적용
    $tabs.removeClass("active").attr("aria-selected", "false");
    $tabs.eq(activeTab).addClass("active").attr("aria-selected", "true");
    $count.html(
      "<strong>" +
        String(imageIndex + 1).padStart(2, "0") +
        "</strong> - " +
        String(imageList.length).padStart(2, "0"),
    );
  }

  // 이전/다음 방향에 맞춰 이동하고, 처음·마지막에서는 반대편으로 순환
  function moveSlide(direction) {
    var imageList = tabItems[activeTab];
    activeIndexes[activeTab] =
      (activeIndexes[activeTab] + direction + imageList.length) %
      imageList.length;
    render(direction);
  }

  // 5초마다 이미지 자동재생
  function startAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(function () {
      moveSlide(1);
    }, 5000);
    isPlaying = true;
    $playButton
      .attr("aria-label", "일시정지")
      .find("i")
      .attr("class", "fa-solid fa-pause");
  }

  // 자동재생을 중지하고 재생 버튼 아이콘을 되돌리게
  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
    isPlaying = false;
    $playButton
      .attr("aria-label", "재생")
      .find("i")
      .attr("class", "fa-solid fa-play");
  }

  // 버튼 클릭시 자동재생 시간 초기화
  function resetAutoPlay() {
    if (isPlaying) startAutoPlay();
  }

  // 카테고리 탭 클릭 시 해당 탭의 첫 콘텐츠부터 표시하게
  $tabs.on("click", function (event) {
    event.preventDefault();
    activeTab = $tabs.index(this);
    activeIndexes[activeTab] = 0;
    render();
    resetAutoPlay();
  });

  // aria-label로 이전·다음 버튼을 구분해 이동 기능추가
  $promo.find('button[aria-label="이전"]').on("click", function () {
    moveSlide(-1);
    resetAutoPlay();
  });
  $promo.find('button[aria-label="다음"]').on("click", function () {
    moveSlide(1);
    resetAutoPlay();
  });

  // 자동재생 중에는 멈추고, 멈춘 상태에서는 다시 시작
  $playButton.on("click", function () {
    if (isPlaying) stopAutoPlay();
    else startAutoPlay();
  });

  // 목록 버튼 클릭 시 두 탭의 모든 이미지를 가진 모달창 추가
  $promo.find('button[aria-label="목록"]').on("click", function () {
    var $modal = $(
      '<div class="promo-modal" role="dialog" aria-modal="true" aria-label="시정홍보 전체 목록"></div>',
    );
    var $modalBody = $('<div class="promo-modal__body"></div>');
    var $closeButton = $(
      '<button type="button" class="promo-modal__close" aria-label="닫기"><i class="fa-solid fa-xmark"></i></button>',
    );
    var totalImages = tabItems[0].length + tabItems[1].length;
    var $modalTitle = $(
      '<div class="promo-modal__title"><h2>시정홍보</h2><p>총 <strong>' + totalImages + '</strong>개의 이미지가 있습니다.</p></div>',
    );
    var $modalContent = $('<div class="promo-modal__content"></div>');

    $modalBody.append($modalTitle, $modalContent);

    tabItems.forEach(function (images, tabIndex) {
      var title = $.trim($tabs.eq(tabIndex).text());
      var $section = $(
        '<section class="promo-modal__section"></section>',
      ).append($("<h3>").text(title));
      var $list = $('<div class="promo-modal__list"></div>');

      images.forEach(function (image, imageIndex) {
        var $item = $(
          '<button type="button" class="promo-modal__item"></button>',
        ).append(
          $("<img>", {
            src: image,
            alt: title + " " + (imageIndex + 1) + "번째 이미지",
          }),
        );
        // 모달 속 이미지를 선택하면 그 이미지로 이동한 뒤 모달을 닫음
        $item.on("click", function () {
          activeTab = tabIndex;
          activeIndexes[tabIndex] = imageIndex;
          render();
          resetAutoPlay();
          $modal.remove();
          $("body").removeClass("is-promo-modal-open");
        });
        $list.append($item);
      });
      $modalContent.append($section.append($list));
    });

    // 닫기 버튼 또는 어두운 배경 클릭으로 모달을 닫게
    $closeButton.on("click", function () {
      $modal.remove();
      $("body").removeClass("is-promo-modal-open");
    });
    $modal.on("click", function (event) {
      if (event.target === this) {
        $modal.remove();
        $("body").removeClass("is-promo-modal-open");
      }
    });
    $modal.append($modalBody, $closeButton).appendTo("body");
    $("body").addClass("is-promo-modal-open");
  });

  render();
  startAutoPlay();
});
