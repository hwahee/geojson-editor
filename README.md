# GEOJSON 에디터
![image](https://user-images.githubusercontent.com/44242823/150453533-9bdf553f-c46e-4fd5-b968-3a1351432a5d.png)


## 사용하기 전에
.env.example을 확인해주세요
본인의 토큰을 입력한다음에 .example을 지워야 동작합니다
### 빌드
1. 클론
2. npm install (종속성 설치)
3. .env.example 설정 
4. npm run build (빌드)
    - heap out of memory 에러가 날 경우
        > package.json의 max_old_space_size를 8192 혹은 더 크게 설정
5. npx serve -s build (서버 실행)



## 기능
- geojson feature 보여줌
- reverse geocoding으로 주소 찾기
- 이미지 링크 유효하면 보여주기


## 할 일
### 완료한 일
- Firestore DB 설정하고 데이터 가져오기
- table로 데이터 보여주기
- imageUrl 사용 가능하면 이미지 보여주기
- 컨트롤러
    - 페이지 앞뒤로 이동하기
    - 임의 페이지 번호 입력으로 이동하기
- reverse geocoding으로 좌표를 바탕으로 한 주소 구하기
### 계속할 일
- 컨트롤러 보강하기
- DB 업로드 전에 테스트할 함수 더 만들기
### 해야할 일
- DB
    - 데이터 추가하기
    - 데이터 수정하기
- 지도 구현하기
    - 지도에서 좌표 구하기
    - geometry 데이터 지도에 나타내기
- 이미지 링크 추가하면 바로 보여주기
### 되면 할 일
- 스타일 개선하기