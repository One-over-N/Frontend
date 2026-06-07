# 🌐 One Over N (엔분의일)

**OTT 계정 공유 매칭 및 신뢰도 기반 자동 정산 관리 서비스**

<br>

## 👥 1. 프로젝트 개요 및 팀 소개

### 프로젝트명

**One Over N (1/N)**

**One Over N**은 넷플릭스, 디즈니플러스 등 OTT 계정을 함께 이용할 파티원을 매칭하고, 매달 정산일에 맞춰 인당 요금을 자동으로 청구하는 웹 서비스입니다.

파티원들의 입금 현황을 바탕으로 유저의 신뢰도 점수를 실시간으로 계산하여, 투명하고 신뢰할 수 있는 계정 공유 환경을 제공합니다.

<br>

### 팀 소개

**2026-1 이화여자대학교 데이터베이스 수업 프로젝트 11조**

* 고예빈
* 김나성
* 김서현
* 박선영

<br>

### 배포 주소

* **Frontend:** `https://frontend-ebon-five-27.vercel.app`
* **Backend:** `https://one-over-n.onrender.com`

<br>

## 💻 2. 개발 환경

* **Language:** Java
* **Database:** MySQL
* **Framework:** Spring Boot

<br>

## ✨ 3. 주요 기능

### 1. 회원 및 신뢰도 관리

회원가입 시 기본 신뢰도 점수 50점을 부여하고, 정산 이력에 따라 신뢰도 점수를 가감합니다.

### 2. OTT 파티 매칭 및 자동 마감

사용자는 원하는 OTT 플랫폼과 요금제를 선택하여 파티를 개설하거나 가입을 신청할 수 있습니다.
파티 정원이 모두 채워지면 해당 파티는 자동으로 마감 상태로 전환됩니다.

### 3. 매달 정산서 자동 갱신 및 1/N 분할 청구

매달 파티 결제일에 총액을 기준으로 파티 인원수에 따라 1/N 금액을 산출하고, 각 파티원에게 자동으로 청구합니다.

### 4. 실시간 수납 처리 및 정산 완료

파티원이 앱 내에서 결제를 완료하면 입금 상태가 갱신되며, 신뢰도 점수가 증가합니다.
모든 파티원이 납부를 완료하면 해당 회차의 정산이 완료 처리됩니다.

### 5. 자정 미납자 패널티 부여

정산일이 지났음에도 `UNPAID` 상태인 유저에게는 신뢰도 감점 패널티가 부여됩니다.

<br>

## 🗺️ 4. 데이터베이스 설계 (ERD)

<img width="1844" height="1482" alt="Copy of OTT 계정 공유 파티원 관리 시스템 ERD" src="https://github.com/user-attachments/assets/448ae593-fce9-4a54-9bae-e14bf0afe8e2" />

<br>

## 🛠️ 5. 설치 및 실행 방법

### 1) Repository Clone

백엔드 소스코드가 보관된 저장소를 복사하고, 해당 디렉터리로 이동합니다.

```bash
git clone https://github.com/One-over-N/Backend.git
cd Backend
```

<br>

### 2) Database 초기 세팅

MySQL 툴(HeidiSQL 등)을 통해 데이터베이스에 접속한 후, 아래 폴더 순서에 맞춰 SQL 스크립트 파일을 순서대로 실행합니다.

```text
01_table/create_table.sql
02_data/insert_test_data.sql
03_trigger/...
04_procedure/...
05_event/...
```

<br>

### 3) Spring Boot 애플리케이션 가동

IntelliJ 등의 개발 환경에서 메인 클래스를 직접 실행하거나, 터미널 명령어를 이용해 애플리케이션을 실행합니다.

#### IntelliJ 실행 경로

```text
src/main/java/oneovern/OneovernApplication.java
```

#### 터미널 명령어 실행

```bash
./gradlew bootRun
```






