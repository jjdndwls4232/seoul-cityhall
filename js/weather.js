$(function () {

	// ⚠️ 실습/개인 프로젝트용 키입니다. 절대 공개 저장소(GitHub 등)에 올리거나
	// 다른 사람과 공유하지 마세요. 실제 서비스에서는 이 키를 프론트엔드 코드에 두지 않고,
	// 서버(백엔드)를 거쳐서 호출하는 방식으로 숨겨야 합니다.
	const API_KEY = 'c1aa8026be0e219450279b66a72305b4';



	const LAT = 37.5665;// 안양시 위도
	const LON = 126.9780;// 안양시 경도

	//OpenWeatherMap API가 응답으로 주는 영문 지역명을 한글로 변경하기
	const cityNames = {
		'Seoul': '서울시',
	};

	// 아이콘 코드 앞 두 자리 → { 이미지, 설명 } 매핑
	// 원본은 switch문에 조건마다 이미지 생성 코드가 반복돼서 길었는데,
	// 데이터(객체)로 분리하면 조건 추가/수정이 이 객체 한 곳만 고치면 되어 유지보수가 쉬워짐
	const WEATHER_ICONS = {
		'01': { src: 'img/images/icon-clear.svg', desc: '맑음' },
		'02': { src: 'img/images/icon-few-clouds.svg', desc: '구름 조금' },
		'03': { src: 'img/images/icon-clouds.svg', desc: '구름 많음' },
		'04': { src: 'img/images/icon-overcast.svg', desc: '흐림' },
		'09': { src: 'img/images/icon-shower.svg', desc: '소나기' },
		'10': { src: 'img/images/icon-rain.svg', desc: '비' },
		'11': { src: 'img/images/icon-thunderstorm.svg', desc: '천둥번개' },
		'13': { src: 'img/images/icon-snow.svg', desc: '눈' },
		'50': { src: 'img/images/icon-fog.svg', desc: '안개' }
	};
	const DEFAULT_ICON = { src: 'images/icon-clear.svg', desc: '알 수 없음' }; // 매칭 안 되는 코드 대비 기본값

	//날씨 정보 렌더링할 위젯 컨테이너
	const $widget = $('#widget');

	// 미세먼지(PM10) 등급 판정 (환경부 기준)
	function getPm10Info(pm10) {
		if (pm10 <= 30) return { label: '미세먼지 좋음', className: 'dust-good' };
		if (pm10 <= 80) return { label: '미세먼지 보통', className: 'dust-normal' };
		if (pm10 <= 150) return { label: '미세먼지 나쁨', className: 'dust-bad' };
		return { label: '미세먼지 매우 나쁨', className: 'dust-very-bad' };
	}

	// 초미세먼지(PM2.5) 등급 판정 (환경부 기준)
	function getPm25Info(pm25) {
		if (pm25 <= 15) return { label: '초미세먼지 좋음', className: 'dust-good' };
		if (pm25 <= 35) return { label: '초미세먼지 보통', className: 'dust-normal' };
		if (pm25 <= 75) return { label: '초미세먼지 나쁨', className: 'dust-bad' };
		return { label: '초미세먼지 매우 나쁨', className: 'dust-very-bad' };
	}


	//날씨 API 요청이 실패했을 때 에러화면
	function showError() {
		$widget.html(`
			<p class="status is-error">날씨 정보를 불러오지 못했습니다.</p>
			<button type="button" class="retry-btn" id="retryBtn">다시 시도</button>
		`);
		$('#retryBtn').on('click', loadWeather);
	}

	function renderWeather(data) {
		const city = cityNames[data.name] || data.name;
		const icon = WEATHER_ICONS[String(data.weather[0].icon).slice(0, 2)] || DEFAULT_ICON;

		$widget.html(`
			<div class="icon-wrap">
				<img class="icon" src="${icon.src}" alt="${icon.desc}" />
			</div>		
			<div class="temper-wrap">	
				<p class="current-temp">${Math.round(data.main.temp)}℃</p>
				<div class="pm-wrap">
					<div class="detail-item" id="pm10Item">
						<span class="value">측정 중...</span>
					</div>
					<div class="detail-item" id="pm25Item">
						<span class="value">측정 중...</span>
					</div>
				</div>
			</div>
		`);

		loadAirQuality();
	}

	// 대기오염(미세먼지) API호출
	function loadAirQuality() {
		$.getJSON(
			`https://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${API_KEY}`
		)
			.done(function (data) {
				const components = data.list[0].components;
				const pm10 = components.pm10;
				const pm25 = components.pm2_5;

				const pm10Info = getPm10Info(pm10);
				const pm25Info = getPm25Info(pm25);

				$('#pm10Item .value').html(
					`<span class="dust-badge ${pm10Info.className}">${pm10Info.label}</span>`
				);
				$('#pm25Item .value').html(
					`<span class="dust-badge ${pm25Info.className}">${pm25Info.label}</span>`
				);
			})
			.fail(function () {
				$('#pm10Item .value').text('정보 없음');
				$('#pm25Item .value').text('정보 없음');
			});
	}



	// 날씨 API를 호출하는 메인함수
	function loadWeather() {
		// API 응답을 기다리는동안 로딩 문구를 먼저 보여줌
		$widget.html('<p class="status">날씨 정보를 불러오는 중...</p>');

		$.getJSON(
			`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=Metric`
		)
			.done(renderWeather)
			.fail(showError); // 네트워크 오류, 키 만료 등 어떤 이유로든 요청이 실패하면 에러 화면으로 전환
	}

	loadWeather();

});
