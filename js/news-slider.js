$(function () {
  // 카드 전체를 가로로 스크롤하는 영역
  const $newsWrap = $(".news-card-wrap");

  // 카테고리를 고르는 탭 링크
  const $tabs = $(".news-tabs a");

  // 이전과 다음 카드 이동 버튼
  const $leftButton = $(".news-controls .left");
  const $rightButton = $(".news-controls .right");

  // 현재 화면에 표시 중인 카테고리의 이름
  let currentCategory = "news";

  // 애니메이션이 진행되는 동안 연속 클릭을 막는 상태값 적용
  let isMoving = false;

  // 현재 선택된 탭의 카드 6개만 선택
  function getCurrentCards() {
    return $newsWrap.children('a[data-category="' + currentCategory + '"]');
  }

  // 카드 한 개의 너비와 카드 사이 간격을 합친 이동 거리
  function getMoveWidth() {
    return getCurrentCards().first().outerWidth(true);
  }

  // 현재 위치에 따라 좌우 버튼을 켜거나 끄는 함수
  function updateButtons() {
    // 현재 카드 영역이 가로로 이동한 거리
    const currentScroll = $newsWrap.scrollLeft();

    // 가장 오른쪽 카드까지 갈 수 있는 최대 이동 거리
    const maxScroll = $newsWrap[0].scrollWidth - $newsWrap.innerWidth();

    // 첫 카드 위치에서는 왼쪽 버튼을 비활성화
    $leftButton.prop("disabled", currentScroll <= 0);

    // 마지막 카드 위치에서는 오른쪽 버튼을 비활성화
    $rightButton.prop("disabled", currentScroll >= maxScroll - 1);
  }

  // 현재 탭의 카드만 보이도록 하고, 항상 첫 카드 위치로
  function showCurrentCategory() {
    // 진행 중인 이동 애니메이션을 멈추고 첫 카드 위치로
    $newsWrap.stop(true).scrollLeft(0);

    // 우선 모든 카테고리의 카드를 숨기고,
    $newsWrap.children("a").hide();

    // 선택한 카테고리에 해당하는 카드 6개만 다시 표시
    getCurrentCards().css("display", "block");

    // 카드가 바뀐 뒤 버튼의 활성 상태도 새로 계산
    updateButtons();
  }

  // 오른쪽 버튼: 카드 한 개가 오른쪽에서 왼쪽으로 이동
  $rightButton.on("click", function () {
    // 애니메이션 중이거나 버튼이 비활성화된 경우에는 이동x
    if (isMoving || $(this).prop("disabled")) return;

    isMoving = true;

    // 카드가 이동할 수 있는 마지막 위치 계산
    const maxScroll = $newsWrap[0].scrollWidth - $newsWrap.innerWidth();

    // 현재 위치에서 카드 하나 너비만큼 이동
    // 마지막 위치를 넘지 않도록 Math.min으로 제한
    const nextScroll = Math.min($newsWrap.scrollLeft() + getMoveWidth(), maxScroll);

    // scrollLeft 값을 400밀리초 동안 바꿔 카드가 밀려 나가는 효과 적용
    $newsWrap.animate({ scrollLeft: nextScroll }, 400, function () {
      isMoving = false;
      updateButtons();
    });
  });

  // 왼쪽 버튼: 카드 한 개가 왼쪽에서 오른쪽으로 이동
  $leftButton.on("click", function () {
    // 애니메이션 중이거나 버튼이 비활성화된 경우에는 이동x
    if (isMoving || $(this).prop("disabled")) return;

    isMoving = true;

    // 카드 하나 너비만큼 이전 위치로 이동
    // 첫 카드보다 더 왼쪽으로 갈 수 없도록 Math.max로 0으로 제한
    const prevScroll = Math.max($newsWrap.scrollLeft() - getMoveWidth(), 0);

    // scrollLeft 값을 400밀리초 동안 바꿔 카드가 오른쪽으로 들어오는 효과 적용
    $newsWrap.animate({ scrollLeft: prevScroll }, 400, function () {
      isMoving = false;
      updateButtons();
    });
  });

  // 탭을 선택하면 해당 카테고리의 카드 6개 펴시
  $tabs.on("click", function (event) {
    // a 태그의 기본 동작(페이지 맨 위로 이동)을 막음
    event.preventDefault();

    // 클릭한 탭에 적힌 data-category 값을 현재 카테고리로 저장
    currentCategory = $(this).data("category");

    // 이전 탭의 선택 표시와 접근성 정보를 제거
    $tabs.removeClass("active").removeAttr("aria-current");

    // 클릭한 탭에만 선택 스타일과 현재 페이지 정보를 적용
    $(this).addClass("active").attr("aria-current", "page");

    showCurrentCategory();
  });

  // 화면 크기가 달라질 때 카드 너비와 버튼 상태를 다시 계산
  $(window).on("resize", updateButtons);

  $tabs.first().attr("aria-current", "page");
  showCurrentCategory();
});
